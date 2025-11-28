export async function kvToggleFavorite(env: any, user_id: string, playlist_id: string) {
  const kv = env?.AIMUSIC_KV
  if (!kv) return null
  const key = `fav:${user_id}`
  const raw = await kv.get(key)
  let arr: string[] = []
  try { arr = raw ? JSON.parse(raw) : [] } catch { arr = [] }
  const idx = arr.indexOf(playlist_id)
  let favored = false
  if (idx >= 0) {
    arr.splice(idx, 1)
    favored = false
  } else {
    arr.push(playlist_id)
    favored = true
  }
  await kv.put(key, JSON.stringify(arr))
  return favored
}

