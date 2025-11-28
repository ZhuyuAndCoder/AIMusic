import React from "react";
import Link from "next/link";
import { Search, Music, User, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-black/60 backdrop-blur border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Music className="h-8 w-8 text-sky-600" />
            <span className="text-xl font-bold text-white">AI音乐</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索音乐、歌单或艺术家..."
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              首页
            </Link>
            <Link
              href="/create"
              className="text-gray-300 hover:text-white transition-colors"
            >
              AI创作
            </Link>
            <Link
              href="/marketplace"
              className="text-gray-300 hover:text-white transition-colors"
            >
              歌单商城
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>{user.username}</span>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  退出
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    <LogIn className="h-4 w-4 mr-1" />
                    登录
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="sm">
                    注册
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
