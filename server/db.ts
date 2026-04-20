import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, incidents, chatMessages, emergencyContacts, InsertIncident, InsertChatMessage, InsertEmergencyContact } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

// In-memory mock stores for local dev without a DB
let mockIncidents: any[] = [];
let mockChatMessages: any[] = [];
let mockContacts: any[] = [];
let incidentCounter = 1;
let messageCounter = 1;

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createIncident(incident: InsertIncident) {
  const db = await getDb();
  if (!db) {
    const id = incidentCounter++;
    const newIncident = { ...incident, id, createdAt: new Date(), updatedAt: new Date() };
    mockIncidents.push(newIncident);
    return id; // Mock returning insertId
  }
  const result = await db.insert(incidents).values(incident);
  return (result[0] as any).insertId || result[0];
}

export async function getIncidentById(id: number) {
  const db = await getDb();
  if (!db) return mockIncidents.find(i => i.id === id);
  const result = await db.select().from(incidents).where(eq(incidents.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserIncidents(userId: number) {
  const db = await getDb();
  if (!db) return mockIncidents.filter(i => i.userId === userId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return await db.select().from(incidents).where(eq(incidents.userId, userId)).orderBy(desc(incidents.createdAt));
}

export async function updateIncidentTriageLevel(id: number, triageLevel: string) {
  const db = await getDb();
  if (!db) {
    const idx = mockIncidents.findIndex(i => i.id === id);
    if (idx > -1) mockIncidents[idx].triageLevel = triageLevel;
    return;
  }
  return await db.update(incidents).set({ triageLevel: triageLevel as any }).where(eq(incidents.id, id));
}

export async function updateIncidentLocation(id: number, location: string, latitude: string, longitude: string) {
  const db = await getDb();
  if (!db) {
    const idx = mockIncidents.findIndex(i => i.id === id);
    if (idx > -1) {
      mockIncidents[idx].location = location;
      mockIncidents[idx].latitude = latitude;
      mockIncidents[idx].longitude = longitude;
    }
    return;
  }
  return await db.update(incidents).set({ location, latitude: latitude as any, longitude: longitude as any }).where(eq(incidents.id, id));
}

export async function markIncidentDispatchSubmitted(id: number) {
  const db = await getDb();
  if (!db) {
    const idx = mockIncidents.findIndex(i => i.id === id);
    if (idx > -1) mockIncidents[idx].dispatchSubmitted = new Date();
    return;
  }
  return await db.update(incidents).set({ dispatchSubmitted: new Date() }).where(eq(incidents.id, id));
}

export async function createChatMessage(message: InsertChatMessage) {
  const db = await getDb();
  if (!db) {
    const newMsg = { ...message, id: messageCounter++, createdAt: new Date() };
    mockChatMessages.push(newMsg);
    return newMsg.id;
  }
  const result = await db.insert(chatMessages).values(message);
  return (result[0] as any).insertId || result[0];
}

export async function getIncidentChatHistory(incidentId: number) {
  const db = await getDb();
  if (!db) return mockChatMessages.filter(m => m.incidentId === incidentId).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  return await db.select().from(chatMessages).where(eq(chatMessages.incidentId, incidentId)).orderBy(chatMessages.createdAt);
}

export async function getEmergencyContactsByState(state: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(emergencyContacts).where(eq(emergencyContacts.state, state));
}

export async function getEmergencyContactsByStateAndType(state: string, serviceType: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(emergencyContacts).where(and(eq(emergencyContacts.state, state), eq(emergencyContacts.serviceType, serviceType as any)));
}

export async function seedEmergencyContacts(contacts: InsertEmergencyContact[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(emergencyContacts).values(contacts);
}
