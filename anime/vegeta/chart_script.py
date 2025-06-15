import plotly.express as px
import plotly.graph_objects as go

# Data from the provided JSON
transformations = ["Base Form", "Super Saiyan", "Super Saiyan 2", "Super Saiyan God", "Super Saiyan Blue", "Super Saiyan Blue Evolved", "Ultra Ego"]
power_levels = [1, 50, 100, 500, 5000, 10000, 25000]

# Abbreviate transformation names to fit 15 character limit
abbreviated_transformations = ["Base", "SS", "SS2", "SS God", "SS Blue", "SS Blue Evo", "Ultra Ego"]

# Create abbreviated power level labels for display
power_labels = []
for level in power_levels:
    if level >= 1000:
        power_labels.append(f"{level//1000}k")
    else:
        power_labels.append(str(level))

# Create bar chart
fig = go.Figure(data=go.Bar(
    x=abbreviated_transformations,
    y=power_levels,
    marker_color='#1FB8CD',  # Strong cyan from brand colors
    text=power_labels,
    textposition='outside',
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title="Vegeta Power Levels",
    xaxis_title="Transform",
    yaxis_title="Power Level"
)

# Update y-axis to show abbreviated values
fig.update_yaxes(
    tickvals=power_levels,
    ticktext=power_labels
)

# Save the chart
fig.write_image("vegeta_power_levels.png")