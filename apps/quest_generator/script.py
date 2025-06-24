# Create a comprehensive summary of quest generator data for reference
import json

quest_generator_data = {
    "basic_quest_types": {
        "Kill Quests": "Eliminate specific enemies or quantities of creatures",
        "Collection/Fetch Quests": "Gather items from locations or defeated enemies",
        "Delivery Quests": "Transport items or messages between NPCs/locations",
        "Escort Quests": "Protect and guide NPCs to destinations",
        "Exploration Quests": "Discover new locations or investigate areas"
    },
    "advanced_quest_types": {
        "Mystery/Investigation": "Solve crimes, uncover secrets, piece together clues",
        "Survival Challenge": "Survive in dangerous areas for specific time periods",
        "Crafting Mission": "Create specific items using gathered materials",
        "Diplomacy Quest": "Negotiate treaties, resolve conflicts between factions",
        "Multi-stage Chain": "Complex quests with multiple interconnected objectives",
        "Rescue Mission": "Save captured NPCs from dangerous situations",
        "Siege Defense": "Protect locations from enemy attacks",
        "Infiltration/Stealth": "Sneak into locations and accomplish objectives unseen"
    },
    "fantasy_elements": {
        "creatures": [
            "Dragons (Ancient Red Dragon, Frost Wyrm, Shadow Dragon)",
            "Undead (Zombies, Skeletons, Vampires, Liches, Wights)",
            "Humanoids (Goblins, Orcs, Bandits, Cultists, Assassins)",
            "Beasts (Dire Wolves, Giant Spiders, Owlbears, Trolls)",
            "Magical Creatures (Elementals, Demons, Angels, Fey)",
            "Giants (Stone Giants, Frost Giants, Fire Giants)"
        ],
        "locations": [
            "Dungeons (Ancient Tomb, Forgotten Crypt, Crystal Caverns)",
            "Settlements (Village of Millbrook, Port City of Saltmere, Capital of Valorhall)",
            "Wilderness (Darkwood Forest, Crimson Desert, Frostpeak Mountains)",
            "Magical Places (Wizard's Tower, Fairy Ring, Elemental Plane)",
            "Ruins (Lost Temple, Abandoned Castle, Elven Sanctuary)"
        ],
        "items": [
            "Weapons (Enchanted Blade, Dwarven Warhammer, Elven Longbow)",
            "Artifacts (Crown of Kings, Orb of Power, Ancient Tome)",
            "Materials (Dragon Scales, Mithril Ore, Rare Herbs, Magical Crystals)",
            "Treasures (Ancient Coins, Precious Gems, Lost Heirloom)",
            "Consumables (Healing Potions, Magic Scrolls, Blessed Water)"
        ],
        "npcs": [
            "Nobles (King Aldric, Princess Elara, Duke Ravencrest)",
            "Merchants (Trader Magnus, Blacksmith Thorin, Alchemist Sage)",
            "Religious Figures (High Priest Benedictus, Oracle of Light)",
            "Scholars (Archmage Verin, Lorekeeper Nolan)",
            "Common Folk (Farmer Willem, Innkeeper Martha, Guard Captain Boris)"
        ]
    },
    "quest_features": {
        "difficulty_levels": ["Easy", "Medium", "Hard", "Epic"],
        "quest_lengths": ["Short", "Medium", "Long", "Campaign"],
        "reward_types": ["Gold Coins", "Magical Items", "Experience", "Reputation", "Land Grants", "Noble Titles"],
        "moral_alignments": ["Good", "Neutral", "Evil", "Any"]
    }
}

# Save to JSON file for reference
with open('quest_generator_reference.json', 'w') as f:
    json.dump(quest_generator_data, f, indent=2)

print("Quest Generator Data Summary:")
print("="*50)
print(f"Basic Quest Types: {len(quest_generator_data['basic_quest_types'])}")
print(f"Advanced Quest Types: {len(quest_generator_data['advanced_quest_types'])}")
print(f"Total Quest Types: {len(quest_generator_data['basic_quest_types']) + len(quest_generator_data['advanced_quest_types'])}")
print(f"Creature Categories: {len(quest_generator_data['fantasy_elements']['creatures'])}")
print(f"Location Categories: {len(quest_generator_data['fantasy_elements']['locations'])}")
print(f"Item Categories: {len(quest_generator_data['fantasy_elements']['items'])}")
print(f"NPC Categories: {len(quest_generator_data['fantasy_elements']['npcs'])}")
print(f"Difficulty Levels: {len(quest_generator_data['quest_features']['difficulty_levels'])}")
print(f"Quest Lengths: {len(quest_generator_data['quest_features']['quest_lengths'])}")
print(f"Reward Types: {len(quest_generator_data['quest_features']['reward_types'])}")

print("\nQuest Generator Successfully Created!")
print("The application includes comprehensive fantasy elements for rich quest generation.")