# Clear the log file at the start of each run
Clear-Content -Path $LOG_FILE -ErrorAction SilentlyContinue
# WebHatchery Build and Deploy Script
# Streamlined deployment solution for E:\WebHatchery to F:\WebHatchery

param(
    [string]$ProjectFilter = "*",
    [switch]$Production,
    [switch]$Force,
    [switch]$VerboseOutput,
    [switch]$DryRun,
    [switch]$SkipBuild,
    [switch]$OnlyBuild,
    [switch]$CleanInstall,
    [switch]$CleanDeploy
)

# Configuration
$SOURCE_PATH = "E:\WebHatchery"
$DEPLOY_PATH = "F:\WebHatchery"
$LOG_FILE = "$SOURCE_PATH\build-deploy.log"

# Load project configurations from projects.json
function Get-ProjectConfigs {
    $projectsJsonPath = Join-Path $SOURCE_PATH "projects.json"
    if (-not (Test-Path $projectsJsonPath)) {
        Write-Log "projects.json not found at $projectsJsonPath" "ERROR"
        return @{}
    }
    
    try {
        $projectsData = Get-Content $projectsJsonPath | ConvertFrom-Json
        $configs = @{}
        
        # Process each group and extract deployment configs
        foreach ($groupName in $projectsData.groups.PSObject.Properties.Name) {
            $group = $projectsData.groups.$groupName
            
            if ($group.projects) {                foreach ($project in $group.projects) {
                    if ($project.deployment) {
                        # Use deployAs if specified, otherwise extract from path
                        if ($project.deployment.deployAs) {
                            $projectName = $project.deployment.deployAs
                        } else {
                            # Extract project name from path, handling nested structures
                            $pathParts = ($project.path -replace '/$', '') -split '/'
                            if ($pathParts.Length -ge 2) {
                                # For paths like "game_apps/magical_girl/frontend/", use "magical_girl"
                                $projectName = $pathParts[-2]
                            } else {
                                # For simple paths like "stories/", use "stories"
                                $projectName = $pathParts[-1]
                            }                        }
                        $config = Convert-DeploymentConfig $project.deployment
                        $config.ProjectPath = $project.path  # Store the original path from config
                        $configs[$projectName] = $config
                    }
                }
            }        }
        
        # Add rootFiles config if it exists (check both locations for compatibility)
        if ($projectsData.rootFiles -and $projectsData.rootFiles.deployment) {
            $configs["rootFiles"] = Convert-DeploymentConfig $projectsData.rootFiles.deployment
        } elseif ($projectsData.groups.rootFiles -and $projectsData.groups.rootFiles.deployment) {
            $configs["rootFiles"] = Convert-DeploymentConfig $projectsData.groups.rootFiles.deployment
        }
        
        return $configs
    } catch {
        Write-Log "Error loading projects.json: $_" "ERROR"
        return @{}
    }
}

