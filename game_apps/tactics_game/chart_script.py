import plotly.graph_objects as go
import plotly.express as px
import numpy as np
import pandas as pd

# Create the comprehensive Fire Emblem mechanics diagram
fig = go.Figure()

# 1. WEAPON TRIANGLE (Upper Left: x=0-4, y=6-10)
weapons = [
    {'name': 'Sword', 'x': 2, 'y': 9, 'color': '#4A90E2', 'beats': 'Axe'},
    {'name': 'Axe', 'x': 0.5, 'y': 7, 'color': '#E74C3C', 'beats': 'Lance'},
    {'name': 'Lance', 'x': 3.5, 'y': 7, 'color': '#2ECC71', 'beats': 'Sword'}
]

# Add weapon circles
for weapon in weapons:
    fig.add_trace(go.Scatter(
        x=[weapon['x']], y=[weapon['y']],
        mode='markers+text',
        marker=dict(size=50, color=weapon['color'], line=dict(width=2, color='white')),
        text=weapon['name'],
        textposition='middle center',
        textfont=dict(size=12, color='white'),
        showlegend=False,
        hovertemplate=f"<b>{weapon['name']}</b><br>Beats: {weapon['beats']}<extra></extra>"
    ))

# Add triangle arrows
fig.add_annotation(x=1.25, y=8, ax=2, ay=9, arrowhead=2, arrowsize=1, arrowcolor='#4A90E2', arrowwidth=3)
fig.add_annotation(x=2.75, y=7, ax=0.5, ay=7, arrowhead=2, arrowsize=1, arrowcolor='#E74C3C', arrowwidth=3)
fig.add_annotation(x=2.75, y=8, ax=3.5, ay=7, arrowhead=2, arrowsize=1, arrowcolor='#2ECC71', arrowwidth=3)

# Weapon triangle title
fig.add_annotation(x=2, y=10.5, text="<b>Weapon Triangle</b>", showarrow=False, font=dict(size=14))
fig.add_annotation(x=2, y=6.2, text="+15% Atk/Hit", showarrow=False, font=dict(size=10))

# 2. COMBAT CALCULATION (Upper Right: x=6-10, y=6-10)
combat_steps = [
    {'step': 'Base Dmg', 'formula': 'Atk - Def', 'y': 9.5},
    {'step': 'Triangle', 'formula': '±15%', 'y': 8.8},
    {'step': 'Hit Rate', 'formula': 'Base+Triangle', 'y': 8.1},
    {'step': 'Critical', 'formula': '5% + mods', 'y': 7.4},
    {'step': 'Double', 'formula': 'Spd ≥ 4 diff', 'y': 6.7}
]

fig.add_annotation(x=8, y=10.5, text="<b>Combat Calc</b>", showarrow=False, font=dict(size=14))

for i, step in enumerate(combat_steps):
    # Step boxes
    fig.add_shape(type="rect", x0=6.2, y0=step['y']-0.2, x1=9.8, y1=step['y']+0.2,
                  fillcolor='#1FB8CD', opacity=0.7, line=dict(width=1, color='white'))
    
    fig.add_annotation(x=6.5, y=step['y'], text=f"{i+1}.", showarrow=False, font=dict(size=10))
    fig.add_annotation(x=7.2, y=step['y'], text=step['step'], showarrow=False, font=dict(size=10))
    fig.add_annotation(x=9.5, y=step['y'], text=step['formula'], showarrow=False, font=dict(size=9))
    
    # Arrows between steps
    if i < len(combat_steps) - 1:
        fig.add_annotation(x=8, y=step['y']-0.35, ax=8, ay=step['y']-0.25, 
                          arrowhead=1, arrowsize=0.8, arrowcolor='#666666')

# 3. TURN PHASES (Lower Left: x=0-4, y=1-5)
phases = [
    {'name': 'Player Phase', 'color': '#4A90E2', 'x': 2, 'y': 4},
    {'name': 'Enemy Phase', 'color': '#E74C3C', 'x': 2, 'y': 2}
]

