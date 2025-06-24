import plotly.graph_objects as go
import numpy as np
import math

# Systems data with brand colors
systems_data = [
    {
        "name": "Character Prog",
        "color": "#1FB8CD",
        "features": ["Skill-based", "No classes", "Lateral adv", "Attributes"]
    },
    {
        "name": "Craft & Economy", 
        "color": "#FFC185",
        "features": ["Resources", "Recipes", "Marketplace", "Durability"]
    },
    {
        "name": "PvP & Combat",
        "color": "#ECEBD5",
        "features": ["Open PvP", "Guild wars", "Territory", "Reputation"]
    },
    {
        "name": "Social Systems",
        "color": "#5D878F",
        "features": ["Guilds", "Alliances", "Housing", "Events"]
    },
    {
        "name": "World Systems",
        "color": "#D2BA4C",
        "features": ["Dynamic evt", "Persistent", "Exploration", "Player cont"]
    }
]

fig = go.Figure()

# Central node
fig.add_trace(go.Scatter(
    x=[0], y=[0],
    mode='markers+text',
    marker=dict(size=80, color='#13343B', line=dict(width=3, color='white')),
    text=['MMORPG Core'],
    textposition='middle center',
    textfont=dict(size=14, color='white', family='Arial Black'),
    showlegend=False,
    hoverinfo='skip'
))

# Position main systems in a circle around center
num_systems = len(systems_data)
radius = 3

for i, system in enumerate(systems_data):
    # Calculate angle for even distribution
    angle = 2 * math.pi * i / num_systems
    x_main = radius * math.cos(angle)
    y_main = radius * math.sin(angle)
    
    # Add main system node
    fig.add_trace(go.Scatter(
        x=[x_main], y=[y_main],
        mode='markers+text',
        marker=dict(size=60, color=system["color"], line=dict(width=2, color='white')),
        text=[system["name"]],
        textposition='middle center',
        textfont=dict(size=12, color='black'),
        showlegend=False,
        hoverinfo='skip'
    ))
    
    # Add line from center to main system
    fig.add_trace(go.Scatter(
        x=[0, x_main], y=[0, y_main],
        mode='lines',
        line=dict(color=system["color"], width=3),
        showlegend=False,
        hoverinfo='skip'
    ))
    
    # Add feature nodes around each main system
    feature_radius = 1.5
    for j, feature in enumerate(system["features"]):
        # Calculate angle for features around main system
        feature_angle = angle + (j - 1.5) * 0.4  # Spread features around main node
        x_feature = x_main + feature_radius * math.cos(feature_angle)
        y_feature = y_main + feature_radius * math.sin(feature_angle)
        
        # Add feature node
        fig.add_trace(go.Scatter(
            x=[x_feature], y=[y_feature],
            mode='markers+text',
            marker=dict(size=30, color=system["color"], opacity=0.7, 
                       line=dict(width=1, color='white')),
            text=[feature],
            textposition='middle center',
            textfont=dict(size=10, color='black'),
            showlegend=False,
            hoverinfo='skip'
        ))
        
        # Add line from main system to feature
        fig.add_trace(go.Scatter(
            x=[x_main, x_feature], y=[y_main, y_feature],
            mode='lines',
            line=dict(color=system["color"], width=2, dash='dot'),
            showlegend=False,
            hoverinfo='skip'
        ))

# Update layout
fig.update_layout(
    title="MMORPG Sandbox Core Systems",
    title_x=0.5,
    showlegend=False,
    xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
    yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
    plot_bgcolor='white',
    paper_bgcolor='white'
)

# Save the chart
fig.write_image("mmorpg_systems_mindmap.png")