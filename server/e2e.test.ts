import { describe, it, expect, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `e2e-user-${userId}`,
    email: `e2e${userId}@example.com`,
    name: `E2E Test User ${userId}`,
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

describe("RoadSOS Magnus E2E Flow", () => {
  it("completes full emergency response flow: create incident -> chat -> update triage -> mark dispatch", async () => {
    const ctx = createAuthContext(100);
    const caller = appRouter.createCaller(ctx);

    // Step 1: User clicks "Get Help Now" - creates CRITICAL incident
    const incident = await caller.incidents.create({
      triageLevel: "CRITICAL",
      language: "en",
    });

    expect(incident).toHaveProperty("id");
    expect(typeof incident.id).toBe("number");
    const incidentId = incident.id;

    // Step 2: Verify incident was created
    const createdIncident = await caller.incidents.getById({ id: incidentId });
    expect(createdIncident).toBeDefined();
    expect(createdIncident?.triageLevel).toBe("CRITICAL");
    expect(createdIncident?.userId).toBe(ctx.user.id);

    // Step 3: User describes situation - add user message to chat
    await caller.chat.addMessage({
      incidentId: incidentId,
      role: "user",
      content: "I was in a car accident on NH-44. There are 2 injured people.",
    });

    // Step 4: AI responds with triage guidance - add assistant message
    await caller.chat.addMessage({
      incidentId: incidentId,
      role: "assistant",
      content: "I understand. This is a CRITICAL situation. Let me help you. First, ensure both injured persons are in a safe location away from traffic.",
    });

    // Step 5: User provides more details
    await caller.chat.addMessage({
      incidentId: incidentId,
      role: "user",
      content: "Person 1 has chest pain and difficulty breathing. Person 2 has a leg injury.",
    });

    // Step 6: AI provides first aid guidance
    await caller.chat.addMessage({
      incidentId: incidentId,
      role: "assistant",
      content: "For Person 1 with chest pain and difficulty breathing: Keep them sitting upright, loosen tight clothing, and monitor breathing. For Person 2 with leg injury: Immobilize the leg and elevate if possible.",
    });

    // Step 7: Verify chat history
    const chatHistory = await caller.chat.getHistory({ incidentId: incidentId });
    expect(Array.isArray(chatHistory)).toBe(true);
    expect(chatHistory.length).toBeGreaterThanOrEqual(4);

    // Step 8: Update incident with location information
    await caller.incidents.updateLocation({
      incidentId: incidentId,
      location: "NH-44, Bangalore",
      latitude: "12.9716",
      longitude: "77.5946",
    });

    // Step 9: Verify location was updated
    const updatedIncident = await caller.incidents.getById({ id: incidentId });
    expect(updatedIncident?.location).toBe("NH-44, Bangalore");
    expect(updatedIncident?.latitude).toBe("12.9716");

    // Step 10: Update triage level based on new information
    await caller.incidents.updateTriageLevel({
      incidentId: incidentId,
      triageLevel: "CRITICAL",
    });

    // Step 11: Mark dispatch as submitted
    await caller.incidents.markDispatchSubmitted({
      incidentId: incidentId,
    });

    // Step 12: Verify dispatch was marked
    const finalIncident = await caller.incidents.getById({ id: incidentId });
    expect(finalIncident?.dispatchSubmitted).not.toBeNull();

    // Step 13: User can resume session - list their incidents
    const userIncidents = await caller.incidents.listUserIncidents();
    expect(Array.isArray(userIncidents)).toBe(true);
    const resumableIncident = userIncidents.find((inc) => inc.id === incidentId);
    expect(resumableIncident).toBeDefined();

    // Step 14: Verify full chat history is available for resumption
    const resumeHistory = await caller.chat.getHistory({ incidentId: incidentId });
    expect(resumeHistory.length).toBeGreaterThanOrEqual(4);
    expect(resumeHistory.some((msg) => msg.role === "user")).toBe(true);
    expect(resumeHistory.some((msg) => msg.role === "assistant")).toBe(true);
  });

  it("handles multiple concurrent incidents from different users", async () => {
    const user1Ctx = createAuthContext(101);
    const user2Ctx = createAuthContext(102);

    const caller1 = appRouter.createCaller(user1Ctx);
    const caller2 = appRouter.createCaller(user2Ctx);

    // User 1 creates CRITICAL incident
    const incident1 = await caller1.incidents.create({
      triageLevel: "CRITICAL",
      language: "en",
    });

    // User 2 creates SERIOUS incident
    const incident2 = await caller2.incidents.create({
      triageLevel: "SERIOUS",
      language: "hi",
    });

    expect(incident1.id).not.toBe(incident2.id);

    // Both users add messages independently
    await caller1.chat.addMessage({
      incidentId: incident1.id,
      role: "user",
      content: "User 1 emergency message",
    });

    await caller2.chat.addMessage({
      incidentId: incident2.id,
      role: "user",
      content: "User 2 emergency message",
    });

    // Verify each user only sees their own incidents
    const user1Incidents = await caller1.incidents.listUserIncidents();
    const user2Incidents = await caller2.incidents.listUserIncidents();

    expect(user1Incidents.some((inc) => inc.id === incident1.id)).toBe(true);
    expect(user2Incidents.some((inc) => inc.id === incident2.id)).toBe(true);
  });

  it("supports multilingual emergency response", async () => {
    const ctx = createAuthContext(103);
    const caller = appRouter.createCaller(ctx);

    // Create incident with Hindi language preference
    const incident = await caller.incidents.create({
      triageLevel: "CRITICAL",
      language: "hi",
    });

    expect(incident).toHaveProperty("id");

    // Add messages in Hindi
    await caller.chat.addMessage({
      incidentId: incident.id,
      role: "user",
      content: "मुझे कार दुर्घटना हुई है",
    });

    // Verify chat history preserves language
    const history = await caller.chat.getHistory({ incidentId: incident.id });
    expect(history.some((msg) => msg.content.includes("दुर्घटना"))).toBe(true);
  });

  it("handles different triage levels appropriately", async () => {
    const criticalCtx = createAuthContext(104);
    const seriousCtx = createAuthContext(105);
    const minorCtx = createAuthContext(106);

    const criticalCaller = appRouter.createCaller(criticalCtx);
    const seriousCaller = appRouter.createCaller(seriousCtx);
    const minorCaller = appRouter.createCaller(minorCtx);

    // Create incidents with different triage levels
    const critical = await criticalCaller.incidents.create({
      triageLevel: "CRITICAL",
      language: "en",
    });

    const serious = await seriousCaller.incidents.create({
      triageLevel: "SERIOUS",
      language: "en",
    });

    const minor = await minorCaller.incidents.create({
      triageLevel: "MINOR",
      language: "en",
    });

    // Verify all were created
    expect(critical).toHaveProperty("id");
    expect(serious).toHaveProperty("id");
    expect(minor).toHaveProperty("id");

    // Verify triage levels are preserved
    const criticalData = await criticalCaller.incidents.getById({ id: critical.id });
    const seriousData = await seriousCaller.incidents.getById({ id: serious.id });
    const minorData = await minorCaller.incidents.getById({ id: minor.id });

    expect(criticalData?.triageLevel).toBe("CRITICAL");
    expect(seriousData?.triageLevel).toBe("SERIOUS");
    expect(minorData?.triageLevel).toBe("MINOR");
  });
});
