import { NextResponse } from 'next/server'
import { mockStore } from '@/lib/mockStore'
import { d1GetPlaylist, d1GetTracks } from '@/lib/cfDb'
export const runtime = 'edge'

export async function GET(_req: Request, context: any) {
  const id = context?.params?.id as string
  const d1Playlist = await d1GetPlaylist(context?.env, id)
  if (d1Playlist) {
    const tracks = await d1GetTracks(context?.env, id)
    return NextResponse.json({ data: { playlist: d1Playlist, tracks } })
  }
  const playlist = mockStore.getPlaylist(id)
  if (!playlist) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const tracks = mockStore.getTracks(id)
  mockStore.incrementPlayCount(id)
  return NextResponse.json({ data: { playlist, tracks } })
}
