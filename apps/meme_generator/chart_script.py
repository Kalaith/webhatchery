import plotly.graph_objects as go
import plotly.express as px
import json

# Data for the meme generator features
data = {
    "Video Features": [
        "Upload MP4/WebM", "Drag & Drop", "30s Auto-trim", "Playback Ctrl", 
        "Speed Adjust", "Video Preview", "Timeline Scrub"
    ],
    "Text Controls": [
        "Multi Layers", "Drag Position", "Font Select", "Text Size", 
        "Color Picker", "Bold/Italic", "Text Outline", "Text Shadows"
    ],
    "Meme Templates": [
        "Drake Point", "Distract BF", "Woman/Cat", "This is Fine",
        "Expand Brain", "Two Button", "Change Mind", "Surprise Pika"
    ],
    "Export Options": [
        "MP4 720p/1080p", "GIF Export", "Insta Square", "TikTok Vert",
        "Twitter/X", "Custom HD"
    ],
    "Audio Features": [
        "Mute Audio", "Volume Ctrl", "Sound Effects", "Drama Music", "Audio Timeline"
    ]
}

# Brand colors
colors = ['#1FB8CD', '#FFC185', '#ECEBD5', '#5D878F', '#D2BA4C']

# Prepare data for treemap
labels = []
parents = []
values = []
color_list = []

# Add main categories
for i, (category, features) in enumerate(data.items()):
    labels.append(category[:15])  # Keep within 15 char limit
    parents.append("")
    values.append(len(features))
    color_list.append(colors[i % len(colors)])

# Add features under each category
for i, (category, features) in enumerate(data.items()):
    for feature in features:
        labels.append(feature[:15])  # Keep within 15 char limit
        parents.append(category[:15])
        values.append(1)
        color_list.append(colors[i % len(colors)])

# Create treemap
fig = go.Figure(go.Treemap(
    labels=labels,
    parents=parents,
    values=values,
    textinfo="label",
    marker=dict(
        colors=color_list,
        line=dict(width=2, color='white')
    ),
    textfont=dict(size=12, color='white'),
    hovertemplate='<b>%{label}</b><br>Category: %{parent}<extra></extra>'
))

fig.update_layout(
    title="Meme Generator Features Overview",
    font=dict(size=14)
)

# Save the chart
fig.write_image("meme_generator_features.png")