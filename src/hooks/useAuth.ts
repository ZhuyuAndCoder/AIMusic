import { useState, useEffect } from "react";
// 简化的本地认证：使用内存用户 user1
import { User } from "@/types/user";
import { mockStore } from "@/lib/mockStore";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();

    return () => {};
  }, []);

  const checkUser = async () => {
    try {
      await fetchUserProfile("user1");
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const u = mockStore.users[userId] || {
        id: userId,
        email: `${userId}@example.com`,
        username: "游客",
        avatar_url: undefined,
      };
      const full: User = {
        id: u.id,
        email: u.email,
        username: u.username,
        avatar_url: u.avatar_url,
        role: "user",
        is_creator: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUser(full);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await fetchUserProfile("user1");
      return { data: { user: { id: "user1" } } as any, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      await fetchUserProfile("user1");
      return { data: { user: { id: "user1" } } as any, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };
};
