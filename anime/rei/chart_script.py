import pandas as pd
import plotly.graph_objects as go

# Create DataFrame from provided data
data = {
    "phases": ["Rei I", "Rei II (Ep 1-6)", "Rei II (Ep 7-23)", "Rei III (Ep 24-26)", 
               "End of Evangelion", "Rebuild 1.0-2.0", "Rei Q (3.0)", "Rebuild 3.0+1.0"],
    "emotional_development": [10, 15, 50, 30, 70, 80, 25, 90],
    "agency_free_will": [5, 20, 45, 30, 85, 60, 40, 80]
}

df = pd.DataFrame(data)

# Create shortened x-axis labels to stay under 15 chars
short_phases = ["Rei I", "Rei II (1-6)", "Rei II (7-23)", "Rei III", 
                "End of Eva", "Rebuild 1-2", "Rei Q", "Rebuild 3+1"]

# Create a figure
fig = go.Figure()

# Add traces for each line
fig.add_trace(go.Scatter(
    x=short_phases, 
    y=df["emotional_development"],
    mode='lines+markers',
    name='Emotion',
    line=dict(color='#1FB8CD', width=3),
    marker=dict(size=8),
    cliponaxis=False
))

fig.add_trace(go.Scatter(
    x=short_phases, 
    y=df["agency_free_will"],
    mode='lines+markers',
    name='Agency',
    line=dict(color='#FFC185', width=3),
    marker=dict(size=8),
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title="Rei Ayanami's Character Development",
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Update axes
fig.update_xaxes(title="Series Phase")
fig.update_yaxes(title="Development", range=[0, 100])

# Save the chart
output_file = "rei_character_development.png"
fig.write_image(output_file)

# Display the chart
fig