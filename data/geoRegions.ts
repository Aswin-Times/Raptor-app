export type Region = {
  id: string;
  name: string;
  type: 'state' | 'district';
  // Simplified bounding box: [minLat, maxLat, minLon, maxLon]
  bbox: [number, number, number, number]; 
};

export const OFFLINE_REGIONS: Region[] = [
  { id: 'dl', name: 'Delhi NCR', type: 'state', bbox: [28.40, 28.88, 76.83, 77.34] },
  { id: 'mh', name: 'Maharashtra', type: 'state', bbox: [15.60, 22.02, 72.63, 80.89] },
  { id: 'ka', name: 'Karnataka', type: 'state', bbox: [11.58, 18.43, 74.05, 78.58] },
  { id: 'tn', name: 'Tamil Nadu', type: 'state', bbox: [8.07, 13.50, 76.24, 80.34] },
  { id: 'up', name: 'Uttar Pradesh', type: 'state', bbox: [23.86, 30.40, 77.08, 84.63] },
  // District examples
  { id: 'mumbai', name: 'Mumbai', type: 'district', bbox: [18.89, 19.27, 72.77, 73.00] },
  { id: 'agra', name: 'Agra, UP', type: 'district', bbox: [26.90, 27.25, 77.80, 78.10] }
];

export const reverseGeocodeOffline = (lat: number, lon: number): string => {
  // Find matching bounding boxes
  const matches = OFFLINE_REGIONS.filter(
    r => lat >= r.bbox[0] && lat <= r.bbox[1] && lon >= r.bbox[2] && lon <= r.bbox[3]
  );

  if (matches.length === 0) return 'Location: ' + lat.toFixed(4) + ', ' + lon.toFixed(4);

  // Return the most specific match (district > state)
  matches.sort((a, b) => a.type === 'district' ? -1 : 1);
  return matches[0].name;
};
