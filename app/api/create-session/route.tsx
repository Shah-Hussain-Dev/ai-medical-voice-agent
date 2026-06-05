import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, notes, conversation, report, selectedDoctor } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const inserted = await db
      .insert(SessionChatTable)
      .values({
        sessionId,
        notes: typeof notes === "object" ? JSON.stringify(notes) : notes,
        conversation: conversation || [],
        report: report || {},
        selectedDoctor: selectedDoctor || null,
        createdBy: email,
        createdOn: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json({ success: true, data: inserted[0] }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating session in DB:", error);
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
  }
}


export async function GET(req: Request){
// get session id from the db and use onthe medical agent page
const {searchParams} = new URL(req.url);
const sessionId = searchParams.get('sessionId');
if(!sessionId){
  return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
}

const result = await db.select().from(SessionChatTable).where(eq(SessionChatTable.sessionId, sessionId));
return NextResponse.json({ success: true, data: result[0] }, { status: 200 });
 

}