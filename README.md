# WebHatchery

A collection of web development projects with an automated build and deployment system for rapid prototyping and production deployment.

## 🏗️ Project Structure

WebHatchery is organized as a monorepo containing multiple independent web projects, each with their own technology stack and deployment requirements.

### 📁 Directory Layout

```
WebHatchery/
├── 🏗️ Build System
│   ├── build-deploy.ps1          # Main build and deployment script
│   ├── build.bat                 # Windows batch wrapper
│   ├── validate-projects.ps1     # Project validation tool
│   ├── build-config.json         # Build configuration
│   └── BUILD-README.md           # Detailed build documentation
│
├── 🌐 Web Projects
│   ├── isitdoneyet/              # Full-stack PHP/JS task manager
│   ├── litrpg_studio/            # React-based content creation tool
│   ├── project_management/       # AI-powered project planning tool
│   ├── meme_generator/           # Interactive meme creation app
│   ├── anime/                    # Static anime character galleries
│   ├── stories/                  # Static story content
│   └── storiesx/                 # Extended story collection
│
├── 🛠️ Utilities
│   ├── utils/                    # Shared scripts and tools
│   ├── cgi-bin/                  # Server-side scripts
│   └── comyui.php               # Common UI components
│
└── 📋 Documentation
    ├── README.md                 # This file
    ├── projects.json             # Project metadata
    └── index.html               # Root landing page
```

## 🚀 Quick Start

### Prerequisites

- **PHP** (v8.0+) and **Composer**
- **PowerShell** (for build scripts)
- **Apache/Nginx** (for deployment)

### Basic Usage

```powershell
# Build and deploy all projects
.\build-deploy.ps1

# Deploy specific project
.\build-deploy.ps1 -ProjectFilter "litrpg_studio"

# Production deployment
.\build-deploy.ps1 -Production

# Dry run (preview changes)
.\build-deploy.ps1 -DryRun -Verbose
```

### Using the Batch Wrapper

```cmd
# Windows Command Prompt alternative
build.bat
build.bat litrpg_studio
build.bat --production
build.bat --dry-run --verbose
```

## 📦 Project Types

### Full-Stack Applications

**isitdoneyet** - Task management system
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: PHP 8, Slim Framework, SQLite
- **Features**: Project hierarchy, task tracking, REST API

### React Applications

**litrpg_studio** - Content creation platform
- **Framework**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS
- **Features**: Interactive content editor, real-time preview

### Static Applications

**project_management** - AI project planning tool
- **Tech**: Vanilla JavaScript, HTML5, CSS3
- **Features**: Multi-step forms, PDF export, AI integration

**meme_generator** - Interactive meme creator
- **Tech**: JavaScript Canvas API, Python backend
- **Features**: Template-based generation, custom uploads

### Content Collections

**anime/** - Character galleries and information
**stories/** - Static story content with navigation
**storiesx/** - Extended story collection

## 🔧 Build System Features

### Automated Detection
- Automatically detects project types (React, PHP, Node, Static)
- Configures build processes based on project structure
- Handles dependencies and build outputs

### Deployment Options
- **Development**: Local testing and debugging
- **Production**: Optimized builds with minification
- **Selective**: Deploy specific projects or patterns
- **Dry Run**: Preview changes without executing

### Smart Copying
- Copies only necessary files for each project type
- Excludes development files and dependencies
- Handles build outputs (dist/, build/ folders)
- Preserves directory structures

## 📋 Configuration

### Project Configuration (`build-deploy.ps1`)

```powershell
$PROJECT_CONFIGS = @{
    "project_name" = @{
        Type = "React|PHP|Node|Static|FullStack"
        BuildPath = "frontend"              # Optional: build directory
        OutputDir = "dist"                  # Build output folder
        BackendPath = "backend"             # Backend directory
        ProductionApiUrl = "https://..."    # Production API endpoint
        Exclude = @("file1", "file2")       # Files to exclude
    }
}
```

### Build Configuration (`build-config.json`)

```json
{
  "projects": {
    "project_name": {
      "type": "react",
      "buildCommand": "npm run build",
      "outputPath": "dist",
      "production": {
        "apiUrl": "https://api.production.com"
      }
    }
  }
}
```

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
.\build-deploy.ps1 -ProjectFilter "myproject" -Verbose
```

### 3. Testing
```powershell
# Dry run to check deployment
.\build-deploy.ps1 -DryRun -Verbose
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

| Project | Type | Status | Features |
|---------|------|--------|----------|
| isitdoneyet | Full-Stack | ✅ Complete | Task management, API, Database |
| litrpg_studio | React | ✅ Complete | Content editor, React 18, Tailwind |
| project_management | Static | ✅ Complete | AI integration, PDF export |
| meme_generator | Static | ✅ Complete | Canvas API, Python backend |
| anime | Static | ✅ Complete | Gallery system, PHP navigation |
| stories | Static | ✅ Complete | Story browser, markdown support |

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
mkdir E:\WebHatchery\new_project
```

### 2. Add Configuration
Update `$PROJECT_CONFIGS` in `build-deploy.ps1`:
```powershell
"new_project" = @{
    Type = "React"  # or PHP, Node, Static, FullStack
    OutputDir = "dist"
}
```

### 3. Test Build
```powershell
.\build-deploy.ps1 -ProjectFilter "new_project" -DryRun -Verbose
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
.\build-deploy.ps1 -Verbose -DryRun

# Check specific project
.\build-deploy.ps1 -ProjectFilter "project_name" -Verbose
```

## 📄 Documentation

- [`BUILD-README.md`](BUILD-README.md) - Detailed build system documentation
- [`projects.json`](projects.json) - Project metadata and descriptions
- Individual project README files in each project directory

## 🤝 Contributing

1. **Add New Projects**: Follow the project structure guidelines
2. **Update Configurations**: Modify build configs for new project types
3. **Test Thoroughly**: Use dry-run mode before production deployment
4. **Document Changes**: Update this README and project-specific docs

## 📊 Statistics

- **Total Projects**: 7 active projects
- **Technologies**: React, PHP, Node.js, Python, Vanilla JS
- **Build System**: PowerShell-based with cross-platform support
- **Deployment**: Automated with production optimizations

---

**Last Updated**: June 15, 2025  
**Build System Version**: 1.0.0  
**PowerShell Compatibility**: 5.1+

For detailed build system documentation, see [`BUILD-README.md`](BUILD-README.md)
