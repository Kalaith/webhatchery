import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Load the data
df = pd.read_csv('dnd_cr_chart_data.csv')

# Define colors for monster categories
colors = ['#1FB8CD', '#FFC185', '#ECEBD5', '#5D878F', '#D2BA4C', 
          '#B4413C', '#964325', '#944454', '#13343B', '#DB4545', 
          '#1FB8CD', '#FFC185', '#ECEBD5', '#5D878F']

# Create a mapping of monster categories to colors
category_colors = {}
unique_categories = df['Monster_Category'].unique()
for i, category in enumerate(unique_categories):
    category_colors[category] = colors[i % len(colors)]

# Create subplot with secondary y-axis
fig = make_subplots(specs=[[{"secondary_y": True}]])

# Add bars for each monster category
for category in unique_categories:
    category_data = df[df['Monster_Category'] == category]
    fig.add_trace(
        go.Bar(
            x=category_data['Challenge_Rating'],
            y=category_data['XP_Value'],
            name=category[:15],  # Truncate to 15 characters
            marker_color=category_colors[category],
            cliponaxis=False
        ),
        secondary_y=False,
    )

# Add line chart for Party Level
fig.add_trace(
    go.Scatter(
        x=df['Challenge_Rating'],
        y=df['Party_Level_Numeric'],
        mode='lines+markers',
        name='Party Level',
        line=dict(color='#DB4545', width=3),
        marker=dict(size=6),
        cliponaxis=False
    ),
    secondary_y=True,
)

# Set x-axis title
fig.update_xaxes(title_text="Challenge Rating")

# Set y-axes titles
fig.update_yaxes(title_text="XP Value", type="log", secondary_y=False)
fig.update_yaxes(title_text="Recommended Party Level", secondary_y=True)

# Update layout
fig.update_layout(
    title="D&D 5e Challenge Rating Progression",
    showlegend=True
)

# Save the chart
fig.write_image("dnd_cr_progression.png")