// --- 1. Define Interfaces for Data Structure ---

/**
 * Represents the structure of a single trait from the JSON data.
 * All properties are optional as not every trait will have every property.
 */
interface TraitProperties {
    description: string;
    trait_type: "active_ability" | "passive_effect" | "environmental_effect";
    target_type: "enemy" | "self" | "area" | "allies" | "environment" | "structure" | "room" | "corpse";
    applies_to: "monster" | "room_theme";
    mana_cost?: number;
    cooldown_turns?: number;
    duration_turns?: number; // -1 for permanent, >0 for temporary
    chance_percent?: number;
    upgrade_potential: boolean;
    // --- Specific effect properties (extend as needed) ---
    bonus_damage_multiplier?: number;
    surprise_chance_percent?: number;
    slow_duration_turns?: number;
    slow_amount_percent?: number;
    immobilize_chance_percent?: number;
    immobilize_duration_turns?: number;
    damage_per_turn?: number; // For DoT or HoT
    heal_amount_percent?: number; // General healing
    detection_reduction_percent?: number;
    movement_speed_reduction_percent?: number;
    attack_speed_reduction_percent?: number;
    radius?: number; // For area effects, -1 for "room"
    max_enemy_size_tier?: number;
    morale_reduction_percent?: number;
    attack_chance_reduction_percent?: number;
    invisibility_duration_turns?: number;
    damage_reflection_percent?: number; // Percent of damage reflected
    illusion_duration_turns?: number;
    confusion_chance_percent?: number;
    number_of_illusions?: number;
    range_tiles?: number;
    number_of_mimics?: number;
    mimic_health_percent_of_caster?: number;
    mimic_damage_percent_of_caster?: number;
    damage_distribution_percent?: number; // For Shared Health
    area_of_effect_radius?: number; // Specific for AoE range
    mana_cost_multiplier_for_copied_spell?: number;
    cooldown_multiplier_for_copied_spell?: number;
    max_spells_stored?: number;
    mana_absorption_percent?: number;
    heal_from_mana_percent?: number;
    power_gain_per_mana?: number;
    debuff_on_enemy_chance_percent?: number;
    mimicry_effectiveness_percent?: number;
    heal_on_kill_percent?: number;
    enemy_effectiveness_reduction_percent?: number;
    magic_damage_reduction_percent?: number;
    fire_damage_multiplier?: number;
    ignite_chance_percent?: number;
    ignite_duration_turns?: number;
    light_radius_tiles?: number;
    reveal_hidden_duration_turns?: number;
    trigger_chance_percent?: number;
    triggered_effect_type?: string;
    triggered_effect_value?: number;
    burn_damage_per_turn_percent_of_attack_damage?: number;
    defense_reduction_percent?: number;
    evasion_increase_percent?: number;
    poison_damage_per_turn_percent_of_attack_damage?: number;
    blind_duration_turns?: number;
    pass_through_objects_duration_turns?: number;
    disrupt_chance_percent?: number;
    mislead_chance_percent?: number;
    room_effect_duration_turns?: number;
    effect_strength_multiplier?: number;
    reflect_chance_percent?: number;
    storage_duration_turns?: number;
    mana_cost_multiplier?: number;
    copied_spell_power_reduction_percent?: number;
    interrupt_chance_percent?: number;
    ability_learn_chance_percent?: number;
    max_abilities_learned?: number;
    damage_type?: string; // e.g., "mental", "physical"
    damage_amount?: number; // Direct damage from an ability
    ability_disable_duration_turns?: number;
    number_of_abilities_locked?: number;
    spell_destroy_chance_percent?: number;
    power_gain_per_spell_level?: number;
    split_health_threshold_percent?: number;
    number_of_splits?: number;
    spawn_health_percent_of_original?: number;
    spawn_damage_percent_of_original?: number;
    hazard_duration_turns?: number;
    hazard_damage_per_turn?: number;
    hazard_type?: string;
    heal_amount_percent_per_turn_environment?: number;
    power_gain_per_turn_environment?: number;
    explode_chance_percent_on_hit?: number;
    explode_damage_amount?: number;
    form_change_chance_percent_on_hit?: number;
    target_reduction_percent?: number;
    physical_defense_bonus_percent?: number;
    bonus_damage_multiplier_to_immobilized?: number;
    armor_reduction_percent_per_hit?: number;
    object_corrosion_chance_percent?: number;
    poison_damage_per_turn?: number; // Direct poison amount
    copy_spawn_chance_percent?: number;
    copy_health_percent_of_original?: number;
    copy_damage_percent_of_original?: number;
    spread_chance_percent?: number;
    spread_radius?: number;
    debuff_strength_multiplier?: number;
    spell_target_reduction_percent?: number;
    weak_spot_damage_multiplier?: number;
    core_reveal_chance_percent?: number;
    lure_chance_percent?: number;
    containment_difficulty_multiplier?: number;
    size_multiplier?: number;
    movement_disabled?: boolean;
    max_traps?: number;
    trap_effect_type?: string;
    trap_effect_value?: number;
    extra_actions_count?: number;
    attract_radius?: number;
    lure_duration_turns?: number;
    sleep_duration_turns?: number;
    movement_speed_bonus_underground?: number;
    disease_effect_type?: string;
    disease_strength_percent?: number;
    heal_amount_percent_per_turn_sunlight?: number;
    damage_reduction_for_allies_percent?: number;
    limb_regrowth_time_turns?: number;
    knockdown_duration_turns?: number;
    poison_damage_amount?: number; // Direct poison amount from ability
    hindrance_strength_percent?: number;
    heal_per_turn_percent_of_max_health_for_allies?: number;
    explosion_damage_amount?: number;
    explosion_radius?: number;
    vision_obscure_percent?: number;
    terrain_change_type?: string;
    terrain_bonus_for_monster_percent?: number;
    heal_amount_percent_per_turn_overgrown_area?: number;
    movement_speed_bonus_percent?: number; // General speed increase
    debuff_duration_reduction_percent?: number;
    decay_damage_per_turn?: number; // Direct decay amount
    number_of_spores?: number;
    spore_health_percent_of_caster?: number;
    spore_damage_percent_of_caster?: number;
    heal_amount_percent_from_defeated_enemies?: number;
    power_gain_from_defeated_enemies_multiplier?: number;
    fungal_growth_rate_multiplier?: number;
    mana_cost_per_turn?: number; // For ongoing mana drain
    accuracy_reduction_percent?: number;
    focus_reduction_percent?: number;
    control_duration_turns?: number;
    rebirth_chance_percent?: number;
    spore_creature_health_percent_of_original?: number;
    dodge_chance_percent_side_attacks?: number;
    attack_frequency_increase_percent?: number;
    critical_hit_chance_percent?: number;
    critical_hit_damage_multiplier?: number;
    bonus_damage_multiplier_from_above?: number;
    damage_bonus_per_ally_percent?: number;
    defense_bonus_per_ally_percent?: number;
    max_bonus_allies?: number;
    magic_barrier_break_chance_percent?: number;
    cooldown_turns_reduction?: number;
    lightning_damage_bonus_percent?: number;
    pacify_chance_percent?: number;
    minion_buff_strength_percent?: number;
    ranged_damage_reduction_percent?: number;
    bonus_damage_multiplier_to_isolated_targets?: number;
    stamina_cost_reduction_percent?: number;
    armor_reduction_per_hit_percent?: number;
    new_area_coverage_bonus?: number;
    ally_buff_strength_percent?: number;
    detection_range_tiles?: number;
    detect_hidden_chance_percent?: number;
    escape_chance_percent?: number;
    movement_speed_bonus_on_retreat_percent?: number;
    number_of_minions?: number;
    minion_health_percent_of_caster?: number;
    minion_damage_percent_of_caster?: number;
    insect_ally_buff_strength_percent?: number;
    information_sharing_bonus_percent?: number;
    ally_coordination_bonus_percent?: number;
    number_of_soldiers?: number;
    soldier_health_percent_of_caster?: number;
    soldier_damage_percent_of_caster?: number;
    dodge_chance_increase_percent?: number;
    action_frequency_increase_percent?: number;
    hit_chance_reduction_percent_for_enemies?: number;
    vision_range_in_darkness_tiles?: number;
    spell_casting_prevention_chance_percent?: number;
    magic_barrier_destroy_chance_percent?: number;
    life_steal_amount_percent_of_damage?: number;
    mana_steal_amount_percent_of_damage?: number;
    darkness_duration_turns?: number;
    invisibility_duration_in_darkness_turns?: number;
    number_of_clones?: number;
    clone_health_percent_of_caster?: number;
    clone_damage_percent_of_caster?: number;
    heal_amount_percent_on_kill?: number;
    damage_reduction_percent?: number; // General damage reduction
    avoid_attack_chance_percent?: number;
    illusion_spawn_chance_percent?: number;
    distraction_strength_percent?: number;
    bat_buff_strength_percent?: number;
    heal_amount_percent_per_turn_over_blood?: number;
    movement_type?: string; // "flying", "climbing"
    grab_resist_chance_percent?: number;
    hold_resist_chance_percent?: number;
    petrify_chance_percent?: number;
    petrify_duration_turns?: number;
    enemies_hit?: number; // For multi-target abilities
    fire_damage_reduction_percent?: number;
    burn_damage_per_turn?: number; // Direct burn amount
    bonus_critical_damage_multiplier?: number;
    freeze_duration_turns?: number;
    attack_bonus_percent?: number; // General attack bonus
    health_bonus_percent?: number; // General health bonus
    movement_speed_bonus_on_chase_percent?: number;
    disease_spread_chance_percent?: number;
    mana_gain_from_defeated_enemies_percent?: number;
    attacks_per_turn_bonus?: number;
    immune_to_fear?: boolean;
    trail_duration_turns?: number;
    number_of_undead_raised?: number;
    undead_health_percent_of_original?: number;
    undead_damage_percent_of_original?: number;
    disease_damage_amount?: number; // Direct disease amount
    life_drain_amount_percent_of_target_health?: number;
    mana_drain_amount_percent_of_target_mana?: number;
    alert_radius?: number;
    buff_duration_turns?: number;
    buff_strength_percent?: number;
    track_effectiveness_percent?: number;
    canine_ally_buff_strength_percent?: number;
}

/**
 * Represents the entire collection of trait data.
 */
interface TraitData {
    [key: string]: TraitProperties;
}

/**
 * Represents an active, temporary effect applied to a monster.
 */
interface ActiveEffect {
    traitName: string; // The name of the trait causing this effect (e.g., "Stun")
    durationRemaining: number; // How many turns the effect has left
    effectProperties: TraitProperties; // A copy of the trait's properties for easy reference
    // You might also add:
    // sourceMonsterId?: string; // Who applied the effect
    // originalValue?: any; // If the effect changes a stat temporarily, store its original value here
}

/**
 * Represents a single monster in the game.
 * Includes base stats and a way to manage active and passive traits.
 */
class Monster {
    id: string;
    name: string;
    // Base stats (these are what the monster starts with)
    baseHealth: number;
    baseMana: number;
    baseAttack: number;
    baseDefense: number;
    baseSpeed: number;

    // Current effective stats (calculated from base stats + traits + active effects)
    health: number;
    maxHealth: number;
    mana: number;
    maxMana: number;
    attack: number;
    defense: number;
    speed: number;

    activeEffects: ActiveEffect[] = [];
    permanentPassiveTraits: TraitProperties[] = []; // Traits that always apply and don't expire
    availableAbilities: TraitProperties[] = []; // Active abilities the monster can use

