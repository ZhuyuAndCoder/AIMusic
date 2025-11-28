import { NextResponse } from 'next/server'
export const runtime = 'edge'

export async function GET(req: Request, context: any) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')
  if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 })
  const bucket = context?.env?.AIMUSIC_MEDIA
  if (!bucket) return NextResponse.json({ error: 'R2 not bound' }, { status: 500 })
  const obj = await bucket.get(key)
  if (!obj) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const headers: Record<string,string> = {}
  if (obj.httpMetadata?.contentType) headers['content-type'] = obj.httpMetadata.contentType
  return new Response(obj.body, { headers })
}

