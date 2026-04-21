import * as SQLite from 'expo-sqlite';
import { firstAidData } from '../firstAidData';

let db: SQLite.SQLiteDatabase | null = null;

export const initFirstAidDB = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;

  db = await SQLite.openDatabaseAsync('roadsos_firstaid.db');

  // Main table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS first_aid_topics (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      short_description TEXT,
      instructions_json TEXT,
      warnings_json TEXT,
      category TEXT DEFAULT 'general',
      lang TEXT DEFAULT 'en'
    );
  `);

  // FTS5 virtual table for full-text search
  await db.execAsync(`
    CREATE VIRTUAL TABLE IF NOT EXISTS first_aid_fts USING fts5(
      id UNINDEXED,
      title,
      short_description,
      content='first_aid_topics',
      content_rowid='rowid'
    );
  `);

  // Triggers to keep FTS in sync
  await db.execAsync(`
    CREATE TRIGGER IF NOT EXISTS first_aid_ai AFTER INSERT ON first_aid_topics BEGIN
      INSERT INTO first_aid_fts(rowid, id, title, short_description) 
      VALUES (new.rowid, new.id, new.title, new.short_description);
    END;
  `);

  return db;
};

export const seedFirstAidDB = async () => {
  const database = await initFirstAidDB();

  const row = await database.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM first_aid_topics`
  );
  if (row && row.count > 0) return; // Already seeded

  const CATEGORY_MAP: Record<string, string> = {
    cpr: 'cardiac', heart_attack: 'cardiac', stroke: 'cardiac',
    choking: 'airway', anaphylaxis: 'airway',
    bleeding: 'trauma', fractures: 'trauma', head_neck_spine: 'trauma',
    burns: 'trauma', electric_shock: 'trauma',
    seizure: 'neurological',
    shock: 'circulation',
    heatstroke: 'environmental', hypothermia: 'environmental',
    poisoning: 'toxicology', animal_bites: 'toxicology',
  };

  const stmt = await database.prepareAsync(`
    INSERT INTO first_aid_topics 
      (id, title, short_description, instructions_json, warnings_json, category, lang)
    VALUES 
      ($id, $title, $short_description, $instructions_json, $warnings_json, $category, $lang)
  `);

  try {
    await database.withTransactionAsync(async () => {
      for (const topic of firstAidData) {
        await stmt.executeAsync({
          $id: topic.id,
          $title: topic.title,
          $short_description: topic.shortDescription,
          $instructions_json: JSON.stringify(topic.instructions),
          $warnings_json: JSON.stringify(topic.warnings),
          $category: CATEGORY_MAP[topic.id] ?? 'general',
          $lang: 'en',
        });
      }
    });
  } finally {
    await stmt.finalizeAsync();
  }

  console.log('[FirstAidDB] Seeded', firstAidData.length, 'topics with FTS5.');
};

export type FirstAidRow = {
  id: string;
  title: string;
  short_description: string;
  instructions_json: string;
  warnings_json: string;
  category: string;
  lang: string;
};

export const searchFirstAid = async (query: string, category?: string): Promise<FirstAidRow[]> => {
  const database = await initFirstAidDB();

  if (query.trim().length >= 2) {
    // FTS5 search — blazing fast
    const ftsQuery = query.trim().split(/\s+/).map(w => `"${w}"*`).join(' ');
    const ftsResults = await database.getAllAsync<{ id: string }>(
      `SELECT id FROM first_aid_fts WHERE first_aid_fts MATCH ? ORDER BY rank`,
      [ftsQuery]
    );
    if (ftsResults.length === 0) return [];

    const ids = ftsResults.map(r => `'${r.id}'`).join(',');
    let sql = `SELECT * FROM first_aid_topics WHERE id IN (${ids})`;
    if (category) sql += ` AND category = '${category}'`;
    return database.getAllAsync<FirstAidRow>(sql);
  }

  // No query — return all (optionally filtered by category)
  let sql = `SELECT * FROM first_aid_topics WHERE lang = 'en'`;
  if (category) sql += ` AND category = ?`;
  return database.getAllAsync<FirstAidRow>(sql, category ? [category] : []);
};
