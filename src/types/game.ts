export type GameStatus = 'want-to-play' | 'playing' | 'beaten' | 'completed' | 'shelved' | 'abandoned';

export interface Game {
  id: number;
  name: string;
  background_image: string;
  released: string;
  rating: number;
  metacritic: number;
  genres: { name: string }[];
  platforms: { platform: { name: string } }[];
  playtime?: number;
}

export interface BacklogEntry {
  game: Game;
  status: GameStatus;
  addedAt: string;
  updatedAt: string;
  rating?: number;
  review?: string;
  hltb_main?: number;
  hltb_extras?: number;
  hltb_complete?: number;
}

export interface RAWGResponse {
  results: Game[];
  next: string | null;
  previous: string | null;
  count: number;
}