fig.add_annotation(x=2, y=5.5, text="<b>Turn Structure</b>", showarrow=False, font=dict(size=14))

for phase in phases:
    fig.add_shape(type="rect", x0=0.5, y0=phase['y']-0.4, x1=3.5, y1=phase['y']+0.4,
                  fillcolor=phase['color'], opacity=0.8, line=dict(width=2, color='white'))
    fig.add_annotation(x=2, y=phase['y'], text=phase['name'], showarrow=False, 
                      font=dict(size=12, color='white'))

# Phase transition arrow
fig.add_annotation(x=2, y=3, ax=2, ay=3.6, arrowhead=2, arrowsize=1.2, arrowcolor='#666666', arrowwidth=3)
fig.add_annotation(x=1.4, y=3, ax=1.4, ay=1.4, arrowhead=2, arrowsize=1.2, arrowcolor='#666666', arrowwidth=3)

# Phase actions
player_actions = ['Select Unit', 'Move', 'Action', 'Execute']
enemy_actions = ['AI Plan', 'Move', 'Attack', 'End Turn']

for i, action in enumerate(player_actions):
    fig.add_annotation(x=0.2 + i*0.9, y=4.7, text=action, showarrow=False, font=dict(size=8))

for i, action in enumerate(enemy_actions):
    fig.add_annotation(x=0.2 + i*0.9, y=1.3, text=action, showarrow=False, font=dict(size=8))

# 4. MOVEMENT GRID (Lower Right: x=6-10, y=1-5)
fig.add_annotation(x=8, y=5.5, text="<b>Movement Grid</b>", showarrow=False, font=dict(size=14))

# Grid squares
grid_size = 0.4
for i in range(5):
    for j in range(5):
        x_pos = 6.2 + i * grid_size
        y_pos = 1.2 + j * grid_size
        
        # Determine square type
        if i == 2 and j == 2:  # Unit position
            color = '#4A90E2'
            opacity = 1.0
        elif abs(i-2) + abs(j-2) <= 1:  # Movement range (adjacent)
            color = '#90CDF4'
            opacity = 0.7
        elif abs(i-2) + abs(j-2) == 2 and (i == 2 or j == 2):  # Attack range
            color = '#FEB2B2'
            opacity = 0.7
        else:  # Empty squares
            color = '#ECEBD5'
            opacity = 0.3
        
        fig.add_shape(type="rect", 
                     x0=x_pos, y0=y_pos, 
                     x1=x_pos + grid_size, y1=y_pos + grid_size,
                     fillcolor=color, opacity=opacity, 
                     line=dict(width=1, color='#666666'))

# Unit marker
fig.add_trace(go.Scatter(
    x=[8], y=[3], mode='markers+text',
    marker=dict(size=20, color='white', symbol='circle', line=dict(width=2, color='#4A90E2')),
    text='U', textposition='middle center',
    textfont=dict(size=10, color='#4A90E2'),
    showlegend=False, hoverinfo='skip'
))

# Legend for grid
fig.add_annotation(x=6.3, y=0.8, text="Unit", showarrow=False, font=dict(size=9, color='#4A90E2'))
fig.add_annotation(x=7.3, y=0.8, text="Move", showarrow=False, font=dict(size=9, color='#4A90E2'))
fig.add_annotation(x=8.3, y=0.8, text="Attack", showarrow=False, font=dict(size=9, color='#E74C3C'))

# Update layout
fig.update_layout(
    title="Fire Emblem Combat Mechanics",
    xaxis=dict(showgrid=False, showticklabels=False, zeroline=False, range=[-0.5, 10.5]),
    yaxis=dict(showgrid=False, showticklabels=False, zeroline=False, range=[0, 11]),
    plot_bgcolor='rgba(0,0,0,0)',
    showlegend=False
)

fig.write_image("fire_emblem_mechanics.png")