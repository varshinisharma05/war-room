-- Create Weekly Goals Table (per operative)
CREATE TABLE weekly_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  week_start_date DATE NOT NULL,
  goal_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, week_start_date)
);

-- Create Squad Topics Table (common for all 3)
CREATE TABLE squad_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start_date DATE NOT NULL UNIQUE,
  topic_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE weekly_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE squad_topics ENABLE ROW LEVEL SECURITY;

-- Weekly Goals Policies
CREATE POLICY "Weekly goals are viewable by everyone." 
ON weekly_goals FOR SELECT USING (true);

CREATE POLICY "Users can insert their own weekly goals." 
ON weekly_goals FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly goals." 
ON weekly_goals FOR UPDATE USING (auth.uid() = user_id);

-- Squad Topics Policies
CREATE POLICY "Squad topics are viewable by everyone." 
ON squad_topics FOR SELECT USING (true);

CREATE POLICY "Any authenticated user can insert squad topics." 
ON squad_topics FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Any authenticated user can update squad topics." 
ON squad_topics FOR UPDATE USING (auth.role() = 'authenticated');
