# WebHatchery Build & Deploy System

A comprehensive PowerShell-based build and deployment system for the WebHatchery project collection. This system handles multiple project types including React applications, PHP backends, Node.js servers, and static websites.

## 🚀 Quick Start

```powershell
# Deploy all projects
.\build-deploy.ps1

# Deploy specific project
.\build-deploy.ps1 -ProjectFilter "isitdoneyet"

# Production deployment with all optimizations
.\build-deploy.ps1 -Production

# Dry run to see what would happen
.\build-deploy.ps1 -DryRun -Verbose
```

## 📋 Prerequisites

### Required Tools
- **Node.js** (≥18.0.0) - For React and Node.js projects
- **npm** (≥8.0.0) - Package manager for JavaScript projects  
- **PHP** (≥8.1.0) - For PHP backend projects
- **Composer** (≥2.0.0) - Dependency manager for PHP

### Verification
The script automatically checks for prerequisites. Manual verification:

```powershell
node --version
npm --version
php --version
composer --version
```

## 🎯 Supported Project Types

### React Applications
- **Detection**: `package.json` with React dependencies
- **Build**: `npm install && npm run build`
- **Output**: `dist/` or `build/` directory
- **Example**: `litrpg_studio`

### PHP Applications  
- **Detection**: `composer.json` with PHP dependencies
- **Build**: `composer install --no-dev --optimize-autoloader`
- **Output**: `vendor/` directory + source files
- **Example**: `isitdoneyet/backend`

### Full-Stack Applications
- **Detection**: Configured in `build-config.json`
- **Build**: Frontend + Backend builds
- **Output**: Combined deployment
- **Example**: `isitdoneyet`, `ses`

### Static Websites
- **Detection**: HTML/CSS/JS files without build requirements
- **Build**: None required
- **Output**: Direct file copy
- **Example**: `meme_generator`, `project_management`

## 🛠️ Command Line Options

| Parameter | Description | Default |
|-----------|-------------|---------|
| `-ProjectFilter` | Filter projects by name pattern | `"*"` (all) |
| `-Production` | Enable production optimizations | `$false` |
| `-Force` | Force overwrite existing files | `$false` |
| `-Verbose` | Enable detailed logging | `$false` |
| `-DryRun` | Show what would happen without changes | `$false` |
| `-SkipBuild` | Skip build step, only deploy | `$false` |
| `-OnlyBuild` | Only build, don't deploy | `$false` |

## 📁 Directory Structure

```
E:\WebHatchery\          # Source directory
├── build-deploy.ps1     # Main build script
├── build-config.json    # Project configurations
├── build-deploy.log     # Build logs
├── isitdoneyet/         # Full-stack project
│   ├── *.html, *.js     # Frontend files
│   └── backend/         # PHP backend
├── litrpg_studio/       # React project
│   └── frontend/        # React source
└── meme_generator/      # Static project

F:\WebHatchery\          # Deployment directory
├── isitdoneyet/         # Deployed projects
├── litrpg_studio/
└── meme_generator/
```

## 🔧 Configuration

### Project Configuration (`build-config.json`)

Each project can be configured with specific build and deployment settings:

```json
{
  "projects": {
    "project_name": {
      "type": "React|PHP|FullStack|Static",
      "requiresBuild": true,
      "buildCommand": "npm run build",
      "outputDir": "dist",
      "files": ["specific", "files"],
      "excludeFiles": ["test.html"],
      "production": {
        "apiUrl": "https://domain.com/api",
        "environmentUpdates": {...}
      }
    }
  }
}
```

### Auto-Detection

If a project isn't configured, the script auto-detects based on:
- `package.json` with React deps → React
- `composer.json` → PHP  
- `*.html` + `*.js` → Static
- Multiple types → FullStack

## 🏗️ Build Process

### 1. Prerequisites Check
- Verifies required tools are installed
- Checks versions meet minimum requirements

### 2. Project Discovery  
- Scans source directory for projects
- Applies project filter if specified
- Determines project types

### 3. Build Phase
- **React**: `npm install && npm run build`
- **PHP**: `composer install --no-dev --optimize-autoloader`
- **Static**: No build required
- **FullStack**: Build backend then frontend