function Convert-DeploymentConfig {
    param($deployConfig)
    $config = @{
        Type = $deployConfig.type
    }
    
    # Map JSON properties to PowerShell script properties
    if ($deployConfig.buildPath) { $config.BuildPath = $deployConfig.buildPath }
    if ($deployConfig.outputDir) { $config.OutputDir = $deployConfig.outputDir }
    if ($deployConfig.deployAs) { $config.DeployAs = $deployConfig.deployAs }
    if ($deployConfig.recursive) { $config.Recursive = $deployConfig.recursive }
    if ($deployConfig.preserveStructure) { $config.PreserveStructure = $deployConfig.preserveStructure }
    if ($deployConfig.files) { $config.Files = $deployConfig.files }
    if ($deployConfig.exclude) { $config.Exclude = $deployConfig.exclude }
    if ($deployConfig.requiresBuild) { $config.RequiresBuild = $deployConfig.requiresBuild }
    if ($deployConfig.buildCommand) { $config.BuildCommand = $deployConfig.buildCommand }
    if ($deployConfig.packageManager) { $config.PackageManager = $deployConfig.packageManager }
    if ($deployConfig.dependencies) { $config.Dependencies = $deployConfig.dependencies }
    
    # Handle FullStack structure
    if ($deployConfig.frontend) {
        $config.FrontendFiles = $deployConfig.frontend.files
        if ($deployConfig.frontend.type) { $config.FrontendType = $deployConfig.frontend.type }
    }
    
    if ($deployConfig.backend) {
        $config.BackendPath = $deployConfig.backend.path
        $config.BackendType = $deployConfig.backend.type
        if ($deployConfig.backend.requiresBuild) { $config.BackendRequiresBuild = $deployConfig.backend.requiresBuild }
        if ($deployConfig.backend.buildCommand) { $config.BackendBuildCommand = $deployConfig.backend.buildCommand }
        if ($deployConfig.backend.databaseInit) { $config.DatabaseInit = $deployConfig.backend.databaseInit }
        if ($deployConfig.backend.envFile) { $config.EnvFile = $deployConfig.backend.envFile }
    }
    
    # Handle production settings
    if ($deployConfig.production) {
        if ($deployConfig.production.apiUrl) { $config.ProductionApiUrl = $deployConfig.production.apiUrl }
        if ($deployConfig.production.corsOrigins) { $config.CorsOrigins = $deployConfig.production.corsOrigins }
        if ($deployConfig.production.environmentUpdates) { $config.EnvironmentUpdates = $deployConfig.production.environmentUpdates }
    }
    
    # Handle Apache settings
    if ($deployConfig.apache) {
        $config.Apache = $deployConfig.apache
    }
    
    return $config
}

# Load configurations from projects.json
$PROJECT_CONFIGS = Get-ProjectConfigs

# Utility functions
function Write-Log {
    param(
        $Message,
        $Level = "INFO"
    )
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"
    
    if ($VerboseOutput -or $Level -in @("ERROR", "WARN")) {
        $color = switch($Level) { "ERROR" { "Red" } "WARN" { "Yellow" } "SUCCESS" { "Green" } default { "White" } }
        Write-Host $logMessage -ForegroundColor $color
    }
    Add-Content -Path $LOG_FILE -Value $logMessage
}

function Test-Prerequisites {
    $tools = @("node", "npm", "php", "composer")
    $missing = @()
      foreach ($tool in $tools) {
        try {
            & $tool --version | Out-Null
            Write-Log "$tool found" "SUCCESS"
        } catch {
            $missing += $tool
        }
    }
    
    if ($missing) {
        Write-Log "Missing: $($missing -join ', ')" "ERROR"
        return $false
    }
    return $true
}

function Get-ProjectType {
    param($ProjectPath)
    Write-Log "Get-ProjectType called for: $ProjectPath"
    
    $config = $PROJECT_CONFIGS[$ProjectPath]
    if ($config) { 
        Write-Log "Found config for $ProjectPath with type: $($config.Type)"
        return $config.Type 
    }
    
    Write-Log "No config found for $ProjectPath, attempting auto-detection"
      # Auto-detect using the same path resolution logic
    $fullPath = $null
    $possiblePaths = @(
        (Join-Path (Join-Path $SOURCE_PATH "apps") $ProjectPath),
        (Join-Path (Join-Path $SOURCE_PATH "game_apps") $ProjectPath), 
        (Join-Path (Join-Path $SOURCE_PATH "gdd") $ProjectPath),
        (Join-Path $SOURCE_PATH $ProjectPath)
    )
    
    Write-Log "Checking possible paths for $ProjectPath`: $($possiblePaths -join ', ')"
    
    foreach ($path in $possiblePaths) {
        Write-Log "Checking path: $path"
        if (Test-Path $path) {
            $fullPath = $path
            Write-Log "Found project at: $fullPath"
            break
        }
    }
    
    if (-not $fullPath) {
        Write-Log "No path found for $ProjectPath, defaulting to Static" "WARN"
        return "Static"
    }
    
    Write-Log "Auto-detecting project type in: $fullPath"
    
    if (Test-Path "$fullPath\package.json") {
        Write-Log "Found package.json in $fullPath"
        try {
            $pkg = Get-Content "$fullPath\package.json" | ConvertFrom-Json
            if ($pkg.dependencies.react) { 
                Write-Log "Detected React project"
                return "React" 
            }
            if ($pkg.dependencies.express) { 
                Write-Log "Detected Node project"
                return "Node" 
            }
        } catch {
            Write-Log "Error reading package.json: $_" "WARN"
        }
    }
    if (Test-Path "$fullPath\composer.json") { 
        Write-Log "Detected PHP project"
        return "PHP" 
    }
    
    Write-Log "Defaulting to Static project type"
    return "Static"
}

