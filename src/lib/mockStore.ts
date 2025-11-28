type User = {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
};

type Playlist = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  cover_url?: string;
  category?: string;
  is_ai_generated: boolean;
  is_public: boolean;
  is_premium: boolean;
  price: number;
  play_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
  user?: { username: string; avatar_url?: string };
};

type Track = {
  id: string;
  playlist_id: string;
  title: string;
  artist: string;
  audio_url: string;
  cover_url?: string;
  duration: number;
  order_index: number;
  created_at: string;
};

const now = () => new Date().toISOString();

class MockStore {
  users: Record<string, User> = {};
  playlists: Record<string, Playlist> = {};
  tracks: Record<string, Track[]> = {};
  favorites: Record<string, Set<string>> = {};
  purchases: Record<string, Set<string>> = {};

  constructor() {
    const userId = 'user1';
    this.users[userId] = {
      id: userId,
      email: 'user1@example.com',
      username: 'AI创作者',
    };

    const playlistId = '1';
    this.playlists[playlistId] = {
      id: playlistId,
      user_id: userId,
      title: 'AI生成音乐精选',
      description: '由AI创作的热门音乐合集',
      cover_url:
        'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20music%20playlist%20cover&image_size=square',
      category: '电子',
      is_ai_generated: true,
      is_public: true,
      is_premium: true,
      price: 9.9,
      play_count: 1250,
      like_count: 320,
      created_at: now(),
      updated_at: now(),
      user: { username: 'AI创作者' },
    };

    this.tracks[playlistId] = [
      {
        id: 't1',
        playlist_id: playlistId,
        title: '未来之声',
        artist: 'AI作曲家',
        audio_url:
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        cover_url:
          'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=music%20album%20cover&image_size=square',
        duration: 180,
        order_index: 0,
        created_at: now(),
      },
    ];
  }

  listPublic({ aiOnly = false, sortBy = 'created_at', limit = 6 }: { aiOnly?: boolean; sortBy?: 'play_count' | 'created_at'; limit?: number }) {
    const items = Object.values(this.playlists).filter((p) => p.is_public && (!aiOnly || p.is_ai_generated));
    items.sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number));
    return items.slice(0, limit);
  }

  getPlaylist(id: string) {
    const p = this.playlists[id];
    if (!p) return null;
    return { ...p, user: this.users[p.user_id] ? { username: this.users[p.user_id].username, avatar_url: this.users[p.user_id].avatar_url } : p.user };
  }

  getTracks(playlistId: string) {
    return (this.tracks[playlistId] || []).sort((a, b) => a.order_index - b.order_index);
  }

  incrementPlayCount(id: string) {
    if (this.playlists[id]) this.playlists[id].play_count += 1;
  }

  toggleFavorite(userId: string, playlistId: string) {
    if (!this.favorites[userId]) this.favorites[userId] = new Set();
    const set = this.favorites[userId];
    if (set.has(playlistId)) {
      set.delete(playlistId);
      return false;
    } else {
      set.add(playlistId);
      return true;
    }
  }

  createPlaylist(data: Omit<Playlist, 'id' | 'created_at' | 'updated_at' | 'play_count' | 'like_count' | 'price'> & { price?: number }) {
    const id = String(Object.keys(this.playlists).length + 1);
    const playlist: Playlist = {
      id,
      play_count: 0,
      like_count: 0,
      price: data.price ?? 0,
      created_at: now(),
      updated_at: now(),
      ...data,
    };
    this.playlists[id] = playlist;
    return playlist;
  }

  addTracks(playlistId: string, t: Omit<Track, 'id' | 'created_at'>[]) {
    const arr = this.tracks[playlistId] || [];
    t.forEach((x, i) => {
      arr.push({ ...x, id: `t${arr.length + i + 1}`, created_at: now() });
    });
    this.tracks[playlistId] = arr;
    return this.getTracks(playlistId);
  }
}

export const mockStore = new MockStore();
