export type Profile = {
  id: string;
  username: string;
  current_status: 'Ready' | 'Red';
  total_streak: number;
  created_at: string;
};

export type DailyStats = {
  id: string;
  user_id: string;
  date: string;
  locked_goals: string[];
  total_seconds_worked: number;
  active_timer_start: string | null;
  recovery_note: string | null;
  teach_back: string | null;
  evidence_links: string[];
  created_at: string;
};

export type Nudge = {
  id: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
};

export type Resource = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  category: string;
  description: string;
  created_at: string;
};
