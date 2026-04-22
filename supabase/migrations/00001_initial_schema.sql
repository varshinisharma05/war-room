-- Create Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  current_status TEXT NOT NULL DEFAULT 'Ready' CHECK (current_status IN ('Ready', 'Red')),
  total_streak INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create Daily_Stats Table
CREATE TABLE daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  locked_goals TEXT[] NOT NULL DEFAULT '{}',
  total_seconds_worked INTEGER NOT NULL DEFAULT 0,
  active_timer_start TIMESTAMPTZ,
  recovery_note TEXT,
  evidence_links TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create Nudges Table
CREATE TABLE nudges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  receiver_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE nudges ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile." 
ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile."
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Daily_Stats Policies
CREATE POLICY "Daily stats are viewable by everyone." 
ON daily_stats FOR SELECT USING (true);

CREATE POLICY "Users can insert their own daily stats." 
ON daily_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily stats." 
ON daily_stats FOR UPDATE USING (auth.uid() = user_id);

-- Nudges Policies
CREATE POLICY "Nudges are viewable by everyone." 
ON nudges FOR SELECT USING (true);

CREATE POLICY "Users can insert nudges they send." 
ON nudges FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Enable Realtime for nudges
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE nudges;
