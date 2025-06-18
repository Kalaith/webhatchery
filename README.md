# WebHatchery

A collection of web development projects with an automated build and deployment system for rapid prototyping and production deployment.

## 🏗️ Project Structure

WebHatchery is organized as a monorepo containing multiple independent web projects, organized by category with automated build and deployment capabilities.

### 📁 Directory Layout

```
WebHatchery/
├── 🏗️ Build System
│   ├── build-deploy.ps1          # Main build and deployment script
│   ├── validate-projects.ps1     # Project validation tool
│   ├── projects.json             # Unified project configuration
│   └── BUILD-README.md           # Detailed build documentation
│
├── 📱 Web Applications (apps/)
│   ├── isitdoneyet/              # Full-stack PHP/JS task manager
│   ├── litrpg_studio/            # React-based content creation tool
│   ├── project_management/       # AI-powered project planning tool
│   ├── meme_generator/           # Interactive meme creation app
│   └── monster_maker/            # D&D monster creation tool
│
├── 🎮 Game Projects (game_apps/)
│   ├── dragons_den/              # Fantasy dragon management game
│   ├── magical_girl/             # Magical girl adventure game
│   └── space_sim/                # Space colony management simulator
│
├── 🎲 Game Design Documents (gdd/)
│   └── kaiju_simulator/          # Kaiju breeding and battle simulator
│
├── 📚 Fiction Projects
│   ├── stories/                  # Interactive story collection
│   ├── storiesx/                 # Extended story collection
│   └── anime/                    # Anime character analysis
│       ├── grea/                 # Granblue Fantasy character analysis
│       ├── rei/                  # Evangelion character analysis
│       └── vegeta/               # Dragon Ball character analysis
│
├── 🛠️ Utilities & Tools
│   ├── utils/                    # Shared scripts and tools
│   │   └── comfyui/             # AI image generation integration
│   └── cgi-bin/                  # Server-side scripts
│
└── 📋 Root Files
    ├── README.md                 # This file
    ├── projects.json             # Project metadata and build config
    ├── index.php                 # Root landing page
    └── index.css                 # Root styling
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18.0+) and **npm** (v8.0+)
- **PHP** (v8.1+) and **Composer** (v2.0+)
- **PowerShell** (5.1+)
- **Web Server** (Apache/Nginx for production)

### Using the Build Script

```powershell
# Build and deploy all projects
.\build-deploy.ps1

# Deploy specific project
.\build-deploy.ps1 -ProjectFilter "magical_girl"

# Production deployment
.\build-deploy.ps1 -Production

