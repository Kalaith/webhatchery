# AI Project Manager

A comprehensive, AI-powered project management tool that helps you create detailed project plans through guided questionnaires and intelligent analysis. This tool generates professional project documentation including charters, risk assessments, timelines, and stakeholder analysis.

![Project Manager Screenshot](generated_image.png)

## 🚀 Features

### Core Functionality
- **Smart Multi-Step Questionnaire**: Guided 5-step process to capture all project details
- **AI-Powered Analysis**: Generates comprehensive project documentation
- **Multiple Export Formats**: PDF, HTML, CSV, and JSON export options
- **Project Templates**: Pre-filled templates for common project types
- **Real-time Validation**: Instant feedback and error checking

### Enhanced User Experience
- **Auto-Save**: Automatic progress saving every 30 seconds
- **Data Persistence**: Restore your session if you refresh or close the browser
- **Keyboard Navigation**: Use Ctrl+→ and Ctrl+← to navigate steps quickly
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Accessibility**: ARIA labels, keyboard support, and screen reader friendly

### Project Documentation Generated
1. **📋 Project Charter**: Purpose, scope, objectives, and success criteria
2. **⚠️ Risk Assessment**: Identified risks with probability, impact, and mitigation strategies
3. **📅 Timeline Overview**: Project milestones and key deliverable dates
4. **👥 Stakeholder Analysis**: Stakeholder mapping with engagement strategies

## 🛠️ Installation & Setup

### Quick Start
1. Download or clone this repository
2. Open `index.html` in a modern web browser
3. Start creating your project plan!

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd project_management

# Serve locally (optional, for development)
python -m http.server 8000
# or
npx serve .

# Open browser to http://localhost:8000
```

### File Structure
```
project_management/
├── index.html          # Main application file
├── app.js              # JavaScript application logic
├── style.css           # Styling and responsive design
├── test.html           # Quick functionality test
├── README.md           # This documentation
├── generated_image.png # Screenshot/demo image
└── php-integration-guide.md # Backend integration guide
```

## 📋 How to Use

### Step 1: Project Basics
- Enter your project name and description
- Select project type (templates available for common types)
- Choose expected timeline and other basic details

### Step 2: Stakeholders
- Add key project stakeholders
- Define their roles and responsibilities
- Specify communication preferences

### Step 3: Scope & Objectives
- Define project objectives and goals
- List key deliverables
- Set success criteria and metrics

### Step 4: Resources & Budget
- Specify team size and composition
- Set budget range and constraints
- Identify resource limitations

### Step 5: Risks & Challenges
- Identify potential risks and issues
- Define mitigation strategies
- List project dependencies

### Generate Results
Click "Generate Project Plan" to create comprehensive documentation with AI analysis.

## 🎯 Project Templates

The tool includes pre-built templates for common project types:

- **Software Development**: Technical projects with development lifecycle
- **Marketing Campaign**: Brand awareness and lead generation projects
- **Product Launch**: New product introduction and go-to-market strategies
- **Process Improvement**: Operational efficiency and optimization projects
- **Event Planning**: Conference, workshop, and event management
- **Research Project**: Academic or business research initiatives
- **Infrastructure Upgrade**: IT and system improvement projects
- **Training Program**: Educational and skill development programs

## ⌨️ Keyboard Shortcuts

- **Ctrl + →**: Next step
- **Ctrl + ←**: Previous step
- **Escape**: Return to landing page
- **Alt + P**: Previous button (when visible)
- **Alt + N**: Next button
- **Alt + G**: Generate project plan (final step)

## 💾 Data Management

### Auto-Save
- Progress is automatically saved every 30 seconds
- Data persists between browser sessions
- Form data is restored when you return

### Export Options
- **JSON**: Raw data for integration with other tools
- **PDF**: Professional report for presentations
- **HTML**: Styled report for web viewing or printing
- **CSV**: Spreadsheet-compatible data format

### Data Privacy
- All data is stored locally in your browser
- No information is sent to external servers
- Clear your browser's localStorage to remove all data

## 🎨 Customization

### Styling
The application uses CSS custom properties for easy theming:

```css
:root {
  --color-primary: #21808d;
  --color-background: #fcfcf9;
  --color-text: #13343b;
  /* ... more variables */
}
```

### Adding Project Types
Modify the `projectTypes` array in `app.js`:

```javascript
projectTypes: [
  "Your Custom Project Type",
  // ... existing types
]
```

### Custom Templates
Add new templates to the `projectTemplates` object in `app.js`:

```javascript
projectTemplates: {
  "Your Custom Type": {
    projectDescription: "Template description...",
    objectives: "Template objectives...",
    // ... other fields
  }
}
```

## 🔧 Browser Compatibility

- **Recommended**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Minimum**: Any modern browser with ES6 support
- **Features**: Local Storage, CSS Grid, Flexbox, ES6 Classes

## 📱 Mobile Support

The application is fully responsive and works on:
- Mobile phones (320px and up)
- Tablets (768px and up)
- Desktop computers (1024px and up)
- Large screens (1440px and up)

## 🐛 Troubleshooting

### Common Issues

**Data not saving?**
- Check if your browser has localStorage enabled
- Try refreshing the page
- Clear browser cache and try again

**Export not working?**
- Ensure your browser allows file downloads
- Check popup blockers for PDF export
- Try a different export format

**Stakeholders not adding?**
- Ensure both name and role are filled
- Try refreshing the page
- Check browser console for errors

**Next button disabled immediately?**
- This is normal - the button enables after you interact with form fields
- Start filling out the required fields and the validation will update
- Use the keyboard shortcuts (Ctrl+→) if needed

**JavaScript errors on load?**
- Open `test.html` in your browser to run diagnostics
- Check that all files are in the correct directory
- Ensure your browser supports modern JavaScript (ES6+)

### Browser Console
Open Developer Tools (F12) and check the Console tab for any error messages.

### Quick Test
Open `test.html` in your browser to verify the application is working correctly.

## 🤝 Contributing

Contributions are welcome! Here are some ways to contribute:

1. **Bug Reports**: Found an issue? Create a detailed bug report
2. **Feature Requests**: Have an idea? Share your suggestions
3. **Code Contributions**: Submit pull requests with improvements
4. **Documentation**: Help improve this README or add more examples

### Development Guidelines
- Follow existing code style and patterns
- Test changes across different browsers
- Ensure responsive design principles
- Add appropriate comments and documentation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔮 Future Enhancements

Planned features for future versions:
- [ ] Gantt chart visualization
- [ ] Team collaboration features
- [ ] Integration with popular project management tools
- [ ] Advanced risk scoring algorithms
- [ ] Custom branding and themes
- [ ] Multi-language support
- [ ] Cloud storage integration
- [ ] Email sharing capabilities

## 📞 Support

For questions, issues, or feature requests:
- Check the troubleshooting section above
- Review existing issues in the repository
- Create a new issue with detailed information
- Include browser version and steps to reproduce

---

**Built with ❤️ for project managers, by project managers**

*Last updated: June 2025*
