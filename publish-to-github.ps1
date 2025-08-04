# WebHatchery Project Git Repository Setup Script
# This script ensures all projects have their own git repositories with proper .gitignore files

param(
    [switch]$DryRun,
    [switch]$Force,
    [string]$ProjectFilter = "",
    [switch]$VerboseOutput
)

# Import projects configuration
$projectsJsonPath = Join-Path $PSScriptRoot "projects.json"
if (-not (Test-Path $projectsJsonPath)) {
    Write-Error "projects.json not found at $projectsJsonPath"
    exit 1
}

$projectsConfig = Get-Content $projectsJsonPath | ConvertFrom-Json

# Define .gitignore templates based on project type
$gitignoreTemplates = @{
    "React" = @"
# Dependencies
node_modules/
/.pnp
.pnp.js

# Production builds
/dist
/build

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Package-lock files (uncomment if you want to include them)
# package-lock.json
# yarn.lock
"@

    "PHP" = @"
# Composer dependencies
/vendor/
composer.lock

# Environment files
.env
.env.local
.env.development
.env.test
.env.production

# Logs
*.log
logs/
/storage/logs/

# Cache
/storage/cache/
/cache/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Database files
*.sqlite
*.sqlite3
*.db

# Backup files
*.bak
*.backup

# Temporary files
*.tmp
*.temp
"@

    "Static" = @"
# Logs
*.log

# Environment files
.env
.env.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Backup files
*.bak
*.backup

# Temporary files
*.tmp
*.temp

# Build artifacts (if any)
/dist/
/build/
"@

    "FullStack" = @"
# Dependencies
node_modules/
/vendor/
/.pnp
.pnp.js

# Production builds
/dist
/build

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
/storage/logs/

# Database files
*.sqlite
*.sqlite3
*.db

# Cache
/storage/cache/
/cache/
coverage/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Package-lock files (uncomment if you want to include them)
# package-lock.json
# yarn.lock
# composer.lock

# Backup files
*.bak
*.backup

# Temporary files
*.tmp
*.temp
"@
}

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = switch ($Level) {
        "ERROR" { "Red" }
        "WARNING" { "Yellow" }
        "SUCCESS" { "Green" }
        default { "White" }
    }
    
    Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor $color
}

function Get-ProjectType {
    param($deployment)
    
    if ($deployment.type) {
        return $deployment.type
    }
    
    # Fallback logic for older project configs
    if ($deployment.outputDir -eq "dist" -or $deployment.requiresBuild) {
        return "React"
    }
    
    return "Static"
}

function Get-GitignoreContent {
    param([string]$projectType)
    
    return $gitignoreTemplates[$projectType]
}

function Initialize-GitRepository {
    param(
        [string]$ProjectPath,
        [string]$ProjectTitle,
        [string]$ProjectType,
        [bool]$DryRun,
        [bool]$Force
    )
    
    $fullPath = Join-Path $PSScriptRoot $ProjectPath
    
    if (-not (Test-Path $fullPath)) {
        Write-Log "Project path does not exist: $fullPath" "ERROR"
        return $false
    }
    
    $gitPath = Join-Path $fullPath ".git"
    $gitignorePath = Join-Path $fullPath ".gitignore"
    
    # Check if git repository already exists
    if (Test-Path $gitPath) {
        if (-not $Force) {
            Write-Log "Git repository already exists for '$ProjectTitle'" "WARNING"
            
            # Check if .gitignore exists and update if needed
            if (-not (Test-Path $gitignorePath)) {
                Write-Log "Adding missing .gitignore to existing repository '$ProjectTitle'"
                if (-not $DryRun) {
                    $gitignoreContent = Get-GitignoreContent -projectType $ProjectType
                    Set-Content -Path $gitignorePath -Value $gitignoreContent -Encoding UTF8
                }
            }
            return $true
        } else {
            Write-Log "Force flag set, reinitializing repository for '$ProjectTitle'" "WARNING"
        }
    }
    
    Write-Log "Setting up git repository for '$ProjectTitle' (Type: $ProjectType)"
    
    if ($DryRun) {
        Write-Log "[DRY RUN] Would initialize git repository at: $fullPath"
        Write-Log "[DRY RUN] Would create .gitignore for project type: $ProjectType"
        return $true
    }
    
    try {
        # Change to project directory
        Push-Location $fullPath
        
        # Initialize git repository
        git init
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to initialize git repository"
        }
        
        # Create .gitignore
        $gitignoreContent = Get-GitignoreContent -projectType $ProjectType
        Set-Content -Path $gitignorePath -Value $gitignoreContent -Encoding UTF8
        
        # Add initial commit
        git add .gitignore
        git commit -m "Initial commit: Add .gitignore"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Log "Successfully initialized git repository for '$ProjectTitle'" "SUCCESS"
            return $true
        } else {
            Write-Log "Warning: Git repository initialized but initial commit failed for '$ProjectTitle'" "WARNING"
            return $true
        }
        
    } catch {
        Write-Log "Failed to initialize git repository for '$ProjectTitle': $($_.Exception.Message)" "ERROR"
        return $false
    } finally {
        Pop-Location
    }
}

function Process-ProjectGroup {
    param(
        [object]$Group,
        [string]$GroupName,
        [bool]$DryRun,
        [bool]$Force,
        [string]$ProjectFilter
    )
    
    $processedCount = 0
    $successCount = 0
    
    foreach ($project in $Group.projects) {
        # Apply project filter if specified
        if ($ProjectFilter -and $project.title -notlike "*$ProjectFilter*") {
            continue
        }
        
        $processedCount++
        
        $projectType = Get-ProjectType -deployment $project.deployment
        
        if ($VerboseOutput) {
            Write-Log "Processing project: $($project.title) | Path: $($project.path) | Type: $projectType"
        }
        
        $success = Initialize-GitRepository -ProjectPath $project.path -ProjectTitle $project.title -ProjectType $projectType -DryRun $DryRun -Force $Force
        
        if ($success) {
            $successCount++
        }
    }
    
    Write-Log "Group '$GroupName': Processed $processedCount projects, $successCount successful"
    return @{ Processed = $processedCount; Successful = $successCount }
}

# Main execution
Write-Log "=== WebHatchery Git Repository Setup ===" "SUCCESS"
Write-Log "Starting git repository setup for all projects..."

if ($DryRun) {
    Write-Log "DRY RUN MODE - No changes will be made" "WARNING"
}

if ($ProjectFilter) {
    Write-Log "Filtering projects containing: '$ProjectFilter'"
}

$totalProcessed = 0
$totalSuccessful = 0

# Process each project group
foreach ($groupKey in $projectsConfig.groups.PSObject.Properties.Name) {
    $group = $projectsConfig.groups.$groupKey
    
    # Skip hidden groups unless specifically filtered
    if ($group.hidden -and -not $ProjectFilter) {
        Write-Log "Skipping hidden group: $($group.name)"
        continue
    }
    
    Write-Log "Processing group: $($group.name)"
    
    $result = Process-ProjectGroup -Group $group -GroupName $group.name -DryRun $DryRun -Force $Force -ProjectFilter $ProjectFilter
    $totalProcessed += $result.Processed
    $totalSuccessful += $result.Successful
}

# Summary
Write-Log "=== Summary ===" "SUCCESS"
Write-Log "Total projects processed: $totalProcessed"
Write-Log "Successful setups: $totalSuccessful"

if ($totalProcessed -gt $totalSuccessful) {
    Write-Log "Some projects failed to set up properly. Check the log above for details." "WARNING"
    exit 1
} else {
    Write-Log "All projects successfully set up with git repositories!" "SUCCESS"
    exit 0
}