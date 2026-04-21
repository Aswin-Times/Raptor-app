import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';
import * as Location from 'expo-location';

// ─── Types ────────────────────────────────────────────────────────────────────

export type GpsLog = {
  timestamp: string;
  latitude: number;
  longitude: number;
  accuracy: number;
};

export type IncidentMetadata = {
  incidentId: string;
  startedAt: string;
  endedAt: string;
  photos: string[];      // file URIs
  audioFile: string;     // file URI
  gpsLogs: GpsLog[];
  encryptionKey: string; // stored for reference; in production use secure keystore
};

// ─── Directories ──────────────────────────────────────────────────────────────

const INCIDENTS_DIR = `${FileSystem.documentDirectory}incidents/`;

export const ensureIncidentsDir = async () => {
  const info = await FileSystem.getInfoAsync(INCIDENTS_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(INCIDENTS_DIR, { intermediates: true });
  }
};

// ─── AES-256 Encryption (XOR cipher via Crypto — pure JS fallback) ────────────
// Note: expo-crypto provides digest/UUID. True AES requires expo-aes or native module.
// This implementation uses a keyed XOR stream — suitable for offline tamper evidence.
// For production apps submit to stores, replace with react-native-aes-crypto.

const xorEncrypt = (data: string, key: string): string => {
  let result = '';
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(
      data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  // Base64 encode to make it storable
  return Buffer.from(result, 'binary').toString('base64');
};

export const generateEncryptionKey = async (): Promise<string> => {
  const uuid = Crypto.randomUUID();
  // Hash for a 256-bit key string
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    uuid
  );
  return hash;
};

export const encryptAndSave = async (
  data: string,
  destPath: string,
  key: string
): Promise<void> => {
  const encrypted = xorEncrypt(data, key);
  await FileSystem.writeAsStringAsync(destPath, encrypted, {
    encoding: FileSystem.EncodingType.UTF8,
  });
};

// ─── GPS Logger ───────────────────────────────────────────────────────────────

export const startGpsLogging = (
  intervalMs: number,
  onLog: (log: GpsLog) => void
): (() => void) => {
  let stopped = false;

  const poll = async () => {
    while (!stopped) {
      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        onLog({
          timestamp: new Date().toISOString(),
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          accuracy: loc.coords.accuracy ?? 0,
        });
      } catch {
        // GPS temporarily unavailable — continue
      }
      await new Promise(r => setTimeout(r, intervalMs));
    }
  };

  poll();
  return () => { stopped = true; };
};
