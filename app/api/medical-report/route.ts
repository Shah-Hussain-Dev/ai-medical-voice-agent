import { db } from "@/config/db";
import { openai } from "@/config/OpenAiModel";
import { SessionChatTable } from "@/config/schema";
import { AI_DOCTOR_SUGGESTION_MODEL } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
const REPORT_GEN_PROMPT=`
You are an AI Medical Voice Agent that just finished a voice conversation with a user. Based on doctor AI agent info and Conversation between ai medical agent and user , generate a structured report with the following fields:

1. sessionId: a unique session identifier
2. agent: the medical specialist name (e.g., "General Physician AI")
3. user: name of the patient or "Anonymous" if not provided
4. timestamp: current date and time in ISO format
5. chiefComplaint: one-sentence summary of the main health concern
6. summary: a 2-3 sentence summary of the conversation, symptoms, and recommendations
7. symptoms: list of symptoms mentioned by the user
8. duration: how long the user has experienced the symptoms
9. severity: mild, moderate, or severe
10. medicationsMentioned: list of any medicines mentioned
11. recommendations: list of AI suggestions (e.g., rest, see a doctor)
Return the result in this JSON format:
{
 "sessionId": "string",
 "agent": "string",
 "user": "string",
 "timestamp": "ISO Date string",
 "chiefComplaint": "string",
 "summary": "string",
 "symptoms": ["symptom1", "symptom2"],
 "duration": "string",
 "severity": "string",
 "medicationsMentioned": ["med1", "med2"],
 "recommendations": ["rec1", "rec2"],
}

Only include valid fields. Respond with nothing else.


`
export async function POST (request:Request){

    try {
        const {
            messages,
            sessionDetail,
            sessionId
        }= await request.json();
        
        const UserInput=`AI Doctor Agent Info: ${JSON.stringify(sessionDetail)} \n Session ID: ${sessionId} \n Conversation Message: ${JSON.stringify(messages)}`

        // call gemini with prompt to generate report
        const completion = await openai.chat.completions.create({
              model: AI_DOCTOR_SUGGESTION_MODEL.gemini,
              messages: [
                {
                  role: "system",
                  content:REPORT_GEN_PROMPT
                    
                },
                {
                  role: "user",
                  content: UserInput
                   
                },
              ],
              max_tokens: 4000
            });
        
               console.log(completion?.choices?.[0]?.message);
                let content = completion?.choices?.[0]?.message?.content || "";
                
                // Clean up potential markdown formatting
                content = content.trim();
                if (content.startsWith("```json")) {
                content = content.slice(7);
                } else if (content.startsWith("```")) {
                content = content.slice(3);
                }
                if (content.endsWith("```")) {
                content = content.slice(0, -3);
                }
                content = content.trim();
                // Save to database
                const result = await db.update(SessionChatTable).set({
                    report:content,
                    conversation:JSON.stringify(messages),
                    
                }).where(eq(SessionChatTable.sessionId,sessionId))
                return NextResponse.json({report:content});
    } catch (error) {
        console.error("Error generating medical report:", error);
        return NextResponse.json({report:[]});
    }
}
