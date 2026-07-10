export type Mode = "debate" | "comedy" | "romance";

export interface BookRec {
  title: string;
  author: string;
  reason: string;
  emoji: string;
}

export interface RecipeRec {
  name: string;
  ingredients: string[];
  reason: string;
  emoji: string;
}

export interface BaddieResponse {
  moodTag: string;
  moodColor: string;
  realTalk: string;
  prompts: string[];
  songLyrics?: string | null;
  danceSteps?: string[] | null;
  books?: BookRec[] | null;
  recipes?: RecipeRec[] | null;
}

export interface Vent {
  id: string;
  content: string;
  mode: Mode;
  response: BaddieResponse;
  createdAt: string;
}

export interface MoodTagColor {
  tag: string;
  color: string;
}
