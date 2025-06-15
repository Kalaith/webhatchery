import pandas as pd
import numpy as np

# Create a DataFrame for Vegeta's transformations and power levels
vegeta_transformations = pd.DataFrame({
    'Transformation': ['Base Form', 'Super Saiyan', 'Super Saiyan 2', 'Super Saiyan God', 
                       'Super Saiyan Blue', 'Super Saiyan Blue Evolved', 'Ultra Ego'],
    'Power Level (Relative)': [1, 50, 100, 500, 5000, 10000, 25000],
    'Description': [
        'Vegeta\'s natural state, still extremely powerful',
        'The legendary transformation that increases power 50x',
        'The ascended state, twice as powerful as Super Saiyan',
        'Divine ki transformation with godly power',
        'Combination of Super Saiyan with God ki',
        'Enhanced version of Blue with greater power output',
        'Trained by Beerus, focuses on destruction energy, grows stronger with damage'
    ]
})

# Create a DataFrame for Frieza's transformations and power levels
frieza_transformations = pd.DataFrame({
    'Transformation': ['First Form', 'Second Form', 'Third Form', 'Final Form', 
                       'Full Power (100%)', 'Golden Frieza', 'Black Frieza'],
    'Power Level (Relative)': [530, 1060, 2120, 12000, 120000, 15000, 30000],
    'Description': [
        'Suppressed form to conserve energy',
        'Twice as powerful as first form, more brutish',
        'More alien appearance with elongated head',
        'Sleek, compact form with tremendous power',
        'Maximum output of Final Form',
        'Achieved through intense training, golden color',
        'Beyond Golden, achieved after 10 years training in Hyperbolic Time Chamber'
    ]
})

# Save the DataFrames to CSV files
vegeta_transformations.to_csv('vegeta_transformations.csv', index=False)
frieza_transformations.to_csv('frieza_transformations.csv', index=False)

print("Vegeta's Transformations:")
print(vegeta_transformations[['Transformation', 'Power Level (Relative)']])
print("\nFrieza's Transformations:")
print(frieza_transformations[['Transformation', 'Power Level (Relative)']])

# Create a DataFrame for Vegeta's key abilities
vegeta_abilities = pd.DataFrame({
    'Ability': ['Galick Gun', 'Big Bang Attack', 'Final Flash', 'Final Explosion', 
                'Hakai Energy', 'God Heat Flash', 'Gamma Burst Flash'],
    'Type': ['Energy Wave', 'Energy Sphere', 'Energy Wave', 'Self-Destruction', 
             'Destruction', 'Energy Wave', 'Energy Wave'],
    'Description': [
        'Vegeta\'s signature purple energy wave',
        'Condensed energy sphere with massive explosive power',
        'Powerful two-handed energy wave with charging time',
        'Converting life force into massive explosion (survivable in later forms)',
        'Destruction energy learned from Beerus, erases matter',
        'Powerful heat-based energy attack used in God form',
        'Ultra Ego\'s ultimate attack, devastatingly powerful'
    ]
})

# Create a DataFrame for Frieza's key abilities
frieza_abilities = pd.DataFrame({
    'Ability': ['Death Beam', 'Death Ball', 'Nova Strike', 'Supernova', 
                'Death Cannon', 'Earth Breaker', 'Psychokinesis'],
    'Type': ['Precision Beam', 'Energy Sphere', 'Body Attack', 'Planet Destroyer', 
             'Energy Wave', 'Ground Attack', 'Telekinesis'],
    'Description': [
        'Quick, precise finger beam that pierces targets',
        'Large energy sphere capable of destroying planets',
        'Surrounding body with energy and charging opponents',
        'Massive version of Death Ball used to destroy Planet Vegeta',
        'Powerful energy wave fired from palm',
        'Quick planet-destroying attack from a single finger',
        'Mental powers to control objects and opponents'
    ]
})

# Save the DataFrames to CSV files
vegeta_abilities.to_csv('vegeta_abilities.csv', index=False)
frieza_abilities.to_csv('frieza_abilities.csv', index=False)

print("\nVegeta's Abilities:")
print(vegeta_abilities[['Ability', 'Type']])
print("\nFrieza's Abilities:")
print(frieza_abilities[['Ability', 'Type']])