import plotly.graph_objects as go
import plotly.io as pio
import math

# Define colors for different categories
colors = {
    'start': '#1FB8CD',      # Strong cyan
    'loop': '#FFC185',       # Light orange  
    'tech': '#ECEBD5',       # Light green
    'resources': '#5D878F',  # Cyan
    'needs': '#D2BA4C',      # Moderate yellow
    'exploration': '#B4413C', # Moderate red
    'goals': '#964325'       # Dark orange
}

# Create figure
fig = go.Figure()

# Add invisible scatter plot to set up the coordinate system
fig.add_trace(go.Scatter(
    x=[0, 14], y=[0, 12],
    mode='markers',
    marker=dict(size=0, opacity=0),
    showlegend=False
))

# Starting State - more prominent
fig.add_shape(type="rect", x0=5, y0=10.5, x1=9, y1=11.5,
              fillcolor=colors['start'], line=dict(color="black", width=3))
fig.add_annotation(x=7, y=11.2, text="Crash-landed AI + Life Support", showarrow=False, font=dict(size=12, color="black"))
fig.add_annotation(x=7, y=10.8, text="3 Colonists: Chen, Rodriguez, Williams", showarrow=False, font=dict(size=10, color="black"))

# Core Gameplay Loop - circular arrangement
center_x, center_y = 7, 8.5
radius = 1.2
loop_steps = ["Manage\nColonists", "Send\nExploration", "Discover\nResources", "Research\nTech", "Expand\nColony"]
angles = [i * 2 * math.pi / len(loop_steps) - math.pi/2 for i in range(len(loop_steps))]

loop_positions = []
for i, (step, angle) in enumerate(zip(loop_steps, angles)):
    x = center_x + radius * math.cos(angle)
    y = center_y + radius * math.sin(angle)
    loop_positions.append((x, y))
    
    # Add boxes for loop steps
    fig.add_shape(type="rect", x0=x-0.6, y0=y-0.4, x1=x+0.6, y1=y+0.4,
                  fillcolor=colors['loop'], line=dict(color="black", width=2))
    fig.add_annotation(x=x, y=y, text=step, showarrow=False, font=dict(size=9, color="black"))

# Add circular arrows between loop steps
for i in range(len(loop_positions)):
    current = loop_positions[i]
    next_pos = loop_positions[(i + 1) % len(loop_positions)]
    
    # Calculate arrow position slightly outside the boxes
    angle_to_next = math.atan2(next_pos[1] - current[1], next_pos[0] - current[0])
    arrow_start_x = current[0] + 0.6 * math.cos(angle_to_next)
    arrow_start_y = current[1] + 0.4 * math.sin(angle_to_next)
    arrow_end_x = next_pos[0] - 0.6 * math.cos(angle_to_next)
    arrow_end_y = next_pos[1] - 0.4 * math.sin(angle_to_next)
    
    fig.add_annotation(x=arrow_end_x, y=arrow_end_y, ax=arrow_start_x, ay=arrow_start_y,
                      arrowhead=2, arrowsize=1.5, arrowwidth=3, arrowcolor="black")

# Arrow from start to loop
fig.add_annotation(x=7, y=9.3, ax=7, ay=10.4, arrowhead=2, arrowsize=2, arrowwidth=3, arrowcolor="black")

# Tech Branches - better spaced on left
tech_data = [
    ("Survival", ["Food Prod", "Water Purif", "Shelter"]),
    ("Energy", ["Solar", "Geothermal", "Storage"]),
    ("Construction", ["Robotics", "Manufact", "Materials"])
]

for i, (branch, items) in enumerate(tech_data):
    y_pos = 6.5 - i * 2
    
    # Branch header - larger
    fig.add_shape(type="rect", x0=0.3, y0=y_pos, x1=2.2, y1=y_pos+0.6,
                  fillcolor=colors['tech'], line=dict(color="black", width=2))
    fig.add_annotation(x=1.25, y=y_pos+0.3, text=f"{branch} Tech", showarrow=False, font=dict(size=10, color="black"))
    
    # Branch items - better spaced
    for j, item in enumerate(items):
        item_x = 2.8 + j * 1.5
        fig.add_shape(type="rect", x0=item_x, y0=y_pos, x1=item_x+1.3, y1=y_pos+0.6,
                      fillcolor=colors['tech'], line=dict(color="black", width=1))
        fig.add_annotation(x=item_x+0.65, y=y_pos+0.3, text=item, showarrow=False, font=dict(size=9, color="black"))
        
        # Arrow from branch to first item or between items
        if j == 0:
            fig.add_annotation(x=item_x-0.1, y=y_pos+0.3, ax=2.3, ay=y_pos+0.3, 
                              arrowhead=2, arrowsize=1, arrowwidth=2, arrowcolor="black")
        else:
            prev_item_x = 2.8 + (j-1) * 1.5
            fig.add_annotation(x=item_x-0.1, y=y_pos+0.3, ax=prev_item_x+1.4, ay=y_pos+0.3, 
                              arrowhead=2, arrowsize=1, arrowwidth=2, arrowcolor="black")

