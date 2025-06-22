# Deploy.ps1 - Deployment and file copy logic
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
    if ($Config.ProductionApiUrl) {
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
