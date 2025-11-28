import React from "react";
import { Play, Heart, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Playlist } from "@/types/playlist";
import { usePlayer } from "@/hooks/usePlayer";
import { apiGet } from "@/lib/api";

interface PlaylistCardProps {
  playlist: Playlist;
  onPlay?: () => void;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  onPlay,
}) => {
  const { playTrack } = usePlayer();

  const handlePlay = async () => {
    if (onPlay) {
      onPlay();
      return;
    }

    const { data: tracks } = await apiGet<any[]>("/api/tracks", {
      playlist_id: playlist.id,
    });

    if (tracks && tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  return (
    <Card className="group cursor-pointer">
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-t-xl">
          <img
            src={
              playlist.cover_url ||
              `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
                "music playlist cover"
              )}&image_size=square`
            }
            alt={playlist.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <button
              onClick={handlePlay}
              className="opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300 bg-sky-600 text-white p-3 rounded-full hover:bg-sky-700"
            >
              <Play className="h-6 w-6" />
            </button>
          </div>
          {playlist.is_premium && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
              VIP
            </div>
          )}
          {playlist.is_ai_generated && (
            <div className="absolute top-2 left-2 bg-sky-600 text-white px-2 py-1 rounded-full text-xs font-bold">
              AI
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
          {playlist.title}
        </h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {playlist.description || "暂无描述"}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{playlist.user?.username || "未知用户"}</span>
          <div className="flex items-center space-x-4">
            <span>{playlist.play_count} 播放</span>
            <span>{playlist.like_count} 喜欢</span>
          </div>
        </div>

        {playlist.category && (
          <div className="mt-3">
            <span className="inline-block bg-gray-800 text-sky-400 px-2 py-1 rounded-full text-xs">
              {playlist.category}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <button className="text-gray-400 hover:text-sky-600 transition-colors">
            <Heart className="h-4 w-4" />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
