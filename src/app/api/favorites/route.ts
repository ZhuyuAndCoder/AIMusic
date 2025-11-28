import { NextResponse } from 'next/server'
import { mockStore } from '@/lib/mockStore'
import { kvToggleFavorite } from '@/lib/cfKv'
export const runtime = 'edge'

export async function POST(req: Request, context: any) {
  const body = await req.json().catch(() => null) as { user_id?: string; playlist_id?: string }
  if (!body?.user_id || !body?.playlist_id) return NextResponse.json({ error: 'user_id and playlist_id required' }, { status: 400 })

  // Try D1 first
  const db = context?.env?.AIMUSIC_DB
  if (db) {
    // Check existing
    const sel = await db.prepare('SELECT 1 FROM favorites WHERE user_id = ? AND playlist_id = ? LIMIT 1').bind(body.user_id, body.playlist_id).all()
    const exists = (sel?.results || []).length > 0
    if (exists) {
      await db.prepare('DELETE FROM favorites WHERE user_id = ? AND playlist_id = ?').bind(body.user_id, body.playlist_id).run()
      return NextResponse.json({ data: { favored: false } })
    } else {
      await db.prepare('INSERT INTO favorites(user_id, playlist_id) VALUES(?, ?)').bind(body.user_id, body.playlist_id).run()
      return NextResponse.json({ data: { favored: true } })
    }
  }

  // KV fallback
  const kvFav = await kvToggleFavorite(context?.env, body.user_id, body.playlist_id)
  if (kvFav !== null) return NextResponse.json({ data: { favored: kvFav } })

  // Mock fallback
  const favored = mockStore.toggleFavorite(body.user_id, body.playlist_id)
  return NextResponse.json({ data: { favored } })
}
