import { NextResponse } from 'next/server'
export const runtime = 'edge'

export async function POST(req: Request, context: any) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'file required' }, { status: 400 })
    const ext = (file.name.split('.').pop() || 'bin').toLowerCase()
    const key = `uploads/${new Date().toISOString().slice(0,10)}/${cryptoRandom(12)}.${ext}`
    const bucket = context?.env?.AIMUSIC_MEDIA
    if (!bucket) return NextResponse.json({ error: 'R2 not bound' }, { status: 500 })
    await bucket.put(key, file.stream(), { httpMetadata: { contentType: file.type || 'application/octet-stream' } })
    return NextResponse.json({ data: { key } })
  } catch (e) {
    return NextResponse.json({ error: 'upload failed' }, { status: 500 })
  }
}

function cryptoRandom(len: number) {
  const arr = new Uint8Array(len)
  crypto.getRandomValues(arr)
  return Array.from(arr).map(x => x.toString(16).padStart(2,'0')).join('')
}

