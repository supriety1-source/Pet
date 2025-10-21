export interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  is_admin: boolean;
  account_tier: 'kindness' | 'recovery';
  created_at: string;
}

export interface UserStats {
  user_id: string;
  total_credits: number;
  total_acts_verified: number;
  current_streak: number;
  longest_streak: number;
  service_leader_status: boolean;
  service_leader_tier?: 'bronze' | 'silver' | 'gold';
  last_act_date?: string;
}

export interface KindnessAct {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: 'online' | 'offline' | 'community';
  media_url?: string;
  media_type?: 'image' | 'video';
  location?: string;
  act_date: string;
  created_at: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  verified_at?: string;
  rejection_reason?: string;
  credits_awarded: number;
  visibility: 'public' | 'community' | 'private';
  // Populated from joins
  username?: string;
  full_name?: string;
  avatar_url?: string;
  service_leader_tier?: string;
  reaction_count?: number;
  comment_count?: number;
}

export interface ActReaction {
  id: string;
  act_id: string;
  user_id: string;
  reaction_type: 'heart' | 'fire' | 'clap';
  created_at: string;
  username?: string;
  avatar_url?: string;
}

export interface ActComment {
  id: string;
  act_id: string;
  user_id: string;
  comment_text: string;
  created_at: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
}

export interface AuthContextType {
  user: User | null;
  stats: UserStats | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export interface SignupData {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}
