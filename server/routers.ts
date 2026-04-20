import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { incidentsRouter, chatRouter } from "./routers/incidents";
import { emergencyRouter } from "./routers/emergency";
import { aiRouter } from "./routers/ai";
import { z } from "zod";
import { sdk } from "./_core/sdk";
import * as db from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    localAuth: publicProcedure
      .input(
        z.object({
          action: z.enum(["login", "signup"]),
          email: z.string().email(),
          password: z.string(),
          name: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Mock authentication for local development
        const openId = `local_${input.email.replace(/[^a-zA-Z0-9]/g, "")}`;
        
        try {
          const user = {
            openId,
            email: input.email,
            name: input.name || input.email.split("@")[0],
            loginMethod: "local",
          };
          await db.upsertUser(user as any);
        } catch (e) {
          console.warn("[Auth] Failed to upsert user to DB, continuing with mock session.", e);
        }

        const sessionToken = await sdk.createSessionToken(openId, {
          name: input.name || input.email.split("@")[0],
        });

        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, cookieOptions);

        return { success: true };
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  incidents: incidentsRouter,
  chat: chatRouter,
  ai: aiRouter,
  emergency: emergencyRouter,
});

export type AppRouter = typeof appRouter;
