import plotly.graph_objects as go
import pandas as pd
import json

# Load the data
data = {"transformations": ["Ultra Ego Vegeta", "Black Frieza"], "power_levels": [25000, 30000]}

# Create DataFrame
df = pd.DataFrame(data)

# Create the bar chart
fig = go.Figure()

# Add bars with specific colors
fig.add_trace(go.Bar(
    x=df['transformations'],
    y=df['power_levels'],
    marker_color=['#1FB8CD', '#944454'],  # Blue for Vegeta, Purple for Frieza
    text=df['power_levels'].apply(lambda x: f"{x/1000:.0f}k"),
    textposition='auto',
    cliponaxis=False
))

# Add horizontal line at 30000
fig.add_shape(
    type="line",
    x0=-0.5,
    y0=30000,
    x1=1.5,
    y1=30000,
    line=dict(color="#DB4545", width=2, dash="dash")
)

# Update layout
fig.update_layout(
    title="Ultimate Forms: Vegeta vs. Frieza",
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5),
    uniformtext_minsize=14, 
    uniformtext_mode='hide'
)

# Update axis labels
fig.update_xaxes(title="Transformations")
fig.update_yaxes(title="Power Level")

# Save the chart
fig.write_image("vegeta_frieza_power.png")

# Display the chart
fig