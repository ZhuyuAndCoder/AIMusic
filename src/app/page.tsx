'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles, TrendingUp, Clock, Heart, Gamepad2 } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { PlayerBar } from '@/components/layout/PlayerBar'
import { PlaylistCard } from '@/components/music/PlaylistCard'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { FadeIn } from '@/components/ui/FadeIn'
import { apiGet } from '@/lib/api'
import { Playlist } from '@/types/playlist'

export default function HomePage() {
  const [recommendedPlaylists, setRecommendedPlaylists] = useState<Playlist[]>([])
  const [trendingPlaylists, setTrendingPlaylists] = useState<Playlist[]>([])
  const [recentPlaylists, setRecentPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const fetchPlaylists = async () => {
    try {
      setIsLoading(true)
      
      // 获取推荐歌单（AI生成的公开歌单）
      const { data: recommendedData } = await apiGet<Playlist[]>('/api/playlists', { type: 'recommended', limit: 6 })

      // 获取热门歌单（播放次数最多的公开歌单）
      const { data: trendingData } = await apiGet<Playlist[]>('/api/playlists', { type: 'trending', limit: 6 })

      // 获取最新歌单
      const { data: recentData } = await apiGet<Playlist[]>('/api/playlists', { type: 'recent', limit: 6 })

      if (recommendedData) setRecommendedPlaylists(recommendedData)

      if (trendingData) setTrendingPlaylists(trendingData)

      if (recentData) setRecentPlaylists(recentData)
    } catch (error) {
      console.error('Error fetching playlists:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 pb-32">
        {/* Hero Section */}
        <FadeIn>
          <section className="text-center py-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              用AI创造
              <span className="text-sky-600">专属音乐</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              结合QQ音乐和网易云音乐风格，利用AI技术创建个性化歌单，分享和收藏您喜爱的音乐
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create">
                <Button variant="primary" size="lg" className="px-8">
                  <Sparkles className="h-5 w-5 mr-2" />
                  开始AI创作
                </Button>
              </Link>
              <Link href="/games">
                <Button variant="outline" size="lg" className="px-8">
                  <Gamepad2 className="h-5 w-5 mr-2" />
                  音乐游戏
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="outline" size="lg" className="px-8">
                  浏览歌单商城
                </Button>
              </Link>
            </div>
          </section>
        </FadeIn>

        {/* AI创作特色 */}
        <FadeIn>
        <section className="py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <Sparkles className="h-12 w-12 text-sky-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">智能创作</h3>
              <p className="text-gray-400">AI根据您的喜好自动生成个性化歌单</p>
            </Card>
            <Card className="text-center">
              <Heart className="h-12 w-12 text-sky-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">个性推荐</h3>
              <p className="text-gray-400">基于您的音乐品味推荐相似风格</p>
            </Card>
            <Card className="text-center">
              <TrendingUp className="h-12 w-12 text-sky-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">社区分享</h3>
              <p className="text-gray-400">与音乐爱好者分享您的创作</p>
            </Card>
          </div>
        </section>
        </FadeIn>

        {/* AI推荐歌单 */}
        <FadeIn>
        <section className="py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">AI推荐歌单</h2>
            <Button variant="outline">查看更多</Button>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-900 rounded-xl p-4 animate-pulse">
                  <div className="aspect-square bg-gray-800 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-800 rounded mb-2" />
                  <div className="h-3 bg-gray-800 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedPlaylists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          )}
        </section>
        </FadeIn>

        {/* 热门歌单 */}
        <FadeIn>
        <section className="py-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-sky-600" />
              <h2 className="text-3xl font-bold text-white">热门歌单</h2>
            </div>
            <Button variant="outline">查看更多</Button>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-900 rounded-xl p-4 animate-pulse">
                  <div className="aspect-square bg-gray-800 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-800 rounded mb-2" />
                  <div className="h-3 bg-gray-800 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingPlaylists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          )}
        </section>
        </FadeIn>

        {/* 最新歌单 */}
        <FadeIn>
        <section className="py-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-sky-600" />
              <h2 className="text-3xl font-bold text-white">最新歌单</h2>
            </div>
            <Button variant="outline">查看更多</Button>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-900 rounded-xl p-4 animate-pulse">
                  <div className="aspect-square bg-gray-800 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-800 rounded mb-2" />
                  <div className="h-3 bg-gray-800 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPlaylists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          )}
        </section>
        </FadeIn>
      </main>

      <PlayerBar />
    </div>
  )
}
