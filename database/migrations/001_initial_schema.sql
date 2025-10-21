-- Supriety Kindness Track - Initial Database Schema
-- Migration 001: Create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    account_tier VARCHAR(20) DEFAULT 'kindness' CHECK (account_tier IN ('kindness', 'recovery'))
);

-- Kindness acts table
CREATE TABLE kindness_acts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) CHECK (category IN ('online', 'offline', 'community')),
    media_url TEXT,
    media_type VARCHAR(20) CHECK (media_type IN ('image', 'video')),
    location TEXT,
    act_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    -- Verification fields
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    verified_at TIMESTAMP,
    verified_by UUID REFERENCES users(id),
    rejection_reason TEXT,

    -- Gamification fields
    credits_awarded INTEGER DEFAULT 0,
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'community', 'private'))
);

-- User stats table
CREATE TABLE user_stats (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_credits INTEGER DEFAULT 0,
    total_acts_verified INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    service_leader_status BOOLEAN DEFAULT false,
    service_leader_tier VARCHAR(20) CHECK (service_leader_tier IN ('bronze', 'silver', 'gold')),
    last_act_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Reactions/likes on kindness acts
CREATE TABLE act_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    act_id UUID REFERENCES kindness_acts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    reaction_type VARCHAR(20) DEFAULT 'heart' CHECK (reaction_type IN ('heart', 'fire', 'clap')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(act_id, user_id)
);

-- Comments on kindness acts
CREATE TABLE act_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    act_id UUID REFERENCES kindness_acts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_acts_user_date ON kindness_acts(user_id, act_date DESC);
CREATE INDEX idx_acts_status ON kindness_acts(verification_status);
CREATE INDEX idx_acts_created ON kindness_acts(created_at DESC);
CREATE INDEX idx_user_stats_credits ON user_stats(total_credits DESC);
CREATE INDEX idx_reactions_act ON act_reactions(act_id);
CREATE INDEX idx_comments_act ON act_comments(act_id, created_at DESC);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Trigger to automatically create user_stats when a user is created
CREATE OR REPLACE FUNCTION create_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_stats (user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_user_stats
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_user_stats();

-- Trigger to update user_stats when an act is verified
CREATE OR REPLACE FUNCTION update_user_stats_on_verify()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.verification_status = 'verified' AND OLD.verification_status != 'verified' THEN
        UPDATE user_stats
        SET
            total_credits = total_credits + NEW.credits_awarded,
            total_acts_verified = total_acts_verified + 1,
            last_act_date = NEW.act_date,
            updated_at = NOW()
        WHERE user_id = NEW.user_id;

        -- Update Service Leader status based on credits
        UPDATE user_stats
        SET
            service_leader_status = CASE
                WHEN total_credits >= 100 THEN true
                ELSE false
            END,
            service_leader_tier = CASE
                WHEN total_credits >= 1000 THEN 'gold'
                WHEN total_credits >= 500 THEN 'silver'
                WHEN total_credits >= 100 THEN 'bronze'
                ELSE NULL
            END
        WHERE user_id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_stats
AFTER UPDATE ON kindness_acts
FOR EACH ROW
EXECUTE FUNCTION update_user_stats_on_verify();

-- Function to calculate streaks (to be called daily or when acts are verified)
CREATE OR REPLACE FUNCTION calculate_user_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_streak INTEGER := 0;
    v_current_date DATE;
    v_check_date DATE;
BEGIN
    -- Get the most recent act date
    SELECT MAX(act_date) INTO v_current_date
    FROM kindness_acts
    WHERE user_id = p_user_id AND verification_status = 'verified';

    -- If no acts, streak is 0
    IF v_current_date IS NULL THEN
        RETURN 0;
    END IF;

    -- Check if the most recent act is today or yesterday
    IF v_current_date < CURRENT_DATE - INTERVAL '1 day' THEN
        RETURN 0;
    END IF;

    -- Count consecutive days backwards from current date
    v_check_date := v_current_date;
    WHILE EXISTS (
        SELECT 1 FROM kindness_acts
        WHERE user_id = p_user_id
        AND act_date = v_check_date
        AND verification_status = 'verified'
    ) LOOP
        v_streak := v_streak + 1;
        v_check_date := v_check_date - INTERVAL '1 day';
    END LOOP;

    RETURN v_streak;
END;
$$ LANGUAGE plpgsql;