    constructor(id: string, name: string, baseStats: any, allTraits: TraitProperties[]) {
        this.id = id;
        this.name = name;
        this.baseHealth = baseStats.health;
        this.baseMana = baseStats.mana;
        this.baseAttack = baseStats.attack;
        this.baseDefense = baseStats.defense;
        this.baseSpeed = baseStats.speed;

        // Initialize current stats with base stats
        this.health = this.baseHealth;
        this.maxHealth = this.baseHealth;
        this.mana = this.baseMana;
        this.maxMana = this.baseMana;
        this.attack = this.baseAttack;
        this.defense = this.baseDefense;
        this.speed = this.baseSpeed;

        // Separate traits into categories for easier management
        allTraits.forEach(trait => {
            if (trait.applies_to === "monster") { // Only consider traits applicable to this monster
                if (trait.trait_type === "passive_effect" && (trait.duration_turns === -1 || trait.duration_turns === undefined)) {
                    this.permanentPassiveTraits.push(trait);
                    this.applyImmediateEffects(trait); // Apply permanent passive stat changes immediately
                } else if (trait.trait_type === "active_ability") {
                    this.availableAbilities.push(trait);
                }
                // Other passive effects with durations will be handled when "applied"
            }
        });
    }

    /**
     * Applies a trait's effect to this monster.
     * Can be used for temporary debuffs/buffs or immediate passive effects.
     */
    applyTraitEffect(trait: TraitProperties, sourceMonster?: Monster) {
        // Handle immediate effects that don't have a duration or are instant
        if (trait.duration_turns === undefined || trait.duration_turns === 0) {
            this.applyImmediateEffects(trait);
            return;
        }

        // Check if an existing effect of this type is already active
        const existingEffectIndex = this.activeEffects.findIndex(
            (effect) => effect.effectProperties.description === trait.description
        );

        if (existingEffectIndex !== -1) {
            // Update duration or stack if the trait allows
            this.activeEffects[existingEffectIndex].durationRemaining = trait.duration_turns;
            console.log(`${this.name} refreshes ${trait.description}. Duration: ${trait.duration_turns}`);
        } else {
            // Add as a new active effect
            this.activeEffects.push({
                traitName: trait.description,
                durationRemaining: trait.duration_turns,
                effectProperties: trait,
            });
            console.log(`${this.name} gained active effect: ${trait.description} for ${trait.duration_turns} turns.`);
            this.applyImmediateEffects(trait); // Apply initial stat changes for temporary effects
        }
    }

    /**
     * Applies immediate, non-duration-based effects of a trait.
     * This will directly modify the monster's current stats.
     */
    applyImmediateEffects(trait: TraitProperties) {
        // This method should apply immediate stat modifications.
        // For temporary effects, these changes need to be reverted when the effect ends.
        // For simplicity, this example directly modifies current stats.
        // In a real game, you'd use a system to track stat modifiers.

        if (trait.attack_bonus_percent) {
            this.attack *= (1 + trait.attack_bonus_percent / 100);
            console.log(`  -> ${this.name} Attack +${trait.attack_bonus_percent}%`);
        }
        if (trait.defense_bonus_percent) {
            this.defense *= (1 + trait.defense_bonus_percent / 100);
            console.log(`  -> ${this.name} Defense +${trait.defense_bonus_percent}%`);
        }
        if (trait.health_bonus_percent) {
            this.maxHealth *= (1 + trait.health_bonus_percent / 100);
            this.health = Math.min(this.health, this.maxHealth); // Cap health at new max
            console.log(`  -> ${this.name} Max Health +${trait.health_bonus_percent}%`);
        }
        if (trait.movement_speed_bonus_percent) {
            this.speed *= (1 + trait.movement_speed_bonus_percent / 100);
            console.log(`  -> ${this.name} Speed +${trait.movement_speed_bonus_percent}%`);
        }
        if (trait.damage_reduction_percent) {
            // This would typically be applied in the takeDamage method
            console.log(`  -> ${this.name} Damage Reduction +${trait.damage_reduction_percent}%`);
        }
        // ... add more immediate effects
    }

    /**
     * Recalculates all current stats based on base stats, permanent traits, and active effects.
     * This is crucial to ensure stats are correct after effects expire.
     */
    recalculateStats() {
        // Reset to base stats first
        this.health = Math.min(this.health, this.baseHealth); // Don't heal if current is higher than base
        this.maxHealth = this.baseHealth;
        this.mana = Math.min(this.mana, this.baseMana);
        this.maxMana = this.baseMana;
        this.attack = this.baseAttack;
        this.defense = this.baseDefense;
        this.speed = this.baseSpeed;

        // Apply permanent passive traits
        this.permanentPassiveTraits.forEach(trait => {
            this.applyImmediateEffects(trait); // This will re-apply the bonuses
        });

        // Apply active effects that modify stats (only if they have a duration)
        this.activeEffects.forEach(effect => {
            if (effect.durationRemaining !== -1) { // Only apply if it's a temporary effect that modifies stats
                this.applyImmediateEffects(effect.effectProperties);
            }
        });
        // Note: For complex interactions (e.g., multiplicative vs additive bonuses),
        // a more sophisticated stat modifier system would be needed.
    }


    /**
     * Updates all active effects on this monster.
     * Applies per-turn effects and decrements durations.
     */
    updateEffects() {
        const effectsToRemove: ActiveEffect[] = [];
        this.activeEffects.forEach(effect => {
            // Apply ongoing effects (Damage Over Time, Heal Over Time, Mana Cost Per Turn etc.)
            if (effect.effectProperties.damage_per_turn) {
                this.health -= effect.effectProperties.damage_per_turn;
                console.log(`  -> ${this.name} takes ${effect.effectProperties.damage_per_turn} damage from ${effect.traitName}. Health: ${this.health.toFixed(2)}`);
            }
            if (effect.effectProperties.poison_damage_per_turn) {
                this.health -= effect.effectProperties.poison_damage_per_turn;
                console.log(`  -> ${this.name} takes ${effect.effectProperties.poison_damage_per_turn} poison damage from ${effect.traitName}. Health: ${this.health.toFixed(2)}`);
            }
            if (effect.effectProperties.decay_damage_per_turn) {
                this.health -= effect.effectProperties.decay_damage_per_turn;
                console.log(`  -> ${this.name} takes ${effect.effectProperties.decay_damage_per_turn} decay damage from ${effect.traitName}. Health: ${this.health.toFixed(2)}`);
            }
            if (effect.effectProperties.burn_damage_per_turn) {
                this.health -= effect.effectProperties.burn_damage_per_turn;
                console.log(`  -> ${this.name} takes ${effect.effectProperties.burn_damage_per_turn} burn damage from ${effect.traitName}. Health: ${this.health.toFixed(2)}`);
            }
            if (effect.effectProperties.heal_per_turn_percent_of_max_health) {
                this.health += this.maxHealth * (effect.effectProperties.heal_per_turn_percent_of_max_health / 100);
                this.health = Math.min(this.health, this.maxHealth);
                console.log(`  -> ${this.name} heals ${effect.effectProperties.heal_per_turn_percent_of_max_health}% from ${effect.traitName}. Health: ${this.health.toFixed(2)}`);
            }
            if (effect.effectProperties.heal_amount_percent_per_turn_environment) {
                // Assuming "environment" is present or specific condition met
                this.health += this.maxHealth * (effect.effectProperties.heal_amount_percent_per_turn_environment / 100);
                this.health = Math.min(this.health, this.maxHealth);
                console.log(`  -> ${this.name} heals ${effect.effectProperties.heal_amount_percent_per_turn_environment}% from environment due to ${effect.traitName}. Health: ${this.health.toFixed(2)}`);
            }
            if (effect.effectProperties.mana_cost_per_turn) {
                this.mana -= effect.effectProperties.mana_cost_per_turn;
                this.mana = Math.max(0, this.mana);
                console.log(`  -> ${this.name} loses ${effect.effectProperties.mana_cost_per_turn} mana from ${effect.traitName}. Mana: ${this.mana.toFixed(2)}`);
            }


            // Decrement duration if not permanent (-1)
            if (effect.durationRemaining > 0) {
                effect.durationRemaining--;
            }

            // Mark for removal if duration is 0
            if (effect.durationRemaining === 0) {
                effectsToRemove.push(effect);
                console.log(`  -> ${this.name}'s ${effect.traitName} effect ended.`);
            }
        });

        // Remove expired effects
        this.activeEffects = this.activeEffects.filter(effect => !effectsToRemove.includes(effect));

        // Recalculate stats after effects have been updated and potentially removed
        this.recalculateStats();

        // Check for defeat after applying all per-turn effects
        if (this.health <= 0) {
            this.health = 0; // Ensure health doesn't go negative for display
            console.log(`${this.name} was defeated by ongoing effects!`);
            this.handleDefeat(); // Handle death triggers
        }
    }


    /**
     * Calculates and applies damage taken, considering resistances and vulnerabilities.
     */
    takeDamage(amount: number) {
        let finalDamage = amount;

        // Apply general damage reduction from traits like 'Resilient' or 'Resist Pain'
        const damageReductionTrait = this.permanentPassiveTraits.find(t => t.description === "Resilient" || t.description === "Resist Pain");
        if (damageReductionTrait && damageReductionTrait.damage_reduction_percent) {
            finalDamage *= (1 - damageReductionTrait.damage_reduction_percent / 100);
        }

        // Apply specific resistances (e.g., 'Spell Resistance', 'Heat Resistance')
        // This would need to know the damage type. For simplicity, let's assume it's general.
        // Example: If damage had a 'type' property (e.g., { amount: 50, type: "fire" })
        // if (damage.type === "fire") {
        //     const fireResist = this.permanentPassiveTraits.find(t => t.description === "Heat Resistance");
        //     if (fireResist && fireResist.fire_damage_reduction_percent) {
        //         finalDamage *= (1 - fireResist.fire_damage_reduction_percent / 100);
        //     }
        // }


        // Apply vulnerabilities (e.g., 'Frail', 'Flammable')
        const frailTrait = this.permanentPassiveTraits.find(t => t.description === "Frail");
        if (frailTrait && frailTrait.damage_taken_multiplier) {
            finalDamage *= frailTrait.damage_taken_multiplier;
        }

        this.health -= finalDamage;
        console.log(`${this.name} took ${finalDamage.toFixed(2)} damage. Remaining health: ${this.health.toFixed(2)}`);

        if (this.health <= 0) {
            this.health = 0;
            console.log(`${this.name} has been defeated!`);
            this.handleDefeat();
        }
    }

    /**
     * Handles what happens when a monster is defeated.
     * Checks for revive traits or on-death effects.
     */
    handleDefeat() {
        // --- Revive Mechanics ---
        const undyingTrait = this.permanentPassiveTraits.find(t => t.description === "Undying");
        if (undyingTrait && undyingTrait.revive_chance_percent && Math.random() * 100 < undyingTrait.revive_chance_percent) {
            this.health = this.maxHealth * (undyingTrait.revive_health_percent! / 100);
            console.log(`${this.name} revives with ${this.health.toFixed(2)} health due to Undying!`);
            return; // Monster is no longer defeated
        }

        const sporeRebirthTrait = this.permanentPassiveTraits.find(t => t.description === "Spore Rebirth");
        if (sporeRebirthTrait && sporeRebirthTrait.rebirth_chance_percent && Math.random() * 100 < sporeRebirthTrait.rebirth_chance_percent) {
            // In a real game, this would spawn a new 'spore creature' monster.
            // For this simulation, we'll just log it.
            console.log(`${this.name} undergoes spore rebirth and transforms!`);
            // You would typically remove this monster instance and add a new "spore creature" monster to the combat simulation.
            return; // Monster transforms, might still be considered "alive" in a new form
        }

        // --- On-Death Effects ---
        const explodeOnDeathTrait = this.permanentPassiveTraits.find(t => t.description === "Explode on Death");
        if (explodeOnDeathTrait && explodeOnDeathTrait.explosion_damage_amount && explodeOnDeathTrait.explosion_radius) {
            console.log(`${this.name} explodes on death, dealing ${explodeOnDeathTrait.explosion_damage_amount} damage in radius ${explodeOnDeathTrait.explosion_radius} to nearby enemies!`);
            // In a full game, you'd trigger an area damage event here.
        }

        const splitOnDeathTrait = this.permanentPassiveTraits.find(t => t.description === "Split on Death");
        if (splitOnDeathTrait && splitOnDeathTrait.number_of_splits) {
            console.log(`${this.name} splits into ${splitOnDeathTrait.number_of_splits} smaller versions on death!`);
            // In a full game, you'd add new monster instances to the combat simulation here.
        }

        // Other "on-death" effects (e.g., Absorb Corpse, if it applies to the killer)
        // Would typically be handled by an event system or by the killer's logic.
    }

