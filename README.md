# ✨ ZenithMe | Private Burnout & Mood Tracker

**ZenithMe** is a premium, mobile-first, and privacy-focused mental wellbeing application designed specifically for busy professionals. It helps users track mood, stress, energy, and burnout risk while keeping all data 100% private and local to their device.

![App Preview](https://via.placeholder.com/800x400/F6C4DA/261A3C?text=ZenithMe+Premium+Burnout+Tracker)

---

## 🎨 Design Philosophy & Color Palette
The app features a **Pastel Wellness UI** designed to evoke calmness and reduce "UI fatigue." Every color is part of a curated design system tailored for emotional safety.

### The Wellness Palette
- **Background Blush** (`#F6C4DA`): Primary background for a soft, welcoming feel.
- **Pink Mist** (`#FBE7F1`): Surface highlights.
- **Aqua** (`#BEF1EC`): Used for "Calm" and "Growth" indicators.
- **Sky** (`#B7DEFF`): Used for "Focus" and "Professional" tones.
- **Lavender** (`#C8B8F5`): Primary brand accent for buttons and avatars.
- **Peach** (`#F7C8BD`): Secondary surface for "Warning" or "Moderate" risk.
- **Text Primary** (`#261A3C`): High-contrast Deep Plum for maximum readability.

---

## 🚀 Key Features

### 1. 🛡️ Privacy First (Local-First Architecture)
- **Zero Cloud**: No external servers, no cookies, no tracking.
- **Device-Only Storage**: All data securely rests in your browser's Local Storage.
- **Data Ownership**: Export records to JSON, or permanently destroy all data locally with a single tap.

### 2. 🎛️ Premium Onboarding & Setup
- **Personalized Setup**: Goal selection, custom avatar creation, and stress frequency profiling.
- **Private Journey**: No real email/password login wall—just jump right into local configuration.
- **Graceful Introduction**: Soft animated transitions establish the wellness tone immediately.

### 3. 🏡 Smart Dashboard & Real Data Handling
- **Dynamic Greetings**: Adapts to local time of day (`Good Morning`).
- **Authentic Empty States**: Elegant fallback UI when you haven't produced enough check-ins yet.
- **True Streak Engine**: Accurate milestone tracking, verifying consecutive daily inputs mathematically.

### 4. 📝 Premium Mood Check-in & Timeline
- **Granular Reflection**: Log expressive emojis, plus 1-10 slider ratings for Stress, Energy, Sleep, and Focus. 
- **Contextual Tags**: Pinpoint triggers like "Meetings", "Rest", or "Deadlines".
- **Real-Time Journal**: Search past memories, filter by 'stressed' days, and review your reflection history interactively.

### 5. 📊 Data-Driven Insights & Burnout Engine
- **Non-Medical Risk Profiling**: Evaluates consecutive days of high stress vs low sleep/energy to assess burnout risk.
- **7-Day Trajectory**: Real-time AreaChart displaying intersections in Mood vs. Stress lines.
- **Actionable Coping**: Intelligent output offering "Low/Moderate/High" indicators paired with realistic grounding suggestions.

### 6. 🌬️ Calm Tools & Web Reminders
- **Box Breathing (4-4-4-4)**: Animated, session-based breathing interface for acute nervous system resets.
- **4-7-8 Relaxation**: Deep guided breathing tools specifically timing inhales/holds/exhales for optimal recovery.
- **Native Web Nudges**: Selectable time preferences (e.g., 08:00, 20:00) mapped to true browser Notification permissions.

---

## 🛠️ Technical Architecture

### Tech Stack
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS 4.0 (CSS Theme Variables)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Fonts**: Outfit (Headings) & Inter (Body)

### Service-Oriented Logic
- `storage.js`: Centralized data management with validation.
- `BurnoutEngine.js`: Non-medical indicator logic that handles risk scaling.
- `NotificationService.js`: Browser API wrapper for local reminders.

---

## 📱 Mobile-First Principles
The UI is optimized for a 390px width and uses:
- **Safe-Area Insets**: Respects camera notches and bottom gesture bars.
- **Bottom Navigation Blur**: A native-like tab bar for easy thumb navigation.
- **Large Tap Targets**: Minimum 44px buttons for accessibility.

---

## 🌍 How to Run Locally
1. Clone the repo: `git clone https://github.com/shrutikeshri2021/mood_tracker_ag.git`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

---

## 🛥️ Deployment on Render
This project includes a `render.yaml` file for instant deployment as a **Static Site**.
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

---

*Disclaimer: This tool is for self-awareness and burnout prevention tracking. It is not a medical diagnostic tool. Please consult a professional for mental health concerns.*
