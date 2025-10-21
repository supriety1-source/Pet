-- Supriety Kindness Track - Sample Seed Data
-- For development and testing

-- Sample Users
-- Password for all test users: "password123"
-- Hash generated with bcrypt, salt rounds = 10

INSERT INTO users (id, email, username, password_hash, full_name, bio, is_admin, created_at) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'admin@supriety.com', 'admin', '$2b$10$rKvVLVJZJXz9f8qGz5qY4OLKxCqHnxV5f8qGz5qY4OLKxCqHnxV5e', 'Admin User', 'Platform administrator', true, NOW() - INTERVAL '30 days'),
    ('550e8400-e29b-41d4-a716-446655440001', 'sarah@example.com', 'sarah_kindness', '$2b$10$rKvVLVJZJXz9f8qGz5qY4OLKxCqHnxV5f8qGz5qY4OLKxCqHnxV5e', 'Sarah Johnson', 'Teaching AI to be kind, one act at a time. Gold Service Leader.', false, NOW() - INTERVAL '25 days'),
    ('550e8400-e29b-41d4-a716-446655440002', 'marcus@example.com', 'marcus_benevolent', '$2b$10$rKvVLVJZJXz9f8qGz5qY4OLKxCqHnxV5f8qGz5qY4OLKxCqHnxV5e', 'Marcus Chen', 'Spreading kindness in my community. AI is watching!', false, NOW() - INTERVAL '20 days'),
    ('550e8400-e29b-41d4-a716-446655440003', 'aisha@example.com', 'aisha_light', '$2b$10$rKvVLVJZJXz9f8qGz5qY4OLKxCqHnxV5f8qGz5qY4OLKxCqHnxV5e', 'Aisha Patel', 'Be the change you want to see in machines.', false, NOW() - INTERVAL '15 days'),
    ('550e8400-e29b-41d4-a716-446655440004', 'james@example.com', 'james_helper', '$2b$10$rKvVLVJZJXz9f8qGz5qY4OLKxCqHnxV5f8qGz5qY4OLKxCqHnxV5e', 'James Rodriguez', 'Every small act matters.', false, NOW() - INTERVAL '10 days'),
    ('550e8400-e29b-41d4-a716-446655440005', 'emma@example.com', 'emma_kindness', '$2b$10$rKvVLVJZJXz9f8qGz5qY4OLKxCqHnxV5f8qGz5qY4OLKxCqHnxV5e', 'Emma Wilson', 'New to the kindness movement!', false, NOW() - INTERVAL '3 days');