# Arrow from Research Tech in loop to Tech Trees
research_pos = loop_positions[3]  # Research Tech position
fig.add_annotation(x=2.5, y=6.5, ax=research_pos[0]-0.6, ay=research_pos[1], 
                  arrowhead=2, arrowsize=1.5, arrowwidth=3, arrowcolor="black")

# Resources - better positioned on right
resources = ["Power", "Oxygen", "Food", "Water", "Materials", "Rare Elem"]
for i, resource in enumerate(resources):
    x_pos = 11
    y_pos = 7.5 - i * 0.6
    fig.add_shape(type="rect", x0=x_pos, y0=y_pos, x1=x_pos+2, y1=y_pos+0.5,
                  fillcolor=colors['resources'], line=dict(color="white", width=1))
    fig.add_annotation(x=x_pos+1, y=y_pos+0.25, text=resource, showarrow=False, font=dict(size=10, color="white"))

# Arrow from Discover Resources to Resources
discover_pos = loop_positions[2]  # Discover Resources position
fig.add_annotation(x=10.8, y=6.5, ax=discover_pos[0]+0.6, ay=discover_pos[1], 
                  arrowhead=2, arrowsize=1.5, arrowwidth=3, arrowcolor="black")

# Colonist Needs - better positioned
needs = ["Health", "Hunger", "Rest", "Morale"]
for i, need in enumerate(needs):
    x_pos = 11
    y_pos = 3.5 - i * 0.6
    fig.add_shape(type="rect", x0=x_pos, y0=y_pos, x1=x_pos+2, y1=y_pos+0.5,
                  fillcolor=colors['needs'], line=dict(color="black", width=1))
    fig.add_annotation(x=x_pos+1, y=y_pos+0.25, text=need, showarrow=False, font=dict(size=10, color="black"))

# Arrow from Manage Colonists to Needs
manage_pos = loop_positions[0]  # Manage Colonists position
fig.add_annotation(x=10.8, y=3, ax=manage_pos[0]+0.6, ay=manage_pos[1], 
                  arrowhead=2, arrowsize=1.5, arrowwidth=3, arrowcolor="black")

# Exploration Areas - better positioned on left
exploration = [("Nearby Crater", "Easy"), ("Crystal Fields", "Medium"), ("Ancient Ruins", "Hard")]
for i, (area, difficulty) in enumerate(exploration):
    y_pos = 3.5 - i * 0.8
    fig.add_shape(type="rect", x0=0.3, y0=y_pos, x1=2.8, y1=y_pos+0.6,
                  fillcolor=colors['exploration'], line=dict(color="white", width=1))
    fig.add_annotation(x=1.55, y=y_pos+0.4, text=area, showarrow=False, font=dict(size=9, color="white"))
    fig.add_annotation(x=1.55, y=y_pos+0.2, text=f"Difficulty: {difficulty}", showarrow=False, font=dict(size=8, color="white"))

# Arrow from Send Exploration to Exploration Areas
explore_pos = loop_positions[1]  # Send Exploration position
fig.add_annotation(x=3, y=3.5, ax=explore_pos[0]-0.6, ay=explore_pos[1], 
                  arrowhead=2, arrowsize=1.5, arrowwidth=3, arrowcolor="black")

# End Goals - better positioned
fig.add_shape(type="rect", x0=5, y0=0.5, x1=9, y1=1.3,
              fillcolor=colors['goals'], line=dict(color="white", width=3))
fig.add_annotation(x=7, y=0.9, text="Long-term Survival & Prosperity", showarrow=False, font=dict(size=12, color="white"))

# Arrow from Expand Colony to End Goals
expand_pos = loop_positions[4]  # Expand Colony position
fig.add_annotation(x=7, y=1.4, ax=expand_pos[0], ay=expand_pos[1]-0.4, 
                  arrowhead=2, arrowsize=2, arrowwidth=3, arrowcolor="black")

# Add section labels with better positioning
fig.add_annotation(x=7, y=9.8, text="CORE GAMEPLAY LOOP", showarrow=False, 
                  font=dict(size=14, color="black", family="Arial Black"),
                  bgcolor="white", bordercolor="black", borderwidth=1)

fig.add_annotation(x=3.5, y=7.8, text="TECHNOLOGY TREES", showarrow=False, 
                  font=dict(size=12, color="black", family="Arial Black"))

fig.add_annotation(x=12, y=8.2, text="RESOURCES", showarrow=False, 
                  font=dict(size=12, color="black", family="Arial Black"))

fig.add_annotation(x=12, y=4.2, text="COLONIST NEEDS", showarrow=False, 
                  font=dict(size=12, color="black", family="Arial Black"))

fig.add_annotation(x=1.55, y=4.8, text="EXPLORATION AREAS", showarrow=False, 
                  font=dict(size=12, color="black", family="Arial Black"))

# Update layout
fig.update_layout(
    title="Space Colony Game Progression",
    xaxis=dict(visible=False, range=[-0.5, 14]),
    yaxis=dict(visible=False, range=[0, 12.5]),
    showlegend=False,
    plot_bgcolor='white',
    paper_bgcolor='white'
)

# Save the chart
fig.write_image("space_colony_flowchart.png", width=1400, height=1000)