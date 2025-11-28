import React from "react";
import { Play, Pause, Heart, MoreHorizontal } from "lucide-react";
import { Track } from "@/types/playlist";
import { usePlayer } from "@/hooks/usePlayer";

interface TrackItemProps {
  track: Track;
  index: number;
  isActive?: boolean;
}

export const TrackItem: React.FC<TrackItemProps> = ({
  track,
  index,
  isActive = false,
}) => {
  const { currentTrack, isPlaying, playTrack, playlist } = usePlayer();

  const isCurrentTrack = currentTrack?.id === track.id;
  const isTrackPlaying = isCurrentTrack && isPlaying;

  const handlePlay = () => {
    if (isCurrentTrack) {
      // 如果已经是当前曲目，则切换播放状态
      // 这里需要添加 togglePlay 功能到 usePlayer
    } else {
      // 播放新曲目
      playTrack(track, playlist);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
        isActive ? "bg-sky-900 bg-opacity-30" : "hover:bg-gray-800"
      }`}
    >
      <div className="flex items-center space-x-4 flex-1">
        <div className="w-8 text-center">
          {isCurrentTrack && isPlaying ? (
            <div className="flex items-center justify-center">
              <div className="flex space-x-0.5">
                <div className="w-0.5 h-3 bg-sky-600 animate-pulse" />
                <div
                  className="w-0.5 h-3 bg-sky-600 animate-pulse"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-0.5 h-3 bg-sky-600 animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          ) : (
            <span className="text-gray-400 text-sm">{index + 1}</span>
          )}
        </div>

        <img
          src={
            track.cover_url ||
            `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
              "music album cover"
            )}&image_size=square`
          }
          alt={track.title}
          className="w-12 h-12 rounded-lg object-cover"
        />

        <div className="flex-1 min-w-0">
          <h4
            className={`font-medium ${
              isCurrentTrack ? "text-sky-400" : "text-white"
            }`}
          >
            {track.title}
          </h4>
          <p className="text-gray-400 text-sm truncate">{track.artist}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-gray-400 text-sm">
          {formatDuration(track.duration)}
        </span>

        <button
          onClick={handlePlay}
          className="text-gray-400 hover:text-sky-600 transition-colors"
        >
          {isTrackPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </button>

        <button className="text-gray-400 hover:text-sky-600 transition-colors">
          <Heart className="h-4 w-4" />
        </button>

        <button className="text-gray-400 hover:text-white transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
