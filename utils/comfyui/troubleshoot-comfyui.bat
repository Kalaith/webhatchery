@echo off
REM ComfyUI Connection Troubleshooter
REM This script helps diagnose ComfyUI connection issues

echo ComfyUI Connection Troubleshooter
echo =================================
echo.

echo 1. Testing local ComfyUI connection...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://127.0.0.1:8188/' -Method Get -TimeoutSec 5; Write-Host '✓ Local ComfyUI is running' -ForegroundColor Green; Write-Host 'Status:' $response.StatusCode } catch { Write-Host '✗ Local ComfyUI not accessible:' $_.Exception.Message -ForegroundColor Red }"

echo.
echo 2. Testing ngrok tunnel...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://awaited-grouper-talented.ngrok-free.app/' -Method Get -TimeoutSec 10; Write-Host '✓ Ngrok tunnel is accessible' -ForegroundColor Green; Write-Host 'Status:' $response.StatusCode } catch { Write-Host '✗ Ngrok tunnel issue:' $_.Exception.Message -ForegroundColor Red }"

echo.
echo 3. Testing ngrok API (if running locally)...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:4040/api/tunnels' -TimeoutSec 5; Write-Host '✓ Ngrok API accessible' -ForegroundColor Green; Write-Host 'Active tunnels:' $response.tunnels.Count; foreach($t in $response.tunnels) { Write-Host '  ' $t.public_url '->' $t.config.addr } } catch { Write-Host '✗ Ngrok API not accessible:' $_.Exception.Message -ForegroundColor Yellow }"

echo.
echo 4. Checking if ComfyUI process is running...
tasklist /FI "IMAGENAME eq python.exe" | findstr python.exe >nul
if %errorlevel%==0 (
    echo ✓ Python processes found
    tasklist /FI "IMAGENAME eq python.exe"
) else (
    echo ✗ No Python processes found
)

echo.
echo 5. Testing ComfyUI API endpoint...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://127.0.0.1:8188/system_stats' -TimeoutSec 5; Write-Host '✓ ComfyUI API responding' -ForegroundColor Green; Write-Host 'System info available' } catch { Write-Host '✗ ComfyUI API not responding:' $_.Exception.Message -ForegroundColor Red }"

echo.
echo Troubleshooting complete!
echo.
echo If local ComfyUI is not running:
echo 1. Navigate to your ComfyUI directory
echo 2. Run: python main.py --listen
echo 3. Wait for "Starting server" message
echo 4. Then start ngrok with: start-ngrok.bat
echo.
pause
