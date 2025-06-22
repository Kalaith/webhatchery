# Build.ps1 - Build logic
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
            }            "PHP" {
                $composerArgs = "install --no-dev --optimize-autoloader --no-interaction"
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
                
                $npmArgs = "install --production"
                Invoke-Command "npm $npmArgs" "Installing Node.js dependencies"
            }
            "FullStack" {                # Build backend
                if ($Config.BackendPath) {
                    $backendPath = Join-Path $fullPath $Config.BackendPath
                    Set-Location $backendPath
                    
                    $composerArgs = "install --no-dev --optimize-autoloader --no-interaction"
                    if ($Config.BackendBuildCommand) {
                        Invoke-Command $Config.BackendBuildCommand "Building backend with custom command"
                    } else {
                        Invoke-Command "composer $composerArgs" "Building backend"
                    }
                }# Handle frontend build if it's a React/Vite frontend
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
