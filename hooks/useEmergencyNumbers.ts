import { useState, useEffect } from 'react';
import { MMKV } from 'react-native-mmkv';
import { BUNDLED_EMERGENCY_NUMBERS, EmergencyNumber } from '../data/emergencyNumbers';

// Create a single MMKV instance
export const storage = new MMKV({
  id: 'emergency-db',
  encryptionKey: 'road-sos-secure-key'
});

const STORAGE_KEY = 'road_sos_emergency_numbers';

export function useEmergencyNumbers() {
  const [numbers, setNumbers] = useState<EmergencyNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNumbers();
  }, []);

  const loadNumbers = () => {
    setIsLoading(true);
    try {
      const stored = storage.getString(STORAGE_KEY);
      if (stored) {
        setNumbers(JSON.parse(stored));
      } else {
        // Seed MMKV with bundled JSON
        storage.set(STORAGE_KEY, JSON.stringify(BUNDLED_EMERGENCY_NUMBERS));
        setNumbers(BUNDLED_EMERGENCY_NUMBERS);
      }
    } catch (e) {
      console.warn("MMKV Storage failed, falling back to bundled JSON", e);
      setNumbers(BUNDLED_EMERGENCY_NUMBERS);
    } finally {
      setIsLoading(false);
    }
  };

  const syncWithServer = async () => {
    // Delta sync simulation
    // fetch('/api/emergency-numbers')
    console.log("Delta syncing offline numbers...");
  };

  return {
    numbers,
    isLoading,
    syncWithServer
  };
}
