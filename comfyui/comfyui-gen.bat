@echo off
REM ComfyUI Image Generator - Batch Wrapper
REM Usage: comfyui-gen.bat "your prompt here" [width] [height] [model]

setlocal EnableDelayedExpansion

if "%~1"=="" (
    echo Usage: comfyui-gen.bat "prompt" [width] [height] [model] [options]
    echo Examples: 
    echo   comfyui-gen.bat "beautiful landscape" 768 512
    echo   comfyui-gen.bat "anime character" 512 768 "ponyDiffusionV6XL_v6StartWithThisOne.safetensors"
    echo   comfyui-gen.bat "desktop wallpaper cityscape" screen screen "" wallpaper
    echo   comfyui-gen.bat "nature scene" screen screen "" screen
    echo.    echo Special Options:
    echo   - Use "screen" for width/height to auto-detect screen resolution
    echo   - Add "wallpaper" as 5th parameter to set as desktop wallpaper
    echo   - Add "screen" as 5th parameter to use screen resolution
    echo   - Add "open" as 5th parameter to open image after generation
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
set OPTIONS=%~5

if "%WIDTH%"=="" set WIDTH=512
if "%HEIGHT%"=="" set HEIGHT=512

REM Handle special screen resolution option
set USE_SCREEN=
set SET_WALLPAPER=
set OPEN_IMAGE=

if /i "%WIDTH%"=="screen" (
    set USE_SCREEN=-UseScreenResolution
    set WIDTH=512
)
if /i "%HEIGHT%"=="screen" (
    set USE_SCREEN=-UseScreenResolution
    set HEIGHT=512
)
if /i "%OPTIONS%"=="screen" (
    set USE_SCREEN=-UseScreenResolution
)
if /i "%OPTIONS%"=="wallpaper" (
    set SET_WALLPAPER=-SetAsWallpaper
)
if /i "%OPTIONS%"=="open" (
    set OPEN_IMAGE=-OpenImage
)

echo Generating image with ComfyUI...
echo Prompt: %PROMPT%
if "%USE_SCREEN%"=="-UseScreenResolution" (
    echo Size: Screen Resolution (auto-detected)
) else (
    echo Size: %WIDTH%x%HEIGHT%
)
if not "%MODEL%"=="" echo Model: %MODEL%
if "%SET_WALLPAPER%"=="-SetAsWallpaper" echo Setting as wallpaper: Yes
echo.

if "%MODEL%"=="" (
    powershell -ExecutionPolicy Bypass -File "%~dp0comfyui-generate.ps1" -Prompt "%PROMPT%" -Width %WIDTH% -Height %HEIGHT% %USE_SCREEN% %SET_WALLPAPER% %OPEN_IMAGE%
) else (
    powershell -ExecutionPolicy Bypass -File "%~dp0comfyui-generate.ps1" -Prompt "%PROMPT%" -Width %WIDTH% -Height %HEIGHT% -Model "%MODEL%" %USE_SCREEN% %SET_WALLPAPER% %OPEN_IMAGE%
)
