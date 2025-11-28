"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Playlist } from "@/types/playlist";
import { Track } from "@/types/track";
import { PlaylistCard } from "@/components/music/PlaylistCard";
import TrackItem from "@/components/music/TrackItem";
import { User, Music, Heart, ShoppingBag } from "lucide-react";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [favoriteTracks, setFavoriteTracks] = useState<Track[]>([]);
  const [purchasedPlaylists, setPurchasedPlaylists] = useState<Playlist[]>([]);
  const [activeTab, setActiveTab] = useState<
    "playlists" | "favorites" | "purchased"
  >("playlists");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user) {
      fetchUserData();
    }
  }, [user, authLoading, router]);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Fetch user's playlists
      const { data: playlistsData } = await apiGet<Playlist[]>(
        "/api/playlists",
        { type: "recent", limit: 50 }
      );
      setUserPlaylists(
        (playlistsData || []).filter((p) => p.user_id === user?.id)
      );

      // Fetch favorite tracks
      setFavoriteTracks([]);

      // Fetch purchased playlists
      setPurchasedPlaylists([]);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="animate-pulse text-sky-400">加载中...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "playlists":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userPlaylists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
            {userPlaylists.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400">
                <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>还没有创建歌单</p>
                <button
                  onClick={() => router.push("/create")}
                  className="mt-4 px-6 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors"
                >
                  创建第一个歌单
                </button>
              </div>
            )}
          </div>
        );
      case "favorites":
        return (
          <div className="space-y-4">
            {favoriteTracks.map((track) => (
              <TrackItem key={track.id} track={track} />
            ))}
            {favoriteTracks.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>还没有收藏的音乐</p>
                <button
                  onClick={() => router.push("/")}
                  className="mt-4 px-6 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors"
                >
                  去发现音乐
                </button>
              </div>
            )}
          </div>
        );
      case "purchased":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {purchasedPlaylists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
            {purchasedPlaylists.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>还没有购买的歌单</p>
                <button
                  onClick={() => router.push("/")}
                  className="mt-4 px-6 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors"
                >
                  浏览市场
                </button>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-sky-600 to-cyan-600 rounded-full flex items-center justify-center">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.username}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
              <p className="text-gray-400">{user.email}</p>
              <div className="flex space-x-6 mt-2 text-sm text-gray-300">
                <span>{userPlaylists.length} 歌单</span>
                <span>{favoriteTracks.length} 收藏</span>
                <span>{purchasedPlaylists.length} 购买</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-800 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("playlists")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "playlists"
                  ? "border-sky-500 text-sky-400"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              <Music className="inline-block w-4 h-4 mr-2" />
              我的歌单
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "favorites"
                  ? "border-sky-500 text-sky-400"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              <Heart className="inline-block w-4 h-4 mr-2" />
              我的收藏
            </button>
            <button
              onClick={() => setActiveTab("purchased")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "purchased"
                  ? "border-sky-500 text-sky-400"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              <ShoppingBag className="inline-block w-4 h-4 mr-2" />
              已购买
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>{renderTabContent()}</div>
      </div>
    </div>
  );
}
