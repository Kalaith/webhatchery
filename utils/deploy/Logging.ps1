# Logging.ps1 - Logging utilities
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
