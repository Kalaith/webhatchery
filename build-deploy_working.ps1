# WebHatchery Build and Deploy Script
# Comprehensive deployment solution for E:\WebHatchery to F:\WebHatchery
# Handles React, PHP, Node.js, and static projects

param(
    [Parameter(Mandatory=$false)]
    [string]$ProjectFilter = "*",
    
    [Parameter(Mandatory=$false)]
    [switch]$Production = $false,
      [Parameter(Mandatory=$false)]
    [switch]$Force = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$VerboseOutput = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipBuild = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$OnlyBuild = $false
)

# Script configuration
$SOURCE_PATH = "E:\WebHatchery"
$DEPLOY_PATH = "F:\WebHatchery"
$SCRIPT_VERSION = "1.0.0"
$LOG_FILE = "$SOURCE_PATH\build-deploy.log"

# Project type detection patterns
$PROJECT_PATTERNS = @{
    "React" = @{
        "Files" = @("package.json", "src/", "public/")
        "BuildFiles" = @("vite.config.js", "vite.config.ts", "webpack.config.js")
        "Dependencies" = @("react", "@vitejs/plugin-react")
        "BuildCommand" = "npm run build"
        "OutputDir" = @("dist", "build")
    }
    "PHP" = @{
        "Files" = @("composer.json", "*.php")
        "BuildFiles" = @("composer.json")
        "Dependencies" = @("php", "slim/slim", "illuminate/database")
        "BuildCommand" = "composer install --no-dev --optimize-autoloader"
        "OutputDir" = @("vendor/")
    }
    "Node" = @{
        "Files" = @("package.json", "server.js", "app.js")
        "BuildFiles" = @("package.json")
        "Dependencies" = @("express", "http", "fs")
        "BuildCommand" = "npm install --production"
        "OutputDir" = @("node_modules/")
    }
    "Static" = @{
        "Files" = @("index.html", "*.css", "*.js")
        "BuildFiles" = @()
        "Dependencies" = @()
        "BuildCommand" = ""
        "OutputDir" = @()
    }
}

# Project-specific configurations
$PROJECT_CONFIGS = @{    "isitdoneyet" = @{
        "Type" = "FullStack"
        "Frontend" = @{
            "Type" = "Static"
            "Files" = @("index.html", "app.js", "api-service.js", "style.css", "server.js")
        }
        "Backend" = @{
            "Type" = "PHP"
            "Path" = "backend"
            "RequiresBuild" = $true
            "DatabaseInit" = $true
        }
        "Production" = @{
            "EnvFile" = "backend/.env"
            "ApiUrl" = "https://webhatchery.au/isitdoneyet/api"
            "CorsOrigins" = "https://webhatchery.au"
        }
        "Exclude" = @("deployment-test.html", "initialize-database.php", ".htaccess")
    }
    "litrpg_studio" = @{
        "Type" = "React"
        "Path" = "frontend"
        "RequiresBuild" = $true
        "OutputDir" = "dist"
        "PublicPath" = "/"
    }
    "meme_generator" = @{
        "Type" = "Static"
        "RequiresBuild" = $false
        "Files" = @("index.html", "app.js", "style.css", "css/", "js/")
    }
    "project_management" = @{
        "Type" = "Static"
        "RequiresBuild" = $false
        "Files" = @("index.html", "app.js", "style.css", "*.js")
    }
    "stories" = @{
        "Type" = "Static"
        "RequiresBuild" = $false
        "Recursive" = $true
    }
    "storiesx" = @{
        "Type" = "Static"
        "RequiresBuild" = $false
        "Recursive" = $true
    }
    "anime" = @{
        "Type" = "Static"
        "RequiresBuild" = $false
        "Recursive" = $true
    }
}

# Utility functions
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"
    
    if ($VerboseOutput -or $Level -eq "ERROR" -or $Level -eq "WARN") {
        Write-Host $logMessage -ForegroundColor $(
            switch($Level) {
                "ERROR" { "Red" }
                "WARN" { "Yellow" }
                "SUCCESS" { "Green" }
                default { "White" }
            }
        )
    }
    
    Add-Content -Path $LOG_FILE -Value $logMessage
}

