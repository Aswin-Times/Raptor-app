import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("incidents router", () => {
  it("creates a new incident with CRITICAL triage level", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.incidents.create({
      triageLevel: "CRITICAL",
      language: "en",
    });

    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("number");
  });

  it("creates incident with SERIOUS triage level", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.incidents.create({
      triageLevel: "SERIOUS",
      language: "en",
    });

    expect(result).toHaveProperty("id");
  });

  it("creates incident with MINOR triage level", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.incidents.create({
      triageLevel: "MINOR",
      language: "en",
    });

    expect(result).toHaveProperty("id");
  });

  it("creates incident with language preference", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.incidents.create({
      triageLevel: "CRITICAL",
      language: "hi",
    });

    expect(result).toHaveProperty("id");
  });

  it("lists user incidents", async () => {
    const ctx = createAuthContext(2);
    const caller = appRouter.createCaller(ctx);

    // Create an incident first
    await caller.incidents.create({
      triageLevel: "CRITICAL",
      language: "en",
    });

    // List incidents
    const incidents = await caller.incidents.listUserIncidents();

    expect(Array.isArray(incidents)).toBe(true);
  });

  it("updates incident triage level", async () => {
    const ctx = createAuthContext(3);
    const caller = appRouter.createCaller(ctx);

    // Create an incident
    const created = await caller.incidents.create({
      triageLevel: "MINOR",
      language: "en",
    });

    // Update triage level
    await caller.incidents.updateTriageLevel({
      incidentId: created.id,
      triageLevel: "CRITICAL",
    });

    // Verify update
    const incident = await caller.incidents.getById({ id: created.id });
    expect(incident?.triageLevel).toBe("CRITICAL");
  });

  it("updates incident location", async () => {
    const ctx = createAuthContext(4);
    const caller = appRouter.createCaller(ctx);

    // Create an incident
    const created = await caller.incidents.create({
      triageLevel: "CRITICAL",
      language: "en",
    });

    // Update location
    await caller.incidents.updateLocation({
      incidentId: created.id,
      location: "NH-44, Bangalore",
      latitude: "12.9716",
      longitude: "77.5946",
    });

    // Verify update
    const incident = await caller.incidents.getById({ id: created.id });
    expect(incident?.location).toBe("NH-44, Bangalore");
    expect(incident?.latitude).toBe("12.9716");
    expect(incident?.longitude).toBe("77.5946");
  });

  it("marks incident dispatch as submitted", async () => {
    const ctx = createAuthContext(5);
    const caller = appRouter.createCaller(ctx);

    // Create an incident
    const created = await caller.incidents.create({
      triageLevel: "CRITICAL",
      language: "en",
    });

    // Mark dispatch submitted
    await caller.incidents.markDispatchSubmitted({
      incidentId: created.id,
    });

    // Verify
    const incident = await caller.incidents.getById({ id: created.id });
    expect(incident?.dispatchSubmitted).not.toBeNull();
  });
});

describe("chat router", () => {
  it("adds a user message to incident chat", async () => {
    const ctx = createAuthContext(6);
    const caller = appRouter.createCaller(ctx);

    // Create an incident
    const incident = await caller.incidents.create({
      triageLevel: "CRITICAL",
      language: "en",
    });

    // Add message
    const result = await caller.chat.addMessage({
      incidentId: incident.id,
      role: "user",
      content: "I was in a car accident",
    });

    expect(result).toBeDefined();
  });

  it("adds an assistant message to incident chat", async () => {
    const ctx = createAuthContext(7);
    const caller = appRouter.createCaller(ctx);

    // Create an incident
    const incident = await caller.incidents.create({
      triageLevel: "CRITICAL",
      language: "en",
    });

    // Add assistant message
    const result = await caller.chat.addMessage({
      incidentId: incident.id,
      role: "assistant",
      content: "I'm here to help. Tell me about your injuries.",
    });

    expect(result).toBeDefined();
  });

  it("retrieves chat history for incident", async () => {
    const ctx = createAuthContext(8);
    const caller = appRouter.createCaller(ctx);

    // Create an incident
    const incident = await caller.incidents.create({
      triageLevel: "CRITICAL",
      language: "en",
    });

    // Add messages
    await caller.chat.addMessage({
      incidentId: incident.id,
      role: "user",
      content: "I was in a car accident",
    });

    await caller.chat.addMessage({
      incidentId: incident.id,
      role: "assistant",
      content: "I'm here to help.",
    });

    // Get history
    const history = await caller.chat.getHistory({
      incidentId: incident.id,
    });

    expect(Array.isArray(history)).toBe(true);
    expect(history.length).toBeGreaterThanOrEqual(2);
  });
});

describe("emergency router", () => {
  it("retrieves emergency contacts by state", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // This will return empty array if no data seeded, but should not error
    const contacts = await caller.emergency.getContactsByState({
      state: "Karnataka",
    });

    expect(Array.isArray(contacts)).toBe(true);
  });

  it("retrieves emergency contacts by state and type", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // This will return empty array if no data seeded, but should not error
    const contacts = await caller.emergency.getContactsByStateAndType({
      state: "Karnataka",
      serviceType: "ambulance",
    });

    expect(Array.isArray(contacts)).toBe(true);
  });
});
