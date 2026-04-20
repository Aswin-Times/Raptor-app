import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { emergencyContacts } from "./drizzle/schema.ts";

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "test",
});

const db = drizzle(connection);

const emergencyData = [
  // Karnataka - Ambulances
  { state: "Karnataka", serviceType: "ambulance", name: "EMRI Ambulance", phone: "108", distance: "0.5", eta: "5-8 min", level: "Government", differentiator: "Free emergency ambulance service" },
  { state: "Karnataka", serviceType: "ambulance", name: "Private Ambulance Service", phone: "9876543210", distance: "1.2", eta: "8-12 min", level: "Private", differentiator: "24/7 private ambulance with advanced life support" },
  
  // Karnataka - Trauma Centres
  { state: "Karnataka", serviceType: "trauma_centre", name: "Victoria Hospital Trauma Centre", phone: "08026700000", distance: "2.5", eta: "12-15 min", level: "Level I", differentiator: "Government Level I trauma centre with full surgical capability" },
  { state: "Karnataka", serviceType: "trauma_centre", name: "St. John's Medical College Hospital", phone: "08041448888", distance: "3.2", eta: "15-18 min", level: "Level I", differentiator: "Private Level I trauma centre with 24/7 emergency surgery" },
  
  // Karnataka - Police
  { state: "Karnataka", serviceType: "police", name: "PCR Van (Traffic Police)", phone: "100", distance: "1.0", eta: "5-10 min", level: "Government", differentiator: "Police Control Room for accident scene management" },
  
  // Karnataka - Fire
  { state: "Karnataka", serviceType: "fire", name: "Fire & Rescue Service", phone: "101", distance: "2.0", eta: "8-12 min", level: "Government", differentiator: "Fire rescue for vehicle extraction and fire control" },
  
  // Maharashtra - Ambulances
  { state: "Maharashtra", serviceType: "ambulance", name: "EMRI Ambulance", phone: "108", distance: "0.5", eta: "5-8 min", level: "Government", differentiator: "Free emergency ambulance service" },
  { state: "Maharashtra", serviceType: "ambulance", name: "Private Ambulance Service", phone: "9876543211", distance: "1.5", eta: "10-15 min", level: "Private", differentiator: "24/7 private ambulance with advanced life support" },
  
  // Maharashtra - Trauma Centres
  { state: "Maharashtra", serviceType: "trauma_centre", name: "Sion Hospital Trauma Centre", phone: "02224099999", distance: "3.0", eta: "15-20 min", level: "Level I", differentiator: "Government Level I trauma centre with full surgical capability" },
  { state: "Maharashtra", serviceType: "trauma_centre", name: "Lilavati Hospital", phone: "02240606060", distance: "2.8", eta: "14-18 min", level: "Level I", differentiator: "Private Level I trauma centre with advanced ICU facilities" },
  
  // Maharashtra - Police
  { state: "Maharashtra", serviceType: "police", name: "PCR Van (Traffic Police)", phone: "100", distance: "1.2", eta: "6-10 min", level: "Government", differentiator: "Police Control Room for accident scene management" },
  
  // Maharashtra - Fire
  { state: "Maharashtra", serviceType: "fire", name: "Fire & Rescue Service", phone: "101", distance: "2.5", eta: "10-15 min", level: "Government", differentiator: "Fire rescue for vehicle extraction and fire control" },
  
  // Delhi - Ambulances
  { state: "Delhi", serviceType: "ambulance", name: "EMRI Ambulance", phone: "108", distance: "0.3", eta: "4-7 min", level: "Government", differentiator: "Free emergency ambulance service" },
  { state: "Delhi", serviceType: "ambulance", name: "Private Ambulance Service", phone: "9876543212", distance: "1.0", eta: "7-10 min", level: "Private", differentiator: "24/7 private ambulance with advanced life support" },
  
  // Delhi - Trauma Centres
  { state: "Delhi", serviceType: "trauma_centre", name: "AIIMS Delhi Trauma Centre", phone: "01126588500", distance: "2.0", eta: "10-15 min", level: "Level I", differentiator: "Government Level I trauma centre with full surgical capability" },
  { state: "Delhi", serviceType: "trauma_centre", name: "Apollo Hospital Delhi", phone: "01142424242", distance: "2.5", eta: "12-16 min", level: "Level I", differentiator: "Private Level I trauma centre with advanced facilities" },
  
  // Delhi - Police
  { state: "Delhi", serviceType: "police", name: "PCR Van (Traffic Police)", phone: "100", distance: "0.8", eta: "4-8 min", level: "Government", differentiator: "Police Control Room for accident scene management" },
  
  // Delhi - Fire
  { state: "Delhi", serviceType: "fire", name: "Fire & Rescue Service", phone: "101", distance: "1.5", eta: "6-10 min", level: "Government", differentiator: "Fire rescue for vehicle extraction and fire control" },
  
  // Tamil Nadu - Ambulances
  { state: "Tamil Nadu", serviceType: "ambulance", name: "EMRI Ambulance", phone: "108", distance: "0.5", eta: "5-8 min", level: "Government", differentiator: "Free emergency ambulance service" },
  { state: "Tamil Nadu", serviceType: "ambulance", name: "Private Ambulance Service", phone: "9876543213", distance: "1.3", eta: "9-13 min", level: "Private", differentiator: "24/7 private ambulance with advanced life support" },
  
  // Tamil Nadu - Trauma Centres
  { state: "Tamil Nadu", serviceType: "trauma_centre", name: "Government Medical College Hospital", phone: "04424640000", distance: "2.2", eta: "12-16 min", level: "Level I", differentiator: "Government Level I trauma centre with full surgical capability" },
  { state: "Tamil Nadu", serviceType: "trauma_centre", name: "Apollo Hospital Chennai", phone: "04428298888", distance: "2.8", eta: "14-18 min", level: "Level I", differentiator: "Private Level I trauma centre with advanced facilities" },
  
  // Tamil Nadu - Police
  { state: "Tamil Nadu", serviceType: "police", name: "PCR Van (Traffic Police)", phone: "100", distance: "1.0", eta: "5-10 min", level: "Government", differentiator: "Police Control Room for accident scene management" },
  
  // Tamil Nadu - Fire
  { state: "Tamil Nadu", serviceType: "fire", name: "Fire & Rescue Service", phone: "101", distance: "2.0", eta: "8-12 min", level: "Government", differentiator: "Fire rescue for vehicle extraction and fire control" },
];

try {
  console.log("Seeding emergency contacts...");
  
  // Check if data already exists
  const existing = await db.select().from(emergencyContacts).limit(1);
  if (existing.length > 0) {
    console.log("Emergency contacts already seeded, skipping...");
    process.exit(0);
  }
  
  await db.insert(emergencyContacts).values(emergencyData);
  console.log(`Successfully seeded ${emergencyData.length} emergency contacts!`);
} catch (error) {
  console.error("Seeding failed:", error);
  process.exit(1);
} finally {
  await connection.end();
}