# Dry run (preview changes)
.\build-deploy.ps1 -DryRun -VerboseOutput
```

## 📦 Project Types

### Web Applications (apps/)

**Is It Done Yet?** - Recursive task management system
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: PHP 8, REST API, Database integration
- **Features**: Project hierarchy, task tracking, real-time updates

**LitRPG Studio** - Content creation platform for writers
- **Framework**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS
- **Features**: Interactive content editor, real-time preview, game mechanics

**Project Management** - AI-powered project planning tool
- **Tech**: Vanilla JavaScript, HTML5, CSS3
- **Features**: Multi-step forms, stakeholder tracking, report generation

**Meme Generator** - Interactive meme creation tool
- **Tech**: JavaScript Canvas API, CSS3
- **Features**: Template-based generation, custom text, image manipulation

**Monster Maker** - D&D monster creation and balancing tool
- **Tech**: Vanilla JavaScript, D3.js for charts
- **Features**: Challenge rating calculator, stat progression charts

### Game Projects (game_apps/)

**Dragons Den** - Fantasy dragon management game
- **Framework**: React, TypeScript
- **Features**: Dragon breeding, exploration mechanics, character progression

**Magical Girl** - Magical girl transformation adventure
- **Framework**: React, TypeScript, Framer Motion
- **Features**: Character progression, transformation sequences, story mode

**Space Colony Simulator** - Space colony management
- **Tech**: Vanilla JavaScript, Canvas API
- **Features**: Resource management, exploration, technology trees

### Game Design Documents (gdd/)

**Kaiju Simulator** - Comprehensive kaiju breeding simulator
- **Tech**: Vanilla JavaScript ES6 modules
- **Features**: Breeding lab, combat simulation, progression systems, kaiju encyclopedia

### Fiction Projects

**Stories Collection** - Interactive story browser
- **Projects**: Alex Adventure, Isekai Adventure, Luminara, Tower Climber, Truck-kun
- **Tech**: PHP navigation, HTML5, responsive design
- **Features**: Story categorization, reading progress, mobile-friendly

**Stories Extended** - Mature content story collection
- **Projects**: The Bastard's Choice (and others)
- **Tech**: PHP navigation, content warnings
- **Features**: Age verification, content filtering

**Anime Character Analysis** - Deep character studies
- **Characters**: Grea (Granblue Fantasy), Rei Ayanami (Evangelion), Vegeta (Dragon Ball)
- **Tech**: Python data analysis, Chart.js visualizations
- **Features**: Character development charts, power level analysis, interactive timelines

## 🔧 Build System Features

### Unified Configuration
- **Single Source**: All project metadata and build config in `projects.json`
- **Organized by Category**: Fiction, Apps, Games, Tools
- **Version Controlled**: Configuration changes tracked with version numbers

### Automated Detection & Building
- **React Projects**: npm install → npm run build → deploy dist/
- **Full-Stack Projects**: Composer install for backend, file copying for frontend
- **Static Projects**: Direct file copying with exclusion rules
- **Nested Projects**: Handles projects with subdirectories (e.g., magical-girl/magical-girl/)

### Smart Deployment
- **Custom Deploy Names**: Deploy `game_apps/magical_girl/` as `magical_girl/`
- **Path Resolution**: Automatically finds projects in apps/, game_apps/, gdd/, or root
- **File Filtering**: Include/exclude specific files per project
- **Production Optimization**: API URL replacement, environment updates

### Development Features
- **Dry Run Mode**: Preview changes without executing
- **Verbose Logging**: Detailed output for debugging
- **Selective Deployment**: Deploy individual projects or patterns
- **Error Handling**: Graceful failure handling with rollback options

## 📋 Configuration

All project configuration is now centralized in `projects.json` with the following structure:

### Project Configuration

```json
{
  "version": "2.0.0",
  "groups": {
    "apps": {
      "name": "Web Applications",
      "projects": [
        {
          "title": "Project Name",
          "path": "apps/project_name/",
          "description": "Project description",
          "deployment": {
            "type": "React|Static|FullStack",
            "buildPath": "nested-folder",      // For nested React projects
            "outputDir": "dist",               // Build output directory
            "deployAs": "custom_name",         // Custom deployment name
            "files": ["file1", "file2"],       // Specific files to deploy
            "exclude": ["dev-file"],           // Files to exclude
            "requiresBuild": true,             // Requires build step
            "buildCommand": "npm run build",   // Custom build command
            "frontend": {                      // FullStack frontend config
              "type": "Static",
              "files": ["index.html", "app.js"]
            },
            "backend": {                       // FullStack backend config
              "type": "PHP",
              "path": "backend",
              "buildCommand": "composer install"
            },
            "production": {                    // Production settings
              "apiUrl": "https://api.prod.com",
              "environmentUpdates": {...}
            }
          }
        }
      ]
    }
  },
  "global": {
    "buildTools": {...},
    "deployment": {...}
  }
}
```

### Legacy Support

The build script automatically loads configuration from `projects.json` and maintains backward compatibility with existing projects.

## 🛠️ Development Workflow

### 1. Project Setup
```powershell
# Validate project structure
.\validate-projects.ps1

