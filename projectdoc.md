Here is the complete blueprint for your Micro-Habit Tracker. This overview maps out the user experience, the system architecture, and a step-by-step development roadmap so you can build this smoothly.
------------------------------
## Project Blueprint: System Architecture
Your website and Android app will never talk to the database directly. Instead, they will securely share the exact same backend engine.

┌──────────────────────────┐      ┌──────────────────────────┐
│  WEB FRONTEND (React)    │      │  ANDROID APP (Kotlin)    │
│  - Big screen dashboard  │      │  - Mobile home widget    │
│  - Progress calendars    │      │  - Push reminders        │
└─────────────┬────────────┘      └────────────┬─────────────┘
              │                                │
              └───────────────┬────────────────┘
                              │ HTTP Requests (JSON Data)
                              ▼
               ┌─────────────────────────────┐
               │    BACKEND API GATEWAY      │
               │ (Supabase / Firebase / Node)│
               └──────────────┬──────────────┘
                              │
                              ▼
               ┌─────────────────────────────┐
               │      CENTRAL DATABASE       │
               │  - Users & Habits Tables    │
               └─────────────────────────────┘

------------------------------
## The User Experience (UX)## The Web Experience (Desktop/Laptop)

* Focus: Setup, analysis, and reflection.
* Key Features:
* Clean dashboard displaying current habits and streaks.
   * A calendar grid visualization (like GitHub's green contribution graph) showing consistency over months.
   * Configuration settings to add, delete, or rename habits.

## The Android Experience (Mobile Phone)

* Focus: Instant execution and micro-interactions.
* Key Features:
* A clean single-column list with massive check-buttons for 1-tap logging.
   * A Home Screen Widget so users can check off habits without opening the app.
   * Daily push notifications at 8:00 PM if habits are still incomplete.

------------------------------
## Data flow & API Payloads
When the frontend interacts with the API, they pass small text objects called JSON. Here is exactly what those look like:
## 1. Fetching the Habit List (GET /api/habits)
When a user opens either app, the client requests their habits. The API sends back this list:

[
  {
    "id": "h_982",
    "name": "Drink 3L Water",
    "streak": 5,
    "is_completed_today": false
  },
  {
    "id": "h_551",
    "name": "Read 10 Pages",
    "streak": 14,
    "is_completed_today": true
  }
]

## 2. Completing a Habit (PUT /api/habits/h_982/complete)
When the user taps the checkmark on Android or Web, the client tells the server to update that habit. The backend processes the streak logic and responds with the new count:

{
  "id": "h_982",
  "name": "Drink 3L Water",
  "streak": 6,
  "is_completed_today": true
}

------------------------------
## Step-by-Step Development Plan
Do not try to build everything at once. Build it in stages so you always have a working product.
## Phase 1: The Database & Core API

* Set up your database tables (users and habits).
* Build and test your API endpoints using a tool like Postman to make sure you can create, get, and update habits successfully.

## Phase 2: The Web App

* Build a simple UI to log in and view the habit list.
* Connect your buttons to the PUT /api/habits/{id}/complete endpoint.
* Make sure clicking a button updates the database in real-time.

## Phase 3: The Android App

* Build a matching layout in Kotlin/Jetpack Compose.
* Use a networking library (like Retrofit) to call the exact same API endpoints you built in Phase 1.
* Test that checking a habit on your phone instantly updates the website dashboard.

------------------------------
## Next Step
To write the first line of code, we need to choose your backend tool. Which backend path should we use?

* Option A: Supabase/Firebase (Recommended for speed) – They handle the server and database for you automatically.
* Option B: Node.js + Express (Best for learning backend) – You write the server logic and database queries yourself from scratch.

Let me know which option you choose, and we will initialize your database tables!

## Product Requirement Document (PRD)## Project: Micro-Habit Tracker (Web & Android)
------------------------------
## 1. Project Overview
The Micro-Habit Tracker is a cross-platform application designed to help users build long-term routines through micro-actions. Users can track up to 3 daily habits (e.g., "Drink water," "Stretch," "Read 10 pages") with a zero-friction interface. The system ensures real-time data sync across a desktop web application and a native Android app.
## Problem Statement
Most habit trackers are bloated, over-engineered, and fail to bridge the gap between deep desktop reflection and quick mobile interactions. Users need a system that sits on their desk (web) and stays in their pocket (mobile) with zero syncing delays.
## Objectives

* Provide a unified database and API backend for web and mobile clients.
* Maintain a frictionless 1-tap completion mechanism.
* Automate streak retention and reset logic on a daily cadence.

------------------------------
## 2. Target Audience & Personas

* The Desktop Worker: Spends 8+ hours at a computer. Uses the web dashboard to plan their week, review monthly trends, and configure settings.
* The On-the-Go Achiever: Relies on their smartphone for quick actions. Uses the Android application for instant logging, home-screen widgets, and push reminders.

------------------------------
## 3. Scope & Feature Requirements## 3.1 User Authentication (Web & Android)

* Sign Up / Login: Email and password authentication.
* Session Persistence: Users remain logged in across app restarts until they explicitly log out.

## 3.2 Core Habit Management (Web Primary)

* Habit Creation: Users can create up to 3 custom habits.
* Habit Deletion: Users can remove a habit, which archives historical progress without breaking overall user statistics.
* Habit Restraints: Hard limit of 3 active habits to prevent user burnout and maintain interface simplicity.

## 3.3 The Daily Loop (Web & Android)

* The Dashboard View: A clean list showing active habits, current streak counts, and a visual completion state (Checked vs. Unchecked).
* The 1-Tap Action: Clicking or tapping a habit marks it done for the calendar day.
* Real-time Sync: Checking an item on Android instantly updates the web UI state if both are open.

## 3.4 Platform-Specific Features## Web App Unique Features

* Consistency Heatmap: A visual 365-day grid (GitHub-style calendar) showing past completion density.
* Advanced Analytics: Simple charts showing completion percentages by day of the week.

## Android App Unique Features

* Home Screen Widget: A 1x3 or 2x2 interactive widget allowing users to check off habits directly from the Android launcher without opening the application.
* Push Notifications: A daily reminder sent at 8:00 PM local time if any active habits remain uncompleted.

------------------------------
## 4. Technical Architecture & API Design## 4.1 Data Model (Database Schema)

 [users] ────🔑 1 : N ────> [habits]
  - id (UUID)                - id (UUID)
  - email (String)           - user_id (UUID, FK)
  - created_at (Timestamp)   - name (String)
                             - streak_count (Integer)
                             - last_completed_at (Date)
                             - created_at (Timestamp)

## 4.2 Core API Endpoints## GET /api/habits

* Description: Retrieves active habits for the authenticated user.
* Response Payload (JSON):

[
  {
    "id": "habit_uuid_111",
    "name": "Drink 3L Water",
    "streak_count": 5,
    "is_completed_today": false
  }
]


## PUT /api/habits/{id}/complete

* Description: Triggers completion logic for a specific habit.
* Server-Side Logic:
1. If last_completed_at == Today → Do nothing.
   2. If last_completed_at == Yesterday → Increment streak_count by 1. Set last_completed_at to Today.
   3. If last_completed_at < Yesterday → Reset streak_count to 1. Set last_completed_at to Today.
* Response Payload (JSON):

{
  "id": "habit_uuid_111",
  "streak_count": 6,
  "is_completed_today": true
}


------------------------------
## 5. UI/UX & Key Screens## 5.1 Web Application

* Screen 1: Auth Gate: Clean, minimalist login/signup form.
* Screen 2: Central Dashboard:
* Left Panel: Current active habits with large, clickable checkbox states.
   * Right Panel: The historical grid calendar heatmap and analytics dashboard.

## 5.2 Android Application

* Screen 1: Main Activity: A single-column view optimized for thumb reach. Large cards for each habit showing the habit name, flame icon with streak count, and a massive touch target checkbox.
* Screen 2: Add/Edit Dialog: A simple bottom-sheet modal to type or edit habit titles.

------------------------------
## 6. Non-Functional Requirements

* Latency: API response times for custom endpoints must remain under 200ms to avoid UI stuttering.
* Offline Capability (Android): The Android application must cache the latest known API state locally. If a user marks a habit complete offline, the action queues up and syncs once network connectivity recovers.
* Data Security: All data in transit must enforce HTTPS protocols. Passwords must use secure cryptographic hashing functions (e.g., bcrypt) if self-hosting the backend.

------------------------------
## 7. Phase 1 Release Criteria & MVP Checklist

* Users can sign up and sign in from both platforms using the same account credentials.
* A habit checked off on Android updates the API database correctly.
* Re-opening the Web App reflects the correct streak incremented by the Android activity.
* Habits reset their completion state at midnight based on the server's time zone tracking.

------------------------------
Let's start building! Tell me if you want to initialize the backend database with Supabase/Firebase (Option A) or if you want to write the custom server yourself using Node.js (Option B).

