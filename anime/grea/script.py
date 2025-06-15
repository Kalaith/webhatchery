import pandas as pd

# Create a comprehensive dataset of Grea's character development throughout Manaria Friends episodes
episode_data = {
    'Episode': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    'Episode_Title': [
        'Anne and Grea',
        'Agony of Grea', 
        'Princess\'s Holiday',
        'Test Time',
        'Academy Down',
        'Floating at Sea',
        'Hide-and-Seek',
        'Backstage Confidential',
        'A Slice of Life',
        'The Pair\'s Promise'
    ],
    'Focus_Character': [
        'Both',
        'Grea',
        'Both', 
        'Anne',
        'Grea',
        'Grea',
        'Anne',
        'Grea',
        'Both',
        'Both'
    ],
    'Character_Development_Theme': [
        'Introduction & Friendship',
        'Dragon Nature & Vulnerability',
        'Social Integration',
        'Academic Struggles',
        'Protective Instincts',
        'Overcoming Fears',
        'Playful Bond',
        'Performance Anxiety',
        'Relationship Conflict',
        'Future Together'
    ],
    'Grea_Growth_Aspect': [
        'Initial Self-Consciousness',
        'Accepting Dragon Heritage',
        'Social Confidence',
        'Supporting Anne',
        'Inner Strength Revealed',
        'Water Phobia to Enjoyment',
        'Carefree Interaction',
        'Stage Fright to Success',
        'Communication Skills',
        'Commitment to Friendship'
    ],
    'Relationship_Depth': [7, 8, 7, 6, 9, 8, 8, 7, 9, 10],
    'Character_Confidence': [4, 3, 6, 5, 8, 7, 7, 5, 6, 8]
}

# Create DataFrame
df = pd.DataFrame(episode_data)

# Display the data
print("Manaria Friends: Grea's Character Development Analysis")
print("=" * 60)
print(df.to_string(index=False))

# Save as CSV for potential chart creation
df.to_csv('grea_character_development.csv', index=False)

print("\n\nSummary Statistics:")
print("=" * 30)
print(f"Average Relationship Depth: {df['Relationship_Depth'].mean():.1f}/10")
print(f"Average Character Confidence: {df['Character_Confidence'].mean():.1f}/10")
print(f"Grea-focused Episodes: {len(df[df['Focus_Character'].isin(['Grea', 'Both'])])}/10")

print("\n\nKey Character Development Moments:")
print("=" * 40)
peak_episodes = df.nlargest(3, 'Character_Confidence')[['Episode', 'Episode_Title', 'Character_Development_Theme']]
for idx, row in peak_episodes.iterrows():
    print(f"Episode {row['Episode']}: {row['Episode_Title']} - {row['Character_Development_Theme']}")