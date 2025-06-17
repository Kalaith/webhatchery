import pandas as pd

# Create a comprehensive colonist management table
colonist_data = {
    'Colonist': ['Dr. Sarah Chen', 'Engineer Rodriguez', 'Scout Williams'],
    'Specialization': ['Scientist', 'Engineer', 'Explorer'],
    'Starting Health': [100, 100, 100],
    'Starting Hunger': [85, 80, 90],
    'Starting Rest': [90, 85, 95],
    'Starting Morale': [75, 80, 85],
    'Exploration Skill': [7, 6, 9],
    'Special Abilities': [
        'Faster tech research, Better discoveries',
        'Improved construction, Equipment repair',
        'Higher survival rate, More discoveries'
    ]
}

colonist_df = pd.DataFrame(colonist_data)

# Create tech tree progression table
tech_tree_data = {
    'Tech Branch': ['Survival', 'Survival', 'Survival', 'Energy', 'Energy', 'Energy', 'Construction', 'Construction', 'Construction'],
    'Technology': ['Food Production', 'Water Purification', 'Shelter Construction', 'Solar Panels', 'Geothermal', 'Power Storage', 'Robotics', 'Manufacturing', 'Advanced Materials'],
    'Required Discovery': ['Organic Samples', 'Water Source', 'Building Materials', 'Solar Crystals', 'Geothermal Vents', 'Energy Crystals', 'Metal Alloys + Circuits', 'Manufacturing Site', 'Rare Minerals'],
    'Material Cost': [5, 3, 8, 10, 15, 7, 20, 25, 0],
    'Rare Elements Cost': [0, 0, 0, 0, 2, 0, 5, 0, 10],
    'Benefits': [
        'Produces 5 food/hour',
        'Produces 3 water/hour',
        'Reduces morale decay',
        'Generates 10 power/hour',
        'Generates 20 power/hour',
        'Stores 50 power units',
        'Automated resource gathering',
        'Produces materials from raw resources',
        'Unlocks advanced structures'
    ]
}

tech_df = pd.DataFrame(tech_tree_data)

# Create exploration areas table
exploration_data = {
    'Area': ['Nearby Crater', 'Crystal Fields', 'Ancient Ruins'],
    'Difficulty': ['Easy (1)', 'Medium (2)', 'Hard (3)'],
    'Time Required': ['30 seconds', '60 seconds', '90 seconds'],
    'Risk Level': ['Low', 'Medium', 'High'],
    'Possible Discoveries': [
        'Water Source, Basic Materials, Organic Samples',
        'Energy Crystals, Solar Crystals, Rare Minerals',
        'Circuit Components, Manufacturing Site, Alien Technology'
    ],
    'Unlock Requirements': ['Available from start', 'Available from start', 'Requires advanced tech']
}

exploration_df = pd.DataFrame(exploration_data)

# Create resource management table
resource_data = {
    'Resource': ['Power', 'Oxygen', 'Food', 'Water', 'Materials', 'Rare Elements'],
    'Starting Amount': [100, 80, 10, 10, 5, 0],
    'Consumption Rate': ['-1/hour', '-0.5/hour', '-0.3/colonist/hour', '-0.2/colonist/hour', 'Used for construction', 'Used for advanced tech'],
    'Production Methods': [
        'Solar panels, Geothermal',
        'Life support (automatic)',
        'Food production facility',
        'Water purification facility',
        'Exploration, Manufacturing',
        'Exploration of dangerous areas'
    ],
    'Critical Threshold': [20, 30, 2, 2, 'N/A', 'N/A']
}

resource_df = pd.DataFrame(resource_data)

# Save all tables to CSV files
colonist_df.to_csv('colonist_management.csv', index=False)
tech_df.to_csv('tech_tree_progression.csv', index=False)
exploration_df.to_csv('exploration_areas.csv', index=False)
resource_df.to_csv('resource_management.csv', index=False)

print("Game Mechanics Summary Tables Created:")
print("\n1. COLONIST MANAGEMENT:")
print(colonist_df.to_string(index=False))
print("\n2. TECH TREE PROGRESSION:")
print(tech_df.to_string(index=False))
print("\n3. EXPLORATION AREAS:")
print(exploration_df.to_string(index=False))
print("\n4. RESOURCE MANAGEMENT:")
print(resource_df.to_string(index=False))