    /**
     * Uses an active ability (trait) if available and mana allows.
     */
    useAbility(traitName: string, targetMonster?: Monster, allMonsters: Monster[] = []) {
        const trait = this.availableAbilities.find(t => t.description === traitName);
        if (!trait) {
            console.warn(`${this.name} does not have active ability: ${traitName}`);
            return false;
        }

        if (this.mana < (trait.mana_cost || 0)) {
            console.log(`${this.name} does not have enough mana (${this.mana}) for ${traitName} (cost: ${trait.mana_cost || 0}).`);
            return false;
        }
        // In a full game, you'd also check cooldowns here.

        this.mana -= (trait.mana_cost || 0);
        console.log(`${this.name} uses ${trait.description}. Mana remaining: ${this.mana.toFixed(2)}`);

        // --- Ability Execution Logic (Simplified) ---
        // This is where you would implement the specific effects of each ability.
        // The `target_type` and other trait properties guide this logic.

        const randomRoll = Math.random() * 100; // For chance-based effects

        switch (trait.target_type) {
            case "enemy":
                if (targetMonster) {
                    if (trait.bonus_damage_multiplier) {
                        const damageDealt = this.attack * trait.bonus_damage_multiplier;
                        targetMonster.takeDamage(damageDealt);
                        console.log(`  -> Deals ${damageDealt.toFixed(2)} bonus damage to ${targetMonster.name}.`);
                    }
                    if (trait.stun_duration_turns && trait.chance_percent && randomRoll < trait.chance_percent) {
                        targetMonster.applyTraitEffect({ ...trait, description: `Stunned by ${this.name}'s ${trait.description}` }, this);
                        console.log(`  -> ${targetMonster.name} is stunned for ${trait.stun_duration_turns} turns.`);
                    }
                    if (trait.poison_damage_per_turn_percent_of_attack_damage && trait.chance_percent && randomRoll < trait.chance_percent) {
                        // For DoT, create a temporary effect with relevant properties
                        const poisonEffect: TraitProperties = {
                            ...trait,
                            description: `Poisoned by ${this.name}'s ${trait.description}`,
                            damage_per_turn: this.attack * trait.poison_damage_per_turn_percent_of_attack_damage, // Calculate actual damage
                            duration_turns: trait.poison_duration_turns
                        };
                        targetMonster.applyTraitEffect(poisonEffect, this);
                        console.log(`  -> ${targetMonster.name} is poisoned for ${trait.poison_duration_turns} turns.`);
                    }
                    // ... other single-target effects like Blind, Immobilize, Fear, etc.
                } else {
                    console.warn(`Ability '${trait.description}' requires a target, but none was provided.`);
                }
                break;

            case "area":
                const affectedTargets = allMonsters.filter(m => {
                    // Implement actual radius check for area abilities
                    // For simplicity, let's say it affects all enemies in the 'room' for now, if radius is -1
                    // Or a subset if radius is specified (randomly in this example)
                    const isEnemy = m.id !== this.id;
                    const isInRadius = trait.radius === -1 || (Math.random() < 0.7); // Placeholder for actual geometric check
                    return isEnemy && m.health > 0 && isInRadius;
                });

                affectedTargets.forEach(m => {
                    if (trait.damage_amount) {
                        m.takeDamage(trait.damage_amount);
                        console.log(`  -> ${m.name} takes ${trait.damage_amount} area damage.`);
                    }
                    if (trait.fear_duration_turns && trait.chance_percent && randomRoll < trait.chance_percent) {
                        m.applyTraitEffect({ ...trait, description: `Feared by ${this.name}'s ${trait.description}` }, this);
                        console.log(`  -> ${m.name} is feared for ${trait.fear_duration_turns} turns.`);
                    }
                    if (trait.stun_duration_turns && trait.chance_percent && randomRoll < trait.chance_percent) {
                        m.applyTraitEffect({ ...trait, description: `Stunned by ${this.name}'s ${trait.description}` }, this);
                        console.log(`  -> ${m.name} is stunned for ${trait.stun_duration_turns} turns.`);
                    }
                    // ... more area effects like Poison Cloud, Spore Storm, etc.
                });
                break;

            case "self":
                // Abilities that affect only the caster
                if (trait.heal_amount_percent) {
                    this.health += this.maxHealth * (trait.heal_amount_percent / 100);
                    this.health = Math.min(this.health, this.maxHealth);
                    console.log(`  -> ${this.name} heals for ${trait.heal_amount_percent}% (to ${this.health.toFixed(2)}).`);
                }
                if (trait.invulnerability_duration_turns) {
                    this.applyTraitEffect({ ...trait, description: `${this.name} is Invulnerable` });
                    console.log(`  -> ${this.name} becomes invulnerable for ${trait.invulnerability_duration_turns} turn(s).`);
                }
                // ... more self-buffs like Dust Cloak, Speed Burst
                break;

            case "allies":
                const nearbyAllies = allMonsters.filter(m => {
                    // Assuming allies are monsters of the same "faction" or within radius
                    const isAlly = m.id !== this.id; // Simplified: just not self
                    const isInRadius = trait.radius === -1 || (Math.random() < 0.7); // Placeholder
                    return isAlly && m.health > 0 && isInRadius;
                });
                nearbyAllies.forEach(ally => {
                    if (trait.ally_buff_strength_percent) {
                        const buffEffect: TraitProperties = {
                            ...trait,
                            description: `Buffed by ${this.name}'s ${trait.description}`,
                            attack_bonus_percent: trait.ally_buff_strength_percent, // Example
                            duration_turns: trait.duration_turns
                        };
                        ally.applyTraitEffect(buffEffect, this);
                        console.log(`  -> ${ally.name} receives buff from ${this.name}'s ${trait.description}.`);
                    }
                });
                break;

            case "corpse":
                // This would involve finding a defeated monster (corpse) in the environment
                // For simplicity, we'll just log the effect.
                console.log(`  -> ${this.name} attempts to ${trait.description} a nearby corpse.`);
                // In a real game, you'd add logic to identify and interact with 'corpse' entities.
                // This might involve spawning new monsters or gaining resources.
                if (trait.number_of_undead_raised && trait.undead_health_percent_of_original) {
                    console.log(`  -> Raises ${trait.number_of_undead_raised} undead from the fallen.`);
                }
                break;

            // Add other target types as needed: 'environment', 'structure', 'room'
            default:
                console.warn(`Unhandled target type: ${trait.target_type} for trait: ${trait.description}`);
        }
        return true; // Ability successfully used
    }
}

/**
 * Main combat simulation class to manage turns and monsters.
 */
class CombatSimulation {
    monsters: Monster[] = [];
    currentTurn: number = 0;
    traitData: TraitData; // Holds all trait definitions from JSON

    constructor(traitData: TraitData) {
        this.traitData = traitData;
    }

    /**
     * Adds a monster to the simulation, applying its initial passive traits.
     */
    addMonster(monsterName: string, baseStats: any, traitNames: string[]) {
        const relevantTraits: TraitProperties[] = traitNames.map(tName => {
            const trait = this.traitData[tName];
            if (!trait) {
                console.warn(`Trait '${tName}' not found in provided traitData.`);
                return null;
            }
            return { ...trait, name: tName }; // Include trait name for easier debugging
        }).filter(t => t !== null) as TraitProperties[];

        const newMonster = new Monster(
            `monster-${this.monsters.length + 1}`,
            monsterName,
            baseStats,
            relevantTraits
        );
        this.monsters.push(newMonster);
        console.log(`Added monster: ${newMonster.name}`);
    }

    /**
     * Executes one turn of combat.
     * Returns true if combat is over (no enemies left).
     */
    runTurn(): boolean {
        this.currentTurn++;
        console.log(`\n--- Turn ${this.currentTurn} ---`);

        // Sort monsters by speed (or initiative) for turn order
        this.monsters.sort((a, b) => b.speed - a.speed);

        for (const monster of this.monsters) {
            if (monster.health <= 0) {
                continue; // Skip defeated monsters
            }
            console.log(`\n${monster.name}'s turn (HP: ${monster.health.toFixed(2)}, Mana: ${monster.mana.toFixed(2)}, Speed: ${monster.speed.toFixed(2)})`);

            // 1. Update active effects (DoT, HoT, debuffs expire, etc.)
            monster.updateEffects();
            if (monster.health <= 0) { // Check if monster was defeated by its own effects
                continue;
            }

            // 2. Monster takes action (simplified AI: attack random enemy or use ability)
            const aliveEnemies = this.monsters.filter(m => m.id !== monster.id && m.health > 0);
            if (aliveEnemies.length > 0) {
                const target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
                console.log(`${monster.name} considers targeting ${target.name}.`);

                let abilityUsed = false;
                // Simplified AI: Try to use the first active ability if enough mana
                if (monster.availableAbilities.length > 0) {
                    const chosenAbility = monster.availableAbilities[0]; // Just pick the first one
                    if (monster.mana >= (chosenAbility.mana_cost || 0)) {
                        abilityUsed = monster.useAbility(chosenAbility.description, target, this.monsters);
                    }
                }

                if (!abilityUsed) {
                    // If no ability was used, perform a basic attack
                    target.takeDamage(monster.attack);
                    console.log(`${monster.name} performs a basic attack on ${target.name}.`);
                }

            } else {
                console.log(`${monster.name} has no valid targets.`);
            }
        }

        // Remove truly defeated monsters at the end of the turn
        // (Monsters that revived or transformed should still be in the list)
        this.monsters = this.monsters.filter(m => m.health > 0);

        // Determine if combat is over (e.g., all player-controlled entities defeated, or all enemies defeated)
        // For this example, if there are no monsters left, combat is over.
        if (this.monsters.length === 0) {
            console.log("\nAll entities defeated! Combat Over.");
            return true;
        }

        return false; // Combat continues
    }
}

// --- Sample Usage with your data ---

