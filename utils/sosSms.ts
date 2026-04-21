import * as SMS from 'expo-sms';
import * as Location from 'expo-location';
import { reverseGeocodeOffline } from '../data/geoRegions';

export type AccidentType = 
  | 'Road Accident'
  | 'Medical Emergency'
  | 'Fire'
  | 'Flooding'
  | 'Other';

export type SosPayload = {
  userName: string;
  accidentType: AccidentType;
  latitude: number;
  longitude: number;
  address: string;
  timestamp: string;
};

const buildSosMessage = (payload: SosPayload): string => {
  const mapsLink = `https://maps.google.com/?q=${payload.latitude},${payload.longitude}`;
  return [
    `🚨 EMERGENCY SOS — RoadSOS App`,
    ``,
    `Name: ${payload.userName}`,
    `Emergency: ${payload.accidentType}`,
    `Time: ${payload.timestamp}`,
    ``,
    `📍 Location: ${payload.address}`,
    `🗺️ GPS Link: ${mapsLink}`,
    ``,
    `⚠️ Please send help immediately or call 112.`,
  ].join('\n');
};

export const sendSosSms = async (
  recipients: string[],
  userName: string,
  accidentType: AccidentType
): Promise<{ success: boolean; error?: string }> => {
  const isAvailable = await SMS.isAvailableAsync();
  if (!isAvailable) {
    return { success: false, error: 'SMS is not available on this device.' };
  }

  let lat = 0, lon = 0, address = 'Location unavailable';

  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      lat = loc.coords.latitude;
      lon = loc.coords.longitude;
      address = reverseGeocodeOffline(lat, lon);
    }
  } catch {
    address = 'GPS Unavailable';
  }

  const payload: SosPayload = {
    userName,
    accidentType,
    latitude: lat,
    longitude: lon,
    address,
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  };

  const message = buildSosMessage(payload);

  const { result } = await SMS.sendSMSAsync(recipients, message);
  if (result === 'sent' || result === 'unknown') {
    return { success: true };
  }
  return { success: false, error: `SMS result: ${result}` };
};
