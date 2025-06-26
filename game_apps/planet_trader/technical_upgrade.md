# Planetary Terraforming Company – Technical Design Extension Document

## Overview

This document outlines a technical extension for the existing prototype of *Planetary Terraforming Company*, focusing on increasing system complexity, interdependencies between stats, upgrade systems, and unique planetary scenarios. The goal is to evolve the gameplay from a simplistic stat adjustment model into a nuanced simulation while preserving the core loop.

---

## 1. Interdependent Planetary Systems

### Current State

Each terraforming action (e.g., increase heat) independently modifies a stat (e.g., temperature) with no side effects.

### Extension Proposal

Introduce **stat interdependence** to simulate more realistic planetary behavior.

#### Proposed Stat Interactions

| Stat Changed | Primary Effect             | Secondary Side Effects                                   |
| ------------ | -------------------------- | -------------------------------------------------------- |
| Temperature  | Affects planetary heat     | Impacts water (evaporation/freezing), atmosphere density |
| Water        | Affects surface coverage   | Influences temperature (heat retention), life score      |
| Atmosphere   | Affects breathable gases   | Impacts radiation shielding, heat retention              |
| Gravity      | Affects surface conditions | Changes atmospheric retention, buyer suitability         |
| Radiation    | Affects habitability       | Influenced by atmosphere, mitigated by shielding tech    |

#### Sample Effect Chain

* Increasing temperature → melts ice → raises water levels → increases humidity → changes atmospheric composition.

---

## 2. Advanced Terraforming Tools

Tools can evolve into tech tiers, offering both specialization and complexity.

### Tool Properties

Each tool has:

* **Energy Cost** per use
* **Time Delay** for effect
* **Side Effects** (e.g., CO2 release when heating)
* **Precision Level** (upgradeable)

### Example Tool Types

| Tool Name            | Effect                   | Side Effects / Notes                                      |
| -------------------- | ------------------------ | --------------------------------------------------------- |
| Solar Amplifier      | Raises temperature       | May decrease water if heat > threshold                    |
| Atmospheric Pump     | Adds breathable gases    | Raises pressure; may increase gravity if dense gases used |
| Hydroseeder Drone    | Adds surface water       | Limited by current temperature                            |
| Gravity Stabilizer   | Raises or lowers gravity | High energy cost; affects atmospheric loss                |
| Radiation Filter Net | Reduces radiation        | Requires atmosphere >= minimal density                    |

---

## 3. Upgrade System

### Upgrade Categories

1. **Tool Efficiency** – Lower energy cost or faster action
2. **Stat Dampening** – Reduces side effects of changes
3. **Precision Controls** – Fine-grained control over stat ranges
4. **Passive Buffs** – Auto-balance small stat drift over time
5. **Unlock Exotic Tools** – E.g., Magnetic Core Driller (affects gravity/temperature)

### Upgrade Format

Each upgrade:

* Has a **credit cost**
* May require a **tech lab level**
* Can be globally applied or tool-specific

### Sample Upgrade Tree

```
Tool Upgrade Tree (Solar Amplifier):
- Efficiency Boost I
- Side Effect Dampener (Water Loss -10%)
- Multi-Frequency Emitter (Precision +2)
- Adaptive Solar Panel (Auto-adjust to radiation levels)
```

---

## 4. Special Planetary Scenarios

Introduce rare planetary templates that unlock fun and thematic gameplay paths:

| Scenario Name     | Description                           | Terraforming Challenge / Reward              |
| ----------------- | ------------------------------------- | -------------------------------------------- |
| Hot Springs World | Planet has geothermal activity        | Turn into spa planet; sell to leisure aliens |
| Shattered Crust   | Surface is fragmented by tectonics    | Stabilize gravity and crust; mining bonus    |
| Hollow Planet     | Low mass, high core temperature       | Must balance heat loss and pressure zones    |
| Icy Comet         | Small body, high velocity, mostly ice | Can become a water world or hydro-station    |
| Radiant Beacon    | Emits natural radiation bursts        | Can become energy-export hub with upgrades   |

Special planets have:

* Fixed base traits
* Unique alien buyer types
* Tech unlock opportunities

---

## 5. Environmental Thresholds and Tipping Points

