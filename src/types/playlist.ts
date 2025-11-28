export interface Playlist {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  cover_url?: string;
  category?: string;
  is_ai_generated: boolean;
  is_public: boolean;
  is_premium: boolean;
  price: number;
  play_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
  user?: {
    username: string;
    avatar_url?: string;
  };
}

export interface Track {
  id: string;
  playlist_id: string;
  title: string;
  artist: string;
  album?: string;
  audio_url: string;
  cover_url?: string;
  duration: number;
  order_index: number;
  created_at: string;
}