function Test-Prerequisites {
    Write-Log "Checking prerequisites..."
    
    $missing = @()
    
    # Check Node.js
    try {
        $nodeVersion = node --version 2>$null
        Write-Log "Node.js: $nodeVersion" "SUCCESS"
    } catch {
        $missing += "Node.js"
    }
    
    # Check npm
    try {
        $npmVersion = npm --version 2>$null
        Write-Log "npm: $npmVersion" "SUCCESS"
    } catch {
        $missing += "npm"
    }
    
    # Check PHP
    try {
        $phpVersion = php --version 2>$null | Select-String "PHP" | Select-Object -First 1
        Write-Log "PHP: $phpVersion" "SUCCESS"
    } catch {
        $missing += "PHP"
    }
    
    # Check Composer
    try {
        $composerVersion = composer --version 2>$null
        Write-Log "Composer: $composerVersion" "SUCCESS"
    } catch {
        $missing += "Composer"
    }
    
    if ($missing.Count -gt 0) {
        Write-Log "Missing prerequisites: $($missing -join ', ')" "ERROR"
        return $false
    }
    
    return $true
}

function Get-ProjectType {
    param([string]$ProjectPath)
    
    $config = $PROJECT_CONFIGS[$ProjectPath]
    if ($config) {
        return $config.Type
    }
    
    # Auto-detect project type
    foreach ($type in $PROJECT_PATTERNS.Keys) {
        $pattern = $PROJECT_PATTERNS[$type]
        $match = $true
        
        foreach ($file in $pattern.Files) {
            $fullPath = Join-Path $SOURCE_PATH $ProjectPath $file
            if (-not (Test-Path $fullPath)) {
                $match = $false
                break
            }
        }
        
        if ($match) {
            # Check package.json for specific dependencies
            $packageJsonPath = Join-Path $SOURCE_PATH $ProjectPath "package.json"
            if (Test-Path $packageJsonPath) {
                $packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
                
                foreach ($dep in $pattern.Dependencies) {
                    if ($packageJson.dependencies.$dep -or $packageJson.devDependencies.$dep) {
                        return $type
                    }
                }
            }
            
            return $type
        }
    }
    
    return "Static"
}

