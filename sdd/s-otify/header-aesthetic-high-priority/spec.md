# Spec: Header Aesthetic Improvements (HIGH Priority)

**Change**: header-aesthetic-high-priority
**Project**: s-otify (Spotify clone)
**Mode**: engram

## Overview

This spec defines three HIGH priority aesthetic improvements to the Header component:
1. Logo replacement with recognizable music icon
2. Active navigation state with visual indicator
3. Language selector with flag icons and button group

---

## 1. Logo Specification

### Current State
- Uses text character `◉` in `.brandIcon` span
- Styled with: `bg-zinc-800 p-1 text-2xl ring-1 ring-zinc-700`
- App name shows as "S-otify"

### Requirement: Music Icon Logo

The system MUST display a recognizable music/brand icon that clearly conveys the application is a music streaming service.

#### Scenario: Logo Display

- GIVEN the Header component renders
- WHEN the page loads
- THEN the brand logo icon MUST be visible next to "S-otify" text
- AND the icon MUST be recognizable as music-related (prefer Spotify green `#1DB954` or similar)

#### Scenario: Logo Styling

- GIVEN the logo is rendered
- WHEN viewed on desktop (≥768px)
- THEN the icon size MUST be proportional (approx 24-32px)
- AND the icon MUST align vertically with the app name text
- AND the icon SHOULD have hover opacity transition (opacity-90 on hover)

#### Implementation Notes
- **Option**: Replace `◉` with SVG icon (e.g., music note ♫, play ▶, or Spotify-style green circle)
- **Location**: `Header.jsx`, line 19: `<span className={styles.brandIcon}>◉</span>`
- **Styling**: Update `Header.module.css` `.brandIcon` to use SVG with appropriate sizing

---

## 2. Active Navigation State Specification

### Current State
- Navigation uses `<Link>` from react-router-dom
- No active state styling exists
- All nav links have identical appearance

### Requirement: Active Route Indicator

The system MUST visually indicate which navigation link corresponds to the currently active route.

#### Scenario: Active Home Route

- GIVEN user navigates to `/`
- WHEN the Header renders
- THEN the "Home" nav link MUST display a visual indicator (underline, background highlight, or border)
- AND the indicator color SHOULD be Spotify green (`#1DB954`) or similar accent color
- AND non-active links MUST NOT show this indicator

#### Scenario: Active Favorites Route

- GIVEN user navigates to `/favorites`
- WHEN the Header renders
- THEN the "Favorites" nav link MUST display the visual indicator
- AND "Home" link MUST NOT display the indicator

#### Scenario: No Active Route Match

- GIVEN user navigates to a route not in NAV_LINKS (e.g., `/playlist/123`)
- WHEN the Header renders
- THEN NO nav link should display the active indicator

#### Implementation Notes
- **Detection**: Use `NavLink` from react-router-dom (replaces `Link`) with `className` callback, OR use `useLocation()` hook
- **Visual**: Active class with `.active` applied via NavLink's `end` prop for exact match on `/`
- **CSS**: Add `.navLinkActive` class with `text-white bg-zinc-800` or bottom border indicator

---

## 3. Language Selector Specification

### Current State
- Uses native `<select>` element
- Shows "ES" and "EN" as text options
- Styled with: `rounded-full border border-zinc-700 bg-zinc-900/95 px-3 py-1 text-xs`

### Requirement: Flag-Based Language Switcher

The system MUST provide a language selector that displays flag icons and uses a button group instead of native select.

#### Scenario: Language Selector Flags

- GIVEN the Header renders
- WHEN the language selector is visible
- THEN it MUST display flag icons (🇪🇸 for Spanish, 🇬🇧 for English)
- AND the current language flag MUST be visually distinct (highlighted or larger)

#### Scenario: Language Switch Interaction

- GIVEN the language selector shows flags
- WHEN user clicks on a non-active language flag
- THEN the system MUST switch the application language to that locale
- AND the UI MUST immediately reflect the new selected flag as active

#### Scenario: Language Persistence

- GIVEN user selects a language
- WHEN the page refreshes
- THEN the system MUST maintain the selected language preference

#### Scenario: Language Selector Hover State

- GIVEN the language selector displays flags
- WHEN user hovers over a flag button
- THEN the button SHOULD show a visual hover state (scale, brightness, or border change)
- AND focus state SHOULD be visible for keyboard navigation

#### Implementation Notes
- **Replace**: `<select>` with button group (`<button>` elements)
- **Location**: `Header.jsx`, lines 24-31
- **CSS**: Add `.languageButtons`, `.languageBtn`, `.languageBtnActive` classes
- **Icons**: Use emoji flags (🇪🇸 🇬🇧) or SVG flag icons
- **Styling**: Remove select styling, add button group with gap, hover transitions, focus rings

---

## Responsive Behavior

### Requirement: Mobile-Friendly Header

The system MUST ensure header aesthetic improvements work on mobile devices.

#### Scenario: Mobile Logo

- GIVEN viewport width < 768px
- WHEN the header renders
- THEN the logo icon MUST remain visible and properly sized
- AND the icon size SHOULD be slightly smaller (text-xl range)

#### Scenario: Mobile Navigation

- GIVEN viewport width < 768px
- WHEN the header renders
- THEN nav links MUST remain accessible
- AND active indicator MUST remain visible on mobile

#### Scenario: Mobile Language Selector

- GIVEN viewport width < 768px
- WHEN the language selector renders
- THEN flag buttons MUST remain clickable (min touch target 44px)
- AND spacing SHOULD be adequate for touch interaction

---

## Acceptance Criteria Summary

| Criterion | Requirement |
|-----------|-------------|
| Logo visible | Music icon displays correctly |
| Logo recognizable | Clear music/brand association |
| Active state | Visual indicator on current route |
| Language flags | 🇪🇸 🇬🇧 displayed |
| Hover states | Interactive feedback on buttons |
| No console errors | Clean browser console |
| Mobile responsive | Works on < 768px viewport |

---

## Files to Modify

1. `src/components/Header/Header.jsx`
   - Replace `<Link>` with `<NavLink>` for navigation (optional via className)
   - Replace `<select>` with button group for language selector
   - Update logo icon from `◉` to SVG or emoji

2. `src/components/Header/Header.module.css`
   - Add `.brandIcon` SVG styling
   - Add `.navLinkActive` class for active state
   - Add `.languageButtons`, `.languageBtn`, `.languageBtnActive` classes
   - Update responsive styles as needed

---

## Dependencies

- **react-router-dom**: Required for `<NavLink>` or `useLocation()` (already installed)
- **react-i18next**: Already in use for translations (no changes needed)
- **No new packages required**

---

## Next Step

Ready for **sdd-design** phase to create technical implementation details.