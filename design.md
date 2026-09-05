---
name: Zenith Habit Tracker
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf2'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef4ff'
  surface-container: '#e5efff'
  surface-container-high: '#dbe9ff'
  surface-container-highest: '#d4e4fa'
  on-surface: '#0d1c2d'
  on-surface-variant: '#3d4a3e'
  inverse-surface: '#233143'
  inverse-on-surface: '#e9f1ff'
  outline: '#6d7b6d'
  outline-variant: '#bccabb'
  surface-tint: '#006d36'
  primary: '#006d36'
  on-primary: '#ffffff'
  primary-container: '#4ade80'
  on-primary-container: '#005e2d'
  inverse-primary: '#4de082'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#5c5f61'
  on-tertiary: '#ffffff'
  tertiary-container: '#c2c4c6'
  on-tertiary-container: '#4e5153'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6dfe9c'
  primary-fixed-dim: '#4de082'
  on-primary-fixed: '#00210c'
  on-primary-fixed-variant: '#005227'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f8f9ff'
  on-background: '#0d1c2d'
  surface-variant: '#d4e4fa'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-bold:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 48px
---

## Brand & Style

This design system is engineered for a **Micro-Habit Tracker** that balances high-energy achievement with mindful productivity. The brand personality is "The Quiet Coach"—reliable, encouraging, and focused on the friction-less removal of obstacles. 

The aesthetic follows a **Premium Minimalist** approach. It utilizes a sophisticated geometric headline font to signal modernity and a soft, high-legibility body font to ensure that the user's data remains the primary focus. The interface relies on generous whitespace and a card-based architecture to provide a sense of mental clarity, avoiding the "clutter-stress" often associated with productivity tools. 

Key attributes:
- **Productive:** High-contrast interactions for immediate feedback.
- **Encouraging:** A "Success Green" primary color that rewards action without overstimulating.
- **Frictionless:** Minimal steps between intent and logging.

## Colors

The palette is designed to create a "dopamine loop" through visual cues. The **Primary Success Green (#4ADE80)** is reserved strictly for completion states, streaks, and primary action buttons. This ensures that the color becomes synonymous with achievement.

The **Deep Slate (#1E293B)** acts as the anchor for the system, used for high-contrast typography and structural elements to provide a sense of stability and authority. 

Backgrounds utilize a tiered neutral system:
- **Surface:** `#FFFFFF` for primary content cards.
- **Background:** `#F8FAFC` for the global canvas to reduce eye strain.
- **Subtle Accents:** Soft grays for secondary information and inactive states.

## Typography

The typography system uses a dual-font strategy to differentiate between **tracking (data/stats)** and **habits (content)**.

**Outfit** is used for headlines and progress numbers. Its geometric nature feels technical and modern, perfect for displaying streaks and daily percentages. 

**Plus Jakarta Sans** is used for habit titles, descriptions, and UI labels. Its softer terminals make the application feel more approachable and less like a rigid "to-do" list.

For mobile layouts, `display-lg` should be scaled down to 36px to prevent overflow, while maintaining the tight -0.02em letter spacing to preserve the premium editorial feel.

## Layout & Spacing

The design system utilizes a **Fluid-Fixed Hybrid Grid**. Content is housed within cards that span a 12-column grid on desktop, but reflow into a single vertical stack on mobile to facilitate one-handed 1-tap logging.

- **The 8pt Rhythm:** All padding and margins must be multiples of 8px (except for micro-spacing of 4px).
- **Safe Margins:** A 20px outer margin on mobile ensures that interaction elements are not too close to screen edges.
- **Grouped Logic:** Habits are grouped in cards with 16px internal padding. Related habits (e.g., "Morning Routine") are separated by 32px of vertical space to create distinct mental buckets.

## Elevation & Depth

To maintain a clean and modern aesthetic, this design system avoids heavy shadows. Depth is communicated through **Tonal Layering** and **Soft Ambient Shadows**.

- **Level 0 (Background):** `#F8FAFC` - The base surface.
- **Level 1 (Cards):** White background with a very soft, diffused shadow (`0px 4px 20px rgba(30, 41, 59, 0.05)`).
- **Level 2 (Active/Pressed):** When a user taps a habit to log it, the card should visually "sink" by removing the shadow and applying a 1px inner border of Success Green.
- **Floating Actions:** Primary "Add Habit" buttons use a slightly more pronounced shadow to indicate clickability and float above the content grid.

## Shapes

In alignment with the "inviting wellness-tech" aesthetic, the shape language is **Pill-Shaped**. 

- **Primary Cards:** Use a minimum radius of 24px (rounded-lg) to feel friendly and safe.
- **Action Buttons:** Must be fully pill-shaped (50% of height) to clearly distinguish them from informational cards.
- **Checkboxes/Logging Cues:** These are circular to represent the cyclical nature of habits.
- **Progress Bars:** Use fully rounded caps for both the track and the fill to maintain the soft visual rhythm.

## Components

### 1-Tap Log Buttons
The core interaction. These are circular or pill-shaped buttons that use a high-contrast transition. 
- **Incomplete:** Ghost state (Slate outline, transparent fill).
- **Completed:** Solid Success Green fill with a scale-up animation (1.05x).

### Habit Cards
Card containers that house the habit name (Body-LG), streak count (Headline-MD), and the 1-tap log button. Cards should use a white background to pop against the soft neutral page background.

### Progress Rings
Used for daily overview. A thick 8px stroke with rounded caps. The empty state is a subtle 5% opacity of the Success Green to show the "potential" for completion.

### Chips
Used for habit categories (e.g., "Health", "Work"). Small, pill-shaped elements with `#F1F5F9` backgrounds and `#475569` text.

### Input Fields
Minimalist styling with only a bottom border that turns Success Green on focus. This reduces visual noise during the habit creation process.

### Streaks & Stats
Streaks are highlighted using the `Outfit` font in `Primary Success Green`. These should be the most visually prominent numerical data on the screen to drive motivation.