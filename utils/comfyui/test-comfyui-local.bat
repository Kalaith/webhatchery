@echo off
REM Quick test of ComfyUI PowerShell script with local connection

echo Testing ComfyUI PowerShell Script
echo =================================
echo.
echo This will test the comfyui-generate.ps1 script with a simple prompt
echo to verify it can connect to your local ComfyUI instance.
echo.
echo Make sure ComfyUI is running locally first!
echo.
pause

echo Testing connection and generating a simple image...
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0comfyui-generate.ps1" -Prompt "simple test image, colorful abstract art" -Width 512 -Height 512 -OutputPath "test_output.png"

echo.
echo Test complete! Check if test_output.png was created.
pause
