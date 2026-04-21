import { useState, useEffect } from 'react';
import { storage } from './useEmergencyNumbers'; // Reuse the MMKV instance

const MEDICAL_ID_KEY = 'road_sos_medical_id';

export type MedicalIdProfile = {
  name: string;
  bloodType: string;
  allergies: string;
  medications: string;
  medicalConditions: string;
  organDonor: boolean;
  doctorName: string;
  doctorPhone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
};

const DEFAULT_PROFILE: MedicalIdProfile = {
  name: '',
  bloodType: '',
  allergies: 'None',
  medications: 'None',
  medicalConditions: 'None',
  organDonor: false,
  doctorName: '',
  doctorPhone: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelation: '',
};

export function useMedicalId() {
  const [profile, setProfile] = useState<MedicalIdProfile>(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = storage.getString(MEDICAL_ID_KEY);
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load Medical ID', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveProfile = (newProfile: MedicalIdProfile) => {
    try {
      storage.set(MEDICAL_ID_KEY, JSON.stringify(newProfile));
      setProfile(newProfile);
      return true;
    } catch (e) {
      console.warn('Failed to save Medical ID', e);
      return false;
    }
  };

  return { profile, isLoaded, saveProfile };
}
