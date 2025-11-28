CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS playlists (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  category TEXT,
  is_ai_generated INTEGER DEFAULT 0,
  is_public INTEGER DEFAULT 1,
  is_premium INTEGER DEFAULT 0,
  price REAL DEFAULT 0,
  play_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_playlists_public ON playlists(is_public);
CREATE INDEX IF NOT EXISTS idx_playlists_created ON playlists(created_at);
CREATE INDEX IF NOT EXISTS idx_playlists_play ON playlists(play_count);

CREATE TABLE IF NOT EXISTS tracks (
  id TEXT PRIMARY KEY,
  playlist_id TEXT NOT NULL,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  cover_url TEXT,
  duration INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (playlist_id) REFERENCES playlists(id)
);

CREATE INDEX IF NOT EXISTS idx_tracks_playlist ON tracks(playlist_id);
CREATE INDEX IF NOT EXISTS idx_tracks_order ON tracks(order_index);

CREATE TABLE IF NOT EXISTS favorites (
  user_id TEXT NOT NULL,
  playlist_id TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, playlist_id)
);

CREATE TABLE IF NOT EXISTS purchases (
  user_id TEXT NOT NULL,
  playlist_id TEXT NOT NULL,
  price REAL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, playlist_id)
);

