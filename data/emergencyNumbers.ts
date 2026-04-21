export type EmergencyNumber = {
  id: string;
  name: string;
  number: string;
  type: 'universal' | 'police' | 'medical' | 'highway' | 'women' | 'child' | 'state';
  state?: string; 
};

export const BUNDLED_EMERGENCY_NUMBERS: EmergencyNumber[] = [
  { id: 'nat-112', name: 'National Emergency', number: '112', type: 'universal' },
  { id: 'nat-100', name: 'Police Control Room', number: '100', type: 'police' },
  { id: 'nat-108', name: 'Ambulance & Medical', number: '108', type: 'medical' },
  { id: 'nat-102', name: 'Ambulance (Pregnancy)', number: '102', type: 'medical' },
  { id: 'nat-1033', name: 'National Highway Rescue', number: '1033', type: 'highway' },
  { id: 'nat-1091', name: 'Women Helpline', number: '1091', type: 'women' },
  { id: 'nat-1098', name: 'Child Helpline', number: '1098', type: 'child' },
  
  // Example states for bundle
  { id: 'mh-1', name: 'Mumbai Police Control', number: '100', type: 'state', state: 'Maharashtra' },
  { id: 'mh-2', name: 'Highway Traffic Police (MH)', number: '9869802222', type: 'state', state: 'Maharashtra' },
  { id: 'dl-1', name: 'Delhi Police Control', number: '112', type: 'state', state: 'Delhi' },
  { id: 'dl-2', name: 'Delhi Traffic Police', number: '1095', type: 'state', state: 'Delhi' },
  { id: 'ka-1', name: 'Bengaluru Police', number: '100', type: 'state', state: 'Karnataka' },
  { id: 'ka-2', name: 'Karnataka Highway Police', number: '08022942400', type: 'state', state: 'Karnataka' },
  { id: 'tn-1', name: 'Tamil Nadu Police', number: '100', type: 'state', state: 'Tamil Nadu' },
];
