import { create } from "zustand";
import { Track } from "@/types/playlist";

interface PlayerState {
  currentTrack: Track | null;
  playlist: Track[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  isShuffle: boolean;
  isRepeat: boolean;
  repeatMode: "none" | "one" | "all";
}

interface PlayerActions {
  setCurrentTrack: (track: Track) => void;
  setPlaylist: (tracks: Track[]) => void;
  togglePlay: () => void;
  setPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  playTrack: (track: Track, playlist: Track[]) => void;
}

export const usePlayer = create<PlayerState & PlayerActions>((set, get) => ({
  currentTrack: null,
  playlist: [],
  isPlaying: false,
  volume: 1,
  progress: 0,
  isShuffle: false,
  isRepeat: false,
  repeatMode: "none",

  setCurrentTrack: (track) => set({ currentTrack: track }),

  setPlaylist: (tracks) => set({ playlist: tracks }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setPlaying: (playing) => set({ isPlaying: playing }),

  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),

  setProgress: (progress) =>
    set({ progress: Math.max(0, Math.min(100, progress)) }),

  nextTrack: () => {
    const { currentTrack, playlist, isShuffle } = get();
    if (!currentTrack || playlist.length === 0) return;

    const currentIndex = playlist.findIndex(
      (track) => track.id === currentTrack.id
    );
    let nextIndex;

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = currentIndex === playlist.length - 1 ? 0 : currentIndex + 1;
    }

    set({ currentTrack: playlist[nextIndex], progress: 0 });
  },

  previousTrack: () => {
    const { currentTrack, playlist } = get();
    if (!currentTrack || playlist.length === 0) return;

    const currentIndex = playlist.findIndex(
      (track) => track.id === currentTrack.id
    );
    const prevIndex =
      currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;

    set({ currentTrack: playlist[prevIndex], progress: 0 });
  },

  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),

  toggleRepeat: () =>
    set((state) => {
      const modes: ("none" | "one" | "all")[] = ["none", "one", "all"];
      const currentIndex = modes.indexOf(state.repeatMode);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      return { repeatMode: nextMode, isRepeat: nextMode !== "none" };
    }),

  playTrack: (track, playlist) =>
    set({
      currentTrack: track,
      playlist,
      isPlaying: true,
      progress: 0,
    }),
}));