// The JSON data you provided (parsed into a JavaScript object)
const monsterTraitsData: TraitData = {
  "Ambush": {
    "description": "Attacks from hiding for bonus damage or surprise.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 0,
    "cooldown_turns": 5,
    "bonus_damage_multiplier": 1.5,
    "surprise_chance_percent": 75,
    "upgrade_potential": true
  },
  "Sticky": {
    "description": "Slows or immobilizes targets on contact.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "slow_duration_turns": 2,
    "slow_amount_percent": 30,
    "immobilize_chance_percent": 15,
    "immobilize_duration_turns": 1,
    "upgrade_potential": true
  },
  "Slow": {
    "description": "Reduced movement speed or attack frequency.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "movement_speed_reduction_percent": 20,
    "attack_speed_reduction_percent": 10,
    "duration_turns": 3,
    "upgrade_potential": true
  },
  "Latch": {
    "description": "Can attach to objects or enemies, preventing escape.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 15,
    "cooldown_turns": 4,
    "immobilize_duration_turns": 3,
    "damage_per_turn": 5,
    "upgrade_potential": true
  },
  "Scavenge": {
    "description": "Gains resources or heals from defeated enemies.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "heal_amount_percent": 10,
    "resource_gain_multiplier": 1.2,
    "upgrade_potential": true
  },
  "Blend In": {
    "description": "Harder to detect; camouflages with environment.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "detection_reduction_percent": 30,
    "camouflage_effectiveness_percent": 50,
    "upgrade_potential": true
  },
  "Jump Attack": {
    "description": "Can leap to attack distant targets.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 10,
    "cooldown_turns": 3,
    "bonus_damage_multiplier": 1.3,
    "range": 3,
    "upgrade_potential": true
  },
  "Surprise": {
    "description": "First attack in combat deals extra damage.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "bonus_damage_multiplier": 1.4,
    "surprise_chance_percent": 100,
    "upgrade_potential": true
  },
  "Swallow": {
    "description": "Can consume and trap smaller enemies.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 25,
    "cooldown_turns": 6,
    "trap_duration_turns": 2,
    "max_enemy_size_tier": 1,
    "upgrade_potential": true
  },
  "Stun": {
    "description": "Chance to temporarily disable targets.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "stun_duration_turns": 1,
    "chance_percent": 20,
    "upgrade_potential": true
  },
  "Intimidating": {
    "description": "Reduces enemy morale or chance to attack.",
    "trait_type": "passive_effect",
    "target_type": "area",
    "applies_to": "monster",
    "morale_reduction_percent": 10,
    "attack_chance_reduction_percent": 5,
    "radius": 2,
    "duration_turns": -1,
    "upgrade_potential": true
  },
  "Constrict": {
    "description": "Restricts movement of multiple targets.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 20,
    "cooldown_turns": 5,
    "damage_per_turn": 8,
    "immobilize_duration_turns": 2,
    "targets_affected": 2,
    "upgrade_potential": true
  },
  "Terrify": {
    "description": "Causes fear, making enemies flee or act erratically.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 30,
    "cooldown_turns": 8,
    "fear_duration_turns": 3,
    "flee_chance_percent": 40,
    "erratic_action_chance_percent": 60,
    "radius": 3,
    "upgrade_potential": true
  },
  "Camouflage": {
    "description": "Invisible or disguised until attacking. (Also: Blends in with environment.)",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "detection_reduction_percent": 50,
    "invisibility_duration_turns": -1,
    "upgrade_potential": true
  },
  "Reflect": {
    "description": "Returns a portion of damage to attacker.",
    "trait_type": "active_ability",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost": 20,
    "cooldown_turns": 6,
    "damage_reflection_percent": 25,
    "duration_turns": 2,
    "upgrade_potential": true
  },
  "Illusion": {
    "description": "Creates false images to confuse enemies.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 15,
    "cooldown_turns": 5,
    "illusion_duration_turns": 4,
    "confusion_chance_percent": 50,
    "number_of_illusions": 2,
    "upgrade_potential": true
  },
  "Teleport": {
    "description": "Can blink short distances.",
    "trait_type": "active_ability",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost": 10,
    "cooldown_turns": 2,
    "range_tiles": 5,
    "upgrade_potential": true
  },
  "Summon Mini-Mimics": {
    "description": "Spawns smaller mimic allies during combat.",
    "trait_type": "active_ability",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost": 30,
    "cooldown_turns": 10,
    "number_of_mimics": 1,
    "mimic_health_percent_of_caster": 30,
    "mimic_damage_percent_of_caster": 50,
    "upgrade_potential": true
  },
  "Shared Health": {
    "description": "Distributes damage among group members.",
    "trait_type": "passive_effect",
    "target_type": "allies",
    "applies_to": "monster",
    "damage_distribution_percent": 50,
    "radius": 3,
    "duration_turns": -1,
    "upgrade_potential": true
  },
  "Sticky Floor": {
    "description": "Slows all enemies in the room.",
    "trait_type": "environmental_effect",
    "target_type": "area",
    "applies_to": "room_theme",
    "slow_amount_percent": 25,
    "duration_turns": -1,
    "area_of_effect_radius": -1,
    "upgrade_potential": true
  },
  "Spell Mimicry": {
    "description": "Can copy and use a spell seen in battle.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost_multiplier_for_copied_spell": 1.5,
    "cooldown_multiplier_for_copied_spell": 1.5,
    "max_spells_stored": 1,
    "upgrade_potential": true
  },
  "Consume Magic": {
    "description": "Absorbs magical effects for healing or power.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "mana_absorption_percent": 30,
    "heal_from_mana_percent": 50,
    "power_gain_per_mana": 0.5,
    "upgrade_potential": true
  },
  "Fake Casting": {
    "description": "Pretends to cast spells to bait reactions.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 5,
    "cooldown_turns": 2,
    "debuff_on_enemy_chance_percent": 70,
    "duration_turns": 1,
    "upgrade_potential": true
  },
  "True Mimicry": {
    "description": "Can perfectly imitate large objects or rooms.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "mimicry_effectiveness_percent": 90,
    "cooldown_turns": 15,
    "upgrade_potential": true
  },
  "Devour": {
    "description": "Deals massive damage and heals self on kill.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 30,
    "cooldown_turns": 7,
    "bonus_damage_multiplier": 2.0,
    "heal_on_kill_percent": 30,
    "upgrade_potential": true
  },
  "Reflect Damage": {
    "description": "Returns all or most damage to attacker.",
    "trait_type": "active_ability",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost": 25,
    "cooldown_turns": 8,
    "damage_reflection_percent": 75,
    "duration_turns": 1,
    "upgrade_potential": true
  },
  "Terrifying Presence": {
    "description": "Reduces effectiveness of all enemies in room.",
    "trait_type": "passive_effect",
    "target_type": "area",
    "applies_to": "monster",
    "enemy_effectiveness_reduction_percent": 15,
    "radius": 4,
    "duration_turns": -1,
    "upgrade_potential": true
  },
  "Spell Resistance": {
    "description": "Takes less damage from spells.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "magic_damage_reduction_percent": 25,
    "upgrade_potential": true
  },
  "Flammable": {
    "description": "Takes extra damage from fire, but can ignite enemies.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "fire_damage_multiplier": 1.5,
    "ignite_chance_percent": 30,
    "ignite_duration_turns": 2,
    "upgrade_potential": true
  },
  "Illuminating": {
    "description": "Emits light, revealing hidden objects or enemies.",
    "trait_type": "passive_effect",
    "target_type": "area",
    "applies_to": "monster",
    "light_radius_tiles": 5,
    "reveal_hidden_duration_turns": -1,
    "upgrade_potential": false
  },
  "Spell Trap": {
    "description": "Triggers magical effects when tampered with.",
    "trait_type": "environmental_effect",
    "target_type": "area",
    "applies_to": "room_theme",
    "trigger_chance_percent": 100,
    "triggered_effect_type": "damage",
    "triggered_effect_value": 30,
    "upgrade_potential": true
  },
  "Burn": {
    "description": "Attacks ignite enemies.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "burn_damage_per_turn_percent_of_attack_damage": 0.1,
    "burn_duration_turns": 3,
    "chance_percent": 30,
    "upgrade_potential": true
  },
  "Paper Thin": {
    "description": "Very low defense, but hard to hit.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "defense_reduction_percent": 50,
    "evasion_increase_percent": 30,
    "upgrade_potential": false
  },
  "Poison Ink": {
    "description": "Attacks can poison or blind.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "poison_damage_per_turn_percent_of_attack_damage": 0.05,
    "poison_duration_turns": 4,
    "blind_duration_turns": 2,
    "chance_percent": 25,
    "upgrade_potential": true
  },
  "Grip": {
    "description": "Can hold objects or enemies in place.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 10,
    "cooldown_turns": 3,
    "immobilize_duration_turns": 2,
    "upgrade_potential": true
  },
  "Shadow Form": {
    "description": "Can pass through shadows or become intangible.",
    "trait_type": "active_ability",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost": 20,
    "cooldown_turns": 6,
    "intangibility_duration_turns": 1,
    "pass_through_objects_duration_turns": 1,
    "upgrade_potential": true
  },
  "Teleport Short": {
    "description": "Can blink within the same room.",
    "trait_type": "active_ability",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost": 8,
    "cooldown_turns": 2,
    "range_tiles": 3,
    "upgrade_potential": true
  },
  "Fear Pulse": {
    "description": "Emits a wave of fear, disrupting enemies.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 25,
    "cooldown_turns": 7,
    "fear_duration_turns": 2,
    "disrupt_chance_percent": 50,
    "radius": 3,
    "upgrade_potential": true
  },
  "Create Illusion": {
    "description": "Generates false terrain or objects.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 15,
    "cooldown_turns": 5,
    "illusion_duration_turns": 5,
    "mislead_chance_percent": 60,
    "upgrade_potential": true
  },
  "Haunt Room": {
    "description": "Room effects persist after monster is gone.",
    "trait_type": "passive_effect",
    "target_type": "room",
    "applies_to": "monster",
    "room_effect_duration_turns": 5,
    "effect_strength_multiplier": 0.5,
    "upgrade_potential": true
  },
  "Spell Reflect": {
    "description": "Bounces spells back at caster.",
    "trait_type": "active_ability",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost": 20,
    "cooldown_turns": 6,
    "reflect_chance_percent": 40,
    "upgrade_potential": true
  },
  "Store Spells": {
    "description": "Can hold and later use absorbed spells.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "max_spells_stored": 3,
    "storage_duration_turns": -1,
    "upgrade_potential": true
  },
  "Cast Copy": {
    "description": "Casts a weaker version of a stored spell.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost_multiplier": 0.8,
    "copied_spell_power_reduction_percent": 30,
    "upgrade_potential": true
  },
  "Break Focus": {
    "description": "Interrupts spellcasters.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 10,
    "cooldown_turns": 3,
    "interrupt_chance_percent": 70,
    "upgrade_potential": true
  },
  "Absorb Knowledge": {
    "description": "Learns abilities from defeated spellcasters.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "ability_learn_chance_percent": 10,
    "max_abilities_learned": 1,
    "upgrade_potential": true
  },
  "Mental Assault": {
    "description": "Attacks target's mind, causing confusion.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 20,
    "cooldown_turns": 5,
    "confusion_duration_turns": 3,
    "damage_type": "mental",
    "damage_amount": 15,
    "chance_percent": 75,
    "upgrade_potential": true
  },
  "Memory Lock": {
    "description": "Prevents use of certain abilities.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 25,
    "cooldown_turns": 8,
    "ability_disable_duration_turns": 4,
    "number_of_abilities_locked": 1,
    "chance_percent": 60,
    "upgrade_potential": true
  },
  "Illusory Room": {
    "description": "Creates a fake room to trap or mislead.",
    "trait_type": "environmental_effect",
    "target_type": "room",
    "applies_to": "room_theme",
    "trap_duration_turns": 5,
    "mislead_chance_percent": 80,
    "upgrade_potential": true
  },
  "Devour Spell": {
    "description": "Destroys a spell and gains its power.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 30,
    "cooldown_turns": 10,
    "spell_destroy_chance_percent": 50,
    "power_gain_per_spell_level": 5,
    "upgrade_potential": true
  },
  "Split": {
    "description": "Divides into smaller versions when damaged.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "split_health_threshold_percent": 50,
    "number_of_splits": 1,
    "spawn_health_percent_of_original": 50,
    "spawn_damage_percent_of_original": 75,
    "upgrade_potential": true
  },
  "Trail": {
    "description": "Leaves hazardous terrain behind.",
    "trait_type": "passive_effect",
    "target_type": "area",
    "applies_to": "monster",
    "hazard_duration_turns": 3,
    "hazard_damage_per_turn": 5,
    "hazard_type": "poison",
    "upgrade_potential": true
  },
  "Absorb": {
    "description": "Gains health or power from environment.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "heal_amount_percent_per_turn_environment": 2,
    "power_gain_per_turn_environment": 1,
    "upgrade_potential": true
  },
  "Unstable": {
    "description": "May explode or change form when hit.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "explode_chance_percent_on_hit": 10,
    "explode_damage_amount": 20,
    "form_change_chance_percent_on_hit": 5,
    "upgrade_potential": true
  },
  "Low Profile": {
    "description": "Harder to target or hit.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "target_reduction_percent": 20,
    "hit_chance_reduction_percent": 15,
    "upgrade_potential": true
  },
  "Armor Shell": {
    "description": "High physical defense.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "physical_defense_bonus_percent": 30,
    "upgrade_potential": true
  },
  "Crushing Weight": {
    "description": "Deals extra damage to immobilized targets.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "bonus_damage_multiplier_to_immobilized": 1.5,
    "upgrade_potential": true
  },
  "Acidic": {
    "description": "Attacks corrode armor or objects.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "armor_reduction_percent_per_hit": 5,
    "object_corrosion_chance_percent": 20,
    "upgrade_potential": true
  },
  "Poison Cloud": {
    "description": "Emits a toxic cloud that damages over time.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 20,
    "cooldown_turns": 6,
    "poison_damage_per_turn": 10,
    "duration_turns": 4,
    "radius": 3,
    "chance_percent": 100,
    "upgrade_potential": true
  },
  "Multiply": {
    "description": "Can create copies of itself.",
    "trait_type": "active_ability",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost": 30,
    "cooldown_turns": 10,
    "copy_spawn_chance_percent": 50,
    "copy_health_percent_of_original": 60,
    "copy_damage_percent_of_original": 80,
    "upgrade_potential": true
  },
  "Contagion": {
    "description": "Spreads negative effects to others.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "spread_chance_percent": 40,
    "spread_radius": 1,
    "debuff_strength_multiplier": 0.8,
    "upgrade_potential": true
  },
  "Refract Light": {
    "description": "Harder to target with spells.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "spell_target_reduction_percent": 25,
    "upgrade_potential": true
  },
  "Magic Resistance": {
    "description": "Reduces magic damage taken.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "magic_damage_reduction_percent": 30,
    "upgrade_potential": true
  },
  "Fragile Core": {
    "description": "Weak spot that takes extra damage.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "weak_spot_damage_multiplier": 2.0,
    "core_reveal_chance_percent": 100,
    "upgrade_potential": false
  },
  "Mimic Voice": {
    "description": "Can imitate voices to lure or confuse.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 10,
    "cooldown_turns": 4,
    "lure_chance_percent": 60,
    "confusion_duration_turns": 2,
    "upgrade_potential": true
  },
  "Amorphous Giant": {
    "description": "Very large and hard to contain.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "size_multiplier": 2.0,
    "containment_difficulty_multiplier": 1.5,
    "upgrade_potential": false
  },
  "Split on Death": {
    "description": "Creates smaller versions when killed.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "number_of_splits": 2,
    "spawn_health_percent_of_original": 30,
    "spawn_damage_percent_of_original": 60,
    "upgrade_potential": true
  },
  "Reshape": {
    "description": "Can change form to fit through spaces.",
    "trait_type": "active_ability",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost": 10,
    "cooldown_turns": 3,
    "upgrade_potential": true
  },
  "Spell Absorb": {
    "description": "Heals or powers up from spells.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "mana_gain_per_spell_level": 5,
    "heal_per_spell_level": 3,
    "power_gain_per_spell_level": 2,
    "upgrade_potential": true
  },
  "Entangle": {
    "description": "Restricts enemy movement.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 15,
    "cooldown_turns": 4,
    "immobilize_duration_turns": 2,
    "damage_per_turn": 5,
    "chance_percent": 80,
    "upgrade_potential": true
  },
  "Regrowth": {
    "description": "Heals over time.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "heal_per_turn_percent_of_max_health": 5,
    "upgrade_potential": true
  },
  "Rooted": {
    "description": "Cannot move, but gains defense.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "movement_disabled": true,
    "defense_bonus_percent": 40,
    "upgrade_potential": true
  },
  "Multi-Grab": {
    "description": "Can grab multiple targets at once.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 25,
    "cooldown_turns": 6,
    "targets_affected": 2,
    "immobilize_duration_turns": 2,
    "upgrade_potential": true
  },
  "Trap Placement": {
    "description": "Can set traps in the room.",
    "trait_type": "active_ability",
    "target_type": "environment",
    "applies_to": "monster",
    "mana_cost": 15,
    "cooldown_turns": 5,
    "max_traps": 1,
    "trap_effect_type": "snare",
    "trap_effect_value": 2,
    "upgrade_potential": true
  },
  "Thorns": {
    "description": "Damages attackers on contact.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "damage_reflection_percent": 10,
    "upgrade_potential": true
  },
  "Poison": {
    "description": "Attacks inflict poison.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "poison_damage_per_turn_percent_of_attack_damage": 0.08,
    "poison_duration_turns": 3,
    "chance_percent": 30,
    "upgrade_potential": true
  },
  "Quick Burst": {
    "description": "Can act twice in quick succession.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "extra_actions_count": 1,
    "cooldown_turns": 4,
    "upgrade_potential": true
  },
  "Lure": {
    "description": "Attracts enemies to its location.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 10,
    "cooldown_turns": 5,
    "attract_radius": 4,
    "lure_duration_turns": 3,
    "upgrade_potential": true
  },
  "Sleep Spores": {
    "description": "Can put enemies to sleep.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 20,
    "cooldown_turns": 6,
    "sleep_duration_turns": 2,
    "chance_percent": 50,
    "radius": 2,
    "upgrade_potential": true
  },
  "Burrow": {
    "description": "Can move underground.",
    "trait_type": "active_ability",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost": 5,
    "cooldown_turns": 2,
    "movement_speed_bonus_underground": 1.5,
    "upgrade_potential": true
  },
  "Decay Aura": {
    "description": "Damages enemies over time nearby.",
    "trait_type": "passive_effect",
    "target_type": "area",
    "applies_to": "monster",
    "damage_per_turn_percent_of_enemy_health": 0.02,
    "radius": 2,
    "duration_turns": -1,
    "upgrade_potential": true
  },
  "Slow Regeneration": {
    "description": "Heals slowly over time.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "heal_per_turn_percent_of_max_health": 2,
    "upgrade_potential": true
  },
  "Disease": {
    "description": "Attacks weaken enemies.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "disease_effect_type": "strength_reduction",
    "disease_strength_percent": 10,
    "disease_duration_turns": 5,
    "chance_percent": 25,
    "upgrade_potential": true
  },
  "Ranged Vines": {
    "description": "Can attack from a distance.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "range_tiles": 4,
    "damage_multiplier": 0.8,
    "upgrade_potential": true
  },
  "Rapid Spread": {
    "description": "Can quickly cover an area.",
    "trait_type": "passive_effect",
    "target_type": "environment",
    "applies_to": "monster",
    "spread_rate_multiplier": 1.5,
    "area_coverage_bonus": 2,
    "upgrade_potential": true
  },
  "Piercing Roots": {
    "description": "Ignores some defenses.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "armor_penetration_percent": 20,
    "magic_resist_penetration_percent": 10,
    "upgrade_potential": true
  },
  "Photosynthesis": {
    "description": "Heals in sunlight or bright light.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "heal_amount_percent_per_turn_sunlight": 3,
    "upgrade_potential": true
  },
  "Guard Allies": {
    "description": "Protects nearby monsters.",
    "trait_type": "passive_effect",
    "target_type": "allies",
    "applies_to": "monster",
    "damage_reduction_for_allies_percent": 15,
    "radius": 2,
    "upgrade_potential": true
  },
  "Thick Hide": {
    "description": "High defense against physical attacks.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "physical_defense_bonus_percent": 25,
    "upgrade_potential": true
  },
  "Mass Entangle": {
    "description": "Can immobilize all enemies in a room.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 35,
    "cooldown_turns": 10,
    "immobilize_duration_turns": 3,
    "damage_per_turn": 5,
    "radius": -1,
    "upgrade_potential": true
  },
  "Regrow Limbs": {
    "description": "Heals lost parts over time.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "heal_amount_percent_per_turn": 8,
    "limb_regrowth_time_turns": 5,
    "upgrade_potential": true
  },
  "Rootquake": {
    "description": "Shakes the ground, knocking enemies down.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 30,
    "cooldown_turns": 8,
    "knockdown_duration_turns": 2,
    "stun_duration_turns": 1,
    "radius": 4,
    "upgrade_potential": true
  },
  "Poison Bloom": {
    "description": "Releases a burst of poison.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 25,
    "cooldown_turns": 7,
    "poison_damage_amount": 20,
    "poison_duration_turns": 3,
    "radius": 3,
    "upgrade_potential": true
  },
  "Fungal Bloom": {
    "description": "Spreads fungus that hinders enemies.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 20,
    "cooldown_turns": 6,
    "hindrance_strength_percent": 15,
    "duration_turns": 4,
    "radius": 3,
    "upgrade_potential": true
  },
  "Regen Spores": {
    "description": "Heals self and allies over time.",
    "trait_type": "passive_effect",
    "target_type": "area",
    "applies_to": "monster",
    "heal_per_turn_percent_of_max_health_for_allies": 3,
    "radius": 2,
    "duration_turns": -1,
    "upgrade_potential": true
  },
  "Tiny": {
    "description": "Very small, hard to hit.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "hit_chance_reduction_percent": 25,
    "evasion_bonus_percent": 15,
    "upgrade_potential": false
  },
  "Explode on Death": {
    "description": "Deals damage to nearby enemies when killed.",
    "trait_type": "passive_effect",
    "target_type": "area",
    "applies_to": "monster",
    "explosion_damage_amount": 30,
    "explosion_radius": 2,
    "upgrade_potential": true
  },
  "Gas Cloud": {
    "description": "Emits a cloud that obscures vision.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 15,
    "cooldown_turns": 5,
    "vision_obscure_percent": 50,
    "duration_turns": 3,
    "radius": 3,
    "upgrade_potential": true
  },
  "Spread Terrain": {
    "description": "Changes the terrain to its advantage.",
    "trait_type": "active_ability",
    "target_type": "environment",
    "applies_to": "monster",
    "mana_cost": 20,
    "cooldown_turns": 6,
    "terrain_change_type": "overgrowth",
    "terrain_bonus_for_monster_percent": 20,
    "duration_turns": 5,
    "upgrade_potential": true
  },
  "Heal Overgrowth": {
    "description": "Heals when in overgrown areas.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "heal_amount_percent_per_turn_overgrown_area": 4,
    "upgrade_potential": true
  },
  "Slow Aura": {
    "description": "Slows all enemies nearby.",
    "trait_type": "passive_effect",
    "target_type": "area",
    "applies_to": "monster",
    "movement_speed_reduction_percent": 15,
    "radius": 2,
    "duration_turns": -1,
    "upgrade_potential": true
  },
  "Debuff Resistance": {
    "description": "Less affected by negative effects.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "debuff_duration_reduction_percent": 25,
    "debuff_strength_reduction_percent": 20,
    "upgrade_potential": true
  },
  "Rotting Spore": {
    "description": "Spreads decay to enemies.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "decay_damage_per_turn": 5,
    "decay_duration_turns": 4,
    "chance_percent": 25,
    "upgrade_potential": true
  },
  "Summon Spores": {
    "description": "Calls forth spore minions.",
    "trait_type": "active_ability",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost": 25,
    "cooldown_turns": 8,
    "number_of_spores": 2,
    "spore_health_percent_of_caster": 20,
    "spore_damage_percent_of_caster": 40,
    "upgrade_potential": true
  },
  "Absorb Nutrients": {
    "description": "Heals from defeated enemies or plants.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "heal_amount_percent_from_defeated_enemies": 15,
    "power_gain_from_defeated_enemies_multiplier": 1.1,
    "upgrade_potential": true
  },
  "Control Fungus": {
    "description": "Can manipulate fungal growth.",
    "trait_type": "active_ability",
    "target_type": "environment",
    "applies_to": "monster",
    "mana_cost": 10,
    "cooldown_turns": 3,
    "fungal_growth_rate_multiplier": 1.5,
    "mana_cost_per_turn": 2,
    "upgrade_potential": true
  },
  "Mind Fog": {
    "description": "Reduces enemy accuracy or focus.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 20,
    "cooldown_turns": 6,
    "accuracy_reduction_percent": 20,
    "focus_reduction_percent": 15,
    "duration_turns": 3,
    "radius": 3,
    "upgrade_potential": true
  },
  "Spore Puppet": {
    "description": "Controls a defeated enemy temporarily.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 40,
    "cooldown_turns": 15,
    "control_duration_turns": 3,
    "upgrade_potential": true
  },
  "Spore Storm": {
    "description": "Covers area in damaging spores.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 30,
    "cooldown_turns": 10,
    "damage_per_turn": 12,
    "duration_turns": 4,
    "radius": 4,
    "upgrade_potential": true
  },
  "Rot Field": {
    "description": "Damages all living things in area.",
    "trait_type": "environmental_effect",
    "target_type": "area",
    "applies_to": "room_theme",
    "damage_per_turn_living_things": 8,
    "duration_turns": -1,
    "radius": -1,
    "upgrade_potential": true
  },
  "Regeneration": {
    "description": "Heals rapidly over time.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "heal_per_turn_percent_of_max_health": 8,
    "upgrade_potential": true
  },
  "Spore Rebirth": {
    "description": "Can revive as a spore creature.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "rebirth_chance_percent": 50,
    "spore_creature_health_percent_of_original": 30,
    "upgrade_potential": true
  },
  "Pollen of Madness": {
    "description": "Causes confusion in enemies.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 25,
    "cooldown_turns": 7,
    "confusion_duration_turns": 3,
    "chance_percent": 60,
    "radius": 3,
    "upgrade_potential": true
  },
  "Side Step": {
    "description": "Can dodge attacks from the side.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "dodge_chance_percent_side_attacks": 30,
    "upgrade_potential": true
  },
  "Guard": {
    "description": "Protects allies from attacks.",
    "trait_type": "active_ability",
    "target_type": "allies",
    "applies_to": "monster",
    "mana_cost": 15,
    "cooldown_turns": 4,
    "damage_reduction_percent_for_allies": 20,
    "radius": 1,
    "duration_turns": 2,
    "upgrade_potential": true
  },
  "Stun on Hit": {
    "description": "Chance to stun when attacking.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "stun_duration_turns": 1,
    "chance_percent": 15,
    "upgrade_potential": true
  },
  "Aggressive": {
    "description": "Attacks more frequently.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "attack_frequency_increase_percent": 20,
    "upgrade_potential": true
  },
  "High Crit": {
    "description": "Increased chance for critical hits.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "critical_hit_chance_percent": 10,
    "critical_hit_damage_multiplier": 1.75,
    "upgrade_potential": true
  },
  "Armor Crush": {
    "description": "Ignores some armor.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "armor_penetration_percent": 25,
    "upgrade_potential": true
  },
  "Heavy Blow": {
    "description": "Deals extra damage with attacks.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "bonus_damage_multiplier": 1.25,
    "upgrade_potential": true
  },
  "Tunnel Collapse": {
    "description": "Can cause cave-ins.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 30,
    "cooldown_turns": 10,
    "damage_amount": 40,
    "stun_duration_turns": 2,
    "area_of_effect_radius": 3,
    "upgrade_potential": true
  },
  "Debris Shield": {
    "description": "Uses debris for extra defense.",
    "trait_type": "active_ability",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost": 10,
    "cooldown_turns": 4,
    "defense_bonus_percent": 20,
    "duration_turns": 3,
    "upgrade_potential": true
  },
  "Battle Cry": {
    "description": "Buffs self and allies.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 20,
    "cooldown_turns": 6,
    "attack_bonus_percent_for_self": 15,
    "defense_bonus_percent_for_self": 10,
    "attack_bonus_percent_for_allies": 10,
    "defense_bonus_percent_for_allies": 5,
    "duration_turns": 3,
    "radius": 3,
    "upgrade_potential": true
  },
  "Shell Slam": {
    "description": "Deals area damage with shell.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 25,
    "cooldown_turns": 7,
    "area_damage_amount": 35,
    "radius": 2,
    "upgrade_potential": true
  },
  "Dust Cloak": {
    "description": "Reduces chance to be hit.",
    "trait_type": "active_ability",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost": 10,
    "cooldown_turns": 5,
    "hit_chance_reduction_percent_for_enemies": 20,
    "duration_turns": 3,
    "upgrade_potential": true
  },
  "Speed Burst": {
    "description": "Can move very quickly for a short time.",
    "trait_type": "active_ability",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost": 10,
    "cooldown_turns": 4,
    "movement_speed_bonus_percent": 50,
    "duration_turns": 2,
    "upgrade_potential": true
  },
  "Blinding Strike": {
    "description": "Chance to blind enemies.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "blind_duration_turns": 2,
    "chance_percent": 20,
    "upgrade_potential": true
  },
  "Siege Slam": {
    "description": "Deals massive damage to structures.",
    "trait_type": "active_ability",
    "target_type": "structure",
    "applies_to": "monster",
    "mana_cost": 30,
    "cooldown_turns": 8,
    "structure_damage_multiplier": 2.5,
    "upgrade_potential": true
  },
  "Shell Fortress": {
    "description": "Can become nearly invulnerable temporarily.",
    "trait_type": "active_ability",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost": 40,
    "cooldown_turns": 12,
    "invulnerability_duration_turns": 1,
    "upgrade_potential": true
  },
  "Earthquake Step": {
    "description": "Shakes the ground with each step.",
    "trait_type": "passive_effect",
    "target_type": "area",
    "applies_to": "monster",
    "stun_duration_turns": 1,
    "knockdown_duration_turns": 1,
    "radius": 1,
    "chance_percent": 10,
    "upgrade_potential": true
  },
  "Hardened Plates": {
    "description": "Extremely high defense.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "defense_bonus_percent": 40,
    "upgrade_potential": true
  },
  "Unshakable": {
    "description": "Cannot be knocked back or stunned.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "immune_to_knockback": true,
    "immune_to_stun": true,
    "upgrade_potential": false
  },
  "Screech": {
    "description": "Emits a loud noise to disorient enemies.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 15,
    "cooldown_turns": 5,
    "disorient_duration_turns": 2,
    "radius": 3,
    "upgrade_potential": true
  },
  "Flight": {
    "description": "Can fly over obstacles.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "movement_type": "flying",
    "upgrade_potential": false
  },
  "Blind": {
    "description": "Cannot see, but senses surroundings.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "vision_range_reduction_percent": 100,
    "accuracy_reduction_percent": 50,
    "senses_bonus_percent": 50,
    "upgrade_potential": false
  },
  "Sound Pulse": {
    "description": "Emits damaging sound waves.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 20,
    "cooldown_turns": 6,
    "damage_amount": 25,
    "radius": 3,
    "upgrade_potential": true
  },
  "Dive": {
    "description": "Can attack from above.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 10,
    "cooldown_turns": 3,
    "bonus_damage_multiplier_from_above": 1.4,
    "upgrade_potential": true
  },
  "Guard Nest": {
    "description": "Defends its territory fiercely.",
    "trait_type": "passive_effect",
    "target_type": "area",
    "applies_to": "monster",
    "damage_reduction_in_territory_percent": 20,
    "attack_bonus_in_territory_percent": 15,
    "upgrade_potential": true
  },
  "Pack Instinct": {
    "description": "Fights better with allies.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "damage_bonus_per_ally_percent": 5,
    "defense_bonus_per_ally_percent": 3,
    "max_bonus_allies": 5,
    "upgrade_potential": true
  },
  "Piercing Screech": {
    "description": "Can break magical barriers.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 25,
    "cooldown_turns": 7,
    "magic_barrier_break_chance_percent": 70,
    "upgrade_potential": true
  },
  "Fast Dive": {
    "description": "Very quick aerial attacks.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 12,
    "cooldown_turns": 2,
    "bonus_damage_multiplier_from_above": 1.5,
    "cooldown_turns_reduction": 1,
    "upgrade_potential": true
  },
  "Fear Aura": {
    "description": "Reduces enemy morale.",
    "trait_type": "passive_effect",
    "target_type": "area",
    "applies_to": "monster",
    "morale_reduction_percent": 10,
    "radius": 3,
    "duration_turns": -1,
    "upgrade_potential": true
  },
  "Vulture Grip": {
    "description": "Can hold onto targets, preventing escape.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 15,
    "cooldown_turns": 4,
    "immobilize_duration_turns": 3,
    "damage_per_turn": 5,
    "upgrade_potential": true
  },
  "Electrify": {
    "description": "Attacks deal lightning damage.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "lightning_damage_bonus_percent": 15,
    "stun_chance_percent": 10,
    "upgrade_potential": true
  },
  "Fast Flier": {
    "description": "Moves quickly through the air.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "movement_speed_bonus_percent": 30,
    "upgrade_potential": true
  },
  "Shock Wave": {
    "description": "Deals area damage with sound or force.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 20,
    "cooldown_turns": 6,
    "damage_amount": 30,
    "radius": 2,
    "upgrade_potential": true
  },
  "Charming Song": {
    "description": "Chance to pacify enemies.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 25,
    "cooldown_turns": 7,
    "pacify_chance_percent": 40,
    "pacify_duration_turns": 3,
    "upgrade_potential": true
  },
  "Command Minions": {
    "description": "Can direct lesser monsters.",
    "trait_type": "active_ability",
    "target_type": "allies",
    "applies_to": "monster",
    "mana_cost": 15,
    "cooldown_turns": 5,
    "minion_buff_strength_percent": 20,
    "duration_turns": 3,
    "upgrade_potential": true
  },
  "Flight Shield": {
    "description": "Reduces ranged damage taken.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "ranged_damage_reduction_percent": 20,
    "upgrade_potential": true
  },
  "Roaring Tempest": {
    "description": "Summons a storm to damage all enemies.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 40,
    "cooldown_turns": 15,
    "damage_per_turn": 15,
    "duration_turns": 5,
    "radius": -1,
    "upgrade_potential": true
  },
  "Gale Slam": {
    "description": "Powerful wind attack.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 25,
    "cooldown_turns": 7,
    "damage_amount": 30,
    "knockback_distance_tiles": 2,
    "upgrade_potential": true
  },
  "Predator Dive": {
    "description": "Deals extra damage to isolated targets.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "bonus_damage_multiplier_to_isolated_targets": 1.6,
    "upgrade_potential": true
  },
  "Shriek of Dread": {
    "description": "Causes fear in all enemies.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 30,
    "cooldown_turns": 10,
    "fear_duration_turns": 4,
    "radius": -1,
    "upgrade_potential": true
  },
  "Tireless": {
    "description": "Does not fatigue in battle.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "stamina_cost_reduction_percent": 100,
    "upgrade_potential": false
  },
  "Acid Spit": {
    "description": "Ranged acid attack.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 10,
    "cooldown_turns": 2,
    "damage_amount": 15,
    "armor_reduction_per_hit_percent": 5,
    "range_tiles": 5,
    "upgrade_potential": true
  },
  "Range Attack": {
    "description": "Can attack from a distance.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "range_tiles": 3,
    "upgrade_potential": true
  },
  "Fragile": {
    "description": "Takes extra damage from all sources.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "damage_taken_multiplier": 1.5,
    "upgrade_potential": false
  },
  "Spore Spread": {
    "description": "Spreads fungus to new areas.",
    "trait_type": "active_ability",
    "target_type": "environment",
    "applies_to": "monster",
    "mana_cost": 10,
    "cooldown_turns": 4,
    "spread_rate_multiplier": 1.2,
    "new_area_coverage_bonus": 1,
    "upgrade_potential": true
  },
  "Fire Ant": {
    "description": "Attacks ignite enemies.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "ignite_chance_percent": 25,
    "ignite_duration_turns": 2,
    "upgrade_potential": true
  },
  "Swarm Boost": {
    "description": "Stronger when in groups.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "damage_bonus_per_ally_percent": 4,
    "defense_bonus_per_ally_percent": 2,
    "max_bonus_allies": 10,
    "upgrade_potential": true
  },
  "Siege Mandibles": {
    "description": "Can break through barriers.",
    "trait_type": "passive_effect",
    "target_type": "structure",
    "applies_to": "monster",
    "barrier_damage_multiplier": 1.8,
    "upgrade_potential": true
  },
  "Dig Speed": {
    "description": "Can dig quickly.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "dig_speed_bonus_percent": 50,
    "upgrade_potential": true
  },
  "Pack Commander": {
    "description": "Buffs all nearby allies.",
    "trait_type": "passive_effect",
    "target_type": "allies",
    "applies_to": "monster",
    "ally_buff_strength_percent": 15,
    "radius": 3,
    "duration_turns": -1,
    "upgrade_potential": true
  },
  "Radar Sense": {
    "description": "Detects hidden enemies.",
    "trait_type": "passive_effect",
    "target_type": "area",
    "applies_to": "monster",
    "detection_range_tiles": 5,
    "detect_hidden_chance_percent": 100,
    "upgrade_potential": true
  },
  "Retreat": {
    "description": "Can escape from battle easily.",
    "trait_type": "active_ability",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost": 5,
    "cooldown_turns": 3,
    "escape_chance_percent": 70,
    "movement_speed_bonus_on_retreat_percent": 30,
    "upgrade_potential": true
  },
  "Spawn Minions": {
    "description": "Creates lesser monsters during combat.",
    "trait_type": "active_ability",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost": 25,
    "cooldown_turns": 8,
    "number_of_minions": 1,
    "minion_health_percent_of_caster": 25,
    "minion_damage_percent_of_caster": 40,
    "upgrade_potential": true
  },
  "Royal Pheromones": {
    "description": "Buffs all insect allies.",
    "trait_type": "passive_effect",
    "target_type": "allies",
    "applies_to": "monster",
    "insect_ally_buff_strength_percent": 20,
    "radius": 4,
    "duration_turns": -1,
    "upgrade_potential": true
  },
  "Thick Carapace": {
    "description": "Very high defense.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "defense_bonus_percent": 35,
    "upgrade_potential": true
  },
  "Hive Mind": {
    "description": "Shares information with all allies.",
    "trait_type": "passive_effect",
    "target_type": "allies",
    "applies_to": "monster",
    "information_sharing_bonus_percent": 100,
    "ally_coordination_bonus_percent": 10,
    "upgrade_potential": true
  },
  "Summon Soldiers": {
    "description": "Calls forth soldier ants.",
    "trait_type": "active_ability",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost": 30,
    "cooldown_turns": 10,
    "number_of_soldiers": 2,
    "soldier_health_percent_of_caster": 30,
    "soldier_damage_percent_of_caster": 50,
    "upgrade_potential": true
  },
  "Echo Pulse": {
    "description": "Emits a sound wave to locate enemies.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 15,
    "cooldown_turns": 4,
    "detection_range_tiles": 6,
    "damage_amount": 10,
    "upgrade_potential": true
  },
  "Dodge Boost": {
    "description": "Increased chance to dodge attacks.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "dodge_chance_increase_percent": 15,
    "upgrade_potential": true
  },
  "Agile": {
    "description": "Moves quickly and easily.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "movement_speed_bonus_percent": 20,
    "evasion_bonus_percent": 10,
    "upgrade_potential": true
  },
  "Fast": {
    "description": "Acts more frequently than normal.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "action_frequency_increase_percent": 15,
    "upgrade_potential": true
  },
  "Piercing Cry": {
    "description": "Can break magical barriers.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 25,
    "cooldown_turns": 7,
    "magic_barrier_break_chance_percent": 70,
    "upgrade_potential": true
  },
  "Stun Cry": {
    "description": "Chance to stun all enemies in range.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 30,
    "cooldown_turns": 8,
    "stun_duration_turns": 2,
    "chance_percent": 60,
    "radius": 3,
    "upgrade_potential": true
  },
  "Evasive": {
    "description": "Hard to hit.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "hit_chance_reduction_percent_for_enemies": 20,
    "upgrade_potential": true
  },
  "Darkvision": {
    "description": "Can see in the dark.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "vision_range_in_darkness_tiles": 10,
    "upgrade_potential": false
  },
  "Silence Aura": {
    "description": "Prevents spellcasting in area.",
    "trait_type": "passive_effect",
    "target_type": "area",
    "applies_to": "monster",
    "spell_casting_prevention_chance_percent": 100,
    "radius": 2,
    "duration_turns": -1,
    "upgrade_potential": true
  },
  "Rotting Bite": {
    "description": "Inflicts disease and decay.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "disease_duration_turns": 4,
    "decay_damage_per_turn": 5,
    "chance_percent": 30,
    "upgrade_potential": true
  },
  "Exploding Death": {
    "description": "Deals damage to all nearby on death.",
    "trait_type": "passive_effect",
    "target_type": "area",
    "applies_to": "monster",
    "explosion_damage_amount": 40,
    "explosion_radius": 2,
    "upgrade_potential": true
  },
  "Void Wings": {
    "description": "Can pass through solid objects.",
    "trait_type": "active_ability",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost": 20,
    "cooldown_turns": 6,
    "pass_through_objects_duration_turns": 1,
    "upgrade_potential": true
  },
  "Echo Shatter": {
    "description": "Destroys magical barriers with sound.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 30,
    "cooldown_turns": 9,
    "magic_barrier_destroy_chance_percent": 80,
    "upgrade_potential": true
  },
  "Soul Drain": {
    "description": "Steals life and mana from enemies.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "life_steal_amount_percent_of_damage": 10,
    "mana_steal_amount_percent_of_damage": 5,
    "upgrade_potential": true
  },
  "Blackout": {
    "description": "Plunges area into magical darkness.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 25,
    "cooldown_turns": 8,
    "darkness_duration_turns": 4,
    "radius": -1,
    "upgrade_potential": true
  },
  "Stealth": {
    "description": "Harder to detect.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "detection_reduction_percent": 40,
    "upgrade_potential": true
  },
  "Life Steal": {
    "description": "Heals for a portion of damage dealt.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "life_steal_amount_percent_of_damage": 15,
    "upgrade_potential": true
  },
  "Dive Attack": {
    "description": "Deals extra damage from above.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 10,
    "cooldown_turns": 3,
    "bonus_damage_multiplier_from_above": 1.3,
    "upgrade_potential": true
  },
  "Slow Flight": {
    "description": "Moves slowly while flying.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "movement_speed_reduction_percent_while_flying": 20,
    "upgrade_potential": false
  },
  "Shadowmeld": {
    "description": "Can become invisible in darkness.",
    "trait_type": "active_ability",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost": 10,
    "cooldown_turns": 4,
    "invisibility_duration_in_darkness_turns": 5,
    "upgrade_potential": true
  },
  "Blood Clone": {
    "description": "Creates duplicates using blood.",
    "trait_type": "active_ability",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost": 35,
    "cooldown_turns": 12,
    "number_of_clones": 1,
    "clone_health_percent_of_caster": 40,
    "clone_damage_percent_of_caster": 60,
    "upgrade_potential": true
  },
  "Heal on Kill": {
    "description": "Heals when defeating an enemy.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "heal_amount_percent_on_kill": 20,
    "upgrade_potential": true
  },
  "Resilient": {
    "description": "Takes less damage from all sources.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "damage_reduction_percent": 15,
    "upgrade_potential": true
  },
  "Mist Form": {
    "description": "Can become mist to avoid attacks.",
    "trait_type": "active_ability",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost": 20,
    "cooldown_turns": 6,
    "avoid_attack_chance_percent": 50,
    "duration_turns": 1,
    "upgrade_potential": true
  },
  "Illusion Aura": {
    "description": "Creates false images to distract.",
    "trait_type": "passive_effect",
    "target_type": "area",
    "applies_to": "monster",
    "illusion_spawn_chance_percent": 20,
    "distraction_strength_percent": 15,
    "radius": 3,
    "duration_turns": -1,
    "upgrade_potential": true
  },
  "Command Lesser Bats": {
    "description": "Can direct lesser bat monsters.",
    "trait_type": "active_ability",
    "target_type": "allies",
    "applies_to": "monster",
    "mana_cost": 15,
    "cooldown_turns": 5,
    "bat_buff_strength_percent": 20,
    "duration_turns": 3,
    "upgrade_potential": true
  },
  "Charm": {
    "description": "Chance to pacify enemies.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 25,
    "cooldown_turns": 7,
    "pacify_chance_percent": 40,
    "pacify_duration_turns": 3,
    "upgrade_potential": true
  },
  "Flyby Slash": {
    "description": "Attacks while flying past enemies.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 10,
    "cooldown_turns": 3,
    "damage_multiplier": 1.1,
    "upgrade_potential": true
  },
  "Sonic Pulse": {
    "description": "Emits a damaging sound wave.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 20,
    "cooldown_turns": 6,
    "damage_amount": 25,
    "radius": 3,
    "upgrade_potential": true
  },
  "Fear Shriek": {
    "description": "Causes fear in all enemies.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 30,
    "cooldown_turns": 10,
    "fear_duration_turns": 4,
    "radius": -1,
    "upgrade_potential": true
  },
  "Total Darkness": {
    "description": "Plunges area into complete darkness.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 35,
    "cooldown_turns": 12,
    "darkness_duration_turns": 5,
    "radius": -1,
    "upgrade_potential": true
  },
  "Bloodstorm": {
    "description": "Summons a storm of blood, damaging all enemies.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 40,
    "cooldown_turns": 15,
    "damage_per_turn": 18,
    "duration_turns": 5,
    "radius": -1,
    "upgrade_potential": true
  },
  "Vampiric Aura": {
    "description": "Heals all allies in area.",
    "trait_type": "passive_effect",
    "target_type": "area",
    "applies_to": "monster",
    "ally_heal_percent_of_damage_dealt": 5,
    "radius": 3,
    "duration_turns": -1,
    "upgrade_potential": true
  },
  "Phase Shift": {
    "description": "Can become intangible briefly.",
    "trait_type": "active_ability",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost": 25,
    "cooldown_turns": 7,
    "intangibility_duration_turns": 1,
    "upgrade_potential": true
  },
  "Sanguine Wings": {
    "description": "Heals when flying over blood.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "heal_amount_percent_per_turn_over_blood": 5,
    "upgrade_potential": true
  },
  "Climb": {
    "description": "Can scale walls and ceilings.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "movement_type": "climbing",
    "upgrade_potential": false
  },
  "Leap Down": {
    "description": "Can attack from above.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 10,
    "cooldown_turns": 3,
    "bonus_damage_multiplier_from_above": 1.3,
    "upgrade_potential": true
  },
  "Soften Blow": {
    "description": "Reduces damage taken from attacks.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "damage_reduction_percent": 10,
    "upgrade_potential": true
  },
  "Slippery": {
    "description": "Hard to grab or hold.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "grab_resist_chance_percent": 50,
    "hold_resist_chance_percent": 50,
    "upgrade_potential": true
  },
  "Glare": {
    "description": "Chance to petrify or stun enemies.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 20,
    "cooldown_turns": 6,
    "petrify_chance_percent": 15,
    "stun_chance_percent": 25,
    "duration_turns": 2,
    "upgrade_potential": true
  },
  "Poison Fang": {
    "description": "Attacks inflict poison.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "poison_damage_per_turn_percent_of_attack_damage": 0.08,
    "poison_duration_turns": 3,
    "chance_percent": 30,
    "upgrade_potential": true
  },
  "Tail Swipe": {
    "description": "Attacks all enemies behind.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 15,
    "cooldown_turns": 4,
    "area_damage_amount": 20,
    "enemies_hit": 2,
    "upgrade_potential": true
  },
  "Knockback": {
    "description": "Pushes enemies away.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "knockback_distance_tiles": 1,
    "chance_percent": 20,
    "upgrade_potential": true
  },
  "Heat Resistance": {
    "description": "Takes less damage from fire.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "fire_damage_reduction_percent": 25,
    "upgrade_potential": true
  },
  "Molten Trail": {
    "description": "Leaves burning ground behind.",
    "trait_type": "passive_effect",
    "target_type": "area",
    "applies_to": "monster",
    "burn_damage_per_turn": 8,
    "burn_duration_turns": 3,
    "upgrade_potential": true
  },
  "Hard Scales": {
    "description": "Very high defense.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "defense_bonus_percent": 30,
    "upgrade_potential": true
  },
  "Coil Grip": {
    "description": "Can immobilize enemies with its body.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 20,
    "cooldown_turns": 5,
    "immobilize_duration_turns": 3,
    "damage_per_turn": 7,
    "upgrade_potential": true
  },
  "Earthquake Roar": {
    "description": "Shakes the ground, stunning enemies.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 30,
    "cooldown_turns": 8,
    "stun_duration_turns": 2,
    "radius": 4,
    "upgrade_potential": true
  },
  "Petrify Glance": {
    "description": "Chance to petrify enemies.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 35,
    "cooldown_turns": 10,
    "petrify_chance_percent": 30,
    "petrify_duration_turns": 3,
    "upgrade_potential": true
  },
  "Massive Coil": {
    "description": "Can trap multiple enemies at once.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 40,
    "cooldown_turns": 12,
    "targets_affected": 3,
    "immobilize_duration_turns": 3,
    "upgrade_potential": true
  },
  "Bark": {
    "description": "Can alert allies or frighten enemies.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 5,
    "cooldown_turns": 2,
    "alert_radius": 5,
    "frighten_duration_turns": 1,
    "frighten_chance_percent": 20,
    "upgrade_potential": true
  },
  "Fear Howl": {
    "description": "Causes fear in all enemies.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 25,
    "cooldown_turns": 7,
    "fear_duration_turns": 3,
    "radius": -1,
    "upgrade_potential": true
  },
  "Alert Allies": {
    "description": "Warns allies of danger.",
    "trait_type": "passive_effect",
    "target_type": "allies",
    "applies_to": "monster",
    "alert_radius": 5,
    "buff_duration_turns": 2,
    "buff_strength_percent": 10,
    "upgrade_potential": true
  },
  "Tracker": {
    "description": "Can follow enemy tracks.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "track_effectiveness_percent": 50,
    "upgrade_potential": true
  },
  "Command Pack": {
    "description": "Buffs all nearby canines.",
    "trait_type": "active_ability",
    "target_type": "allies",
    "applies_to": "monster",
    "mana_cost": 20,
    "cooldown_turns": 6,
    "canine_ally_buff_strength_percent": 15,
    "radius": 3,
    "duration_turns": 3,
    "upgrade_potential": true
  },
  "Savage Bite": {
    "description": "Deals extra damage on critical hits.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "bonus_critical_damage_multiplier": 0.5,
    "upgrade_potential": true
  },
  "Cold Bite": {
    "description": "Attacks slow or freeze enemies.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "slow_duration_turns": 2,
    "freeze_duration_turns": 1,
    "chance_percent": 20,
    "upgrade_potential": true
  },
  "Slowing Aura": {
    "description": "Reduces enemy speed.",
    "trait_type": "passive_effect",
    "target_type": "area",
    "applies_to": "monster",
    "movement_speed_reduction_percent": 15,
    "radius": 2,
    "duration_turns": -1,
    "upgrade_potential": true
  },
  "Resist Freeze": {
    "description": "Takes less damage from cold.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "cold_damage_reduction_percent": 25,
    "upgrade_potential": true
  },
  "Buff at Night": {
    "description": "Stronger during nighttime.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "attack_bonus_percent": 15,
    "defense_bonus_percent": 10,
    "upgrade_potential": true
  },
  "Evasion": {
    "description": "Increased chance to dodge attacks.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "dodge_chance_increase_percent": 20,
    "upgrade_potential": true
  },
  "Undead Bite": {
    "description": "Inflicts disease and decay.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "disease_duration_turns": 4,
    "decay_damage_per_turn": 5,
    "chance_percent": 30,
    "upgrade_potential": true
  },
  "Stench Aura": {
    "description": "Reduces enemy accuracy.",
    "trait_type": "passive_effect",
    "target_type": "area",
    "applies_to": "monster",
    "accuracy_reduction_percent": 15,
    "radius": 2,
    "duration_turns": -1,
    "upgrade_potential": true
  },
  "Summon Ghost Pack": {
    "description": "Calls forth ghostly allies.",
    "trait_type": "active_ability",
    "target_type": "self",
    "applies_to": "monster",
    "mana_cost": 30,
    "cooldown_turns": 10,
    "number_of_ghosts": 2,
    "ghost_health_percent_of_caster": 30,
    "ghost_damage_percent_of_caster": 50,
    "upgrade_potential": true
  },
  "Mark Prey": {
    "description": "Targets take extra damage from all sources.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 15,
    "cooldown_turns": 5,
    "bonus_damage_taken_percent_by_marked_target": 25,
    "duration_turns": 3,
    "upgrade_potential": true
  },
  "Unrelenting Chase": {
    "description": "Can pursue fleeing enemies.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "movement_speed_bonus_on_chase_percent": 30,
    "upgrade_potential": true
  },
  "Lunar Empowerment": {
    "description": "Stronger during full moon.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "attack_bonus_percent": 20,
    "defense_bonus_percent": 15,
    "upgrade_potential": true
  },
  "Relentless": {
    "description": "Does not stop attacking until defeated.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "damage_bonus_while_attacking_percent": 10,
    "upgrade_potential": true
  },
  "Infect on Hit": {
    "description": "Attacks spread disease.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "disease_spread_chance_percent": 20,
    "disease_duration_turns": 3,
    "disease_strength_percent": 10,
    "upgrade_potential": true
  },
  "Stench Cloud": {
    "description": "Reduces enemy accuracy.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 15,
    "cooldown_turns": 5,
    "accuracy_reduction_percent": 20,
    "duration_turns": 3,
    "radius": 3,
    "upgrade_potential": true
  },
  "Rotting Aura": {
    "description": "Damages enemies over time.",
    "trait_type": "passive_effect",
    "target_type": "area",
    "applies_to": "monster",
    "damage_per_turn_percent_of_enemy_health": 0.03,
    "radius": 2,
    "duration_turns": -1,
    "upgrade_potential": true
  },
  "Resist Pain": {
    "description": "Takes less damage from all sources.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "damage_reduction_percent": 20,
    "upgrade_potential": true
  },
  "Tanky": {
    "description": "High health and defense.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "health_bonus_percent": 30,
    "defense_bonus_percent": 25,
    "upgrade_potential": true
  },
  "Split Body": {
    "description": "Can divide into multiple parts.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "split_health_threshold_percent": 60,
    "number_of_splits": 1,
    "spawn_health_percent_of_original": 40,
    "spawn_damage_percent_of_original": 60,
    "upgrade_potential": true
  },
  "Absorb Corpse": {
    "description": "Heals from defeated enemies.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "heal_amount_percent_from_defeated_enemies": 20,
    "mana_gain_from_defeated_enemies_percent": 10,
    "upgrade_potential": true
  },
  "Frail": {
    "description": "Takes extra damage from all sources.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "damage_taken_multiplier": 1.25,
    "upgrade_potential": false
  },
  "Multi-Limb Strike": {
    "description": "Attacks multiple times per turn.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "attacks_per_turn_bonus": 1,
    "upgrade_potential": true
  },
  "Fearless": {
    "description": "Immune to fear effects.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "immune_to_fear": true,
    "upgrade_potential": false
  },
  "Plague Trail": {
    "description": "Leaves a trail that spreads disease.",
    "trait_type": "passive_effect",
    "target_type": "area",
    "applies_to": "monster",
    "disease_duration_turns": 3,
    "disease_damage_per_turn": 6,
    "trail_duration_turns": 2,
    "upgrade_potential": true
  },
  "Spit Disease": {
    "description": "Ranged attack that inflicts disease.",
    "trait_type": "active_ability",
    "target_type": "enemy",
    "applies_to": "monster",
    "mana_cost": 15,
    "cooldown_turns": 4,
    "disease_duration_turns": 5,
    "disease_damage_per_turn": 8,
    "range_tiles": 4,
    "chance_percent": 70,
    "upgrade_potential": true
  },
  "Undying": {
    "description": "Can revive after being defeated.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "revive_chance_percent": 25,
    "revive_health_percent": 20,
    "upgrade_potential": true
  },
  "Immortal Core": {
    "description": "Cannot be killed by normal means.",
    "trait_type": "passive_effect",
    "target_type": "self",
    "applies_to": "monster",
    "immune_to_normal_damage_types": true,
    "upgrade_potential": false
  },
  "Aura of Decay": {
    "description": "Damages all living things nearby.",
    "trait_type": "passive_effect",
    "target_type": "area",
    "applies_to": "monster",
    "damage_per_turn_living_things": 10,
    "radius": 3,
    "duration_turns": -1,
    "upgrade_potential": true
  },
  "Raise Dead": {
    "description": "Revives fallen monsters as allies.",
    "trait_type": "active_ability",
    "target_type": "corpse",
    "applies_to": "monster",
    "mana_cost": 40,
    "cooldown_turns": 15,
    "number_of_undead_raised": 1,
    "undead_health_percent_of_original": 50,
    "undead_damage_percent_of_original": 70,
    "upgrade_potential": true
  },
  "Plague Nova": {
    "description": "Releases a burst of disease.",
    "trait_type": "active_ability",
    "target_type": "area",
    "applies_to": "monster",
    "mana_cost": 35,
    "cooldown_turns": 10,
    "disease_damage_amount": 30,
    "disease_duration_turns": 5,
    "radius": 4,
    "upgrade_potential": true
  },
  "Soul Rot": {
    "description": "Drains life and mana from enemies.",
    "trait_type": "passive_effect",
    "target_type": "enemy",
    "applies_to": "monster",
    "life_drain_amount_percent_of_target_health": 5,
    "mana_drain_amount_percent_of_target_mana": 10,
    "chance_percent": 20,
    "upgrade_potential": true
  }
};


