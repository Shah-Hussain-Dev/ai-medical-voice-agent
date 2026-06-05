import { openai } from "@/config/OpenAiModel";
import { AI_DOCTOR_SUGGESTION_MODEL } from "@/lib/utils";
import { AIDoctorAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { notes } = await req.json();
  try {
    const completion = await openai.chat.completions.create({
      model: AI_DOCTOR_SUGGESTION_MODEL.llama,
      messages: [
        {
          role: "system",
          content:
            "You are a medical suggestion AI. You are provided with a JSON list of available Doctor Agents: " +
            JSON.stringify(AIDoctorAgents) +
            ". Based on the user's notes and symptoms, suggest a list of the 2 to 3 most relevant doctor agents from this list (always include the primary specialist match, and 1 or 2 other general or related specialists as alternative options). You MUST return a JSON object with a single key 'suggestedDoctors' containing an array of these matched doctor agent objects from the list. Do not invent doctors that are not in the list.",
        },
        {
          role: "user",
          content:
            "User Notes/Symptoms: " +
            notes +
            "\n\nPlease suggest a list of 2 to 3 most relevant doctor agents from the list (including the primary specialist plus alternative or general options). Return the list in this exact JSON format: {\"suggestedDoctors\": [...]}. Return only valid JSON without any other text.",
        },
      ],
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

    try {
      const parsedData = JSON.parse(content);
      
      let suggested: any[] = [];
      if (Array.isArray(parsedData)) {
        suggested = parsedData;
      } else if (parsedData && typeof parsedData === "object") {
        if (Array.isArray(parsedData.suggestedDoctors)) {
          suggested = parsedData.suggestedDoctors;
        } else if (Array.isArray(parsedData.suggested_doctors)) {
          suggested = parsedData.suggested_doctors;
        } else if (Array.isArray(parsedData.doctors)) {
          suggested = parsedData.doctors;
        } else {
          // If there is any key that has an array value, use it
          const arrayKey = Object.keys(parsedData).find(key => Array.isArray(parsedData[key]));
          if (arrayKey) {
            suggested = parsedData[arrayKey];
          } else if (parsedData.specialist || parsedData.id) {
            // If the object itself represents a doctor agent
            suggested = [parsedData];
          }
        }
      }

      // Filter and map suggested doctors to ensure they exist in our predefined AIDoctorAgents
      const normalizedSuggested = AIDoctorAgents.filter((agent) =>
        suggested.some(
          (s: any) =>
            s &&
            (s.id === agent.id ||
              (typeof s.specialist === "string" &&
                s.specialist.toLowerCase() === agent.specialist.toLowerCase()))
        )
      );

      // If no valid doctors were matched, fallback to all available doctor agents
      const finalDoctors = normalizedSuggested.length > 0 ? normalizedSuggested : AIDoctorAgents;

      return NextResponse.json({ suggestedDoctors: finalDoctors });
    } catch (parseError) {
      console.error("JSON parsing error:", parseError, "Raw content:", content);
      // Fallback: If parsing fails entirely, return all doctor agents in the consistent structure
      return NextResponse.json({ suggestedDoctors: AIDoctorAgents });
    }
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
  }
}
