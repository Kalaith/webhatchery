# WebHatchery Build and Deploy Script
# Streamlined deployment solution for E:\WebHatchery to F:\WebHatchery

param(
    [string]$ProjectFilter = "*",
    [switch]$Production,
    [switch]$Force,
    [switch]$VerboseOutput,
    [switch]$DryRun,
    [switch]$SkipBuild,
    [switch]$OnlyBuild
)

# Configuration
$SOURCE_PATH = "E:\WebHatchery"
$DEPLOY_PATH = "F:\WebHatchery"
$LOG_FILE = "$SOURCE_PATH\build-deploy.log"

# Project configurations - simplified structure
$PROJECT_CONFIGS = @{
    "isitdoneyet" = @{
        Type = "FullStack"
        BackendPath = "backend"
        BackendType = "PHP"
        FrontendFiles = @("index.html", "app.js", "api-service.js", "style.css", "server.js")
        ProductionApiUrl = "https://webhatchery.au/isitdoneyet/api"
        Exclude = @("deployment-test.html", "initialize-database.php", ".htaccess")
    }    
    "litrpg_studio" = @{
        Type = "React"
        OutputDir = "dist"
    }
    "meme_generator" = @{ Type = "Static" }
    "project_management" = @{ Type = "Static" }
    "stories" = @{ Type = "Static"; Recursive = $true }
    "storiesx" = @{ Type = "Static"; Recursive = $true }
    "anime" = @{ Type = "Static"; Recursive = $true }    
    "rootFiles" = @{ 
        Type = "Static"
        Files = @("index.php", "index.css")
        Exclude = @("build-deploy.ps1", "build.bat", "validate-projects.ps1", "build-config.json", "BUILD-README.md", "README.md", "projects.json", "*.log")
    }
}

# Utility functions
function Write-Log($Message, $Level = "INFO") {
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

function Get-ProjectType($ProjectPath) {
    $config = $PROJECT_CONFIGS[$ProjectPath]
    if ($config) { return $config.Type }
    
    # Auto-detect
    $fullPath = Join-Path $SOURCE_PATH $ProjectPath
    if (Test-Path "$fullPath\package.json") {
        $pkg = Get-Content "$fullPath\package.json" | ConvertFrom-Json
        if ($pkg.dependencies.react) { return "React" }
        if ($pkg.dependencies.express) { return "Node" }
    }
    if (Test-Path "$fullPath\composer.json") { return "PHP" }
    return "Static"
}

function Invoke-Build($ProjectPath, $ProjectType, $Config) {
    if ($SkipBuild) {
        Write-Log "Skipping build for $ProjectPath"
        return $true
    }
    
    $fullPath = Join-Path $SOURCE_PATH $ProjectPath
    $originalLocation = Get-Location
    
    try {
        Set-Location $fullPath
        Write-Log "Building $ProjectType project: $ProjectPath"
        
        # Navigate to build path if specified
        if ($Config.BuildPath) {
            Set-Location (Join-Path $fullPath $Config.BuildPath)
        } elseif ($Config.BackendPath -and $ProjectType -eq "PHP") {
            Set-Location (Join-Path $fullPath $Config.BackendPath)
        }
        
        switch ($ProjectType) {
            "React" {
                Invoke-Command "npm install" "Installing dependencies"
                Invoke-Command "npm run build" "Building React application"
            }
            "PHP" {
                $composerArgs = if ($Production) { "install --no-dev --optimize-autoloader --no-interaction" } else { "install --no-interaction" }
                Invoke-Command "composer $composerArgs" "Installing Composer dependencies"
            }
            "Node" {
                $npmArgs = if ($Production) { "install --production" } else { "install" }
                Invoke-Command "npm $npmArgs" "Installing Node.js dependencies"
            }
            "FullStack" {
                # Build backend
                if ($Config.BackendPath) {
                    $backendPath = Join-Path $fullPath $Config.BackendPath
                    Set-Location $backendPath
                    $composerArgs = if ($Production) { "install --no-dev --optimize-autoloader --no-interaction" } else { "install --no-interaction" }
                    Invoke-Command "composer $composerArgs" "Building backend"
                }
                # No frontend build needed for this project type in current config
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

function Invoke-Command($Command, $Description) {
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

function Copy-ProjectFiles($ProjectPath, $ProjectType, $Config) {
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
    
    $sourcePath = Join-Path $SOURCE_PATH $ProjectPath
    $destPath = Join-Path $DEPLOY_PATH $ProjectPath
    
    Write-Log "Deploying $ProjectPath to $destPath"
    
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
                    $fallback = Join-Path $sourcePath $_
                    if (Test-Path $fallback) {
                        Copy-Files "$fallback\*" $destPath $true
                        return
                    }
                }
                Write-Log "No React build output found" "WARN"
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
    }
      # Get projects to process
    $projects = Get-ChildItem -Path $SOURCE_PATH -Directory | Where-Object { 
        $_.Name -like $ProjectFilter -and 
        $_.Name -notmatch "^\." -and
        $_.Name -notin @("utils", "cgi-bin")
    }
    
    # Add rootFiles as a special project if it matches the filter
    if ("rootFiles" -like $ProjectFilter -and $PROJECT_CONFIGS["rootFiles"]) {
        $rootFileProject = New-Object PSObject -Property @{
            Name = "rootFiles"
            FullName = $SOURCE_PATH
        }
        $projects = @($rootFileProject) + $projects
    }
    
    if (-not $projects) {
        Write-Log "No projects found matching filter: $ProjectFilter" "WARN"
        exit 0
    }
    
    Write-Log "Processing $($projects.Count) projects"
    $results = @()
    
    # Process each project
    foreach ($project in $projects) {
        $projectName = $project.Name
        Write-Host "Processing: $projectName" -ForegroundColor Yellow
        
        try {
            $projectType = Get-ProjectType $projectName
            $config = $PROJECT_CONFIGS[$projectName]
            
            # Build phase
            $buildSuccess = $true
            if (-not $SkipBuild -and $projectType -in @("React", "PHP", "Node", "FullStack")) {
                $buildSuccess = Invoke-Build $projectName $projectType $config
            }
            
            # Deploy phase
            if ($buildSuccess -and -not $OnlyBuild) {
                Copy-ProjectFiles $projectName $projectType $config
            }
            
            $results += @{
                Project = $projectName
                Type = $projectType
                Success = $buildSuccess
                Error = $null
            }
            
        } catch {
            Write-Log "Failed to process" "ERROR"
            $results += @{
                Project = $projectName
                Type = $projectType
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
