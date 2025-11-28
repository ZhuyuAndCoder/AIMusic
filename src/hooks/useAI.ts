import { useState } from "react";
import { apiPost } from "@/lib/api";
import { Playlist } from "@/types/playlist";

interface AIPreferences {
  style: string;
  mood: string;
  scene: string;
}

interface AIState {
  isGenerating: boolean;
  generatedPlaylist: Playlist | null;
  preferences: AIPreferences;
}

export const useAI = () => {
  const [aiState, setAiState] = useState<AIState>({
    isGenerating: false,
    generatedPlaylist: null,
    preferences: {
      style: "",
      mood: "",
      scene: "",
    },
  });

  const generatePlaylist = async (
    preferences: AIPreferences,
    userId: string
  ) => {
    setAiState((prev) => ({ ...prev, isGenerating: true }));

    try {
      // 模拟AI生成过程
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const { data } = await apiPost<{ playlist: Playlist } & { tracks: any[] }>(
        "/api/ai/generate-playlist",
        {
          user_id: userId,
          style: preferences.style,
          mood: preferences.mood,
          scene: preferences.scene,
        }
      );

      setAiState((prev) => ({
        ...prev,
        isGenerating: false,
        generatedPlaylist: data.playlist,
        preferences,
      }));

      return { data: playlistData, error: null };
    } catch (error) {
      setAiState((prev) => ({ ...prev, isGenerating: false }));
      return { data: null, error };
    }
  };

  return {
    ...aiState,
    generatePlaylist,
  };
};
