import { NextResponse } from 'next/server'
import { mockStore } from '@/lib/mockStore'
export const runtime = 'edge'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { user_id?: string; playlist_id?: string }
  if (!body?.user_id || !body?.playlist_id) return NextResponse.json({ error: 'user_id and playlist_id required' }, { status: 400 })
  const favored = mockStore.toggleFavorite(body.user_id, body.playlist_id)
  return NextResponse.json({ data: { favored } })
}

