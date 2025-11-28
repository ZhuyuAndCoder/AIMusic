export interface User {
  id: string
  email: string
  username: string
  avatar_url?: string
  role: 'user' | 'creator' | 'admin'
  is_creator: boolean
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}