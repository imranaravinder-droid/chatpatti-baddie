export type Mode = "debate" | "comedy" | "romance";

export interface BaddieResponse {
  moodTag: string;
  moodColor: string;
  realTalk: string;
  prompts: string[];
  songLyrics?: string;
  danceSteps?: string[];
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
