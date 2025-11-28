import { NextResponse } from 'next/server'
import { mockStore } from '@/lib/mockStore'
import { d1ListPlaylists } from '@/lib/cfDb'
export const runtime = 'edge'

export async function GET(req: Request, context: any) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'recent'
  const limit = Number(searchParams.get('limit') || '6')
  const fromD1 = await d1ListPlaylists(context?.env, type, limit)
  if (fromD1) return NextResponse.json({ data: fromD1 })

  switch (type) {
    case 'recommended': {
      const data = mockStore.listPublic({ aiOnly: true, sortBy: 'play_count', limit })
      return NextResponse.json({ data })
    }
    case 'trending': {
      const data = mockStore.listPublic({ aiOnly: false, sortBy: 'play_count', limit })
      return NextResponse.json({ data })
    }
    case 'recent':
    default: {
      const data = mockStore.listPublic({ aiOnly: false, sortBy: 'created_at', limit })
      return NextResponse.json({ data })
    }
  }
}
