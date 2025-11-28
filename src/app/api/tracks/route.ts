import { NextResponse } from 'next/server'
import { mockStore } from '@/lib/mockStore'
import { d1GetTracks } from '@/lib/cfDb'
export const runtime = 'edge'

export async function GET(req: Request, context: any) {
  const { searchParams } = new URL(req.url)
  const playlistId = searchParams.get('playlist_id')
  if (!playlistId) return NextResponse.json({ error: 'playlist_id required' }, { status: 400 })
  const d1 = await d1GetTracks(context?.env, playlistId)
  if (d1) return NextResponse.json({ data: d1 })
  const data = mockStore.getTracks(playlistId)
  return NextResponse.json({ data })
}
