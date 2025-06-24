# React Component Plan for Dungeon Master Game

This document outlines the React components needed to rebuild the Dungeon Master Game web app.

## Top-Level Structure
- `App` – Main application wrapper, manages global state and layout.

## Layout Components
- `Header` – Game title and subtitle.
- `GameBoard` – Main content area, contains story, NPC panel, and DM panel.
- `Footer` / `GameStatusBar` – Displays tension, morale, and resources.

## Story Components
- `StorySection` – Displays the current story and location.
  - `StoryCard` – Card UI for the story area.
  - `StoryContent` – Scrollable list of story events.
  - `StoryLocation` – Shows current location.

## NPC Components
- `NPCPanel` – Contains the party list.
  - `NPCList` – Maps and renders all NPCs.
  - `NPCCard` – Individual NPC display (portrait, name, class, mood bar, etc.).

## DM Action Components
- `DMPanel` – Contains all DM controls and current request.
  - `CurrentRequest` – Shows the selected NPC's request.
  - `ResponseOptions` – Approve/Deny/Modify/Alternative buttons.
  - `CustomResponse` – Textarea and submit button for custom DM input.
  - `StoryProgression` – Advance Time, Random Event, Add Challenge buttons.

## Status & Resource Components
- `StatusMeters` – Container for all meters.
  - `TensionMeter` – Progress bar and value for story tension.
  - `MoraleMeter` – Progress bar and value for party morale.
  - `Resources` – Gold, Supplies, Reputation display.

## Utility & UI Components
- `Button` – Reusable button component (primary, secondary, outline, etc.).
- `Card` – Reusable card container for consistent UI.
- `ProgressBar` – For tension/morale meters.
- `MoodBar` – For NPC mood display.

## Accessibility & Misc
- `ScreenReaderOnly` – For accessibility labels.
- `KeyboardNavigation` – (Optional) for improved keyboard support.

## State Management
- Use React Context or Redux for global game state (tension, morale, NPCs, story events, etc.).
- Consider custom hooks for game logic (e.g., useNPCs, useStoryEvents).

---

This list covers all major UI and logic components needed to faithfully recreate the current site in React, with modularity and reusability in mind.
