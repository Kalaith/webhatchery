# PowerShell Script to Download Images for "The Octopus and the Pup" Story
# This script downloads all images referenced in the markdown document to local files

# Set strict mode for better error handling
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Define the base directory (current script location)
$ScriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$ImageDirectory = Join-Path $ScriptDirectory "images"

# Create images directory if it doesn't exist
if (-not (Test-Path $ImageDirectory)) {
    New-Item -ItemType Directory -Path $ImageDirectory -Force
    Write-Host "Created images directory: $ImageDirectory" -ForegroundColor Green
}

# Define image URLs and their corresponding local filenames
$ImageDownloads = @(
    @{
        Url = "https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png"
        Filename = "perplexity-logo.png"
        Description = "Perplexity AI logo"
    },
    @{
        Url = "https://pplx-res.cloudinary.com/image/upload/v1749201516/pplx_project_search_images/bcb8289fc9610ffeeeda0007c4075d4316c77b1b.jpg"
        Filename = "chase-paw-patrol.jpg"
        Description = "Chase, the German Shepherd police pup from PAW Patrol, in his blue uniform"
    },
    @{
        Url = "https://pplx-res.cloudinary.com/image/upload/v1749820587/pplx_project_search_images/b3c37dc4ba7c940b31f4e09703a9cf889eadd09d.jpg"
        Filename = "doctor-octopus-figurine.jpg"
        Description = "A detailed figurine of Doctor Octopus with mechanical tentacles"
    },
    @{
        Url = "https://pplx-res.cloudinary.com/image/upload/v1749820587/pplx_project_search_images/32a36632cc4c79f726b548c006be21c53daf8346.jpg"
        Filename = "spiderman-vs-doctor-octopus.jpg"
        Description = "Spider-Man battles Doctor Octopus in a comic book scene"
    }
)

# Function to download an image with retry logic
function Download-Image {
    param(
        [string]$Url,
        [string]$OutputPath,
        [string]$Description,
        [int]$MaxRetries = 3
    )
    
    $retryCount = 0
    $success = $false
    
    while (-not $success -and $retryCount -lt $MaxRetries) {
        try {
            Write-Host "Downloading: $Description" -ForegroundColor Cyan
            Write-Host "  URL: $Url" -ForegroundColor Gray
            Write-Host "  Output: $OutputPath" -ForegroundColor Gray
            
            # Use Invoke-WebRequest to download the image
            $response = Invoke-WebRequest -Uri $Url -OutFile $OutputPath -PassThru
            
            # Verify the file was created and has content
            if (Test-Path $OutputPath) {
                $fileInfo = Get-Item $OutputPath
                if ($fileInfo.Length -gt 0) {
                    Write-Host "  [SUCCESS] Successfully downloaded ($($fileInfo.Length) bytes)" -ForegroundColor Green
                    $success = $true
                } else {
                    throw "Downloaded file is empty"
                }
            } else {
                throw "File was not created"
            }
        }
        catch {
            $retryCount++
            Write-Warning "  [FAILED] Attempt $retryCount failed: $($_.Exception.Message)"
            
            if ($retryCount -lt $MaxRetries) {
                Write-Host "  Retrying in 2 seconds..." -ForegroundColor Yellow
                Start-Sleep -Seconds 2
                
                # Remove empty file if it exists
                if (Test-Path $OutputPath) {
                    Remove-Item $OutputPath -Force
                }
            } else {
                Write-Error "  [FAILED] Failed to download after $MaxRetries attempts: $Description"
                return $false
            }
        }
    }
    
    return $success
}

# Main execution
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "Image Download Script for 'The Octopus and the Pup'" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

$successCount = 0
$totalCount = $ImageDownloads.Count

foreach ($download in $ImageDownloads) {
    $outputPath = Join-Path $ImageDirectory $download.Filename
    
    # Check if file already exists
    if (Test-Path $outputPath) {
        $existingFile = Get-Item $outputPath
        Write-Host "File already exists: $($download.Filename) ($($existingFile.Length) bytes)" -ForegroundColor Yellow
        Write-Host "  Skipping download. Delete the file to force re-download." -ForegroundColor Gray
        $successCount++
        Write-Host ""
        continue
    }
    
    $success = Download-Image -Url $download.Url -OutputPath $outputPath -Description $download.Description
    
    if ($success) {
        $successCount++
    }
    
    Write-Host ""
}

# Summary
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "Download Summary" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "Successfully downloaded: $successCount / $totalCount images" -ForegroundColor $(if ($successCount -eq $totalCount) { "Green" } else { "Yellow" })

if ($successCount -eq $totalCount) {
    Write-Host "[SUCCESS] All images downloaded successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Images saved to: $ImageDirectory" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Downloaded files:" -ForegroundColor White
    foreach ($download in $ImageDownloads) {
        $filePath = Join-Path $ImageDirectory $download.Filename
        if (Test-Path $filePath) {
            $fileInfo = Get-Item $filePath
            Write-Host "  - $($download.Filename) ($($fileInfo.Length) bytes)" -ForegroundColor Gray
        }
    }
} else {
    Write-Warning "Some downloads failed. Check the error messages above."
}

Write-Host ""
Write-Host "You can now use these local images in your HTML files by updating the src attributes to:" -ForegroundColor Cyan
Write-Host "  images/perplexity-logo.png" -ForegroundColor Gray
Write-Host "  images/chase-paw-patrol.jpg" -ForegroundColor Gray
Write-Host "  images/doctor-octopus-figurine.jpg" -ForegroundColor Gray
Write-Host "  images/spiderman-vs-doctor-octopus.jpg" -ForegroundColor Gray
