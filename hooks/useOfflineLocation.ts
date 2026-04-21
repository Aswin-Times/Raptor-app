import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { reverseGeocodeOffline } from '../data/geoRegions';

export function useOfflineLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string>('Acquiring satellite signal...');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setAddress('Location Access Denied');
        return;
      }

      try {
        let loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced, // Fast & less reliant on network
        });
        setLocation(loc);
        
        // Use our lightweight offline geocoder
        const readableAddress = reverseGeocodeOffline(loc.coords.latitude, loc.coords.longitude);
        setAddress(readableAddress);
      } catch (e) {
        setErrorMsg('GPS unavailable. Ensure location services are ON.');
        setAddress('GPS Offline');
      }
    })();
  }, []);

  return { location, address, errorMsg };
}
