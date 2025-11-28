import { NextResponse } from 'next/server'
import { mockStore } from '@/lib/mockStore'
export const runtime = 'edge'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'recent'
  const limit = Number(searchParams.get('limit') || '6')

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

