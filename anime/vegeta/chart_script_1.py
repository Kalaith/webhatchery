import pandas as pd
import plotly.graph_objects as go
import numpy as np

# Create the data from the provided JSON
data = {
    "years": ["Age 737", "Age 762", "Age 762", "Age 762", "Age 762", "Age 764", "Age 779", "Age 779", "Age 780", "Age 781", "Age 781"],
    "events": [
        "Frieza destroys Planet Vegeta, killing King Vegeta and most Saiyans",
        "Vegeta defects from Frieza Force and fights on Earth", 
        "Vegeta travels to Namek seeking Dragon Balls",
        "Vegeta is killed by Frieza on Namek",
        "Goku defeats Frieza on Namek",
        "Frieza returns as a cyborg and is defeated by Future Trunks",
        "Frieza is resurrected and achieves Golden Form",
        "Vegeta defeats Golden Frieza (after Goku)",
        "Tournament of Power - Vegeta and Frieza fight as allies",
        "Granolah arc - Vegeta achieves Ultra Ego transformation", 
        "Frieza returns with Black Frieza form, defeats Goku and Vegeta"
    ],
    "relationship": [
        "Enemy", "Enemy", "Enemy", "Enemy", "Enemy", 
        "Enemy", "Enemy", "Enemy", "Temporary Ally", 
        "Neutral", "Enemy"
    ]
}

df = pd.DataFrame(data)

# Extract numeric years for plotting
df['numeric_year'] = df['years'].str.extract(r'(\d+)').astype(int)

# Create short labels for events (15 char limit)
short_labels = [
    "Planet Vegeta",
    "Vegeta Defects", 
    "Namek Quest",
    "Vegeta Dies",
    "Goku Wins",
    "Cyborg Frieza",
    "Golden Form",
    "Vegeta Wins",
    "Tournament Ally",
    "Ultra Ego",
    "Black Frieza"
]

df['short_label'] = short_labels

# Define color mapping for relationship stages
color_map = {
    "Enemy": "#B4413C",      # Red for enemy relationship
    "Temporary Ally": "#1FB8CD",  # Cyan for allies
    "Neutral": "#D2BA4C"     # Yellow for neutral
}

# Create a single timeline
fig = go.Figure()

# Add a horizontal line for the timeline
fig.add_shape(
    type="line",
    x0=df['numeric_year'].min() - 5,
    y0=0,
    x1=df['numeric_year'].max() + 5,
    y1=0,
    line=dict(color="#ECEBD5", width=2)
)

# Alternate labels above and below the line to avoid overlap
positions = []
for i in range(len(df)):
    # For events in the same year, adjust vertical positioning
    year_count = df[df['numeric_year'] == df.iloc[i]['numeric_year']].shape[0]
    if year_count > 1:
        # Get index within the year group
        year_idx = df[df['numeric_year'] == df.iloc[i]['numeric_year']].index.get_loc(i)
        if year_idx == 0:
            positions.append(0.3)  # First event in year goes above
        else:
            positions.append(-0.3)  # Second event in year goes below
    else:
        # Alternate positions for single events in a year
        if i % 2 == 0:
            positions.append(0.3)
        else:
            positions.append(-0.3)

df['position'] = positions

# Add events as markers on the timeline
for i, row in df.iterrows():
    # Get color based on relationship
    color = color_map[row['relationship']]
    
    # Add marker
    fig.add_trace(go.Scatter(
        x=[row['numeric_year']],
        y=[0],  # All on same line
        mode='markers',
        marker=dict(
            size=15,
            color=color,
            line=dict(width=2, color='white')
        ),
        hoverinfo='text',
        hovertext=f"{row['years']}: {row['events']}",
        showlegend=False
    ))
    
    # Add text label
    fig.add_trace(go.Scatter(
        x=[row['numeric_year']],
        y=[row['position']],  # Alternate above/below
        mode='text',
        text=row['short_label'],
        textposition="middle center",
        hoverinfo='skip',
        showlegend=False
    ))

# Create a color legend for relationship types
for rel_type in color_map:
    fig.add_trace(go.Scatter(
        x=[None],
        y=[None],
        mode='markers',
        marker=dict(size=10, color=color_map[rel_type]),
        name=rel_type,
        showlegend=True
    ))

# Update layout
fig.update_layout(
    title="Vegeta & Frieza Timeline",
    xaxis_title="Age",
    legend=dict(
        orientation='h',
        yanchor='bottom',
        y=1.05,
        xanchor='center',
        x=0.5
    ),
    xaxis=dict(
        tickmode='array',
        tickvals=sorted(df['numeric_year'].unique()),
        ticktext=[f"Age {y}" for y in sorted(df['numeric_year'].unique())]
    )
)

# Hide y-axis as it doesn't represent any value
fig.update_yaxes(visible=False, showticklabels=False)

# Save the chart
fig.write_image("vegeta_frieza_timeline.png")