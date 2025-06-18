@echo off
REM Random Wallpaper Generator - Batch Wrapper
REM Usage: random-wallpaper.bat [category] [count]

setlocal EnableDelayedExpansion

if "%~1"=="help" goto :help
if "%~1"=="-h" goto :help
if "%~1"=="--help" goto :help
if "%~1"=="preview" goto :preview
if "%~1"=="quick" goto :quick

set CATEGORY=%~1
set COUNT=%~2

if "%CATEGORY%"=="" set CATEGORY=all
if "%COUNT%"=="" set COUNT=1

echo Random Wallpaper Generator
echo =========================
echo Category: %CATEGORY%
echo Count: %COUNT%
echo.

REM Validate category
if /i "%CATEGORY%"=="landscape" goto :valid
if /i "%CATEGORY%"=="animal" goto :valid
if /i "%CATEGORY%"=="fantasy" goto :valid
if /i "%CATEGORY%"=="space" goto :valid
if /i "%CATEGORY%"=="nature" goto :valid
if /i "%CATEGORY%"=="abstract" goto :valid
if /i "%CATEGORY%"=="cityscape" goto :valid
if /i "%CATEGORY%"=="seasonal" goto :valid
if /i "%CATEGORY%"=="all" goto :valid

echo Invalid category: %CATEGORY%
echo.
goto :help

:valid
powershell -ExecutionPolicy Bypass -File "%~dp0random-wallpaper.ps1" -Category "%CATEGORY%" -Count %COUNT%
goto :end

:preview
set PREVIEW_CATEGORY=%~2
if "%PREVIEW_CATEGORY%"=="" set PREVIEW_CATEGORY=all
echo Preview Mode - Category: %PREVIEW_CATEGORY%
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0random-wallpaper.ps1" -Category "%PREVIEW_CATEGORY%" -Count 3 -PreviewOnly
goto :end

:quick
echo Quick Random Wallpaper Generation
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0random-wallpaper.ps1" -Category "all" -Count 1
goto :end

:help
echo Usage: random-wallpaper.bat [category] [count]
echo.
echo Categories:
echo   landscape - Mountains, lakes, forests, coastlines
echo   animal    - Wildlife photography, pets, safari animals
echo   fantasy   - Dragons, magic, mythical creatures
echo   space     - Nebulas, planets, galaxies, sci-fi
echo   nature    - Flowers, waterfalls, natural phenomena
echo   abstract  - Geometric patterns, fluid art, artistic
echo   cityscape - Urban photography, skylines, architecture
echo   seasonal  - Winter, spring, summer, autumn themes
echo   all       - Random from all categories (default)
echo.
echo Examples:
echo   random-wallpaper.bat landscape
echo   random-wallpaper.bat animal 3
echo   random-wallpaper.bat space 1
echo   random-wallpaper.bat
echo.
echo Special Commands:
echo   random-wallpaper.bat preview landscape   - Preview prompts only
echo   random-wallpaper.bat quick               - Quick single random wallpaper

:end
