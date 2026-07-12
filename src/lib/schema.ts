import { pgTable, serial, text, timestamp, json, integer, boolean } from "drizzle-orm/pg-core";

export const vents = pgTable("vents", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  mode: text("mode").notNull().default("comedy"),
  moodTag: text("mood_tag").notNull(),
  moodColor: text("mood_color").notNull(),
  realTalk: text("real_talk").notNull(),
  prompts: json("prompts").$type<string[]>().notNull().default([]),
  aiText: text("ai_text"),
  songLyrics: text("song_lyrics"),
  danceSteps: json("dance_steps").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  deviceId: text("device_id"),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  deviceId: text("device_id").notNull().unique(),
  email: text("email").notNull(),
  razorpayOrderId: text("razorpay_order_id").notNull(),
  razorpayPaymentId: text("razorpay_payment_id").notNull(),
  plan: text("plan").notNull().default("premium"),
  status: text("status").notNull().default("active"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const dailyUsage = pgTable("daily_usage", {
  id: serial("id").primaryKey(),
  deviceId: text("device_id").notNull(),
  date: text("date").notNull(),
  count: integer("count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
