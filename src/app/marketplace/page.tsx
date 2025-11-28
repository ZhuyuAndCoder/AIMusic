"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { Playlist } from "@/types/playlist";
import { PlaylistCard } from "@/components/music/PlaylistCard";
import { ShoppingBag, Filter, TrendingUp, Star } from "lucide-react";

export default function MarketplacePage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "trending" | "featured">("all");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">(
    "all"
  );

  useEffect(() => {
    fetchMarketplacePlaylists();
  }, [filter, priceFilter]);

  const fetchMarketplacePlaylists = async () => {
    try {
      setLoading(true);

      const type = filter === "trending" ? "trending" : "recent";
      const { data } = await apiGet<Playlist[]>("/api/playlists", {
        type,
        limit: 24,
      });
      setPlaylists(data || []);
    } catch (error) {
      console.error("Error fetching marketplace playlists:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlaylists = playlists.filter((playlist) => {
    if (priceFilter === "free" && playlist.price > 0) return false;
    if (priceFilter === "paid" && playlist.price === 0) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-8 h-8 text-sky-600" />
              <h1 className="text-3xl font-bold">歌单商城</h1>
            </div>
            <div className="text-sm text-gray-400">
              共 {filteredPlaylists.length} 个精选歌单
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">分类:</span>
              <div className="flex space-x-2">
                {[
                  { key: "all", label: "全部", icon: null },
                  { key: "trending", label: "热门", icon: TrendingUp },
                  { key: "featured", label: "精选", icon: Star },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() =>
                      setFilter(key as "all" | "trending" | "featured")
                    }
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      filter === key
                        ? "bg-sky-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {Icon && <Icon className="inline-block w-3 h-3 mr-1" />}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">价格:</span>
              <div className="flex space-x-2">
                {[
                  { key: "all", label: "全部" },
                  { key: "free", label: "免费" },
                  { key: "paid", label: "付费" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() =>
                      setPriceFilter(key as "all" | "free" | "paid")
                    }
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      priceFilter === key
                        ? "bg-sky-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Premium Banner */}
        <div className="bg-gradient-to-r from-sky-900 to-cyan-900 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">发现优质音乐内容</h2>
              <p className="text-sky-200">
                购买专业音乐人的精选歌单，支持原创音乐创作
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-sky-300">¥9.9</div>
              <div className="text-sm text-sky-200">起</div>
            </div>
          </div>
        </div>

        {/* Playlists Grid */}
        {filteredPlaylists.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              暂无歌单
            </h3>
            <p className="text-gray-500">没有找到符合条件的精选歌单</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlaylists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        )}

        {/* How it works */}
        <div className="mt-16 bg-gray-900 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">
            如何使用歌单商城
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">浏览歌单</h4>
              <p className="text-gray-400 text-sm">
                发现由专业音乐人和AI创作者制作的优质歌单
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">购买收藏</h4>
              <p className="text-gray-400 text-sm">
                购买喜欢的歌单，支持创作者，丰富个人音乐库
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">享受音乐</h4>
              <p className="text-gray-400 text-sm">
                随时随地播放购买的歌单，享受高品质音乐体验
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
