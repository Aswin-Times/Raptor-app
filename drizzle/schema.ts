import { decimal, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Incidents table: stores emergency incident reports
 */
export const incidents = mysqlTable("incidents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  triageLevel: mysqlEnum("triageLevel", ["CRITICAL", "SERIOUS", "MINOR"]).notNull(),
  location: text("location"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  injuryDescription: text("injuryDescription"),
  incidentSummary: text("incidentSummary"),
  language: varchar("language", { length: 10 }).default("en"),
  dispatchSubmitted: timestamp("dispatchSubmitted"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = typeof incidents.$inferInsert;

/**
 * Chat messages table: stores conversation history for each incident
 */
export const chatMessages = mysqlTable("chatMessages", {
  id: int("id").autoincrement().primaryKey(),
  incidentId: int("incidentId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

/**
 * Emergency contacts table: stores emergency service information by location/state
 */
export const emergencyContacts = mysqlTable("emergencyContacts", {
  id: int("id").autoincrement().primaryKey(),
  state: varchar("state", { length: 50 }).notNull(),
  serviceType: mysqlEnum("serviceType", ["ambulance", "police", "fire", "trauma_centre"]).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  distance: decimal("distance", { precision: 5, scale: 2 }),
  eta: varchar("eta", { length: 50 }),
  level: varchar("level", { length: 50 }),
  differentiator: text("differentiator"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmergencyContact = typeof emergencyContacts.$inferSelect;
export type InsertEmergencyContact = typeof emergencyContacts.$inferInsert;

/**
 * Relations
 */
export const usersRelations = relations(users, ({ many }) => ({
  incidents: many(incidents),
}));

export const incidentsRelations = relations(incidents, ({ one, many }) => ({
  user: one(users, {
    fields: [incidents.userId],
    references: [users.id],
  }),
  chatMessages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  incident: one(incidents, {
    fields: [chatMessages.incidentId],
    references: [incidents.id],
  }),
}));