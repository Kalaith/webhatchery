import plotly.graph_objects as go
import pandas as pd
from plotly.subplots import make_subplots

# Create the data
data = {
    "Settlement Tier": ["Hamlet", "Village", "Town", "City"],
    "Population Slots": ["5-10", "11-25", "26-50", "51-100"],
    "Required Infrastructure": ["Basic Shelter, Well, Storage", "Workshops, Market Square, Walls", "Specialized Buildings, Roads, Governance", "Multiple Districts, Advanced Systems"],
    "Available Roles": ["Leader, Crafter, Guard, Farmer, Healer", "All Hamlet + Merchant, Scholar, Builder", "All Village + Captain, Judge, Architect, Priest", "All Town + Governor, Diplomat, Guild Leaders"],
    "Session Requirements": ["2 sessions/week", "3 sessions/week", "3-4 sessions/week", "4-5 sessions/week"],
    "Session Hours": ["2-3 hours", "2-3 hours", "3-4 hours", "3-4 hours"],
    "Expansion Features": ["Basic crafting, Simple events", "Trade routes, Inter-settlement contact", "Advanced crafting, Political systems", "Kingdom formation, Regional influence"]
}

df = pd.DataFrame(data)

# Extract population numbers for visualization
pop_ranges = []
for pop_slot in df["Population Slots"]:
    range_parts = pop_slot.split("-")
    max_pop = int(range_parts[1])
    pop_ranges.append(max_pop)

# Map infrastructure to symbols
infra_symbols = {
    "Hamlet": "🏠 🧱 🌊",  # shelter, storage, well
    "Village": "🛖 🏪 🧱",  # workshops, market, walls
    "Town": "🏛️ 🛣️ 🏢",    # specialized buildings, roads, governance
    "City": "🏙️ 🌉 ⚙️"      # districts, advanced systems
}

# Role counts by tier
role_counts = [5, 8, 12, 16]

# Create color progression from rural to urban
colors = ['#ECEBD5', '#D2BA4C', '#5D878F', '#1FB8CD']  # Light green to strong cyan progression

# Create a figure with subplot to add the game-like border effect
fig = make_subplots(rows=1, cols=1)

# Add main population bars
bar = go.Bar(
    x=df["Settlement Tier"],
    y=pop_ranges,
    marker_color=colors,
    name="Max Population",
    text=[f"Pop: {pop}" for pop in df["Population Slots"]],
    textposition="inside",
    textfont=dict(size=13, color="white"),
    hoverinfo="text",
    hovertext=[
        f"<b>{tier}</b><br>Population: {pop}<br>Roles: {role_count}<br>{session} ({hours})<br>{feat[:15]}"
        for tier, pop, role_count, session, hours, feat in zip(
            df["Settlement Tier"], 
            df["Population Slots"], 
            role_counts,
            df["Session Requirements"],
            df["Session Hours"],
            df["Expansion Features"]
        )
    ]
)

fig.add_trace(bar)

# Add decorative background for game-like feel with rectangles
for i, tier in enumerate(df["Settlement Tier"]):
    # Add a background rectangle for each tier
    fig.add_shape(
        type="rect", 
        x0=i-0.4, x1=i+0.4, 
        y0=0, y1=pop_ranges[i]+25, 
        fillcolor=colors[i], 
        opacity=0.15, 
        line=dict(width=0),
        layer="below"
    )
    
    # Add border around each section
    fig.add_shape(
        type="rect", 
        x0=i-0.4, x1=i+0.4, 
        y0=0, y1=pop_ranges[i]+25, 
        fillcolor="rgba(0,0,0,0)", 
        line=dict(color=colors[i], width=2, dash="solid"),
        layer="below"
    )

# Add session requirement labels
for i, (session, hours) in enumerate(zip(df["Session Requirements"], df["Session Hours"])):
    y_pos = pop_ranges[i] - 15
    fig.add_annotation(
        x=i, y=y_pos,
        text=f"<b>{session}</b>",
        showarrow=False,
        font=dict(size=11, color="white"),
        bgcolor=colors[i],
        opacity=0.9,
        borderpad=4,
        align="center"
    )

# Add infrastructure symbols
for i, tier in enumerate(df["Settlement Tier"]):
    fig.add_annotation(
        x=i, y=pop_ranges[i] + 15,
        text=f"<b>Infrastructure</b><br>{infra_symbols[tier]}",
        showarrow=False,
        font=dict(size=11),
        bgcolor="rgba(255,255,255,0.85)",
        bordercolor=colors[i],
        borderwidth=2,
        borderpad=4,
        align="center"
    )

# Add role counts with simple icons
for i, (tier, count) in enumerate(zip(df["Settlement Tier"], role_counts)):
    # Create a string of person icons based on role count
    if count <= 10:
        role_icons = "👤 " * count
    else:
        role_icons = "👤 x" + str(count)
        
    fig.add_annotation(
        x=i, y=pop_ranges[i] - 30,
        text=f"<b>Roles</b><br>{role_icons}",
        showarrow=False,
        font=dict(size=11),
        bgcolor="rgba(255,255,255,0.85)",
        bordercolor=colors[i],
        borderwidth=2,
        borderpad=4,
        align="center"
    )

# Add expansion features
for i, features in enumerate(df["Expansion Features"]):
    # Abbreviate features
    if i == 0:
        feature_text = "Basic Craft"
    elif i == 1:
        feature_text = "Trade Routes"
    elif i == 2:
        feature_text = "Politics"
    else:
        feature_text = "Kingdom"
        
    # Add feature text
    y_pos = 10  # Position at the bottom
    fig.add_annotation(
        x=i, y=y_pos,
        text=f"<b>{feature_text}</b>",
        showarrow=False,
        font=dict(size=11),
        bgcolor="rgba(255,255,255,0.85)",
        bordercolor=colors[i],
        borderwidth=2,
        borderpad=4,
        align="center"
    )

# Add prominent progression arrows
for i in range(len(df) - 1):
    fig.add_annotation(
        x=i + 0.5,
        y=max(pop_ranges) * 0.5,
        text="➡️",
        showarrow=False,
        font=dict(size=28),
        xanchor="center"
    )

# Add title with game-like border
fig.add_annotation(
    x=0.5, y=1.12,
    xref="paper", yref="paper",
    text="<b>Settlement Progression System</b>",
    showarrow=False,
    font=dict(size=20),
    align="center",
    bgcolor="rgba(255,255,255,0.85)",
    bordercolor="#5D878F",
    borderwidth=2,
    borderpad=10
)

# Update layout
fig.update_layout(
    xaxis_title="Settlement Tier",
    yaxis_title="Max Population",
    showlegend=False,
    template="perplexity",
    margin=dict(t=100),
    plot_bgcolor="rgba(240,240,240,0.5)"
)

# Update axes
fig.update_xaxes(showgrid=False)
fig.update_yaxes(showgrid=True, gridcolor="rgba(200,200,200,0.2)")

# Save the chart
fig.write_image("settlement_progression_chart.png")