import { NextResponse } from 'next/server'
import { mockStore } from '@/lib/mockStore'
export const runtime = 'edge'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { user_id: string; style: string; mood: string; scene: string }
  if (!body?.user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

  await new Promise((r) => setTimeout(r, 500))

  const playlist = mockStore.createPlaylist({
    user_id: body.user_id,
    title: `AI生成的${body.style}音乐`,
    description: `基于${body.mood}情绪和${body.scene}场景生成的个性化歌单`,
    category: body.style,
    is_ai_generated: true,
    is_public: true,
    is_premium: false,
    cover_url: `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(`${body.style} music playlist cover, ${body.mood} mood, ${body.scene} scene`)}&image_size=square`,
  })

  const tracks = mockStore.addTracks(playlist.id, [
    {
      playlist_id: playlist.id,
      title: 'AI生成曲目 1',
      artist: 'AI Music Generator',
      audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      cover_url: `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(`music album cover, ${body.style} style`)}&image_size=square`,
      duration: 180,
      order_index: 0,
    },
    {
      playlist_id: playlist.id,
      title: 'AI生成曲目 2',
      artist: 'AI Music Generator',
      audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      cover_url: `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(`music album cover, ${body.style} style`)}&image_size=square`,
      duration: 200,
      order_index: 1,
    },
  ])

  return NextResponse.json({ data: { playlist, tracks } })
}

