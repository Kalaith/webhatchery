# WebHatchery Project Validator
# Validates project configurations and dependencies

param(
    [Parameter(Mandatory=$false)]
    [string]$ProjectFilter = "*",
    
    [Parameter(Mandatory=$false)]
    [switch]$Fix = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$VerboseOutput = $false
)

$SOURCE_PATH = "E:\WebHatchery"
$CONFIG_FILE = "$SOURCE_PATH\build-config.json"

function Write-ValidationLog {
    param([string]$Message, [string]$Level = "INFO")
    
    $color = switch($Level) {
        "ERROR" { "Red" }
        "WARN" { "Yellow" }
        "SUCCESS" { "Green" }
        "INFO" { "Cyan" }
        default { "White" }
    }
      if ($VerboseOutput -or $Level -ne "INFO") {
        Write-Host "[$Level] $Message" -ForegroundColor $color
    }
}

function Test-ProjectStructure {
    param([string]$ProjectPath, [PSCustomObject]$Config)
    
    $issues = @()
    $fullPath = Join-Path $SOURCE_PATH $ProjectPath
    
    Write-ValidationLog "Validating structure for $ProjectPath"
    
    # Check if project directory exists
    if (-not (Test-Path $fullPath)) {
        $issues += "Project directory does not exist: $fullPath"
        return $issues
    }
    
    # Check required files based on project type
    switch ($Config.type) {
        "React" {
            $requiredFiles = @("package.json")
            if ($Config.path) {
                $reactPath = Join-Path $fullPath $Config.path
                foreach ($file in $requiredFiles) {
                    $filePath = Join-Path $reactPath $file
                    if (-not (Test-Path $filePath)) {
                        $issues += "Missing required file: $file in $($Config.path)"
                    }
                }
                
                # Check for React dependencies
                $packageJsonPath = Join-Path $reactPath "package.json"
                if (Test-Path $packageJsonPath) {
                    $packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
                    $hasReact = $packageJson.dependencies.react -or $packageJson.devDependencies.react
                    if (-not $hasReact) {
                        $issues += "React dependency not found in package.json"
                    }
                }
            }
        }
        
        "PHP" {
            $requiredFiles = @("composer.json")
            foreach ($file in $requiredFiles) {
                $filePath = Join-Path $fullPath $file
                if (-not (Test-Path $filePath)) {
                    $issues += "Missing required file: $file"
                }
            }
        }
        
        "FullStack" {
            # Check frontend files
            if ($Config.frontend -and $Config.frontend.files) {
                foreach ($file in $Config.frontend.files) {
                    $filePath = Join-Path $fullPath $file
                    if (-not (Test-Path $filePath)) {
                        $issues += "Missing frontend file: $file"
                    }
                }
            }
            
            # Check backend structure
            if ($Config.backend -and $Config.backend.path) {
                $backendPath = Join-Path $fullPath $Config.backend.path
                if (-not (Test-Path $backendPath)) {
                    $issues += "Backend directory does not exist: $($Config.backend.path)"
                } else {
                    $composerPath = Join-Path $backendPath "composer.json"
                    if (-not (Test-Path $composerPath)) {
                        $issues += "Backend missing composer.json"
                    }
                }
            }
        }
          "Static" {
            # Check for HTML files - either direct or in subdirectories for collection-type projects
            $htmlFiles = Get-ChildItem -Path $fullPath -Filter "*.html" -ErrorAction SilentlyContinue
            $phpFiles = Get-ChildItem -Path $fullPath -Filter "*.php" -ErrorAction SilentlyContinue
            
            # If this is a recursive/collection project, check subdirectories
            if ($Config.recursive -and ($htmlFiles.Count -eq 0 -and $phpFiles.Count -eq 0)) {
                $subDirFiles = Get-ChildItem -Path $fullPath -Recurse -Include "*.html", "*.php" -ErrorAction SilentlyContinue
                if ($subDirFiles.Count -eq 0) {
                    $issues += "No HTML or PHP files found in static project or subdirectories"
                }
            } elseif (-not $Config.recursive -and $htmlFiles.Count -eq 0 -and $phpFiles.Count -eq 0) {
                $issues += "No HTML or PHP files found in static project"
            }
        }
    }
    
    return $issues
}

