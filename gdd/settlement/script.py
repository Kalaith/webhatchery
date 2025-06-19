import pandas as pd
import json

# Create a structured data table showing the settlement progression system
settlement_data = {
    'Settlement Tier': ['Hamlet', 'Village', 'Town', 'City'],
    'Population Slots': ['5-10', '11-25', '26-50', '51-100'],
    'Required Infrastructure': [
        'Basic Shelter, Well, Storage',
        'Workshops, Market Square, Walls',
        'Specialized Buildings, Roads, Governance',
        'Multiple Districts, Advanced Systems'
    ],
    'Available Roles': [
        'Leader, Crafter, Guard, Farmer, Healer',
        'All Hamlet + Merchant, Scholar, Builder',
        'All Village + Captain, Judge, Architect, Priest',
        'All Town + Governor, Diplomat, Guild Leaders'
    ],
    'Session Requirements': [
        '2 sessions/week, 2-3 hours',
        '3 sessions/week, 2-3 hours', 
        '3-4 sessions/week, 3-4 hours',
        '4-5 sessions/week, 3-4 hours'
    ],
    'Expansion Features': [
        'Basic crafting, Simple events',
        'Trade routes, Inter-settlement contact',
        'Advanced crafting, Political systems',
        'Kingdom formation, Regional influence'
    ]
}

settlement_df = pd.DataFrame(settlement_data)
print("Settlement Progression System:")
print(settlement_df.to_string(index=False))

# Save as CSV for potential chart creation
settlement_df.to_csv('settlement_progression.csv', index=False)

print("\n" + "="*80)

# Create a role-based mechanics breakdown
role_mechanics_data = {
    'Role': ['Blacksmith', 'Merchant', 'Guard Captain', 'Healer', 'Scholar', 'Farmer', 'Builder'],
    'Primary Mechanics': [
        'Item Crafting, Repair Systems',
        'Trade Management, Price Setting',
        'Defense Coordination, Patrol Routes',
        'Medical Treatment, Herb Gathering',
        'Research, Knowledge Management',
        'Food Production, Livestock',
        'Construction, Infrastructure'
    ],
    'Resource Contributions': [
        'Tools, Weapons, Metal Goods',
        'Trade Income, External Relations',
        'Security, Military Equipment',
        'Medical Supplies, Potions',
        'Technology, Information',
        'Food, Raw Materials',
        'Buildings, Infrastructure'
    ],
    'Social Responsibilities': [
        'Equipment Maintenance, Apprenticeships',
        'Economic Planning, Trade Negotiations',
        'Community Safety, Conflict Resolution',
        'Community Health, Emergency Response',
        'Education, Record Keeping',
        'Food Security, Agricultural Planning',
        'Urban Planning, Project Management'
    ],
    'Unique Abilities': [
        'Master Crafting, Quality Bonuses',
        'Market Analysis, Trade Route Access',
        'Combat Leadership, Tactical Planning',
        'Advanced Healing, Disease Prevention',
        'Research Projects, Innovation',
        'Crop Optimization, Weather Prediction',
        'Efficient Construction, Resource Estimation'
    ]
}

role_df = pd.DataFrame(role_mechanics_data)
print("Role-Based Mechanics System:")
print(role_df.to_string(index=False))

# Save as CSV
role_df.to_csv('role_mechanics.csv', index=False)

print("\n" + "="*80)

# Create economic flow model
economic_flow = {
    'Economic Component': ['Resource Generation', 'Community Spending', 'NPC Interactions', 'Infrastructure Costs', 'Emergency Events'],
    'Sources': [
        'Role-specific production, Seasonal harvests',
        'Infrastructure projects, Tool maintenance',
        'Trade goods sales, Service provision',
        'Building construction, Upkeep costs',
        'Disaster response, Crisis management'
    ],
    'Sinks': [
        'Raw material consumption, Tool wear',
        'Completed projects, Upgraded facilities',
        'Imported goods, NPC services',
        'Maintenance requirements, Expansion costs',
        'Resource consumption, Reconstruction'
    ],
    'Community Impact': [
        'Sustains daily operations, Enables growth',
        'Improves quality of life, Unlocks features',
        'Provides external connectivity, Income',
        'Enables settlement advancement, Progression',
        'Tests community resilience, Cooperation'
    ]
}

economic_df = pd.DataFrame(economic_flow)
print("Economic Flow Model:")
print(economic_df.to_string(index=False))

# Save as CSV
economic_df.to_csv('economic_flow.csv', index=False)

print("\n" + "="*80)
print("Data files created successfully!")
print("- settlement_progression.csv")
print("- role_mechanics.csv") 
print("- economic_flow.csv")