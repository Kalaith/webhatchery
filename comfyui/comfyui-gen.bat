@echo off
REM ComfyUI Image Generator - Batch Wrapper
REM Usage: comfyui-gen.bat "your prompt here" [width] [height] [model]

setlocal EnableDelayedExpansion

if "%~1"=="" (
    echo Usage: comfyui-gen.bat "prompt" [width] [height] [model]
    echo Examples: 
    echo   comfyui-gen.bat "beautiful landscape" 768 512
    echo   comfyui-gen.bat "anime character" 512 768 "ponyDiffusionV6XL_v6StartWithThisOne.safetensors"
    echo.
    echo Available Models:
    echo   - juggernautXL_v8Rundiffusion.safetensors (default)
    echo   - plantMilkModelSuite_walnut.safetensors
    echo   - ponyDiffusionV6XL_v6StartWithThisOne.safetensors
    echo.
    echo Default size is 512x512
    exit /b 1
)

set PROMPT=%~1
set WIDTH=%~2
set HEIGHT=%~3
set MODEL=%~4

if "%WIDTH%"=="" set WIDTH=512
if "%HEIGHT%"=="" set HEIGHT=512

echo Generating image with ComfyUI...
echo Prompt: %PROMPT%
echo Size: %WIDTH%x%HEIGHT%
if not "%MODEL%"=="" echo Model: %MODEL%
echo.

if "%MODEL%"=="" (
    powershell -ExecutionPolicy Bypass -File "%~dp0comfyui-generate.ps1" -Prompt "%PROMPT%" -Width %WIDTH% -Height %HEIGHT%
) else (
    powershell -ExecutionPolicy Bypass -File "%~dp0comfyui-generate.ps1" -Prompt "%PROMPT%" -Width %WIDTH% -Height %HEIGHT% -Model "%MODEL%"
)
