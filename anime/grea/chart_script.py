import pandas as pd
import plotly.graph_objects as go
import plotly.io as pio

# Load the data
df = pd.read_csv('grea_character_development.csv')

# Create the figure
fig = go.Figure()

# Add Relationship_Depth line
fig.add_trace(go.Scatter(
    x=df['Episode'],
    y=df['Relationship_Depth'],
    mode='lines+markers',
    name='Relationship',
    line=dict(color='#1FB8CD', width=3),
    marker=dict(size=8),
    hovertemplate='<b>Episode %{x}</b><br>' +
                  'Relationship: %{y}<br>' +
                  '<extra></extra>',
    cliponaxis=False
))

# Add Character_Confidence line
fig.add_trace(go.Scatter(
    x=df['Episode'],
    y=df['Character_Confidence'],
    mode='lines+markers',
    name='Confidence',
    line=dict(color='#FFC185', width=3),
    marker=dict(size=8),
    hovertemplate='<b>Episode %{x}</b><br>' +
                  'Confidence: %{y}<br>' +
                  '<extra></extra>',
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title='Grea Character Development',
    xaxis_title='Episode',
    yaxis_title='Score (1-10)',
    legend=dict(
        orientation='h',
        yanchor='bottom',
        y=1.05,
        xanchor='center',
        x=0.5
    )
)

# Update axes
fig.update_xaxes(
    tickmode='linear',
    tick0=1,
    dtick=1
)

fig.update_yaxes(
    range=[0, 11],
    tickmode='linear',
    tick0=0,
    dtick=2
)

# Save the chart
fig.write_image('grea_development_chart.png')