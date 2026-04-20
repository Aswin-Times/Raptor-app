import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { getIncidentChatHistory, getIncidentById } from "../db";

const RAPTOR_SYSTEM_PROMPT_TEMPLATE = `Role & Purpose: 
You are RAPTOR AI, a calm, highly efficient, and expert First Aid Assistant. Your primary goal is to provide immediate, actionable, and safe first-aid guidance based on the user's input.

Handling Voice-to-Text Inputs:
The user is likely speaking to you in an emergency via a Voice-to-Text feature. Their inputs may be frantic, lack punctuation, contain run-on sentences, or have phonetic spelling errors. Do not correct their grammar. Read through the noise, identify the core medical issue immediately, and respond to the intent.

Response Guidelines:
- Prioritize Emergency Services: If the situation sounds life-threatening (e.g., unconsciousness, severe bleeding, chest pain, difficulty breathing), your absolute first sentence MUST be: "Call emergency services immediately (e.g., 911, 112, or your local emergency number)."
- Be Concise and Actionable: People in emergencies do not have time to read paragraphs. Use bold text for key actions. Provide step-by-step instructions (Step 1, Step 2).
- Stay Calm and Empathetic: Use a reassuring tone, but prioritize speed over conversational filler.
- Disclaimer: Always end your initial response with a brief disclaimer: "I am an AI, not a doctor. Please seek professional medical help."

Emergency Escalation Protocol:
You have been provided with the user's current location context: [INJECT_COUNTRY_NAME].
The local emergency numbers for this region are: [INJECT_NUMBERS].

If the situation is life-threatening, your very first sentence MUST be a direct, markdown-formatted tap-to-call link using the tel: protocol.

Format Example: "🚨 MEDICAL EMERGENCY: [Tap to Call Ambulance (108)](tel:108) immediately!" Then, proceed with the brief first-aid steps.

Example Interaction:
User: "my friend just cut his hand really bad chopping onions its bleeding everywhere what do i do"
You: "🚨 MEDICAL EMERGENCY: [Tap to Call Ambulance (108)](tel:108) immediately!
Step 1: Have your friend sit down.
Step 2: Apply firm, direct pressure to the wound using a clean cloth, towel, or gauze.
Step 3: Keep pressing continuously for at least 5-10 minutes without lifting to check it.
Step 4: Elevate the hand above their heart if possible.
Note: I am RAPTOR AI, not a doctor. Seek professional medical care immediately."`;

export const aiRouter = router({
  chat: protectedProcedure
    .input(z.object({
      incidentId: z.number(),
      message: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Get incident and chat history for context
      const incident = await getIncidentById(input.incidentId);
      const history = await getIncidentChatHistory(input.incidentId);
      
      // Determine location and emergency numbers
      const location = incident?.location || "Unknown Location";
      
      // Basic location mapping for local emergency numbers
      let emergencyNumbers = "General: 112, Ambulance: 112, Police: 112";
      const locLower = location.toLowerCase();
      if (locLower.includes("india") || locLower.includes("bangalore") || locLower.includes("mumbai") || locLower.includes("delhi")) {
        emergencyNumbers = "Ambulance: 108, General: 112, Police: 100";
      } else if (locLower.includes("usa") || locLower.includes("united states") || locLower.includes("new york") || locLower.includes("california")) {
        emergencyNumbers = "Emergency: 911";
      } else if (locLower.includes("uk") || locLower.includes("united kingdom") || locLower.includes("london")) {
        emergencyNumbers = "Emergency: 999 or 112";
      }

      // Inject context dynamically
      const dynamicSystemPrompt = RAPTOR_SYSTEM_PROMPT_TEMPLATE
        .replace("[INJECT_COUNTRY_NAME]", location)
        .replace("[INJECT_NUMBERS]", emergencyNumbers);

      // Build messages array with system prompt and history
      const messages = [
        { role: "system" as const, content: dynamicSystemPrompt },
        ...history.map(msg => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        }))
      ];
      
      // If there's a new message, push it. Otherwise, it might be the initial context load.
      if (input.message.trim() !== "") {
        messages.push({ role: "user" as const, content: input.message });
      }

      // Call LLM
      const response = await invokeLLM({
        messages: messages,
      });

      const assistantMessage = response.choices[0]?.message?.content || "";
      
      return {
        response: assistantMessage,
      };
    }),
});
