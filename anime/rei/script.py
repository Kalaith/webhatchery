import pandas as pd

# Create a comprehensive character development timeline for Rei Ayanami
rei_development_data = {
    'Phase': [
        'Rei I (Flashback)',
        'Rei II (Episodes 1-6)',
        'Rei II (Episodes 7-23)',
        'Rei III (Episodes 24-26)',
        'Rei in End of Evangelion',
        'Rei in Rebuild 1.0-2.0',
        'Rei Q in Rebuild 3.0',
        'Rei in Rebuild 3.0+1.0'
    ],
    'Key Characteristics': [
        'Child clone, naive, manipulated by Gendo',
        'Cold, emotionless, tool-like behavior',
        'Gradual awakening to emotions, connection with Shinji',
        'Memory gaps, questioning identity, blank slate',
        'Chooses humanity over Gendo, rebels against instrumentality',
        'More humanized, shows curiosity and growth',
        'Complete memory loss, identity crisis, seeking belonging',
        'Finds family, learns love, sacrifice for others'
    ],
    'Relationship with Shinji': [
        'No direct interaction',
        'Distant, professional, protective',
        'Growing connection, mutual understanding',
        'Confused, trying to rebuild connection',
        'Chooses to help Shinji over Gendo',
        'Genuine friendship, shared meals, emotional growth',
        'Rejected initially, seeks acceptance',
        'Protective, caring, finds purpose through connection'
    ],
    'Major Development': [
        'Killed by Naoko Akagi for repeating Gendo\'s words',
        'Smiles for the first time after Shinji\'s kindness',
        'Learns to value herself, questions her purpose',
        'Struggles with fragmented identity',
        'Asserts individual will, rejects being a doll',
        'Experiences normal teenage life, cooking, friendship',
        'Existential questioning, "Who am I?"',
        'Accepts her place in the world, finds belonging'
    ],
    'Symbolic Role': [
        'Innocent victim of adult manipulation',
        'Dehumanized tool, lack of self-worth',
        'Awakening humanity, mother figure potential',
        'Rebirth, second chances, memory and identity',
        'Choice and free will, rejection of predetermined fate',
        'Growth and possibility, normal human experience',
        'Identity crisis, the search for self',
        'Resolution, finding home, completing the journey'
    ]
}

rei_df = pd.DataFrame(rei_development_data)
print("Rei Ayanami Character Development Timeline")
print("=" * 50)
print(rei_df.to_string(index=False))

# Save as CSV
rei_df.to_csv('rei_ayanami_character_development.csv', index=False)
print("\nCharacter development data saved as CSV file.")