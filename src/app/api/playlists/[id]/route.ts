import { NextResponse } from 'next/server'
import { mockStore } from '@/lib/mockStore'
export const runtime = 'edge'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const playlist = mockStore.getPlaylist(id)
  if (!playlist) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const tracks = mockStore.getTracks(id)
  mockStore.incrementPlayCount(id)
  return NextResponse.json({ data: { playlist, tracks } })
}

