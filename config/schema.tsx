import { integer, pgTable, varchar, text, json } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    credits: integer().notNull().default(0),
});

export const SessionChatTable = pgTable('sessionChatTable', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    sessionId: varchar().notNull(),
    notes: text(),
    conversation: json(),
    report: json(),
    selectedDoctor: json(),
    createdBy: varchar().references(() => usersTable.email),
    createdOn: varchar(),
});