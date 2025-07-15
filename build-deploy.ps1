# WebHatchery Build and Deploy Script
# Streamlined deployment solution for H:\WebHatchery to F:\WebHatchery

param(
    [string]$ProjectFilter = "*",
    [switch]$Force,
    [switch]$VerboseOutput,
    [switch]$DryRun,
    [switch]$SkipBuild,
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
$SOURCE_PATH = "H:\WebHatchery"
$DEPLOY_PATH = "H:\xampp\htdocs"
$LOG_FILE = "$SOURCE_PATH\build-deploy.log"

# Clear the log file at the start of each run
Clear-Content -Path $LOG_FILE -ErrorAction SilentlyContinue

# Load configurations from projects.json
$projectsJsonPath = Join-Path $SOURCE_PATH "projects.json"
$projectsData = Get-Content $projectsJsonPath | ConvertFrom-Json

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
    
    # Parse projects from groups in projects.json
    $projects = @()
    foreach ($groupKey in $projectsData.groups.PSObject.Properties.Name) {
        $group = $projectsData.groups.$groupKey
        if ($group.projects) {
            foreach ($projectConfig in $group.projects) {
                # Extract project name from deployAs
                $projectName = $projectConfig.deployment.deployAs
                if ($projectName -like $ProjectFilter) {
                    $projectWithName = $projectConfig | Add-Member -MemberType NoteProperty -Name "ProjectName" -Value $projectName -PassThru
                    $projects += $projectWithName
                }
            }
        }
    }
    # Add rootFiles as a special project if it matches the filter
    if ("rootFiles" -like $ProjectFilter -and $projectsData.rootFiles) {
        $rootFileProject = New-Object PSObject -Property @{
            ProjectName = "rootFiles"
            deployment = $projectsData.rootFiles.deployment
            path = ""
        }
        $projects = @($rootFileProject) + $projects
    }

    if (-not $projects) {
        Write-Log "No projects found matching filter: $ProjectFilter" "WARN"
        exit 0
    }

    Write-Log "Processing $($projects.Count) projects"
    $results = @()
    foreach ($project in $projects) {
        $projectName = $project.ProjectName
        $config = $project
        Write-Host "Processing: $projectName" -ForegroundColor Yellow
        try {
            $projectType = $config.deployment.type

            $buildSuccess = $true
            # Enhanced FullStack/Frontend/Backend build and deploy logic
            if ($projectType -eq "FullStack" -and $config.deployment.frontend -and $config.deployment.backend) {
                # --- FRONTEND ---
                $frontend = $config.deployment.frontend
                $frontendPath = Join-Path $SOURCE_PATH $frontend.path
                $frontendBuildSuccess = $true
                if (-not $SkipBuild -and $frontend.requiresBuild -and (Test-Path $frontendPath)) {
                    Push-Location $frontendPath
                    try {
                        if ($frontend.packageManager -eq "npm" -and -not $DryRun) {
                            Invoke-Expression "npm install"
                            Invoke-Expression $frontend.buildCommand
                        }
                    } catch {
                        Write-Log "Frontend build failed for $projectName" "ERROR"
                        $frontendBuildSuccess = $false
                    } finally {
                        Pop-Location
                    }
                } elseif (-not (Test-Path $frontendPath)) {
                    Write-Log "Frontend path not found: $frontendPath" "ERROR"
                    $frontendBuildSuccess = $false
                }
                # --- BACKEND ---
                $backend = $config.deployment.backend
                $backendPath = Join-Path $SOURCE_PATH $backend.path
                $backendBuildSuccess = $true
                if (-not $SkipBuild -and $backend.requiresBuild -and (Test-Path $backendPath)) {
                    Push-Location $backendPath
                    try {
                        if (-not $DryRun) {
                            Invoke-Expression $backend.buildCommand
                        }
                    } catch {
                        Write-Log "Backend build failed for $projectName" "ERROR"
                        $backendBuildSuccess = $false
                    } finally {
                        Pop-Location
                    }
                } elseif (-not (Test-Path $backendPath)) {
                    Write-Log "Backend path not found: $backendPath" "ERROR"
                    $backendBuildSuccess = $false
                }
                $buildSuccess = $frontendBuildSuccess -and $backendBuildSuccess
                # --- DEPLOY ---
                if ($buildSuccess) {
                    $deployPath = Join-Path $DEPLOY_PATH $config.deployment.deployAs
                    # Deploy frontend
                    $frontendOutput = $frontend.outputDir
                    $frontendOutputPath = Join-Path $frontendPath $frontendOutput
                    if (Test-Path $frontendOutputPath) {
                        if (-not $DryRun) {
                            New-Item -ItemType Directory -Path $deployPath -Force | Out-Null
                            Copy-Item -Path "$frontendOutputPath\*" -Destination $deployPath -Recurse -Force
                        }
                    } else {
                        Write-Log "Frontend output path not found: $frontendOutputPath" "WARN"
                    }
                    # Deploy backend
                    $deployBackendPath = Join-Path $deployPath "api"
                    if (Test-Path $backendPath) {
                        if (-not $DryRun) {
                            New-Item -ItemType Directory -Path $deployBackendPath -Force | Out-Null
                            Copy-Item -Path "$backendPath\*" -Destination $deployBackendPath -Recurse -Force
                        }
                    } else {
                        Write-Log "Backend source path not found: $backendPath" "WARN"
                    }
                }
            } else {
                # Legacy/other project types
                if (-not $SkipBuild -and $projectType -in @("React", "PHP", "Node", "FullStack")) {
                    $projectPath = Join-Path $SOURCE_PATH $config.path
                    if (Test-Path $projectPath) {
                        Push-Location $projectPath
                        try {
                            if ($config.deployment.requiresBuild -and -not $DryRun) {
                                if ($config.deployment.packageManager -eq "npm") {
                                    Invoke-Expression "npm install"
                                    Invoke-Expression $config.deployment.buildCommand
                                }
                            }
                        } catch {
                            Write-Log "Build failed for $projectName" "ERROR"
                            $buildSuccess = $false
                        } finally {
                            Pop-Location
                        }
                    } else {
                        Write-Log "Project path not found: $projectPath" "ERROR"
                        $buildSuccess = $false
                    }
                }
                if ($config.backend -and $config.backend.requiresBuild -and -not $SkipBuild) {
                    $backendPath = Join-Path $SOURCE_PATH $config.backend.path
                    if (Test-Path $backendPath) {
                        Push-Location $backendPath
                        try {
                            if (-not $DryRun) { 
                                Invoke-Expression $config.backend.buildCommand 
                            }
                        } catch {
                            Write-Log "Backend build failed: $_" "ERROR"
                            $buildSuccess = $false
                        } finally {
                            Pop-Location
                        }
                    } else {
                        Write-Log "Backend path not found: $backendPath" "ERROR"
                        $buildSuccess = $false
                    }
                }
                if ($buildSuccess) {
                    $sourcePath = Join-Path $SOURCE_PATH $config.path
                    $deployPath = Join-Path $DEPLOY_PATH $config.deployment.deployAs
                    if ($projectName -eq "rootFiles") {
                        # Only copy files listed in the files array, and exclude as needed
                        $rootFiles = $config.deployment.files
                        $rootExcludes = $config.deployment.exclude
                        foreach ($filePattern in $rootFiles) {
                            $filesToCopy = Get-ChildItem -Path (Join-Path $SOURCE_PATH $filePattern) -File -ErrorAction SilentlyContinue
                            foreach ($file in $filesToCopy) {
                                $excludeMatch = $false
                                if ($rootExcludes) {
                                    foreach ($ex in $rootExcludes) {
                                        if ($file.Name -like $ex) { $excludeMatch = $true; break }
                                    }
                                }
                                if (-not $excludeMatch) {
                                    if (-not $DryRun) {
                                        Copy-Item -Path $file.FullName -Destination $DEPLOY_PATH -Force
                                    }
                                }
                            }
                        }
                    } else {
                        if ($config.deployment.requiresBuild -and $config.deployment.outputDir) {
                            $sourcePath = Join-Path $sourcePath $config.deployment.outputDir
                        }
                        if (Test-Path $sourcePath) {
                            if (-not $DryRun) {
                                New-Item -ItemType Directory -Path $deployPath -Force | Out-Null
                                Copy-Item -Path "$sourcePath\*" -Destination $deployPath -Recurse -Force
                            }
                        } else {
                            Write-Log "Frontend source path not found: $sourcePath" "WARN"
                        }
                        if ($config.backend) {
                            $backendSourcePath = Join-Path $SOURCE_PATH $config.backend.path
                            $deployBackendPath = Join-Path $deployPath "api"
                            if (Test-Path $backendSourcePath) {
                                if (-not $DryRun) {
                                    New-Item -ItemType Directory -Path $deployBackendPath -Force | Out-Null
                                    Copy-Item -Path "$backendSourcePath\*" -Destination $deployBackendPath -Recurse -Force
                                }
                            } else {
                                Write-Log "Backend source path not found: $backendSourcePath" "WARN"
                            }
                        }
                    }
                }
            }

            $results += New-Object PSObject -Property @{ Project = $projectName; Type = $projectType; Success = $buildSuccess; Error = $null }
        } catch {
            Write-Log "Failed to process $projectName" "ERROR"
            $results += New-Object PSObject -Property @{ Project = $projectName; Type = "Unknown"; Success = $false; Error = $_.Exception.Message }
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
