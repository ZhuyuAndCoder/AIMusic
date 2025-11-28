import { NextResponse } from 'next/server'
import { mockStore } from '@/lib/mockStore'
export const runtime = 'edge'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const playlistId = searchParams.get('playlist_id')
  if (!playlistId) return NextResponse.json({ error: 'playlist_id required' }, { status: 400 })
  const data = mockStore.getTracks(playlistId)
  return NextResponse.json({ data })
}

