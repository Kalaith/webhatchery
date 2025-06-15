import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Load the transformations data
vegeta_df = pd.read_csv('vegeta_transformations.csv')
frieza_df = pd.read_csv('frieza_transformations.csv')

# Create bar chart comparing power levels
plt.figure(figsize=(12, 8))

# Create positions for the bars
vegeta_pos = np.arange(len(vegeta_df))
frieza_pos = np.arange(len(frieza_df))

# Plot Vegeta's transformations in blue
plt.bar(vegeta_pos, vegeta_df['Power Level (Relative)'], color='blue', alpha=0.7, label='Vegeta')
for i, v in enumerate(vegeta_df['Power Level (Relative)']):
    plt.text(i, v + 500, f"{v}", ha='center', fontweight='bold')

# Add transformation labels
plt.xticks(vegeta_pos, vegeta_df['Transformation'], rotation=45, ha='right')

plt.title('Power Level Comparison: Vegeta\'s Transformations')
plt.xlabel('Transformation')
plt.ylabel('Relative Power Level')
plt.tight_layout()
plt.legend()
plt.savefig('vegeta_power_levels.png')
plt.close()

# Plot Frieza's transformations in purple
plt.figure(figsize=(12, 8))
plt.bar(frieza_pos, frieza_df['Power Level (Relative)'], color='purple', alpha=0.7, label='Frieza')
for i, v in enumerate(frieza_df['Power Level (Relative)']):
    plt.text(i, v + 1000, f"{v}", ha='center', fontweight='bold')

# Add transformation labels
plt.xticks(frieza_pos, frieza_df['Transformation'], rotation=45, ha='right')

plt.title('Power Level Comparison: Frieza\'s Transformations')
plt.xlabel('Transformation')
plt.ylabel('Relative Power Level')
plt.tight_layout()
plt.legend()
plt.savefig('frieza_power_levels.png')
plt.close()

# Create a final comparison chart of the top forms
plt.figure(figsize=(10, 6))

# Select the highest transformations
top_vegeta = vegeta_df.iloc[-2:] # Ultra Ego and SSB Evolved
top_frieza = frieza_df.iloc[-2:] # Black Frieza and Golden Frieza

# Combined positions
labels = list(top_vegeta['Transformation']) + list(top_frieza['Transformation'])
values = list(top_vegeta['Power Level (Relative)']) + list(top_frieza['Power Level (Relative)'])
colors = ['blue', 'blue', 'purple', 'purple']

# Create bar plot
bars = plt.bar(range(len(values)), values, color=colors, alpha=0.7)

# Add value labels
for i, v in enumerate(values):
    plt.text(i, v + 500, f"{v}", ha='center', fontweight='bold')

# Add labels
plt.xticks(range(len(labels)), labels, rotation=45, ha='right')
plt.title('Ultimate Forms: Vegeta vs. Frieza')
plt.ylabel('Relative Power Level')

# Add a horizontal line to show Black Frieza's power
plt.axhline(y=30000, color='red', linestyle='--', label='Current Black Frieza Level')

plt.legend(['Black Frieza Level', 'Vegeta', 'Frieza'])
plt.tight_layout()
plt.savefig('ultimate_forms_comparison.png')

print("Power level comparison charts created.")

# Create a timeline of Vegeta and Frieza's rivalry
timeline_events = [
    {'Year': 'Age 737', 'Event': 'Frieza destroys Planet Vegeta, killing King Vegeta and most Saiyans'},
    {'Year': 'Age 762', 'Event': 'Vegeta defects from Frieza Force and fights on Earth'},
    {'Year': 'Age 762', 'Event': 'Vegeta travels to Namek seeking Dragon Balls'},
    {'Year': 'Age 762', 'Event': 'Vegeta is killed by Frieza on Namek'},
    {'Year': 'Age 762', 'Event': 'Goku defeats Frieza on Namek'},
    {'Year': 'Age 764', 'Event': 'Frieza returns as a cyborg and is defeated by Future Trunks'},
    {'Year': 'Age 779', 'Event': 'Frieza is resurrected and achieves Golden Form'},
    {'Year': 'Age 779', 'Event': 'Vegeta defeats Golden Frieza (after Goku)'},
    {'Year': 'Age 780', 'Event': 'Tournament of Power - Vegeta and Frieza fight as allies'},
    {'Year': 'Age 781', 'Event': 'Granolah arc - Vegeta achieves Ultra Ego transformation'},
    {'Year': 'Age 781', 'Event': 'Frieza returns with Black Frieza form, defeats Goku and Vegeta'},
]

# Create DataFrame
timeline_df = pd.DataFrame(timeline_events)

# Save the timeline
timeline_df.to_csv('vegeta_frieza_timeline.csv', index=False)

print("Timeline created and saved.")

# Create a final key information file for the fanfiction
key_info = """
# Key Information for "Vegeta Defeats Black Frieza" Fanfiction

## Character Motivations

### Vegeta
- Deeply personal hatred for Frieza (destroyed his planet, killed his father, forced him to serve)
- Pride as the Prince of all Saiyans
- Desire to surpass Goku and prove himself the strongest warrior
- Need to redeem himself and avenge his people

### Black Frieza
- Obtained through 10 years of training in a Hyperbolic Time Chamber
- Motivated by not wanting to lose to Saiyans anymore
- Currently stronger than both Ultra Instinct Goku and Ultra Ego Vegeta
- Defeated Gas with a single blow

## Key Power Systems

### Ultra Ego
- Grows stronger as Vegeta takes damage and embraces battle lust
- Opposite of Ultra Instinct's calm mindset
- Purple hair and aura, associated with destruction energy
- Still not mastered - Vegeta can't yet create Beerus's Sphere of Destruction

### Black Frieza
- Most powerful transformation in Universe 7
- Name inspired by "black" credit cards being higher tier than "gold"
- Represents absolute power and the pinnacle of Frieza's potential
- Perfect ki control, no stamina issues

## Potential Story Elements

### Vegeta's Growth Path
- Further mastery of Ultra Ego
- Learning to use Hakai energy more effectively
- Tapping into Saiyan heritage and pride in a new way
- Finding a technique or power that can specifically counter Frieza

### Frieza's Weaknesses
- Overconfidence and toying with opponents
- Tendency to underestimate Saiyans despite past defeats
- Possible weakness in the Black form not yet revealed
- Mental vulnerabilities related to fear of Saiyans

### Setting Ideas
- Rematch on a meaningful planet (remnants of Planet Vegeta, Earth, Tournament grounds)
- Time element (limited time before destruction of a planet)
- Witnesses (Goku watching but unable to help, Beerus observing)
- Connection to Saiyan heritage or ancestry
"""

# Write to a text file
with open('fanfiction_key_info.txt', 'w') as f:
    f.write(key_info)

print("Key information document created.")