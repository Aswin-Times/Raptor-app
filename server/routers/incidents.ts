import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { createIncident, getIncidentById, getUserIncidents, updateIncidentTriageLevel, updateIncidentLocation, markIncidentDispatchSubmitted, createChatMessage, getIncidentChatHistory } from "../db";
import { notifyOwner } from "../_core/notification";
import { getCountryFromIp } from "../utils/geolocation";

export const incidentsRouter = router({
  create: protectedProcedure
    .input(z.object({
      triageLevel: z.enum(["CRITICAL", "SERIOUS", "MINOR"]),
      language: z.string().default("en"),
    }))
    .mutation(async ({ ctx, input }) => {
      // Extract IP from request (handling proxies)
      const ip = (ctx.req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
                 ctx.req.socket?.remoteAddress || 
                 ctx.req.ip || 
                 "";
      
      const locationFromIp = await getCountryFromIp(ip);

      const incident = await createIncident({
        userId: ctx.user.id,
        triageLevel: input.triageLevel,
        language: input.language,
        location: locationFromIp !== "Unknown Location" ? locationFromIp : undefined,
      });
      
      // Notify owner of new incident
      await notifyOwner({
        title: "New Emergency Incident Reported",
        content: `A ${input.triageLevel} severity incident has been reported by user ${ctx.user.name || ctx.user.email}. Incident ID: ${incident}`,
      });
      
      return { id: incident };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await getIncidentById(input.id);
    }),

  listUserIncidents: protectedProcedure
    .query(async ({ ctx }) => {
      return await getUserIncidents(ctx.user.id);
    }),

  updateTriageLevel: protectedProcedure
    .input(z.object({
      incidentId: z.number(),
      triageLevel: z.enum(["CRITICAL", "SERIOUS", "MINOR"]),
    }))
    .mutation(async ({ input }) => {
      return await updateIncidentTriageLevel(input.incidentId, input.triageLevel);
    }),

  updateLocation: protectedProcedure
    .input(z.object({
      incidentId: z.number(),
      location: z.string(),
      latitude: z.string(),
      longitude: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await updateIncidentLocation(input.incidentId, input.location, input.latitude, input.longitude);
    }),

  markDispatchSubmitted: protectedProcedure
    .input(z.object({ incidentId: z.number() }))
    .mutation(async ({ input }) => {
      return await markIncidentDispatchSubmitted(input.incidentId);
    }),
});

export const chatRouter = router({
  addMessage: protectedProcedure
    .input(z.object({
      incidentId: z.number(),
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await createChatMessage({
        incidentId: input.incidentId,
        role: input.role,
        content: input.content,
      });
    }),

  getHistory: protectedProcedure
    .input(z.object({ incidentId: z.number() }))
    .query(async ({ input }) => {
      return await getIncidentChatHistory(input.incidentId);
    }),
});