### 4. Deployment Phase
- Copy built files to deployment directory
- Apply production configurations
- Set file permissions (if applicable)
- Run post-deployment tasks

### 5. Verification
- Check deployment success
- Generate summary report
- Log all activities

## 🎛️ Production Optimizations

When `-Production` flag is used:

### Environment Updates
- Set `DEBUG=false` in `.env` files
- Update API URLs to production domains
- Configure CORS for production origins

### Build Optimizations  
- Use `--no-dev` for Composer installs
- Enable `--optimize-autoloader` for PHP
- Use production builds for React apps

### Security Enhancements
- Remove development files
- Set appropriate file permissions
- Exclude test and debug files

## 📊 Example Usage Scenarios

### Development Deployment
```powershell
# Quick deployment for testing
.\build-deploy.ps1 -ProjectFilter "isitdoneyet" -Verbose
```

### Production Deployment
```powershell
# Full production deployment
.\build-deploy.ps1 -Production -Force
```

### Selective Deployment
```powershell
# Deploy only React projects
.\build-deploy.ps1 -ProjectFilter "*studio*"

# Deploy multiple specific projects
.\build-deploy.ps1 -ProjectFilter "isitdoneyet|meme_generator"
```

### Build Only (CI/CD)
```powershell
# Build for testing without deployment
.\build-deploy.ps1 -OnlyBuild -Verbose
```

### Safe Deployment
```powershell
# Check what would happen first
.\build-deploy.ps1 -DryRun -Verbose

# Then deploy if satisfied
.\build-deploy.ps1 -Production
```

## 🐛 Troubleshooting

### Common Issues

**Build Failures**
- Check Node.js/PHP versions meet requirements
- Verify `package.json`/`composer.json` are valid
- Review build logs in `build-deploy.log`

**Permission Errors**
- Run PowerShell as Administrator if needed
- Check file/directory permissions
- Ensure deployment path is writable

**Missing Dependencies**
- Install Node.js from [nodejs.org](https://nodejs.org)
- Install PHP from [php.net](https://php.net)
- Install Composer from [getcomposer.org](https://getcomposer.org)

**Project Not Found**
- Check project filter pattern
- Verify project exists in source directory
- Review project configuration in `build-config.json`

### Debug Mode
```powershell
# Maximum verbosity for debugging
.\build-deploy.ps1 -Verbose -DryRun -ProjectFilter "problematic_project"
```

### Log Analysis
```powershell
# View recent logs
Get-Content .\build-deploy.log -Tail 50

# Search for errors
Select-String -Path .\build-deploy.log -Pattern "ERROR"
```

## 🔄 Integration

### Apache Integration
- Deploy to Apache document root
- Configure virtual hosts as needed
- Ensure mod_rewrite is enabled for SPA routing

### CI/CD Integration
```powershell
# In CI/CD pipeline
.\build-deploy.ps1 -Production -Force -ProjectFilter $env:PROJECT_NAME
```

### Scheduled Deployment
```powershell
# Windows Task Scheduler compatible
powershell.exe -ExecutionPolicy Bypass -File "E:\WebHatchery\build-deploy.ps1" -Production
```

## 📈 Performance Tips

### Faster Builds
- Use `-SkipBuild` for deployment-only runs
- Filter to specific projects when possible
- Keep `node_modules` and `vendor` in place for incremental builds

### Reliable Deployments  
- Always use `-DryRun` first for production
- Keep backups of deployment directory
- Monitor logs for early error detection

## 🤝 Contributing

### Adding New Project Types
1. Update `$PROJECT_PATTERNS` in script
2. Add detection logic in `Get-ProjectType`
3. Implement build logic in `Invoke-Build`
4. Update configuration schema

### Configuration Changes
1. Modify `build-config.json` structure
2. Update parsing logic in script
3. Test with existing projects
4. Update documentation

## 📄 License

This build system is part of the WebHatchery project collection and follows the same licensing terms as the individual projects.

---

**Last Updated**: June 15, 2025  
**Script Version**: 1.0.0  
**Compatible PowerShell**: 5.1+
