CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    account_tier VARCHAR(20) DEFAULT 'kindness'
);

CREATE TABLE IF NOT EXISTS kindness_acts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50),
    media_url TEXT,
    media_type VARCHAR(20),
    location TEXT,
    act_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    verification_status VARCHAR(20) DEFAULT 'pending',
    verified_at TIMESTAMP,
    verified_by UUID REFERENCES users(id),
    rejection_reason TEXT,
    credits_awarded INTEGER DEFAULT 0,
    visibility VARCHAR(20) DEFAULT 'public'
);

CREATE TABLE IF NOT EXISTS user_stats (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_credits INTEGER DEFAULT 0,
    total_acts_verified INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    service_leader_status BOOLEAN DEFAULT false,
    service_leader_tier VARCHAR(20),
    last_act_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS act_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    act_id UUID REFERENCES kindness_acts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) DEFAULT 'heart',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(act_id, user_id)
);

CREATE TABLE IF NOT EXISTS act_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    act_id UUID REFERENCES kindness_acts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email_likes BOOLEAN DEFAULT true,
    email_comments BOOLEAN DEFAULT true,
    email_summary BOOLEAN DEFAULT true,
    profile_visibility VARCHAR(20) DEFAULT 'public',
    hide_from_feed BOOLEAN DEFAULT false,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_acts_user_date ON kindness_acts(user_id, act_date DESC);
CREATE INDEX IF NOT EXISTS idx_acts_status ON kindness_acts(verification_status);
CREATE INDEX IF NOT EXISTS idx_user_stats_credits ON user_stats(total_credits DESC);