function Test-Dependencies {
    param([string]$ProjectPath, [PSCustomObject]$Config)
    
    $issues = @()
    $fullPath = Join-Path $SOURCE_PATH $ProjectPath
    
    Write-ValidationLog "Checking dependencies for $ProjectPath"
      # Check Node.js dependencies
    if ($Config.type -in @("React", "Node") -or ($Config.type -eq "FullStack" -and $Config.frontend.type -eq "React")) {
        $packageJsonPath = if ($Config.path) {
            Join-Path $fullPath $Config.path "package.json"
        } else {
            Join-Path $fullPath "package.json"
        }
        
        if (Test-Path $packageJsonPath) {
            try {
                $packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
                
                # Check for lock file
                $lockFiles = @("package-lock.json", "yarn.lock", "pnpm-lock.yaml")
                $hasLockFile = $false
                foreach ($lockFile in $lockFiles) {
                    $lockPath = Join-Path (Split-Path $packageJsonPath) $lockFile
                    if (Test-Path $lockPath) {
                        $hasLockFile = $true
                        break
                    }
                }
                
                if (-not $hasLockFile) {
                    $issues += "No lock file found (package-lock.json, yarn.lock, or pnpm-lock.yaml)"
                }
                
                # Check for build script
                if (-not $packageJson.scripts.build) {
                    $issues += "No build script defined in package.json"
                }
                
            } catch {
                $issues += "Invalid package.json format: $_"
            }
        }
    }
    
    # Check PHP dependencies
    if ($Config.type -eq "PHP" -or ($Config.type -eq "FullStack" -and $Config.backend.type -eq "PHP")) {
        $composerPath = if ($Config.backend -and $Config.backend.path) {
            Join-Path $fullPath $Config.backend.path "composer.json"
        } else {
            Join-Path $fullPath "composer.json"
        }
        
        if (Test-Path $composerPath) {
            try {
                $composerJson = Get-Content $composerPath | ConvertFrom-Json
                
                # Check for composer.lock
                $lockPath = Join-Path (Split-Path $composerPath) "composer.lock"
                if (-not (Test-Path $lockPath)) {
                    $issues += "No composer.lock file found"
                }
                
                # Check for autoload configuration
                if (-not $composerJson.autoload) {
                    $issues += "No autoload configuration in composer.json"
                }
                
            } catch {
                $issues += "Invalid composer.json format: $_"
            }
        }
    }
    
    return $issues
}

function Test-BuildConfiguration {
    param([string]$ProjectPath, [PSCustomObject]$Config)
    
    $issues = @()
    $fullPath = Join-Path $SOURCE_PATH $ProjectPath
    
    Write-ValidationLog "Validating build configuration for $ProjectPath"
    
    # Check build requirements
    if ($Config.requiresBuild) {
        if (-not $Config.buildCommand -and $Config.type -notin @("React", "PHP")) {
            $issues += "Build required but no build command specified"
        }
        
        # Validate output directory exists after build would run
        if ($Config.outputDir) {
            $outputPath = Join-Path $fullPath $Config.outputDir
            # Note: We can't check if output exists since it's created during build
            # But we can check if the source structure supports it
        }
    }
    
    # Check production configuration
    if ($Config.production) {
        if ($Config.production.apiUrl -and -not ($Config.production.apiUrl -match "^https?://")) {
            $issues += "Invalid production API URL format"
        }
        
        if ($Config.production.corsOrigins) {
            foreach ($origin in $Config.production.corsOrigins) {
                if (-not ($origin -match "^https?://")) {
                    $issues += "Invalid CORS origin format: $origin"
                }
            }
        }
    }
    
    return $issues
}

function Repair-Project {
    param([string]$ProjectPath, [PSCustomObject]$Config, [array]$Issues)
    
    if (-not $Fix) {
        return
    }
    
    $fullPath = Join-Path $SOURCE_PATH $ProjectPath
    $repaired = @()
    
    Write-ValidationLog "Attempting to repair issues for $ProjectPath" "WARN"
    
    foreach ($issue in $Issues) {
        try {
            switch -Wildcard ($issue) {
                "*package-lock.json*" {
                    $packagePath = if ($Config.path) {
                        Join-Path $fullPath $Config.path
                    } else {
                        $fullPath
                    }
                    
                    Set-Location $packagePath
                    & npm install
                    $repaired += "Generated package-lock.json"
                }
                
                "*composer.lock*" {
                    $composerPath = if ($Config.backend -and $Config.backend.path) {
                        Join-Path $fullPath $Config.backend.path
                    } else {
                        $fullPath
                    }
                    
                    Set-Location $composerPath
                    & composer install
                    $repaired += "Generated composer.lock"
                }
                
                "*No build script*" {
                    # Add basic build script to package.json
                    $packageJsonPath = if ($Config.path) {
                        Join-Path $fullPath $Config.path "package.json"
                    } else {
                        Join-Path $fullPath "package.json"
                    }
                    
                    if (Test-Path $packageJsonPath) {
                        $packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
                        if (-not $packageJson.scripts) {
                            $packageJson | Add-Member -MemberType NoteProperty -Name "scripts" -Value @{}
                        }
                        
                        if ($Config.type -eq "React") {
                            $packageJson.scripts | Add-Member -MemberType NoteProperty -Name "build" -Value "vite build" -Force
                        }
                        
                        $packageJson | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath
                        $repaired += "Added build script to package.json"
                    }
                }
            }
        } catch {
            Write-ValidationLog "Failed to repair: $issue - $_" "ERROR"
        }
    }
      if ($repaired.Count -gt 0) {
        Write-ValidationLog "Repaired $($repaired.Count) issues:" "SUCCESS"
        foreach ($repair in $repaired) {
            Write-ValidationLog "  [OK] $repair" "SUCCESS"
        }
    }
}

