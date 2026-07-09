import { pgTable, serial, text, timestamp, json } from "drizzle-orm/pg-core";

export const vents = pgTable("vents", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  mode: text("mode").notNull().default("comedy"),
  moodTag: text("mood_tag").notNull(),
  moodColor: text("mood_color").notNull(),
  realTalk: text("real_talk").notNull(),
  prompts: json("prompts").$type<string[]>().notNull().default([]),
  songLyrics: text("song_lyrics"),
  danceSteps: json("dance_steps").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
