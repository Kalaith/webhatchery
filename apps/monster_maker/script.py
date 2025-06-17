# Create data for D&D Challenge Rating and Monster Type analysis
import pandas as pd

# Create a dataset of typical CR ranges for different monster categories
cr_data = {
    'Challenge_Rating': ['0', '1/8', '1/4', '1/2', '1', '2', '3', '4', '5', '6-8', '9-12', '13-16', '17-20', '21+'],
    'Typical_Monsters': [
        'Commoner, Rat, Spider',
        'Kobold, Goblin, Cultist',
        'Skeleton, Zombie, Wolf',
        'Orc, Hobgoblin, Scout',
        'Dire Wolf, Dryad, Specter',
        'Ogre, Owlbear, Werewolf',
        'Knight, Mummy, Wight',
        'Ettin, Ghost, Wereboar',
        'Gladiator, Troll, Wraith',
        'Mage, Stone Giant, Young Dragon',
        'Archmage, Fire Giant, Adult Dragon',
        'Vampire, Storm Giant, Beholder',
        'Pit Fiend, Solar, Ancient Dragon',
        'Kraken, Tarrasque, Tiamat'
    ],
    'XP_Value': [0, 25, 50, 100, 200, 450, 700, 1100, 1800, 3900, 8400, 15000, 25000, 155000],
    'Party_Level': ['Any', '1', '1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-10', '10-13', '13-16', '16-20', '20+'],
    'Monster_Category': [
        'Civilians/Critters',
        'Weak Humanoids',
        'Basic Undead/Beasts',
        'Trained Warriors',
        'Dangerous Beasts',
        'Large Monsters',
        'Elite Warriors',
        'Supernatural Threats',
        'Legendary Creatures',
        'Powerful Spellcasters',
        'Giant/Dragon Threats',
        'Legendary Monsters',
        'Planar Threats',
        'World-Ending Threats'
    ]
}

# Create DataFrame
df = pd.DataFrame(cr_data)

# Display the data
print("D&D 5e Challenge Rating Reference Guide")
print("="*50)
print(df.to_string(index=False))

# Save as CSV for the chart
df.to_csv('dnd_challenge_ratings.csv', index=False)

print("\nCSV file created successfully!")