function Show-ValidationSummary {
    param([hashtable]$Results)
    
    # Debug logging
    Write-ValidationLog "Show-ValidationSummary called with Results parameter: $($Results -ne $null)" "INFO"
    if ($Results -ne $null) {
        Write-ValidationLog "Results Keys Count: $($Results.Keys.Count)" "INFO"
        Write-ValidationLog "Results Keys: $($Results.Keys -join ', ')" "INFO"
    }
    
    Write-Host "`n" -NoNewline
    Write-Host "="*80 -ForegroundColor Cyan
    Write-Host "PROJECT VALIDATION SUMMARY" -ForegroundColor Cyan  
    Write-Host "="*80 -ForegroundColor Cyan
    
    if ($Results -eq $null) {
        Write-Host "ERROR: No results provided to summary function" -ForegroundColor Red
        return
    }
    
    $totalProjects = $Results.Keys.Count
    $validProjects = ($Results.Values | Where-Object { $_.Issues.Count -eq 0 }).Count
    $invalidProjects = $totalProjects - $validProjects
    
    Write-Host "Total Projects: $totalProjects" -ForegroundColor White
    Write-Host "Valid: $validProjects" -ForegroundColor Green
    Write-Host "Invalid: $invalidProjects" -ForegroundColor Red
    
    foreach ($project in $Results.Keys | Sort-Object) {
        $result = $Results[$project]
        $status = if ($result.Issues.Count -eq 0) { "[OK]" } else { "[ERROR]" }
        $color = if ($result.Issues.Count -eq 0) { "Green" } else { "Red" }
        
        Write-Host "`n$status $project ($($result.Type))" -ForegroundColor $color
        
        if ($result.Issues.Count -gt 0) {
            foreach ($issue in $result.Issues) {
                Write-Host "    • $issue" -ForegroundColor Yellow
            }
        }
    }
    
    Write-Host "`n" -NoNewline
    Write-Host "="*80 -ForegroundColor Cyan
}

# Main execution
function Main {
    Write-Host "WebHatchery Project Validator" -ForegroundColor Cyan
    Write-Host "Source: $SOURCE_PATH" -ForegroundColor Yellow
    
    if ($Fix) {
        Write-Host "Auto-repair mode enabled" -ForegroundColor Magenta
    }
    
    # Load configuration
    if (-not (Test-Path $CONFIG_FILE)) {
        Write-ValidationLog "Configuration file not found: $CONFIG_FILE" "ERROR"
        Write-ValidationLog "Run the build script first to generate configuration" "ERROR"
        exit 1
    }
    
    try {
        $config = Get-Content $CONFIG_FILE | ConvertFrom-Json
    } catch {
        Write-ValidationLog "Invalid configuration file: $_" "ERROR"
        exit 1
    }
    
    # Get projects to validate
    $projects = Get-ChildItem -Path $SOURCE_PATH -Directory | Where-Object { 
        $_.Name -like $ProjectFilter -and 
        $_.Name -notmatch "^\." -and
        $_.Name -ne "utils"
    }
    
    if ($projects.Count -eq 0) {
        Write-ValidationLog "No projects found matching filter: $ProjectFilter" "WARN"
        exit 0
    }
    
    Write-ValidationLog "Validating $($projects.Count) projects..."
    
    $results = @{}
    
    foreach ($project in $projects) {
        $projectName = $project.Name
        $projectConfig = $config.projects.$projectName
        
        if (-not $projectConfig) {
            Write-ValidationLog "No configuration found for $projectName, skipping..." "WARN"
            continue
        }
        
        Write-ValidationLog "`nValidating: $projectName" "INFO"
        
        $allIssues = @()
        
        # Run validation tests
        $allIssues += Test-ProjectStructure -ProjectPath $projectName -Config $projectConfig
        $allIssues += Test-Dependencies -ProjectPath $projectName -Config $projectConfig  
        $allIssues += Test-BuildConfiguration -ProjectPath $projectName -Config $projectConfig
        
        # Attempt repairs if requested
        if ($allIssues.Count -gt 0) {
            Repair-Project -ProjectPath $projectName -Config $projectConfig -Issues $allIssues
            
            # Re-run validation after repair
            if ($Fix) {
                $allIssues = @()
                $allIssues += Test-ProjectStructure -ProjectPath $projectName -Config $projectConfig
                $allIssues += Test-Dependencies -ProjectPath $projectName -Config $projectConfig
                $allIssues += Test-BuildConfiguration -ProjectPath $projectName -Config $projectConfig
            }
        }
          $results[$projectName] = @{
            Type = $projectConfig.type
            Issues = $allIssues
        }
        
        if ($allIssues.Count -eq 0) {
            Write-ValidationLog "[OK] $projectName validation passed" "SUCCESS"
        } else {
            Write-ValidationLog "[ERROR] $projectName has $($allIssues.Count) issues" "ERROR"
        }
    }
    
    # Show summary
    Show-ValidationSummary -Results $results
    
    # Exit with appropriate code
    $totalIssues = ($results.Values | ForEach-Object { $_.Issues.Count } | Measure-Object -Sum).Sum
    exit $totalIssues
}

# Run the validator
Main
