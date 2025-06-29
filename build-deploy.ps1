# WebHatchery Build and Deploy Script
# Streamlined deployment solution for E:\WebHatchery to F:\WebHatchery

param(
    [string]$ProjectFilter = "*",
    [switch]$Force,
    [switch]$VerboseOutput,
    [switch]$DryRun,
    [switch]$SkipBuild,
    [switch]$OnlyBuild,
    [switch]$CleanInstall,
    [switch]$CleanDeploy
)

# Import utility modules
. "$PSScriptRoot\utils\deploy\Config.ps1"
. "$PSScriptRoot\utils\deploy\Logging.ps1"
. "$PSScriptRoot\utils\deploy\Build.ps1"
. "$PSScriptRoot\utils\deploy\Deploy.ps1"
. "$PSScriptRoot\utils\deploy\Helpers.ps1"

# Configuration
$SOURCE_PATH = "E:\WebHatchery"
$DEPLOY_PATH = "F:\WebHatchery"
$LOG_FILE = "$SOURCE_PATH\build-deploy.log"

# Clear the log file at the start of each run
Clear-Content -Path $LOG_FILE -ErrorAction SilentlyContinue

# Load configurations from projects.json
$PROJECT_CONFIGS = Get-ProjectConfigs

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
    
    # Only deploy projects listed in projects.json
    $projects = @()
    foreach ($key in $PROJECT_CONFIGS.Keys) {
        if ($key -eq "rootFiles" -or $key -eq "global") { continue }
        $config = $PROJECT_CONFIGS[$key]
        if ($config.path) {
            $fullPath = Join-Path $SOURCE_PATH $config.path
        } else {
            $fullPath = $SOURCE_PATH
        }
        if ($key -like $ProjectFilter) {
            $projects += New-Object PSObject -Property @{
                Name = $key
                FullName = $fullPath
                SourceFolder = $config.path
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
