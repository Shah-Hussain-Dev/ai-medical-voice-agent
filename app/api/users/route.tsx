import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST() {
    const user = await currentUser();
    try {
        // Validate Clerk user
        const email = user?.primaryEmailAddress?.emailAddress;
        if (!email) {
            return NextResponse.json({ error: "No authenticated user email" }, { status: 401 });
        }

        // Check if user exists
        const users = await db.select().from(usersTable).where(eq(usersTable.email, email));
        if (users.length === 0) {
            const inserted = await db
                .insert(usersTable)
                .values({ name: user?.fullName ?? "", email, credits: 10 })
                .returning();

            const created = Array.isArray(inserted) ? inserted[0] : inserted;
            return NextResponse.json({ user: created }, { status: 201 });
        }

        return NextResponse.json({ user: users[0], }, { status: 200 });
    } catch (err) {
        console.error("Error fetching user data:", err);
        return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
    }

}