# Config.ps1 - Project configuration loading and conversion
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
            
            if ($group.projects) {
                foreach ($project in $group.projects) {
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
                            }
                        }
                        $config = Convert-DeploymentConfig $project.deployment
                        $config.ProjectPath = $project.path  # Store the original path from config
                        $configs[$projectName] = $config
                    }
                }
            }
        }
        
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