function Invoke-Build {
    param(
        $ProjectPath,
        $ProjectType,
        $Config
    )
    
    if ($SkipBuild) {
        Write-Log "Skipping build for $ProjectPath"
        return $true
    }    # Determine source path from config if available, otherwise use discovery logic
    $fullPath = $null
    
    if ($Config.ProjectPath) {
        # Use path from projects.json config
        $configPath = $Config.ProjectPath -replace '/$', ''  # Remove trailing slash
        $fullPath = Join-Path $SOURCE_PATH $configPath
        Write-Log "Using config path: $fullPath"
    } else {
        # Fall back to discovery logic for legacy projects
        $possiblePaths = @(
            (Join-Path (Join-Path $SOURCE_PATH "apps") $ProjectPath),
            (Join-Path (Join-Path $SOURCE_PATH "game_apps") $ProjectPath), 
            (Join-Path (Join-Path $SOURCE_PATH "gdd") $ProjectPath),
            (Join-Path $SOURCE_PATH $ProjectPath)
        )
        
        foreach ($path in $possiblePaths) {
            if (Test-Path $path) {
                $fullPath = $path
                Write-Log "Found project at: $fullPath"
                break
            }
        }
    }
    
    if (-not $fullPath) {
        Write-Log "Source path not found for project: $ProjectPath" "ERROR"
        return $false
    }
    
    $originalLocation = Get-Location
    
    try {
        Set-Location $fullPath
        Write-Log "Building $ProjectType project: $ProjectPath at $fullPath"
        
        # Navigate to build path if specified
        if ($Config.BuildPath) {
            Set-Location (Join-Path $fullPath $Config.BuildPath)
        } elseif ($Config.BackendPath -and $ProjectType -eq "PHP") {
            Set-Location (Join-Path $fullPath $Config.BackendPath)
        }        switch ($ProjectType) {
            "React" {
                if ($CleanInstall) {
                    Write-Log "Performing clean install for React project"
                    # Remove node_modules and package-lock.json
                    $nodeModulesPath = Join-Path (Get-Location) "node_modules"
                    $packageLockPath = Join-Path (Get-Location) "package-lock.json"
                    
                    if (Test-Path $nodeModulesPath) {
                        Invoke-Command "Remove-Item -Recurse -Force '$nodeModulesPath'" "Removing node_modules"
                    }
                    if (Test-Path $packageLockPath) {
                        Invoke-Command "Remove-Item -Force '$packageLockPath'" "Removing package-lock.json"
                    }
                }
                
                Invoke-Command "npm install" "Installing dependencies"
                if ($Config.BuildCommand) {
                    Invoke-Command $Config.BuildCommand "Building React application with custom command"
                } else {
                    Invoke-Command "npm run build" "Building React application"
                }
            }
            "PHP" {
                $composerArgs = if ($Production) { "install --no-dev --optimize-autoloader --no-interaction" } else { "install --no-interaction" }
                Invoke-Command "composer $composerArgs" "Installing Composer dependencies"
            }            "Node" {
                if ($CleanInstall) {
                    Write-Log "Performing clean install for Node.js project"
                    # Remove node_modules and package-lock.json
                    $nodeModulesPath = Join-Path (Get-Location) "node_modules"
                    $packageLockPath = Join-Path (Get-Location) "package-lock.json"
                    
                    if (Test-Path $nodeModulesPath) {
                        Invoke-Command "Remove-Item -Recurse -Force '$nodeModulesPath'" "Removing node_modules"
                    }
                    if (Test-Path $packageLockPath) {
                        Invoke-Command "Remove-Item -Force '$packageLockPath'" "Removing package-lock.json"
                    }
                }
                
                $npmArgs = if ($Production) { "install --production" } else { "install" }
                Invoke-Command "npm $npmArgs" "Installing Node.js dependencies"
            }
            "FullStack" {
                # Build backend
                if ($Config.BackendPath) {
                    $backendPath = Join-Path $fullPath $Config.BackendPath
                    Set-Location $backendPath
                    
                    $composerArgs = if ($Production) { "install --no-dev --optimize-autoloader --no-interaction" } else { "install --no-interaction" }
                    if ($Config.BackendBuildCommand) {
                        Invoke-Command $Config.BackendBuildCommand "Building backend with custom command"
                    } else {
                        Invoke-Command "composer $composerArgs" "Building backend"
                    }
                }                # Handle frontend build if it's a React/Vite frontend
                if ($Config.FrontendType -eq "Vite") {
                    Set-Location $fullPath
                    
                    if ($CleanInstall) {
                        Write-Log "Performing clean install for FullStack frontend"
                        # Remove node_modules and package-lock.json
                        $nodeModulesPath = Join-Path (Get-Location) "node_modules"
                        $packageLockPath = Join-Path (Get-Location) "package-lock.json"
                        
                        if (Test-Path $nodeModulesPath) {
                            Invoke-Command "Remove-Item -Recurse -Force '$nodeModulesPath'" "Removing frontend node_modules"
                        }
                        if (Test-Path $packageLockPath) {
                            Invoke-Command "Remove-Item -Force '$packageLockPath'" "Removing frontend package-lock.json"
                        }
                    }
                    
                    Invoke-Command "npm install" "Installing frontend dependencies"
                    Invoke-Command "npm run build" "Building frontend"
                }
            }
            "Static" {
                Write-Log "Static project - no build required"
            }
        }
        Write-Log "Build completed successfully for $ProjectPath" "SUCCESS"
        return $true
        
    } catch {
        Write-Log "Build failed for $ProjectPath`: $_" "ERROR"
        return $false
    } finally {
        Set-Location $originalLocation
    }
}

