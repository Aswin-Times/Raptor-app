import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getEmergencyContactsByState, getEmergencyContactsByStateAndType } from "../db";

export const emergencyRouter = router({
  getContactsByState: publicProcedure
    .input(z.object({ state: z.string() }))
    .query(async ({ input }) => {
      return await getEmergencyContactsByState(input.state);
    }),

  getContactsByStateAndType: publicProcedure
    .input(z.object({
      state: z.string(),
      serviceType: z.enum(["ambulance", "police", "fire", "trauma_centre"]),
    }))
    .query(async ({ input }) => {
      return await getEmergencyContactsByStateAndType(input.state, input.serviceType);
    }),
});
