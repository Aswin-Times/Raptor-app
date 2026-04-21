import * as SQLite from 'expo-sqlite';
import { getBoundingBox, haversineDistance } from '../../utils/geo';

// Open or create the database
let db: SQLite.SQLiteDatabase | null = null;

export const initDB = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('roadsos_facilities.db');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS facilities (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        address TEXT,
        phone TEXT,
        trauma_level TEXT,
        lat REAL NOT NULL,
        lon REAL NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_type ON facilities (type);
      CREATE INDEX IF NOT EXISTS idx_lat_lon ON facilities (lat, lon);
    `);
  }
  return db;
};

export type Facility = {
  id: string;
  name: string;
  type: 'hospital' | 'police';
  address: string;
  phone: string;
  trauma_level: string;
  lat: number;
  lon: number;
  distance?: number;
};

export const seedFacilities = async () => {
  const database = await initDB();
  const result = await database.getFirstAsync<{count: number}>('SELECT COUNT(*) as count FROM facilities');
  
  if (result && result.count === 0) {
    console.log("Seeding local SQLite database...");
    
    const statement = await database.prepareAsync(`
      INSERT INTO facilities (id, name, type, address, phone, trauma_level, lat, lon) 
      VALUES ($id, $name, $type, $address, $phone, $trauma_level, $lat, $lon)
    `);

    const mockData = [
      { id: 'h1', name: 'AIIMS New Delhi', type: 'hospital', address: 'Ansari Nagar, New Delhi', phone: '011-26588500', trauma_level: 'Level 1', lat: 28.5659, lon: 77.2093 },
      { id: 'p1', name: 'Safdarjung Police Station', type: 'police', address: 'Safdarjung Enclave, New Delhi', phone: '011-26162622', trauma_level: '', lat: 28.5630, lon: 77.1980 },
      { id: 'h2', name: 'Tata Memorial Hospital', type: 'hospital', address: 'Parel, Mumbai', phone: '022-24177000', trauma_level: 'Level 1', lat: 19.0044, lon: 72.8407 },
      { id: 'p2', name: 'Bhoiwada Police Station', type: 'police', address: 'Parel, Mumbai', phone: '022-24141633', trauma_level: '', lat: 19.0080, lon: 72.8400 },
    ];

    try {
      await database.withTransactionAsync(async () => {
        for (const item of mockData) {
          await statement.executeAsync({
            $id: item.id,
            $name: item.name,
            $type: item.type,
            $address: item.address,
            $phone: item.phone,
            $trauma_level: item.trauma_level,
            $lat: item.lat,
            $lon: item.lon
          });
        }
      });
    } finally {
      await statement.finalizeAsync();
    }
  }
};

export const getNearbyFacilities = async (lat: number, lon: number, radiusKm: number = 20, type?: string) => {
  const database = await initDB();
  const box = getBoundingBox(lat, lon, radiusKm);
  
  let query = `
    SELECT * FROM facilities 
    WHERE lat BETWEEN ? AND ? 
    AND lon BETWEEN ? AND ?
  `;
  const args: any[] = [box.minLat, box.maxLat, box.minLon, box.maxLon];

  if (type) {
    query += ` AND type = ?`;
    args.push(type);
  }

  const results = await database.getAllAsync<Facility>(query, args);

  // Apply Haversine to precisely filter and sort
  const preciseResults = results
    .map(facility => ({
      ...facility,
      distance: haversineDistance(lat, lon, facility.lat, facility.lon)
    }))
    .filter(facility => facility.distance! <= radiusKm)
    .sort((a, b) => a.distance! - b.distance!);

  return preciseResults;
};