Introduce thresholds that trigger major changes.

### Examples

* **Water > 80%** → triggers global flooding warning
* **Atmosphere < 5%** → increases radiation stat sharply
* **Temperature > 100°C** → disables water tools (evaporation)

Each threshold:

* Has a **global flag**
* May unlock **crisis management tools** (e.g., Cloud Seeder, Ice Mirror Satellite)

---

## 6. Alien Buyer Preferences

Extend alien preferences to have quirks:

| Species   | Unique Preference                       | Bonus Modifier                     |
| --------- | --------------------------------------- | ---------------------------------- |
| Thermala  | Prefer high heat and shallow water      | Spa World → +50% sale value        |
| Gravian   | Require high gravity + dense atmosphere | +20% profit if both matched        |
| Lucentid  | Prefer mid-radiation for photosynthesis | +10% bonus for maintaining balance |
| Vaporians | Like cloud-rich, wet worlds             | Auto-buy if 90% humidity threshold |

Preferences can be matched **partially** for **scaled profits**.

---

## 7. Technical Implementation Notes

### Stat System

Refactor stat representation into an object with:

```json
PlanetStats {
  temperature: number,
  water: number,
  atmosphere: number,
  gravity: number,
  radiation: number
}
```

Include dependencies and influence map:

```ts
applyEffect(effect) {
  stats.temperature += effect.tempDelta;
  if (stats.temperature > 60) stats.water -= 0.1;
  // chain other effects here
}
```

### Modifiers and Thresholds

* Each tool effect is a function with base and modified values.
* Thresholds are reactive triggers.
* Upgrades apply via multiplier modifiers or side effect masks.

---

## 8. Future Expansion Hooks

* Procedural event system (e.g., asteroid strike, solar flare)
* Galactic market fluctuations (price modifiers)
* Alien faction relationships
* Cross-planet synergies (trade networks, migration desirability)

---

## Bonus Technical Section: Flora and Fauna Integration

### Purpose

Introducing biological life increases the strategic depth of terraforming and supports new win conditions, modifiers, and buyer types.

### Biological Layers

1. **Microbial Life** – Early signs of biosphere viability; improves atmosphere generation.
2. **Plant Life** – Increases oxygen, adds visual greenery, supports animals.
3. **Animal Life** – Requires stable ecosystems; attracts advanced alien buyers.

### Dependencies for Growth

| Life Tier | Requirements                                   |
| --------- | ---------------------------------------------- |
| Microbial | Water > 10%, Temperature between 0–60°C        |
| Plants    | Atmosphere > 30%, Water > 30%, Radiation < 40% |
| Animals   | Plants present, Stable Temperature and Gravity |

### Gameplay Systems

* **Biological Seeding**: Unlock special tools like *Spore Sprayers* or *Bio Chambers* to introduce life.
* **Ecosystem Feedback**: Plant and animal presence modify planetary stats (e.g., plants reduce CO₂, animals raise biodiversity index).
* **Biome Zones**: Track land vs water regions, elevation, and temperature to define where life thrives.

### Alien Reactions

| Species Type   | Desired Lifeform Presence       | Bonus / Penalty                   |
| -------------- | ------------------------------- | --------------------------------- |
| Elorian Elders | Advanced biodiversity           | Bonus for maxed animal population |
| Vegari Traders | Lush plant-covered worlds       | Bonus for plant coverage > 80%    |
| Synthronics    | No preference (machine species) | Neutral to life stats             |

### Data Model Sample

```ts
PlanetBiosphere {
  hasMicrobes: boolean,
  plantCoverage: number, // 0 to 100
  animalDiversity: number, // 0 to 10
  bioscore: number // composite stat
}
```

### Tech Additions

* **Xeno-Bio Lab**: Unlocks biological terraforming tools
* **Biosphere Monitor**: Adds UI feedback loop for biome stats

Adding life brings long-term strategy, aesthetic progression, and new alien buyer motivations.

---

## Conclusion

These technical extensions aim to create a dynamic, emergent sandbox for creative terraforming strategies while layering deeper simulation logic. Maintaining fun and thematic flavor—such as spa planets, tectonic shapers, or alien luxury resorts—will preserve the game’s charm while expanding its strategic depth.
