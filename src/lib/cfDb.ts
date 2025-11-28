export async function d1ListPlaylists(env: any, type: string, limit: number) {
  const db = env?.AIMUSIC_DB
  if (!db) return null
  let order = "created_at DESC"
  if (type === "trending") order = "play_count DESC"
  const q = `SELECT p.*, u.username, u.avatar_url FROM playlists p LEFT JOIN users u ON u.id = p.user_id WHERE p.is_public = 1 ORDER BY ${order} LIMIT ?`;
  const res = await db.prepare(q).bind(limit).all()
  const rows = res?.results || []
  return rows.map((r: any) => ({
    id: String(r.id),
    user_id: String(r.user_id),
    title: r.title,
    description: r.description,
    cover_url: r.cover_url,
    category: r.category,
    is_ai_generated: !!r.is_ai_generated,
    is_public: !!r.is_public,
    is_premium: !!r.is_premium,
    price: Number(r.price || 0),
    play_count: Number(r.play_count || 0),
    like_count: Number(r.like_count || 0),
    created_at: r.created_at,
    updated_at: r.updated_at,
    user: { username: r.username, avatar_url: r.avatar_url },
  }))
}

export async function d1GetPlaylist(env: any, id: string) {
  const db = env?.AIMUSIC_DB
  if (!db) return null
  const q = `SELECT p.*, u.username, u.avatar_url FROM playlists p LEFT JOIN users u ON u.id = p.user_id WHERE p.id = ? LIMIT 1`;
  const res = await db.prepare(q).bind(id).all()
  const r = (res?.results || [])[0]
  if (!r) return null
  return {
    id: String(r.id),
    user_id: String(r.user_id),
    title: r.title,
    description: r.description,
    cover_url: r.cover_url,
    category: r.category,
    is_ai_generated: !!r.is_ai_generated,
    is_public: !!r.is_public,
    is_premium: !!r.is_premium,
    price: Number(r.price || 0),
    play_count: Number(r.play_count || 0),
    like_count: Number(r.like_count || 0),
    created_at: r.created_at,
    updated_at: r.updated_at,
    user: { username: r.username, avatar_url: r.avatar_url },
  }
}

export async function d1GetTracks(env: any, playlistId: string) {
  const db = env?.AIMUSIC_DB
  if (!db) return null
  const q = `SELECT * FROM tracks WHERE playlist_id = ? ORDER BY order_index ASC`;
  const res = await db.prepare(q).bind(playlistId).all()
  const rows = res?.results || []
  return rows.map((r: any) => ({
    id: String(r.id),
    playlist_id: String(r.playlist_id),
    title: r.title,
    artist: r.artist,
    audio_url: r.audio_url,
    cover_url: r.cover_url,
    duration: Number(r.duration || 0),
    order_index: Number(r.order_index || 0),
    created_at: r.created_at,
  }))
}