function Invoke-Command {
    param(
        $Command,
        $Description
    )
    Write-Log $Description
    if ($DryRun) {
        Write-Log "[DRY RUN] Would run: $Command"
    } else {
        Invoke-Expression $Command
        if ($LASTEXITCODE -ne 0) {
            throw "$Command failed with exit code $LASTEXITCODE"
        }
    }
}

function Copy-ProjectFiles {
    param(
        $ProjectPath,
        $ProjectType,
        $Config
    )
    # Handle rootFiles specially - copy to root of deployment directory
    if ($ProjectPath -eq "rootFiles") {
        $sourcePath = $SOURCE_PATH
        $destPath = $DEPLOY_PATH
        
        Write-Log "Deploying root files to $destPath"
        
        if (-not $DryRun -and -not (Test-Path $destPath)) {
            New-Item -ItemType Directory -Path $destPath -Force | Out-Null
        }
        
        # Copy specific files listed in config
        if ($Config.Files) {
            $Config.Files | ForEach-Object {
                $sourceFile = Join-Path $sourcePath $_
                $destFile = Join-Path $destPath $_
                if (Test-Path $sourceFile) {
                    Copy-Files $sourceFile $destFile $false
                } else {
                    Write-Log "Root file not found: $sourceFile" "WARN"
                }
            }
        }
        return
    }
      # Determine source path based on project location
    $sourcePath = $null
    $actualProjectName = if ($Config.DeployAs) { $Config.DeployAs } else { $ProjectPath }
    Write-Log $ProjectPath
    
    # Use path from config if available, otherwise use discovery logic
    if ($Config.ProjectPath) {
        # Use path from projects.json config
        $configPath = $Config.ProjectPath -replace '/$', ''  # Remove trailing slash
        $sourcePath = Join-Path $SOURCE_PATH $configPath
        Write-Log "Copy-ProjectFiles using config path: $sourcePath"
    } else {
        # Fall back to discovery logic for legacy projects
        $possiblePaths = @(
            (Join-Path (Join-Path $SOURCE_PATH "apps") $ProjectPath),
            (Join-Path (Join-Path $SOURCE_PATH "game_apps") $ProjectPath), 
            (Join-Path (Join-Path $SOURCE_PATH "gdd") $ProjectPath),
            (Join-Path $SOURCE_PATH $ProjectPath)
        )
        
        foreach ($path in $possiblePaths) {
            if (Test-Path $path) {
                $sourcePath = $path
                break
            }
        }
    }
    
    if (-not $sourcePath) {
        Write-Log "Source path not found for project: $ProjectPath" "ERROR"
        return
    }
      $destPath = Join-Path $DEPLOY_PATH $actualProjectName
    
    Write-Log "Deploying $ProjectPath from $sourcePath to $destPath"
    
    # Clean deploy: remove existing deployment directory first
    if ($CleanDeploy -and (Test-Path $destPath)) {
        if ($DryRun) {
            Write-Log "[DRY RUN] Would clean existing deployment: $destPath"
        } else {
            Write-Log "Cleaning existing deployment: $destPath"
            Remove-Item -Path $destPath -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
    
    if (-not $DryRun -and -not (Test-Path $destPath)) {
        New-Item -ItemType Directory -Path $destPath -Force | Out-Null
    }
    
    $excludeItems = @(".git", ".gitignore", "node_modules", ".env.example", "*.log", "*.tmp")
    if ($Config.Exclude) { $excludeItems += $Config.Exclude }
    
    # Determine copy strategy
    switch ($ProjectType) {
        "React" {
            $buildOutput = if ($Config.BuildPath) { 
                Join-Path $sourcePath $Config.BuildPath $Config.OutputDir 
            } else { 
                Join-Path $sourcePath $Config.OutputDir 
            }
            
            if (Test-Path $buildOutput) {
                Copy-Files "$buildOutput\*" $destPath $true
            } else {
                # Fallback to standard locations
                @("dist", "build") | ForEach-Object {
                    $fallback = if ($Config.BuildPath) {
                        Join-Path $sourcePath $Config.BuildPath $_
                    } else {
                        Join-Path $sourcePath $_
                    }
                    if (Test-Path $fallback) {
                        Copy-Files "$fallback\*" $destPath $true
                        return
                    }
                }
                Write-Log "No React build output found for $ProjectPath" "WARN"
            }
        }
        "FullStack" {
            # Copy frontend files
            if ($Config.FrontendFiles) {
                $Config.FrontendFiles | ForEach-Object {
                    $file = Join-Path $sourcePath $_
                    if (Test-Path $file) { Copy-Files $file $destPath $false }
                }
            }
            # Copy backend
            if ($Config.BackendPath) {
                $backendSource = Join-Path $sourcePath $Config.BackendPath
                $backendDest = Join-Path $destPath $Config.BackendPath
                if (Test-Path $backendSource) {
                    Copy-Files "$backendSource\*" $backendDest $true
                }
            }
        }
        default {
            # Copy all files for PHP, Node, Static
            Copy-Files "$sourcePath\*" $destPath $true
        }
    }
    
    # Remove excluded items
    $excludeItems | ForEach-Object {
        $excludePath = Join-Path $destPath $_
        if (Test-Path $excludePath) {
            Remove-Files $excludePath
        }
    }
    
    # Apply production configs
    if ($Production -and $Config.ProductionApiUrl) {
        Update-ProductionUrls $destPath $Config.ProductionApiUrl
    }
}

function Copy-Files {
    param(
        [string]$Source,
        [string]$Dest,
        [bool]$Recursive
    )
    
    if ($DryRun) {
        Write-Log "[DRY RUN] Would copy: $Source -> $Dest"
    } else {
        if (-not (Test-Path (Split-Path $Dest -Parent))) {
            New-Item -ItemType Directory -Path (Split-Path $Dest -Parent) -Force | Out-Null
        }
        if ($Recursive) {
            Copy-Item -Path $Source -Destination $Dest -Recurse -Force
        } else {
            Copy-Item -Path $Source -Destination $Dest -Force
        }
        Write-Log "Copied: $Source -> $Dest"
    }
}

function Remove-Files {
    param(
        [string]$Path
    )
    
    if ($DryRun) {
        Write-Log "[DRY RUN] Would remove: $Path"
    } else {
        Remove-Item -Path $Path -Recurse -Force -ErrorAction SilentlyContinue
        Write-Log "Removed: $Path"
    }
}

function Update-ProductionUrls {
    param(
        [string]$DestPath,
        [string]$ApiUrl
    )
    
    $jsFiles = Get-ChildItem -Path $DestPath -Filter "*.js" -Recurse
    $jsFiles | ForEach-Object {
        if ($DryRun) {
            Write-Log "[DRY RUN] Would update API URLs in: $($_.FullName)"
        } else {
            $content = Get-Content $_.FullName -Raw
            $content = $content -replace "http://localhost:\d+/api", $ApiUrl
            $content = $content -replace "localhost:\d+", "webhatchery.au"
            Set-Content -Path $_.FullName -Value $content
            Write-Log "Updated API URLs in: $($_.FullName)"
        }
    }
}

function Show-Summary {
    param(
        [array]$Results
    )
    
    Write-Host "BUILD AND DEPLOY SUMMARY" -ForegroundColor Cyan

    $successful = $Results | Where-Object Success
    $failed = $Results | Where-Object { -not $_.Success }
    
    Write-Host "Total: $($Results.Count) | Success: $($successful.Count) | Failed: $($failed.Count)" -ForegroundColor White
    
    if ($successful) {
        Write-Host "`nSuccessful:" -ForegroundColor Green
        $successful | ForEach-Object { Write-Host "  + $($_.Project) ($($_.Type))" -ForegroundColor Green }
    }
      if ($failed) {
        Write-Host "`nFailed:" -ForegroundColor Red
        $failed | ForEach-Object { Write-Host "  - $($_.Project): $($_.Error)" -ForegroundColor Red }
    }
    
    Write-Host "`nLog: $LOG_FILE" -ForegroundColor Cyan
}

# Main execution
function Main {
    Write-Host "WebHatchery Build and Deploy Script" -ForegroundColor Cyan
    Write-Host "Source: $SOURCE_PATH -> Target: $DEPLOY_PATH" -ForegroundColor Yellow
    
    if ($DryRun) { Write-Host "DRY RUN MODE" -ForegroundColor Magenta }
    
    # Initialize and check prerequisites
    Write-Log "Starting build and deploy process"
    if (-not (Test-Prerequisites)) {
        Write-Host "Prerequisites check failed" -ForegroundColor Red
        exit 1
    }
    
    # Verify and create paths
    if (-not (Test-Path $SOURCE_PATH)) {
        Write-Log "Source path not found: $SOURCE_PATH" "ERROR"
        exit 1
    }
    
    if (-not $DryRun -and -not (Test-Path $DEPLOY_PATH)) {
        New-Item -ItemType Directory -Path $DEPLOY_PATH -Force | Out-Null
    }    # Get projects to process
    $projects = @()
    
    # Collect projects from apps folder
    if (Test-Path (Join-Path $SOURCE_PATH "apps")) {
        $appProjects = Get-ChildItem -Path (Join-Path $SOURCE_PATH "apps") -Directory | Where-Object { 
            $_.Name -like $ProjectFilter -and $_.Name -notmatch "^\."
        }
        $appProjects | ForEach-Object {
            $projects += New-Object PSObject -Property @{
                Name = $_.Name
                FullName = $_.FullName
                SourceFolder = "apps"
            }
        }
    }
    
    # Collect projects from game_apps folder
    if (Test-Path (Join-Path $SOURCE_PATH "game_apps")) {
        $gameProjects = Get-ChildItem -Path (Join-Path $SOURCE_PATH "game_apps") -Directory | Where-Object { 
            $_.Name -like $ProjectFilter -and $_.Name -notmatch "^\."
        }
        $gameProjects | ForEach-Object {
            $projects += New-Object PSObject -Property @{
                Name = $_.Name
                FullName = $_.FullName
                SourceFolder = "game_apps"
            }
        }
    }
    
    # Collect projects from gdd folder
    if (Test-Path (Join-Path $SOURCE_PATH "gdd")) {
        $gddProjects = Get-ChildItem -Path (Join-Path $SOURCE_PATH "gdd") -Directory | Where-Object { 
            $_.Name -like $ProjectFilter -and $_.Name -notmatch "^\."
        }
        $gddProjects | ForEach-Object {
            $projects += New-Object PSObject -Property @{
                Name = $_.Name
                FullName = $_.FullName
                SourceFolder = "gdd"
            }
        }
    }
    
    # Collect top-level projects (legacy support)
    $topLevelProjects = Get-ChildItem -Path $SOURCE_PATH -Directory | Where-Object { 
        $_.Name -like $ProjectFilter -and 
        $_.Name -notmatch "^\." -and
        $_.Name -notin @("utils", "cgi-bin", "apps", "game_apps", "gdd", "stories", "storiesx", "anime")
    }
    $topLevelProjects | ForEach-Object {
        $projects += New-Object PSObject -Property @{
            Name = $_.Name
            FullName = $_.FullName
            SourceFolder = "root"
        }
    }
    
    # Add special folders if they match the filter
    @("stories", "storiesx", "anime") | ForEach-Object {
        if ($_ -like $ProjectFilter -and (Test-Path (Join-Path $SOURCE_PATH $_))) {
            $projects += New-Object PSObject -Property @{
                Name = $_
                FullName = (Join-Path $SOURCE_PATH $_)
                SourceFolder = "root"
            }
        }
    }
    
    # Add rootFiles as a special project if it matches the filter
    if ("rootFiles" -like $ProjectFilter -and $PROJECT_CONFIGS["rootFiles"]) {
        $rootFileProject = New-Object PSObject -Property @{
            Name = "rootFiles"
            FullName = $SOURCE_PATH
            SourceFolder = "root"
        }
        $projects = @($rootFileProject) + $projects
    }
    
    if (-not $projects) {
        Write-Log "No projects found matching filter: $ProjectFilter" "WARN"
        exit 0
    }
    
    Write-Log "Processing $($projects.Count) projects"
    $results = @()    # Process each project
    foreach ($project in $projects) {
        $projectName = $project.Name
        Write-Host "Processing: $projectName" -ForegroundColor Yellow
        Write-Log "Starting processing for project: $projectName"
        
        try {
            Write-Log "Step 1: Getting project type for $projectName"
            $projectType = Get-ProjectType $projectName
            Write-Log "Project type for $projectName`: $projectType"
            
            Write-Log "Step 2: Getting project config for $projectName"
            $config = $PROJECT_CONFIGS[$projectName]
            if ($config) {
                Write-Log "Config found for $projectName with type: $($config.Type)"
            } else {
                Write-Log "No config found for $projectName" "WARN"
            }
            
            # Build phase
            $buildSuccess = $true
            if (-not $SkipBuild -and $projectType -in @("React", "PHP", "Node", "FullStack")) {
                Write-Log "Step 3: Starting build for $projectName (type: $projectType)"
                $buildSuccess = Invoke-Build $projectName $projectType $config
                Write-Log "Build result for $projectName`: $buildSuccess"
            } else {
                Write-Log "Skipping build for $projectName (SkipBuild: $SkipBuild, Type: $projectType)"
            }
            
            # Deploy phase
            if ($buildSuccess -and -not $OnlyBuild) {
                Write-Log "Step 4: Starting deployment for $projectName"
                Copy-ProjectFiles $projectName $projectType $config
                Write-Log "Deployment completed for $projectName"
            } else {
                Write-Log "Skipping deployment for $projectName (BuildSuccess: $buildSuccess, OnlyBuild: $OnlyBuild)"
            }
            
            Write-Log "Step 5: Creating success result object for $projectName"
            $results += New-Object PSObject -Property @{
                Project = $projectName
                Type = $projectType
                Success = $buildSuccess
                Error = $null
            }
            Write-Log "Successfully processed $projectName" "SUCCESS"
            
        } catch {
            Write-Log "EXCEPTION in processing $projectName at step: $($_.InvocationInfo.ScriptLineNumber)" "ERROR"
            Write-Log "Exception details: $($_.Exception.GetType().Name)" "ERROR"
            Write-Log "Exception message: $($_.Exception.Message)" "ERROR"
            Write-Log "Failed to process $projectName`: $_" "ERROR"
            
            Write-Log "Creating failure result object for $projectName"
            $results += New-Object PSObject -Property @{
                Project = $projectName
                Type = "Unknown"
                Success = $false
                Error = $_.Exception.Message
            }
        }
    }
    
    # Show results
    Show-Summary $results
    
    # Exit with failure count
    $failedCount = ($results | Where-Object { -not $_.Success }).Count
    exit $failedCount
}

# Run the script
Main
