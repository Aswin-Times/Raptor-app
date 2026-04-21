import { useState, useRef, useCallback } from 'react';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import {
  ensureIncidentsDir,
  generateEncryptionKey,
  encryptAndSave,
  startGpsLogging,
  GpsLog,
  IncidentMetadata,
} from '../utils/incidentRecorder';
import * as Crypto from 'expo-crypto';

export type RecorderPhase =
  | 'idle'
  | 'requesting_permissions'
  | 'capturing_photos'
  | 'recording_audio'
  | 'encrypting'
  | 'done'
  | 'error';

export type RecorderState = {
  phase: RecorderPhase;
  photosTaken: number;   // 0–5
  audioSeconds: number;  // 0–60
  gpsCount: number;
  incidentId: string | null;
  errorMsg: string | null;
  exportPath: string | null;
};

const PHOTO_COUNT   = 5;
const PHOTO_INTERVAL_MS = 10_000; // 10 s between shots
const AUDIO_DURATION_MS = 60_000; // 60 s recording
const GPS_INTERVAL_MS   = 30_000; // GPS every 30 s

export function useIncidentRecorder(cameraRef: React.RefObject<Camera | null>) {
  const [state, setState] = useState<RecorderState>({
    phase: 'idle',
    photosTaken: 0,
    audioSeconds: 0,
    gpsCount: 0,
    incidentId: null,
    errorMsg: null,
    exportPath: null,
  });

  const gpsStopRef  = useRef<(() => void) | null>(null);
  const soundingRef = useRef<Audio.Recording | null>(null);
  const gpsLogs     = useRef<GpsLog[]>([]);
  const photos      = useRef<string[]>([]);
  const audioFile   = useRef<string>('');

  const set = (patch: Partial<RecorderState>) =>
    setState(prev => ({ ...prev, ...patch }));

  const start = useCallback(async () => {
    try {
      set({ phase: 'requesting_permissions', errorMsg: null });

      // ── 1. Permissions ─────────────────────────────────────────────────────
      const camPerm = await Camera.requestCameraPermissionsAsync();
      const micPerm = await Camera.requestMicrophonePermissionsAsync();
      if (camPerm.status !== 'granted' || micPerm.status !== 'granted') {
        set({ phase: 'error', errorMsg: 'Camera or microphone permission denied.' });
        return;
      }

      const incidentId  = Crypto.randomUUID();
      const incidentDir = `${FileSystem.documentDirectory}incidents/${incidentId}/`;
      await FileSystem.makeDirectoryAsync(incidentDir, { intermediates: true });

      set({ phase: 'capturing_photos', incidentId, photosTaken: 0 });

      // ── 2. GPS logging (parallel) ──────────────────────────────────────────
      gpsLogs.current = [];
      gpsStopRef.current = startGpsLogging(GPS_INTERVAL_MS, (log) => {
        gpsLogs.current.push(log);
        set({ gpsCount: gpsLogs.current.length });
      });

      // ── 3. Auto-capture 5 photos, 10 s apart ──────────────────────────────
      photos.current = [];
      for (let i = 0; i < PHOTO_COUNT; i++) {
        if (i > 0) await new Promise(r => setTimeout(r, PHOTO_INTERVAL_MS));

        if (cameraRef.current) {
          try {
            const photo = await cameraRef.current.takePictureAsync({ quality: 0.6 });
            const destUri = `${incidentDir}photo_${i + 1}.jpg`;
            await FileSystem.moveAsync({ from: photo.uri, to: destUri });
            photos.current.push(destUri);
            set({ photosTaken: i + 1 });
          } catch {
            // Silently skip failed shots
          }
        }
      }

      // ── 4. 60-second audio recording ───────────────────────────────────────
      set({ phase: 'recording_audio', audioSeconds: 0 });

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      soundingRef.current = recording;

      // Tick counter for UI
      let elapsed = 0;
      const audioTimer = setInterval(() => {
        elapsed += 1;
        set({ audioSeconds: elapsed });
      }, 1000);

      await new Promise(r => setTimeout(r, AUDIO_DURATION_MS));

      clearInterval(audioTimer);
      await recording.stopAndUnloadAsync();

      const audioUri  = recording.getURI() ?? '';
      const audioDest = `${incidentDir}audio.m4a`;
      if (audioUri) {
        await FileSystem.moveAsync({ from: audioUri, to: audioDest });
      }
      audioFile.current = audioDest;

      // ── 5. Stop GPS ────────────────────────────────────────────────────────
      gpsStopRef.current?.();

      // ── 6. Encrypt metadata + GPS log ──────────────────────────────────────
      set({ phase: 'encrypting' });

      const encKey = await generateEncryptionKey();
      const metadata: IncidentMetadata = {
        incidentId,
        startedAt: new Date(Date.now() - PHOTO_COUNT * PHOTO_INTERVAL_MS - AUDIO_DURATION_MS).toISOString(),
        endedAt:   new Date().toISOString(),
        photos:    photos.current,
        audioFile: audioDest,
        gpsLogs:   gpsLogs.current,
        encryptionKey: encKey,
      };

      const metaPath = `${incidentDir}metadata.enc`;
      await encryptAndSave(JSON.stringify(metadata, null, 2), metaPath, encKey);

      // Also write plain manifest for FIR export
      const manifestPath = `${incidentDir}manifest.json`;
      await FileSystem.writeAsStringAsync(
        manifestPath,
        JSON.stringify({ incidentId, startedAt: metadata.startedAt, endedAt: metadata.endedAt, photos: photos.current, audioFile: audioDest }, null, 2)
      );

      set({ phase: 'done', exportPath: incidentDir });
    } catch (err: any) {
      gpsStopRef.current?.();
      set({ phase: 'error', errorMsg: err?.message ?? 'Unknown error' });
    }
  }, [cameraRef]);

  const reset = useCallback(() => {
    gpsStopRef.current?.();
    setState({ phase: 'idle', photosTaken: 0, audioSeconds: 0, gpsCount: 0, incidentId: null, errorMsg: null, exportPath: null });
    gpsLogs.current = [];
    photos.current  = [];
    audioFile.current = '';
  }, []);

  return { state, start, reset };
}
