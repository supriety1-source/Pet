INSERT INTO users (email, username, password_hash, full_name, account_tier)
VALUES
  ('joey@supriety.com', 'joey', '$2b$10$1Nn1sFf8gCsgV9gLqMeYgOGi6Sg6uP0oKn5n4dTWwRSn3Cf0pFZSe', 'Joey Supriety', 'kindness')
ON CONFLICT (email) DO NOTHING;

INSERT INTO user_stats (user_id, total_credits, total_acts_verified, current_streak, longest_streak, service_leader_status, service_leader_tier)
SELECT id, 47, 12, 7, 14, true, 'bronze' FROM users WHERE email = 'joey@supriety.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO kindness_acts (user_id, title, description, category, act_date, verification_status, credits_awarded)
SELECT id, 'Fed the neighborhood cats', 'Brought food for the cats near the park and cleaned their space.', 'community', CURRENT_DATE - INTERVAL '1 day', 'verified', 5
FROM users WHERE email = 'joey@supriety.com'
ON CONFLICT DO NOTHING;
