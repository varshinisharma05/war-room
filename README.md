# ⚔️ The War Room
“Deep Work or Nothing.”

## 📖 The Story: A 50-Day Pact
On April 21st, three engineers realized they were at Step 1 of a 40-step journey. Summer vacation was slipping away, and placements were looming. The problem wasn't a lack of resources—it was a lack of consequences.

Traditional productivity apps are built on "positive reinforcement," but the real world doesn't always work that way. We built the War Room to simulate the high-pressure environment of a mission-critical operation. We didn't want a "to-do list"; we wanted a Command Center where your progress (or lack thereof) is visible to your team in real-time.

Our aim: 50 days of total focus. No distractions. No fake studying. Just raw execution.

---

## 🛠️ The Arsenal (Tech Stack)
- **Framework:** Next.js 14 (App Router) - For server-side performance and industry-standard routing.
- **Database:** Supabase (PostgreSQL) - Leveraging relational data for complex progress tracking.
- **Real-Time:** Supabase Realtime Broadcast - For instant "Nudges" and live status LEDs.
- **Audio Engine:** Native Web Audio API - Synthesizing industrial sounds directly in the browser to keep the app lightweight.
- **Styling:** Tailwind CSS & Shadcn/UI - A customized "Midnight Library" palette with scanline overlays.

---

## 📂 System Architecture: File-by-File Breakdown

### 🏛️ The Foundation
**`app/layout.tsx`**
- **The Why:** This is the "shell" of the app. It injects the Geist Mono font and the CRT Scanline CSS global overlay. It ensures the "War Room" atmosphere is persistent, even during page transitions.

**`app/page.tsx`**
- **The Why:** The Mission Control. It handles the server-side check: "Has this user initialized their targets today?" If not, it triggers the boot sequence.

### 🧠 The Logic Engine
**`lib/supabase/client.ts`**
- **The Why:** The bridge. It initializes the Supabase client. We specifically configured this to handle Realtime Subscriptions, allowing your screen to shake when a friend nudges you.

**`lib/sound.ts`**
- **The Why:** Atmospheric Immersion. Instead of loading bulky MP3s, this uses oscillators to create a 60Hz hum during the lock-in and a success chime when you hit your 4-hour mark. It turns a web app into a "tool."

### 🕹️ The Interface Components
**`components/dashboard/MorningLockInModal.tsx`**
- **The Why:** The Gatekeeper. This file enforces the "Rule of Three." It blocks all UI using a backdrop-blur until three targets are committed to the database. It’s the difference between "maybe working" and "committing."

**`components/dashboard/DeepWorkTimer.tsx`**
- **The Why:** The Executioner. Unlike a regular clock, this timer saves timestamps to the database so you can't "cheat" by refreshing the page. It manages the 25/45/60 minute sessions.

**`components/dashboard/UserCard.tsx`**
- **The Why:** Accountability. This renders your friend's status. It calculates the "Red Zone" logic: if the user is idle and under 4 hours, it pulses Red. It’s a visual representation of team performance.

**`components/resources/ResourceList.tsx`**
- **The Why:** The Collective Brain. A shared vault where we drop links for DSA, CN, and SQL. It ensures that when one of us finds a "Step 40" resource, we all benefit.

---

## 📸 System Visuals

![The Dashboard](./public/screenshots/dashboard.png)
*The dashboard showing the operative in 'Active Focus' and the squad nearing the 4-hour mark.*

<br/>

![Boot Sequence](./public/screenshots/boot_sequence.png)
*The 'SYSTEM OFFLINE' screen that forces target commitment every morning at 10 AM.*

---

> *"Amateurs sit and wait for inspiration, the rest of us just get up and go to work."*  
> — Stephen King
