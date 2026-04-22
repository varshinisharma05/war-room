-- Migration: Add daily teach_back column to daily_stats
ALTER TABLE daily_stats ADD COLUMN teach_back TEXT;
