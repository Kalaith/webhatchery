# Missing Features for Dungeon Master Game

This document lists features described in the player guide and design document that are not fully implemented in the current codebase (`app.js`, `index.html`).

## 1. Advanced NPC Personality & Memory
- NPCs do not remember past interactions or adapt their behavior based on previous player responses.
- No long-term relationship tracking between NPCs and the player (e.g., trust, ambition, rebellion).
- NPCs do not develop or change their request patterns over time based on morale or story events.

## 2. Dynamic Dialogue & Open-Ended Requests
- NPC requests are limited to preset options; no support for open-ended, AI-generated, or contextually adaptive dialogue.
- No natural language processing for interpreting custom DM responses or generating nuanced NPC reactions.

## 3. Procedural Story Generation & Branching
- Story progression is mostly linear and event-driven; there is no procedural narrative generation or branching storylines based on player choices.
- No system for tracking or displaying a branching narrative tree or history of decisions.

## 4. Deeper Resource Management
- Resources (gold, supplies, reputation) are tracked but not deeply integrated into gameplay (e.g., no resource-based decision consequences, trading, or upgrades).
- No inventory or equipment system for the party or individual NPCs.

## 5. NPC Interactions & Party Dynamics
- No direct interactions or relationships between NPCs (e.g., party arguments, alliances, or conflicts).
- NPCs do not react to each other's suggestions or actions.

## 6. Enhanced Random Events & Complications
- Random events are simple and not deeply tied to current story context, tension, or NPC personalities.
- No system for escalating complications or multi-stage events based on tension or previous outcomes.

## 7. Save/Load & Persistence
- No support for saving and loading game state or story history between sessions.

## 8. Accessibility & UI Improvements
- No accessibility features (e.g., screen reader support, keyboard navigation for all controls).
- No visual indicators for NPC mood changes or relationship status.

## 9. Multiplayer/Co-DM Mode
- No support for multiple players acting as co-DMs or taking turns.

## 10. Advanced AI Integration (Future Potential)
- No integration with external AI or language models for generating NPC dialogue or story events.

---

This list is based on the comparison between the current implementation and the features described in the player guide and design document. Some features may be partially present but not fully realized.