// --- Simulation Run ---
const combat = new CombatSimulation(monsterTraitsData);

// Add some monsters with various traits
combat.addMonster("Goblin Grunt", { health: 100, mana: 20, attack: 15, defense: 5, speed: 10 }, ["Aggressive", "Stun on Hit", "Heal on Kill"]);
combat.addMonster("Fungus Beast", { health: 150, mana: 30, attack: 10, defense: 8, speed: 5 }, ["Poison Cloud", "Regrowth", "Spore Storm", "Rotting Aura"]);
combat.addMonster("Shadow Bat", { health: 80, mana: 40, attack: 20, defense: 3, speed: 15 }, ["Flight", "Life Steal", "Shadowmeld", "Fear Shriek"]);
combat.addMonster("Stone Golem", { health: 200, mana: 10, attack: 25, defense: 20, speed: 3 }, ["Tanky", "Hardened Plates", "Earthquake Step", "Shell Fortress"]);

let combatEnded = false;
while (!combatEnded && combat.currentTurn < 10) { // Limit turns to prevent infinite loops for demonstration
    combatEnded = combat.runTurn();
}

console.log("\n--- Final Combat State ---");
if (combatEnded) {
    console.log("Combat concluded!");
} else {
    console.log("Turn limit reached. Combat not fully resolved.");
}

combat.monsters.forEach(m => {
    console.log(`${m.name}: HP ${m.health.toFixed(2)}/${m.maxHealth.toFixed(2)}, Mana ${m.mana.toFixed(2)}/${m.maxMana.toFixed(2)}`);
});