function Invoke-Build {
    param(
        [string]$ProjectPath,
        [string]$ProjectType,
        [hashtable]$Config
    )
    
    if ($SkipBuild) {
        Write-Log "Skipping build for $ProjectPath (--SkipBuild specified)"
        return $true
    }
    
    $fullPath = Join-Path $SOURCE_PATH $ProjectPath
    $originalLocation = Get-Location
    
    try {
        Set-Location $fullPath
        Write-Log "Building $ProjectType project: $ProjectPath"
        
        switch ($ProjectType) {
            "React" {
                if ($Config -and $Config.Path) {
                    $buildPath = Join-Path $fullPath $Config.Path
                    Set-Location $buildPath
                }
                  Write-Log "Installing dependencies..."
                if ($DryRun) {
                    Write-Log "[DRY RUN] Would run: npm install"
                } else {
                    $npmPath = Get-Command npm -ErrorAction SilentlyContinue
                    if (-not $npmPath) {
                        throw "npm command not found. Please ensure Node.js is installed and in PATH."
                    }
                    
                    npm install
                    if ($LASTEXITCODE -ne 0) {
                        throw "npm install failed with exit code $LASTEXITCODE"
                    }
                }
                
                Write-Log "Building React application..."
                if ($DryRun) {
                    Write-Log "[DRY RUN] Would run: npm run build"
                } else {
                    & npm run build
                    if ($LASTEXITCODE -ne 0) {
                        throw "npm run build failed with exit code $LASTEXITCODE"
                    }
                }
            }
            
            "PHP" {
                if ($Config -and $Config.Backend -and $Config.Backend.Path) {
                    $buildPath = Join-Path $fullPath $Config.Backend.Path
                    Set-Location $buildPath
                }
                
                Write-Log "Installing Composer dependencies..."                if ($DryRun) {
                    Write-Log "[DRY RUN] Would run: composer install --no-dev --optimize-autoloader"
                } else {
                    $composerArgs = if ($Production) { 
                        @("install", "--no-dev", "--optimize-autoloader", "--no-interaction")
                    } else {
                        @("install", "--no-interaction")
                    }
                    
                    $result = Start-Process -FilePath "composer" -ArgumentList $composerArgs -Wait -PassThru -NoNewWindow
                    if ($result.ExitCode -ne 0) {
                        throw "composer install failed with exit code $($result.ExitCode)"
                    }
                }
            }
            
            "FullStack" {
                # Build backend first
                if ($Config.Backend) {
                    Write-Log "Building backend..."
                    Invoke-Build -ProjectPath "$ProjectPath/$($Config.Backend.Path)" -ProjectType $Config.Backend.Type -Config $Config.Backend
                }
                
                # Build frontend if needed
                if ($Config.Frontend -and $Config.Frontend.RequiresBuild) {
                    Write-Log "Building frontend..."
                    Invoke-Build -ProjectPath $ProjectPath -ProjectType $Config.Frontend.Type -Config $Config.Frontend
                }
            }
              "Node" {
                Write-Log "Installing Node.js dependencies..."
                if ($DryRun) {
                    Write-Log "[DRY RUN] Would run: npm install"
                } else {
                    $npmArgs = if ($Production) { @("install", "--production") } else { @("install") }
                    $result = Start-Process -FilePath "npm" -ArgumentList $npmArgs -Wait -PassThru -NoNewWindow
                    if ($result.ExitCode -ne 0) {
                        throw "npm install failed with exit code $($result.ExitCode)"
                    }
                }
            }
            
            "Static" {
                Write-Log "Static project - no build required"
            }
            
            default {
                Write-Log "Unknown project type: $ProjectType" "WARN"
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

function Copy-ProjectFiles {
    param(
        [string]$ProjectPath,
        [string]$ProjectType,
        [hashtable]$Config
    )
    
    $sourcePath = Join-Path $SOURCE_PATH $ProjectPath
    $destPath = Join-Path $DEPLOY_PATH $ProjectPath
    
    Write-Log "Deploying $ProjectPath to $destPath"
    
    # Create destination directory
    if (-not $DryRun -and -not (Test-Path $destPath)) {
        New-Item -ItemType Directory -Path $destPath -Force | Out-Null
    }
    
    # Determine what to copy based on project type and config
    $copyItems = @()
    $excludeItems = @(".git", ".gitignore", "node_modules", ".env.example", "*.log", "*.tmp")
    
    if ($Config -and $Config.Exclude) {
        $excludeItems += $Config.Exclude
    }
    
    switch ($ProjectType) {        "React" {
            if ($Config -and $Config.OutputDir) {
                $outputPath = if ($Config.Path) {
                    Join-Path -Path $sourcePath -ChildPath $Config.Path | Join-Path -ChildPath $Config.OutputDir
                } else {
                    Join-Path -Path $sourcePath -ChildPath $Config.OutputDir
                }
                
                if (Test-Path $outputPath) {
                    $copyItems += @{Source = (Join-Path -Path $outputPath -ChildPath "*"); Dest = $destPath; Recursive = $true}
                } else {
                    Write-Log "React output directory not found: $outputPath" "WARN"
                }
            } else {
                # Copy built files from standard locations
                $distPath = Join-Path -Path $sourcePath -ChildPath "dist"
                $buildPath = Join-Path -Path $sourcePath -ChildPath "build"
                
                if (Test-Path $distPath) {
                    $copyItems += @{Source = (Join-Path -Path $distPath -ChildPath "*"); Dest = $destPath; Recursive = $true}
                } elseif (Test-Path $buildPath) {
                    $copyItems += @{Source = (Join-Path -Path $buildPath -ChildPath "*"); Dest = $destPath; Recursive = $true}
                } else {
                    Write-Log "No React build output found in dist/ or build/" "WARN"
                }
            }
        }
        
        "PHP" {
            # Copy all PHP files and vendor directory
            $copyItems += @{Source = "$sourcePath\*"; Dest = $destPath; Recursive = $true}
            $excludeItems += @("tests", "phpunit.xml", ".phpunit.result.cache")
        }
        
        "FullStack" {
            # Copy frontend files
            if ($Config.Frontend -and $Config.Frontend.Files) {
                foreach ($file in $Config.Frontend.Files) {
                    $sourceFile = Join-Path $sourcePath $file
                    if (Test-Path $sourceFile) {
                        $copyItems += @{Source = $sourceFile; Dest = $destPath; Recursive = $false}
                    }
                }
            }
            
            # Copy backend
            if ($Config.Backend -and $Config.Backend.Path) {
                $backendSource = Join-Path $sourcePath $Config.Backend.Path
                $backendDest = Join-Path $destPath $Config.Backend.Path
                
                if (Test-Path $backendSource) {
                    $copyItems += @{Source = "$backendSource\*"; Dest = $backendDest; Recursive = $true}
                }
            }
        }
        
        "Static" {
            if ($Config -and $Config.Files) {
                foreach ($file in $Config.Files) {
                    $sourceFile = Join-Path $sourcePath $file
                    if (Test-Path $sourceFile) {
                        $copyItems += @{Source = $sourceFile; Dest = $destPath; Recursive = ($file.EndsWith("/"))}
                    }
                }
            } else {
                # Copy all files
                $copyItems += @{Source = "$sourcePath\*"; Dest = $destPath; Recursive = $true}
            }
        }
        
        default {
            # Copy everything
            $copyItems += @{Source = "$sourcePath\*"; Dest = $destPath; Recursive = $true}
        }
    }
    
    # Perform the copy operations
    foreach ($item in $copyItems) {
        try {
            if ($DryRun) {
                Write-Log "[DRY RUN] Would copy: $($item.Source) -> $($item.Dest)"
            } else {
                if (-not (Test-Path (Split-Path $item.Dest -Parent))) {
                    New-Item -ItemType Directory -Path (Split-Path $item.Dest -Parent) -Force | Out-Null
                }
                
                if ($item.Recursive) {
                    Copy-Item -Path $item.Source -Destination $item.Dest -Recurse -Force
                } else {
                    Copy-Item -Path $item.Source -Destination $item.Dest -Force
                }
                
                Write-Log "Copied: $($item.Source) -> $($item.Dest)"
            }
        } catch {
            Write-Log "Failed to copy $($item.Source): $_" "ERROR"
        }
    }
    
    # Remove excluded items from destination
    foreach ($exclude in $excludeItems) {
        $excludePath = Join-Path $destPath $exclude
        if (Test-Path $excludePath) {
            if ($DryRun) {
                Write-Log "[DRY RUN] Would remove: $excludePath"
            } else {
                Remove-Item -Path $excludePath -Recurse -Force -ErrorAction SilentlyContinue
                Write-Log "Removed excluded item: $excludePath"
            }
        }
    }
}

function Set-ProductionConfig {
    param(
        [string]$ProjectPath,
        [hashtable]$Config
    )
    
    if (-not $Production -or -not $Config.Production) {
        return
    }
    
    $destPath = Join-Path $DEPLOY_PATH $ProjectPath
    
    Write-Log "Applying production configuration for $ProjectPath"
    
    # Update environment file
    if ($Config.Production.EnvFile) {
        $envPath = Join-Path $destPath $Config.Production.EnvFile
        if (Test-Path $envPath) {
            if ($DryRun) {
                Write-Log "[DRY RUN] Would update environment file: $envPath"
            } else {
                # Read existing .env file
                $envContent = Get-Content $envPath
                
                # Update production settings
                $envContent = $envContent -replace "DEBUG=true", "DEBUG=false"
                $envContent = $envContent -replace "http://localhost", "https://webhatchery.au"
                
                # Write back to file
                Set-Content -Path $envPath -Value $envContent
                Write-Log "Updated production environment: $envPath"
            }
        }
    }
    
    # Update API URLs in frontend files
    if ($Config.Production.ApiUrl) {
        $jsFiles = Get-ChildItem -Path $destPath -Filter "*.js" -Recurse
        foreach ($file in $jsFiles) {
            if ($DryRun) {
                Write-Log "[DRY RUN] Would update API URL in: $($file.FullName)"
            } else {
                $content = Get-Content $file.FullName -Raw
                $content = $content -replace "http://localhost:\d+/api", $Config.Production.ApiUrl
                $content = $content -replace "localhost:\d+", "webhatchery.au"
                Set-Content -Path $file.FullName -Value $content
                Write-Log "Updated API URLs in: $($file.FullName)"
            }
        }
    }
}

function Invoke-PostDeployTasks {
    param(
        [string]$ProjectPath,
        [hashtable]$Config
    )
    
    $destPath = Join-Path $DEPLOY_PATH $ProjectPath
    
    # Database initialization for projects that need it
    if ($Config.Backend -and $Config.Backend.DatabaseInit) {
        Write-Log "Database initialization may be required for $ProjectPath"
        Write-Log "Please run the database initialization script manually if needed"
    }
    
    # Set file permissions (if on Unix-like system or using WSL)
    if ($Production -and (Get-Command "chmod" -ErrorAction SilentlyContinue)) {
        if ($DryRun) {
            Write-Log "[DRY RUN] Would set file permissions for $destPath"
        } else {
            # Set appropriate permissions for web server
            & chmod -R 755 $destPath
            & chmod -R 644 (Join-Path $destPath "*.php")
            & chmod -R 644 (Join-Path $destPath "*.html")
            & chmod -R 644 (Join-Path $destPath "*.css")
            & chmod -R 644 (Join-Path $destPath "*.js")
            Write-Log "Set file permissions for $destPath"
        }
    }
}

function Show-Summary {
    param([array]$Results)

    Write-Host "BUILD & DEPLOY SUMMARY" -ForegroundColor Cyan
    Write-Host "="*80 -ForegroundColor Cyan
    
    $successful = $Results | Where-Object { $_.Success }
    $failed = $Results | Where-Object { -not $_.Success }
    
    Write-Host "Total Projects: $($Results.Count)" -ForegroundColor White
    Write-Host "Successful: $($successful.Count)" -ForegroundColor Green
    Write-Host "Failed: $($failed.Count)" -ForegroundColor Red
    
    if ($successful.Count -gt 0) {
        Write-Host "Successful deployments:" -ForegroundColor Green
        foreach ($result in $successful) {
            Write-Host " + $($result.Project) ($($result.Type))" -ForegroundColor Green
        }
    }
    if ($failed.Count -gt 0) {
        Write-Host "`nFailed deployments:" -ForegroundColor Red        
        foreach ($result in $failed) {
            Write-Host "  x $($result.Project) ($($result.Type)): $($result.Error)" -ForegroundColor Red
        }
    }
    
    Write-Host "`nLog file: $LOG_FILE" -ForegroundColor Cyan
    Write-Host "="*80 -ForegroundColor Cyan
}

# Main execution
function Main {
    Write-Host "WebHatchery Build & Deploy Script v$SCRIPT_VERSION" -ForegroundColor Cyan
    Write-Host "Source: $SOURCE_PATH" -ForegroundColor Yellow
    Write-Host "Target: $DEPLOY_PATH" -ForegroundColor Yellow
    
    if ($DryRun) {
        Write-Host "DRY RUN MODE - No changes will be made" -ForegroundColor Magenta
    }
    
    # Initialize log
    Write-Log "Starting build and deploy process"
    Write-Log "Source: $SOURCE_PATH"
    Write-Log "Target: $DEPLOY_PATH"
    Write-Log "Filter: $ProjectFilter"
    Write-Log "Production: $Production"
    Write-Log "Force: $Force"
    Write-Log "DryRun: $DryRun"
    
    # Check prerequisites
    if (-not (Test-Prerequisites)) {
        Write-Host "Prerequisites check failed. Please install missing tools." -ForegroundColor Red
        exit 1
    }
    
    # Verify paths
    if (-not (Test-Path $SOURCE_PATH)) {
        Write-Log "Source path does not exist: $SOURCE_PATH" "ERROR"
        exit 1
    }
    
    if (-not $DryRun -and -not (Test-Path $DEPLOY_PATH)) {
        Write-Log "Creating deployment directory: $DEPLOY_PATH"
        New-Item -ItemType Directory -Path $DEPLOY_PATH -Force | Out-Null
    }
      # Get projects to process
    $projects = Get-ChildItem -Path $SOURCE_PATH -Directory | Where-Object { 
        $_.Name -like $ProjectFilter -and 
        $_.Name -notmatch "^\." -and
        $_.Name -ne "utils" -and
        $_.Name -ne "cgi-bin"
    }
    
    if ($projects.Count -eq 0) {
        Write-Log "No projects found matching filter: $ProjectFilter" "WARN"
        exit 0
    }
    
    Write-Log "Found $($projects.Count) projects to process"
    
    $results = @()
    
    foreach ($project in $projects) {
        $projectName = $project.Name
        Write-Host "`nProcessing: $projectName" -ForegroundColor Yellow
        
        try {
            # Detect project type
            $projectType = Get-ProjectType -ProjectPath $projectName
            $config = $PROJECT_CONFIGS[$projectName]
            
            Write-Log "Project: $projectName, Type: $projectType"
            
            # Build if required
            $buildSuccess = $true
            if (-not $OnlyBuild) {
                $requiresBuild = $config.RequiresBuild -or 
                                $config.Backend.RequiresBuild -or 
                                $projectType -in @("React", "PHP", "Node")
                
                if ($requiresBuild) {
                    $buildSuccess = Invoke-Build -ProjectPath $projectName -ProjectType $projectType -Config $config
                }
            }
            
            # Deploy if build was successful and not OnlyBuild mode
            if ($buildSuccess -and -not $OnlyBuild) {
                Copy-ProjectFiles -ProjectPath $projectName -ProjectType $projectType -Config $config
                Set-ProductionConfig -ProjectPath $projectName -Config $config
                Invoke-PostDeployTasks -ProjectPath $projectName -Config $config
            }
              $results += @{
                Project = $projectName
                Type = $projectType
                Success = $buildSuccess
                Error = $null
            }
            
            Write-Log "Completed processing $projectName" "SUCCESS"
        } catch {
            $errorMsg = $_.Exception.Message
            Write-Log "Failed to process $projectName - $errorMsg" "ERROR"
            
            $results += @{
                Project = $projectName
                Type = $projectType
                Success = $false
                Error = $errorMsg
            }
        }
    }
    
    # Show summary
    Show-Summary -Results $results
    
    # Exit with appropriate code
    $failedCount = ($results | Where-Object { -not $_.Success }).Count
    exit $failedCount
}

# Run the script
Main
