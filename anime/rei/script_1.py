# Create a comprehensive data structure for Rei's different incarnations
import pandas as pd

rei_incarnations = {
    'Incarnation': [
        'Rei I',
        'Rei II',
        'Rei III', 
        'Rei (Rebuild)',
        'Rei Q',
        'Rei (Final)'
    ],
    'Time Period': [
        '2010 (Flashback)',
        '2015 (Episodes 1-23)',
        '2015 (Episodes 24-26, EoE)',
        '2015 (Rebuild 1.0-2.0)',
        '2015 (Rebuild 3.0)',
        '2015 (Rebuild 3.0+1.0)'
    ],
    'Key Traits': [
        'Child-like, naive, manipulated',
        'Emotionless tool, gradual awakening',
        'Memory gaps, identity confusion',
        'More human, curious, emotional growth',
        'Complete amnesia, seeking identity',
        'Fully realized, finds belonging'
    ],
    'Fate': [
        'Killed by Naoko Akagi',
        'Dies destroying Armisael',
        'Chooses to help Shinji in Instrumentality',
        'Continues development',
        'Sacrifices self to save others',
        'Finds new life and purpose'
    ],
    'Emotional Range': [
        'Limited - child-like wonder',
        'Minimal to growing awareness',
        'Confused but developing agency',
        'Expanded emotional capacity',
        'Seeking, questioning, vulnerable',
        'Full emotional maturity'
    ],
    'Relationship with Shinji': [
        'None - dies before meeting',
        'Professional to caring',
        'Confused but protective',
        'Genuine friendship',
        'Initially rejected, then accepted',
        'Protective, understanding'
    ]
}

rei_incarnations_df = pd.DataFrame(rei_incarnations)
print("Rei Ayanami Incarnations Across Evangelion")
print("=" * 45)
for i, row in rei_incarnations_df.iterrows():
    print(f"\n{row['Incarnation']}")
    print(f"  Time: {row['Time Period']}")
    print(f"  Traits: {row['Key Traits']}")
    print(f"  Fate: {row['Fate']}")
    print(f"  Emotions: {row['Emotional Range']}")
    print(f"  With Shinji: {row['Relationship with Shinji']}")

# Save the data
rei_incarnations_df.to_csv('rei_incarnations_complete.csv', index=False)
print(f"\n\nIncarnations data saved to CSV file.")