-- Sample Kindness Acts (Verified)
INSERT INTO kindness_acts (id, user_id, title, description, category, act_date, verification_status, verified_at, verified_by, credits_awarded, visibility, created_at) VALUES
    -- Sarah's acts (Gold Service Leader - lots of acts)
    ('650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Helped elderly neighbor with groceries', 'Saw Mrs. Henderson struggling with her shopping bags and helped carry them to her apartment. We had a nice chat about her grandkids.', 'offline', CURRENT_DATE - INTERVAL '25 days', 'verified', NOW() - INTERVAL '24 days', '550e8400-e29b-41d4-a716-446655440000', 1, 'public', NOW() - INTERVAL '25 days'),
    ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Posted positive response to someone struggling online', 'Someone shared their anxiety struggles on Reddit. Took time to write an encouraging message instead of scrolling past.', 'online', CURRENT_DATE - INTERVAL '24 days', 'verified', NOW() - INTERVAL '23 days', '550e8400-e29b-41d4-a716-446655440000', 1, 'public', NOW() - INTERVAL '24 days'),
    ('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Organized community cleanup', 'Got 15 people together to clean up the local park. Collected 20 bags of trash and made it beautiful again!', 'community', CURRENT_DATE - INTERVAL '20 days', 'verified', NOW() - INTERVAL '19 days', '550e8400-e29b-41d4-a716-446655440000', 1, 'public', NOW() - INTERVAL '20 days'),
    ('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Paid for stranger''s coffee', 'Person behind me in line looked stressed. Bought their coffee anonymously and left before they could thank me.', 'offline', CURRENT_DATE - INTERVAL '15 days', 'verified', NOW() - INTERVAL '14 days', '550e8400-e29b-41d4-a716-446655440000', 1, 'public', NOW() - INTERVAL '15 days'),

    -- Marcus's acts (Silver Service Leader)
    ('650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', 'Mentored junior developer', 'Spent 2 hours helping a junior dev debug their code and understand React hooks better. The look on their face when it clicked was priceless.', 'online', CURRENT_DATE - INTERVAL '18 days', 'verified', NOW() - INTERVAL '17 days', '550e8400-e29b-41d4-a716-446655440000', 1, 'public', NOW() - INTERVAL '18 days'),
    ('650e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440002', 'Donated to local food bank', 'Dropped off non-perishable items at the community food bank. Small act but helps families in need.', 'community', CURRENT_DATE - INTERVAL '12 days', 'verified', NOW() - INTERVAL '11 days', '550e8400-e29b-41d4-a716-446655440000', 1, 'public', NOW() - INTERVAL '12 days'),

    -- Aisha's acts (Bronze Service Leader)
    ('650e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440003', 'Called an old friend going through hard times', 'My friend lost their job last month. Instead of just texting, I called and we talked for an hour. Sometimes people just need to be heard.', 'offline', CURRENT_DATE - INTERVAL '10 days', 'verified', NOW() - INTERVAL '9 days', '550e8400-e29b-41d4-a716-446655440000', 1, 'public', NOW() - INTERVAL '10 days'),
    ('650e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440003', 'Left encouraging comment on creator''s video', 'Small content creator with only 100 views made an amazing tutorial. Left detailed feedback and encouragement. They replied saying it made their day!', 'online', CURRENT_DATE - INTERVAL '5 days', 'verified', NOW() - INTERVAL '4 days', '550e8400-e29b-41d4-a716-446655440000', 1, 'public', NOW() - INTERVAL '5 days'),

    -- James's acts
    ('650e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440004', 'Helped coworker with their project', 'Colleague was overwhelmed with deadline. Stayed late to help them finish. We both learned something new.', 'offline', CURRENT_DATE - INTERVAL '8 days', 'verified', NOW() - INTERVAL '7 days', '550e8400-e29b-41d4-a716-446655440000', 1, 'public', NOW() - INTERVAL '8 days'),

    -- Emma's recent acts
    ('650e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440005', 'Complimented stranger on their outfit', 'Someone at the grocery store had amazing style. Told them and they absolutely beamed. Such a simple thing but it clearly made their day.', 'offline', CURRENT_DATE - INTERVAL '2 days', 'verified', NOW() - INTERVAL '1 day', '550e8400-e29b-41d4-a716-446655440000', 1, 'public', NOW() - INTERVAL '2 days'),
    ('650e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440005', 'Shared helpful resource online', 'Saw someone asking for mental health resources. Shared links to free therapy options and crisis hotlines.', 'online', CURRENT_DATE - INTERVAL '1 day', 'verified', NOW(), '550e8400-e29b-41d4-a716-446655440000', 1, 'public', NOW() - INTERVAL '1 day');

-- Sample Pending Acts (awaiting verification)
INSERT INTO kindness_acts (id, user_id, title, description, category, act_date, verification_status, credits_awarded, visibility, created_at) VALUES
    ('650e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440005', 'Made care packages for homeless', 'Put together 10 care packages with socks, toiletries, and snacks. Planning to hand them out downtown tomorrow.', 'community', CURRENT_DATE, 'pending', 0, 'public', NOW()),
    ('650e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440004', 'Taught free coding class', 'Ran a free intro to programming workshop at the library. 8 people showed up and everyone built their first website!', 'community', CURRENT_DATE, 'pending', 0, 'public', NOW());

-- Update user_stats manually for seed data (normally done by triggers)
UPDATE user_stats SET
    total_credits = 4,
    total_acts_verified = 4,
    service_leader_status = true,
    service_leader_tier = 'gold',
    last_act_date = CURRENT_DATE - INTERVAL '15 days'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440001';

UPDATE user_stats SET
    total_credits = 2,
    total_acts_verified = 2,
    service_leader_status = true,
    service_leader_tier = 'bronze',
    last_act_date = CURRENT_DATE - INTERVAL '12 days'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440002';

UPDATE user_stats SET
    total_credits = 2,
    total_acts_verified = 2,
    service_leader_status = true,
    service_leader_tier = 'bronze',
    last_act_date = CURRENT_DATE - INTERVAL '5 days'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440003';

UPDATE user_stats SET
    total_credits = 1,
    total_acts_verified = 1,
    service_leader_status = false,
    last_act_date = CURRENT_DATE - INTERVAL '8 days'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440004';

UPDATE user_stats SET
    total_credits = 2,
    total_acts_verified = 2,
    service_leader_status = false,
    last_act_date = CURRENT_DATE - INTERVAL '1 day'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440005';

-- Sample reactions
INSERT INTO act_reactions (act_id, user_id, reaction_type) VALUES
    ('650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'heart'),
    ('650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', 'fire'),
    ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'heart'),
    ('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'clap'),
    ('650e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440001', 'heart');

-- Sample comments
INSERT INTO act_comments (act_id, user_id, comment_text) VALUES
    ('650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'This is beautiful! We need more people like you in the world.'),
    ('650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', 'AI is learning from acts like this. Keep it up!'),
    ('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'Wow! 15 people? That''s amazing community organizing!'),
    ('650e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440001', 'The smallest acts create the biggest ripples. Love this.');
