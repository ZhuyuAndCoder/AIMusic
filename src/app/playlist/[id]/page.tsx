"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { PlayerBar } from "@/components/layout/PlayerBar";
import { TrackItem } from "@/components/music/TrackItem";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { apiGet, apiPost } from "@/lib/api";
import { Playlist, Track } from "@/types/playlist";
import {
  Play,
  Heart,
  Share2,
  MoreHorizontal,
  User,
  Calendar,
  Music,
} from "lucide-react";

export default function PlaylistPage() {
  const params = useParams();
  const playlistId = params?.id as string;

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (playlistId) {
      fetchPlaylist();
    }
  }, [playlistId]);

  const fetchPlaylist = async () => {
    try {
      setIsLoading(true);

      // 获取歌单详情
      const { data } = await apiGet<{ playlist: Playlist; tracks: Track[] }>(
        `/api/playlists/${playlistId}`
      );

      if (data?.playlist) setPlaylist(data.playlist);

      // 获取歌单中的音乐
      if (data?.tracks) setTracks(data.tracks);

      // 更新播放次数
      // 已在接口内自增播放量
    } catch (error) {
      console.error("Error fetching playlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!playlist) return;

    try {
      // 这里未接入真实用户，先用固定 user1
      const { data } = await apiPost<{ favored: boolean }>("/api/favorites", {
        user_id: "user1",
        playlist_id: playlist.id,
      });
      setIsFavorited(!!data?.favored);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTotalDuration = () => {
    return tracks.reduce((total, track) => total + track.duration, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-32 h-32 bg-gray-800 rounded-xl" />
              <div className="flex-1">
                <div className="h-8 bg-gray-800 rounded mb-4 w-1/3" />
                <div className="h-4 bg-gray-800 rounded mb-2 w-1/2" />
                <div className="h-4 bg-gray-800 rounded w-1/4" />
              </div>
            </div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-800 rounded-lg" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl text-white mb-4">歌单不存在</h1>
            <p className="text-gray-400 mb-8">
              抱歉，您访问的歌单不存在或已被删除。
            </p>
            <Button variant="primary">返回首页</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 pb-32">
        {/* 歌单头部信息 */}
        <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8 mb-8">
          <img
            src={
              playlist.cover_url ||
              `https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
                "music playlist cover"
              )}&image_size=square`
            }
            alt={playlist.title}
            className="w-64 h-64 rounded-xl object-cover shadow-2xl"
          />

          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {playlist.is_ai_generated && (
                <span className="bg-sky-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                  AI生成
                </span>
              )}
              {playlist.is_premium && (
                <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                  VIP
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">
              {playlist.title}
            </h1>
            <p className="text-gray-400 mb-6 text-lg">
              {playlist.description || "暂无描述"}
            </p>

            <div className="flex items-center space-x-6 text-sm text-gray-400 mb-6">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{playlist.user?.username || "未知用户"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(playlist.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Music className="h-4 w-4" />
                <span>{tracks.length} 首歌曲</span>
              </div>
              <span>{formatDuration(getTotalDuration())}</span>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="primary" size="lg">
                <Play className="h-5 w-5 mr-2" />
                播放全部
              </Button>
              <Button
                variant={isFavorited ? "secondary" : "outline"}
                size="lg"
                onClick={handleFavorite}
              >
                <Heart
                  className={`h-5 w-5 mr-2 ${
                    isFavorited ? "fill-current" : ""
                  }`}
                />
                {isFavorited ? "已收藏" : "收藏"}
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5 mr-2" />
                分享
              </Button>
              <Button variant="outline" size="lg">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* 歌曲列表 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">歌曲列表</h2>
            <div className="text-sm text-gray-400">
              {tracks.length} 首歌曲 · {formatDuration(getTotalDuration())}
            </div>
          </div>

          <div className="space-y-2">
            {tracks.map((track, index) => (
              <TrackItem key={track.id} track={track} index={index} />
            ))}
          </div>

          {tracks.length === 0 && (
            <div className="text-center py-12">
              <Music className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">暂无歌曲</p>
              <p className="text-gray-500 text-sm mt-2">
                这个歌单还没有添加任何歌曲
              </p>
            </div>
          )}
        </Card>
      </main>

      <PlayerBar />
    </div>
  );
}
