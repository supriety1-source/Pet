export interface User {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  is_admin: boolean;
  created_at: Date;
  last_login?: Date;
  account_tier: 'kindness' | 'recovery';
}

export interface UserStats {
  user_id: string;
  total_credits: number;
  total_acts_verified: number;
  current_streak: number;
  longest_streak: number;
  service_leader_status: boolean;
  service_leader_tier?: 'bronze' | 'silver' | 'gold';
  last_act_date?: Date;
  created_at: Date;
  updated_at: Date;
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
  act_date: Date;
  created_at: Date;
  verification_status: 'pending' | 'verified' | 'rejected';
  verified_at?: Date;
  verified_by?: string;
  rejection_reason?: string;
  credits_awarded: number;
  visibility: 'public' | 'community' | 'private';
}

export interface ActReaction {
  id: string;
  act_id: string;
  user_id: string;
  reaction_type: 'heart' | 'fire' | 'clap';
  created_at: Date;
}

export interface ActComment {
  id: string;
  act_id: string;
  user_id: string;
  comment_text: string;
  created_at: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  isAdmin: boolean;
}

export interface RequestUser {
  userId: string;
  email: string;
  username: string;
  isAdmin: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}
