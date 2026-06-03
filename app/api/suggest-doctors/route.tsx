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
        { role: "system", content: JSON.stringify(AIDoctorAgents) },
        {
          role: "user",
          content:
            "User Notes/Symptoms :" + notes + ", Depends on the user notes and symptoms please suggest list of doctors, Return Object in JSON only  ",
        },
      ],
    });
    console.log(completion.choices[0].message);
    let content = completion.choices[0].message.content || "";
    
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
      return NextResponse.json(parsedData);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError, "Raw content:", content);
      return NextResponse.json({ error: "Failed to parse suggestions", raw: content }, { status: 500 });
    }
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
  }
}
