# Helpers.ps1 - Miscellaneous and summary functions
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
