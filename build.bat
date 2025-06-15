@echo off
REM WebHatchery Build & Deploy - Batch Wrapper
REM Usage: build.bat [project] [options]

setlocal enabledelayedexpansion

REM Default parameters
set PROJECT_FILTER=*
set PRODUCTION=0
set DRY_RUN=0
set VERBOSE=0
set FORCE=0

REM Parse command line arguments
:parse_args
if "%~1"=="" goto end_parse
if /i "%~1"=="--production" set PRODUCTION=1
if /i "%~1"=="-p" set PRODUCTION=1
if /i "%~1"=="--dry-run" set DRY_RUN=1
if /i "%~1"=="-d" set DRY_RUN=1
if /i "%~1"=="--verbose" set VERBOSE=1
if /i "%~1"=="-v" set VERBOSE=1
if /i "%~1"=="--force" set FORCE=1
if /i "%~1"=="-f" set FORCE=1
if /i "%~1"=="--help" goto show_help
if /i "%~1"=="-h" goto show_help
if not "%~1"=="--production" if not "%~1"=="-p" if not "%~1"=="--dry-run" if not "%~1"=="-d" if not "%~1"=="--verbose" if not "%~1"=="-v" if not "%~1"=="--force" if not "%~1"=="-f" (
    set PROJECT_FILTER=%~1
)
shift
goto parse_args

:end_parse

REM Build PowerShell command
set PS_CMD=powershell.exe -ExecutionPolicy Bypass -File "%~dp0build-deploy.ps1"
set PS_CMD=%PS_CMD% -ProjectFilter "%PROJECT_FILTER%"

if %PRODUCTION%==1 set PS_CMD=%PS_CMD% -Production
if %DRY_RUN%==1 set PS_CMD=%PS_CMD% -DryRun
if %VERBOSE%==1 set PS_CMD=%PS_CMD% -Verbose
if %FORCE%==1 set PS_CMD=%PS_CMD% -Force

echo WebHatchery Build ^& Deploy System
echo =================================
echo Project Filter: %PROJECT_FILTER%
echo Production Mode: %PRODUCTION%
echo Dry Run: %DRY_RUN%
echo Verbose: %VERBOSE%
echo Force: %FORCE%
echo.

REM Execute PowerShell script
%PS_CMD%

REM Check exit code
if %ERRORLEVEL% neq 0 (
    echo.
    echo Build/Deploy failed with exit code %ERRORLEVEL%
    echo Check build-deploy.log for details
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Build/Deploy completed successfully!
if %DRY_RUN%==0 (
    echo Files deployed to F:\WebHatchery
)
pause
goto :eof

:show_help
echo WebHatchery Build ^& Deploy System
echo =================================
echo.
echo Usage: build.bat [project] [options]
echo.
echo Arguments:
echo   project              Project name filter (default: all projects)
echo.
echo Options:
echo   -p, --production     Enable production mode optimizations
echo   -d, --dry-run        Show what would happen without making changes
echo   -v, --verbose        Enable detailed output
echo   -f, --force          Force overwrite existing files
echo   -h, --help           Show this help message
echo.
echo Examples:
echo   build.bat                          Deploy all projects
echo   build.bat isitdoneyet             Deploy specific project
echo   build.bat -p                      Deploy all projects in production mode
echo   build.bat isitdoneyet -p -v       Deploy specific project with production and verbose
echo   build.bat -d -v                   Dry run with verbose output
echo.
pause
goto :eof
