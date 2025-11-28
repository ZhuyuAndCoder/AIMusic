import React from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Shuffle,
  Repeat,
  Heart,
} from "lucide-react";
import { usePlayer } from "@/hooks/usePlayer";

export const PlayerBar: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    isShuffle,
    repeatMode,
    togglePlay,
    nextTrack,
    previousTrack,
    toggleShuffle,
    toggleRepeat,
    setVolume,
    setProgress,
  } = usePlayer();

  if (!currentTrack) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentTime = (progress / 100) * currentTrack.duration;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur border-t border-gray-800 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Track Info */}
          <div className="flex items-center space-x-4 flex-1">
            <img
              src={currentTrack.cover_url || "/api/placeholder/48/48"}
              alt={currentTrack.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <h4 className="text-white font-medium truncate">
                {currentTrack.title}
              </h4>
              <p className="text-gray-400 text-sm truncate">
                {currentTrack.artist}
              </p>
            </div>
            <button className="text-gray-400 hover:text-sky-600 transition-colors">
              <Heart className="h-4 w-4" />
            </button>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center space-y-2 flex-1">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleShuffle}
                className={`p-2 rounded-full transition-colors ${
                  isShuffle ? "text-sky-600" : "text-gray-400 hover:text-white"
                }`}
              >
                <Shuffle className="h-4 w-4" />
              </button>

              <button
                onClick={previousTrack}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <SkipBack className="h-5 w-5" />
              </button>

              <button
                onClick={togglePlay}
                className="p-3 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </button>

              <button
                onClick={nextTrack}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <SkipForward className="h-5 w-5" />
              </button>

              <button
                onClick={toggleRepeat}
                className={`p-2 rounded-full transition-colors ${
                  repeatMode !== "none"
                    ? "text-sky-600"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Repeat className="h-4 w-4" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center space-x-2 w-full max-w-md">
              <span className="text-xs text-gray-400 min-w-10">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 relative">
                <div className="h-1 bg-gray-700 rounded-full">
                  <div
                    className="h-1 bg-sky-600 rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <span className="text-xs text-gray-400 min-w-10">
                {formatTime(currentTrack.duration)}
              </span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2 flex-1 justify-end">
            <Volume2 className="h-4 w-4 text-gray-400" />
            <div className="w-24 relative">
              <div className="h-1 bg-gray-700 rounded-full">
                <div
                  className="h-1 bg-sky-600 rounded-full"
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
