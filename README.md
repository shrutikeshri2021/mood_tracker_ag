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
- **Zero Cloud**: No external servers, no cookies, no trackers.
- **Device-Only Storage**: All data is encrypted and saved directly in your browser's Local Storage.
- **Data Ownership**: Export all your data as a JSON backup or clear everything with a single click.

### 2. 🔥 Intelligent Burnout Risk Engine
A logic-based service that monitors your:
- **Stress Persistence**: Detects if your stress levels stay high for multiple days.
- **Energy Depletion**: Tracks recovery habits vs. workday drain.
- **Sleep Quality**: Incorporates rest cycles into your risk score.
  
*Output: Gives you a clear "Low / Moderate / High" risk status with actionable recovery tips.*

### 3. 📊 Data-Driven Insights
- **7-Day Trajectory**: Visual AreaChart showing the correlation between your Mood and Stress.
- **System Equilibrium**: A snapshot of your overall mental stability.
- **Metric Averages**: Breakdown of your average sleep, focus, and energy.

### 4. 📝 Premium Mood Check-in
- **Expressive Mood Selection**: Choose from high-fidelity emotional icons.
- **Intensity Sliders**: Granular 1-10 tracking for Stress, Energy, Sleep, and Focus.
- **Contextual Tags**: Tag your entries with triggers like "Meetings," "Deep Work," or "Overthinking."

### 5. 🌬️ Calm Tools
- **Box Breathing (4-4-4-4)**: Focused rhythmic sessions for instant nervous system stabilization.
- **4-7-8 Relaxation**: Deep breathing guides to prepare for rest and reduce anxiety.
- **Grounding Tools**: Text-guided 5-4-3-2-1 reset.

### 6. 📅 Timeline & Reflection
- Searchable and filterable history.
- Quick summary badges for every past entry.
- Safe-delete functionality.

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
