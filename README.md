# ⚔️ War Room

![Dashboard](./public/screenshots/dashboard.png)

## The Story: Deep Work or Nothing
Traditional productivity apps and standard pomodoro timers are solitary, uninspiring, and too easy to ignore. You set a timer, you fail to follow through, and nobody knows. There are no stakes.

**The War Room** was built to solve a specific problem: creating an industrial-grade, brutal accountability environment for an elite 3-person squad. We didn't want pastel colors or encouraging nudges; we wanted a high-stakes, tech-heavy "Command Center" that forces execution. 

If you don't lock in your daily targets, you can't see the dashboard. If your timer isn't running, your team sees a yellow idle light. If you fall below 4 hours of deep work, you're thrown into the "Red Zone" for public failure. No excuses.

---

## 📸 The Command Center Boot Sequence
When you log in, you are greeted not by a friendly dashboard, but by the **Initialization Sequence**. The entire dashboard is locked behind a frosted glass blur. A low 60Hz synth hum vibrates through your speakers.

![Boot Sequence](./public/screenshots/boot_sequence.png)

You are forced to input three strict operational parameters (targets) for the day. Once locked in, the "SYSTEM ONLINE" sequence triggers, fading out the blur and sliding the dashboard into view.

---

## 🛠️ The Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database & Auth**: Supabase (PostgreSQL)
- **Real-Time Network**: Supabase Realtime Broadcast (Ephemeral Pub/Sub)
- **Styling**: Tailwind CSS & shadcn/ui
- **Audio Engine**: Native Web Audio API Synthesizer (Zero storage footprint)

---

## 📂 File Anatomy & Architecture

### `app/page.tsx` & `app/layout.tsx`
These act as the entry point and the structural foundation of the War Room. 
- **`layout.tsx`** injects the global fonts (Geist Mono for that terminal aesthetic) and wraps the entire application in our CSS-generated grid and scanline background patterns.
- **`page.tsx`** orchestrates the dashboard. It fetches all users, calculates the daily leaderboard, and passes data down to the individual components. It also dictates if the `MorningLockInModal` (Boot Sequence) should be shown based on database records.

### `app/globals.css`
This file is the visual soul of the War Room. Beyond the standard Tailwind directives, it contains custom CSS variables for our neon-green and deep-navy aesthetic. It also contains the crucial `.bg-scanline` and `.bg-grid-pattern` classes which overlay the entire app with a faint, retro CRT-monitor effect.

### `lib/sound.ts`
The custom Sound Engine. Instead of relying on external MP3 files (which require database storage and bandwidth), this file uses the browser's native `AudioContext` to synthesize sounds from scratch:
- `playClick()`: Generates a short oscillator blip when engaging a deep work session.
- `startHum()` / `stopHum()`: Generates a continuous low-frequency triangle wave for the Boot Sequence.
- `playSuccessChime()`: Triggers a multi-oscillator chord progression when a user hits the 4-hour mark.

### `components/dashboard/MorningLockInModal.tsx`
This handles the "Command Center Boot Sequence." It uses a fixed, full-screen overlay with `backdrop-blur-3xl`. It hooks into `lib/sound.ts` to play the hum on mount. Once all three inputs are validated and submitted to Supabase, it triggers a CSS-based "System Online" animation and unlocks the dashboard.

### `components/dashboard/DeepWorkTimer.tsx`
The time engine. It manages the local state for Pomodoro sessions (25m, 45m, 60m). More importantly, it hooks into the `StatusContext` to broadcast to the network when the timer is engaged (`broadcastTimerStart`) or disengaged (`broadcastTimerStop`), and saves the accumulated seconds back to the Supabase Postgres database upon completion.

### `components/dashboard/RealtimeProvider.tsx`
The ephemeral pub/sub layer. This component doesn't render any UI; it sits silently in the background managing WebSockets via Supabase Realtime. 
- It listens for database changes on the `nudges` table (triggering screen shakes and toasts).
- It opens a **Broadcast Channel** (`status_broadcast`) to listen for active timer events across the network, updating a React Context so other components know exactly who is currently focusing in real-time, without hammering the Postgres database with writes.

### `components/dashboard/UserCard.tsx`
The visual representation of an operative. It reads from the `StatusContext` provided by the RealtimeProvider to render a glowing LED status indicator next to the username:
- 🟢 **Green Pulse**: Operative is actively engaged in a timer.
- 🟡 **Solid Yellow**: Operative is idle, but has surpassed 4 hours.
- 🔴 **Solid Red**: Operative is under 4 hours and idle.

---

> *"Amateurs sit and wait for inspiration, the rest of us just get up and go to work."* - Stephen King