# Check for missing dependencies
.\validate-projects.ps1 -Fix
```

### 2. Development Build
```powershell
# Build specific project for testing
.\build-deploy.ps1 -ProjectFilter "magical_girl" -VerboseOutput
```

### 3. Testing
```powershell
# Dry run to check deployment
.\build-deploy.ps1 -DryRun -VerboseOutput
```

### 4. Production Deployment
```powershell
# Full production build and deploy
.\build-deploy.ps1 -Production -Force
```

## 🌐 Deployment Targets

### Development
- **Source**: `E:\WebHatchery\`
- **Target**: `F:\WebHatchery\`
- **Purpose**: Local testing and development

### Production
- **Target**: Apache/Nginx document root
- **Features**: Optimized builds, minified assets
- **Security**: Excluded development files

## 📊 Project Status

| Project | Type | Status | Technology Stack |
|---------|------|--------|------------------|
| **Web Applications** | | | |
| Is It Done Yet? | Full-Stack | ✅ Complete | PHP, JavaScript, SQLite |
| LitRPG Studio | React | ✅ Complete | React 19, TypeScript, Tailwind |
| Project Management | Static | ✅ Complete | JavaScript, AI integration |
| Meme Generator | Static | ✅ Complete | Canvas API, CSS3 |
| Monster Maker | Static | ✅ Complete | JavaScript, D3.js |
| **Game Projects** | | | |
| Dragons Den | React | ✅ Complete | React, TypeScript |
| Magical Girl | React | ✅ Complete | React, TypeScript, Framer Motion |
| Space Colony Simulator | Static | ✅ Complete | JavaScript, Canvas API |
| Kaiju Simulator | Static | ✅ Complete | ES6 Modules, Canvas API |
| **Fiction Projects** | | | |
| Stories Collection | Static | ✅ Complete | PHP, responsive design |
| Stories Extended | Static | ✅ Complete | PHP, content filtering |
| Anime Analysis | Static | ✅ Complete | Python, Chart.js |
| **Tools** | | | |
| ComfyUI Integration | Static | ✅ Complete | PowerShell, AI integration |

## 🔍 Utilities

### Validation Tools
- `validate-projects.ps1` - Check project integrity
- `utils/` - Shared scripts and helpers

### Build Tools
- `build-deploy.ps1` - Main build and deployment
- `build.bat` - Windows Command Prompt wrapper
- `BUILD-README.md` - Detailed build documentation

## 📝 Adding New Projects

### 1. Create Project Directory
```powershell
# For web applications
mkdir E:\WebHatchery\apps\new_project

# For game projects  
mkdir E:\WebHatchery\game_apps\new_game

# For game design documents
mkdir E:\WebHatchery\gdd\new_design
```

### 2. Add to projects.json
Update the appropriate group in `projects.json`:
```json
{
  "groups": {
    "apps": {
      "projects": [
        {
          "title": "New Project",
          "path": "apps/new_project/",
          "description": "Description of the new project",
          "deployment": {
            "type": "React",
            "outputDir": "dist",
            "deployAs": "new_project"
          }
        }
      ]
    }
  }
}
```

### 3. Test Build
```powershell
.\build-deploy.ps1 -ProjectFilter "new_project" -DryRun -VerboseOutput
```

## 🐛 Troubleshooting

### Common Issues

**Build Failures**
- Check `build-deploy.log` for detailed errors
- Verify all dependencies are installed
- Use `-Verbose` flag for detailed output

**Deployment Issues**
- Ensure target directory permissions
- Check for file locks or running processes
- Use `-Force` flag to overwrite existing files

**Missing Dependencies**
```powershell
# Check and install missing tools
.\validate-projects.ps1 -Fix
```

### Debug Mode
```powershell
# Enable verbose logging
.\build-deploy.ps1 -VerboseOutput -DryRun

# Check specific project
.\build-deploy.ps1 -ProjectFilter "project_name" -VerboseOutput
```

## 📄 Documentation

- [`projects.json`](projects.json) - Unified project configuration and metadata
- [`BUILD-README.md`](BUILD-README.md) - Detailed build system documentation  
- [`validate-projects.ps1`](validate-projects.ps1) - Project validation and health checks
- Individual project README files in each project directory

## 🤝 Contributing

1. **Add New Projects**: Follow the organized directory structure (apps/, game_apps/, gdd/)
2. **Update Configuration**: Add projects to `projects.json` with appropriate deployment settings
3. **Test Thoroughly**: Use dry-run mode and verbose output before production deployment
4. **Document Changes**: Update this README and project-specific documentation

## 📊 Statistics

- **Total Projects**: 13 active projects across 4 categories
- **Technologies**: React 19, TypeScript, PHP 8.1, Node.js, Python, Vanilla JS
- **Project Categories**: Web Apps (5), Games (4), Fiction (3), Tools (1)
- **Build System**: PowerShell-based with unified JSON configuration
- **Deployment**: Automated with production optimizations and custom naming

---

**Last Updated**: June 18, 2025  
**Configuration Version**: 2.0.0  
**PowerShell Compatibility**: 5.1+

For detailed build system documentation, see [`BUILD-README.md`](BUILD-README.md)
