# PowerShell Script to Download Images from Any Markdown File
# This script automatically extracts and downloads all images referenced in a markdown document

param(
    [Parameter(Mandatory=$true, HelpMessage="Path to the markdown file")]
    [string]$MarkdownFile,
    
    [Parameter(Mandatory=$false, HelpMessage="Output directory for images (default: 'images' in same folder as markdown)")]
    [string]$OutputDirectory = "",
    
    [Parameter(Mandatory=$false, HelpMessage="Skip files that already exist")]
    [switch]$SkipExisting = $true,
    
    [Parameter(Mandatory=$false, HelpMessage="Maximum number of retry attempts")]
    [int]$MaxRetries = 3,
    
    [Parameter(Mandatory=$false, HelpMessage="Create relative paths for local usage")]
    [switch]$CreateRelativePaths = $false
)

# Set strict mode for better error handling
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Function to validate markdown file
function Test-MarkdownFile {
    param([string]$FilePath)
    
    if (-not (Test-Path $FilePath)) {
        throw "Markdown file not found: $FilePath"
    }
    
    $extension = [System.IO.Path]::GetExtension($FilePath).ToLower()
    if ($extension -ne ".md" -and $extension -ne ".markdown") {
        Write-Warning "File does not have a markdown extension (.md or .markdown): $FilePath"
    }
    
    return $true
}

# Function to extract image URLs from markdown content
function Get-ImageUrlsFromMarkdown {
    param([string]$MarkdownContent)
    
    $imageUrls = @()
      # Regex patterns for different markdown image formats
    $patterns = @(
        # Standard markdown images: ![alt](url)
        '!\[[^\]]*\]\(([^)]+)\)',
        
        # HTML img tags: <img src="url"
        '<img[^>]+src=["\x27\x22]([^\x27\x22]+)[\x27\x22][^>]*>',
        
        # HTML img with various attributes
        '<img[^>]*src\s*=\s*[\x27\x22]([^\x27\x22]+)[\x27\x22][^>]*>'
    )
    
    foreach ($pattern in $patterns) {
        $matches = [regex]::Matches($MarkdownContent, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        foreach ($match in $matches) {
            $url = $match.Groups[1].Value.Trim()
            
            # Only process HTTP/HTTPS URLs
            if ($url -match '^https?://') {
                $imageUrls += $url
            }
        }
    }
    
    # Remove duplicates and return
    return $imageUrls | Sort-Object | Get-Unique
}

# Function to generate safe filename from URL
function Get-SafeFilename {
    param(
        [string]$Url,
        [int]$Index
    )
    
    try {
        $uri = [System.Uri]$Url
        $filename = [System.IO.Path]::GetFileName($uri.LocalPath)
        
        # If no filename or extension, try to get from query parameters
        if (-not $filename -or -not $filename.Contains('.')) {
            # Look for common image extensions in the URL
            $imageExtensions = @('.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff')
            $foundExtension = $null
            
            foreach ($ext in $imageExtensions) {
                if ($Url -match $ext) {
                    $foundExtension = $ext
                    break
                }
            }
            
            if (-not $foundExtension) {
                $foundExtension = '.jpg'  # Default extension
            }
            
            $filename = "image_$($Index.ToString('D3'))$foundExtension"
        }
        
        # Clean filename - remove invalid characters
        $invalidChars = [System.IO.Path]::GetInvalidFileNameChars()
        foreach ($char in $invalidChars) {
            $filename = $filename.Replace($char, '_')
        }
        
        # Additional cleaning for URL-encoded characters
        $filename = $filename -replace '%[0-9A-Fa-f]{2}', '_'
        $filename = $filename -replace '[?&=]', '_'
        
        return $filename
    }
    catch {
        # Fallback filename
        $extension = if ($Url -match '\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)') { $matches[1] } else { 'jpg' }
        return "image_$($Index.ToString('D3')).$extension"
    }
}

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
            
            # Create a web client with proper headers
            $webClient = New-Object System.Net.WebClient
            $webClient.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
            
            # Download the file
            $webClient.DownloadFile($Url, $OutputPath)
            $webClient.Dispose()
            
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
                    Remove-Item $OutputPath -Force -ErrorAction SilentlyContinue
                }
            } else {
                Write-Error "  [FAILED] Failed to download after $MaxRetries attempts: $Description"
                return $false
            }
        }
    }
    
    return $success
}

# Function to create updated markdown with local image paths
function Update-MarkdownWithLocalPaths {
    param(
        [string]$MarkdownContent,
        [hashtable]$UrlToFileMapping,
        [string]$ImageDirectory,
        [string]$MarkdownDirectory
    )
    
    $updatedContent = $MarkdownContent
    
    foreach ($url in $UrlToFileMapping.Keys) {
        $filename = $UrlToFileMapping[$url]
        $relativePath = [System.IO.Path]::GetRelativePath($MarkdownDirectory, (Join-Path $ImageDirectory $filename))
        $relativePath = $relativePath -replace '\\', '/'  # Use forward slashes for web compatibility
        
        # Replace in markdown image syntax
        $updatedContent = $updatedContent -replace [regex]::Escape($url), $relativePath
    }
    
    return $updatedContent
}

# Main execution starts here
try {
    Write-Host "========================================" -ForegroundColor Magenta
    Write-Host "Universal Markdown Image Download Script" -ForegroundColor Magenta
    Write-Host "========================================" -ForegroundColor Magenta
    Write-Host ""
    
    # Validate input file
    Test-MarkdownFile -FilePath $MarkdownFile | Out-Null
    $markdownPath = Resolve-Path $MarkdownFile
    $markdownDirectory = Split-Path $markdownPath -Parent
    $markdownFileName = [System.IO.Path]::GetFileNameWithoutExtension($markdownPath)
    
    Write-Host "Processing markdown file: $markdownPath" -ForegroundColor Cyan
    
    # Determine output directory
    if ([string]::IsNullOrEmpty($OutputDirectory)) {
        $imageDirectory = Join-Path $markdownDirectory "images"
    } else {
        $imageDirectory = $OutputDirectory
    }
    
    # Create images directory if it doesn't exist
    if (-not (Test-Path $imageDirectory)) {
        New-Item -ItemType Directory -Path $imageDirectory -Force | Out-Null
        Write-Host "Created images directory: $imageDirectory" -ForegroundColor Green
    }
    
    # Read markdown content
    $markdownContent = Get-Content -Path $markdownPath -Raw -Encoding UTF8
    
    # Extract image URLs
    Write-Host "Extracting image URLs from markdown..." -ForegroundColor Yellow
    $imageUrls = Get-ImageUrlsFromMarkdown -MarkdownContent $markdownContent
    
    if ($imageUrls.Count -eq 0) {
        Write-Host "No remote image URLs found in the markdown file." -ForegroundColor Yellow
        Write-Host "Script completed with nothing to download." -ForegroundColor Green
        exit 0
    }
    
    Write-Host "Found $($imageUrls.Count) unique image URLs:" -ForegroundColor Green
    $imageUrls | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
    Write-Host ""
    
    # Download images
    $successCount = 0
    $totalCount = $imageUrls.Count
    $urlToFileMapping = @{}
    
    for ($i = 0; $i -lt $imageUrls.Count; $i++) {
        $url = $imageUrls[$i]
        $filename = Get-SafeFilename -Url $url -Index ($i + 1)
        $outputPath = Join-Path $imageDirectory $filename
        
        # Store mapping for later use
        $urlToFileMapping[$url] = $filename
        
        # Check if file already exists
        if ((Test-Path $outputPath) -and $SkipExisting) {
            $existingFile = Get-Item $outputPath
            Write-Host "File already exists: $filename ($($existingFile.Length) bytes)" -ForegroundColor Yellow
            Write-Host "  Skipping download. Use -SkipExisting:`$false to force re-download." -ForegroundColor Gray
            $successCount++
            Write-Host ""
            continue
        }
        
        $success = Download-Image -Url $url -OutputPath $outputPath -Description "Image $($i + 1): $filename" -MaxRetries $MaxRetries
        
        if ($success) {
            $successCount++
        }
        
        Write-Host ""
    }
    
    # Create updated markdown file with local paths if requested
    if ($CreateRelativePaths -and $successCount -gt 0) {
        Write-Host "Creating updated markdown with local image paths..." -ForegroundColor Yellow
        $updatedContent = Update-MarkdownWithLocalPaths -MarkdownContent $markdownContent -UrlToFileMapping $urlToFileMapping -ImageDirectory $imageDirectory -MarkdownDirectory $markdownDirectory
        
        $updatedMarkdownPath = Join-Path $markdownDirectory "$markdownFileName`_local.md"
        $updatedContent | Out-File -FilePath $updatedMarkdownPath -Encoding UTF8
        Write-Host "Updated markdown saved to: $updatedMarkdownPath" -ForegroundColor Green
    }
    
    # Summary
    Write-Host "========================================" -ForegroundColor Magenta
    Write-Host "Download Summary" -ForegroundColor Magenta
    Write-Host "========================================" -ForegroundColor Magenta
    Write-Host "Successfully downloaded: $successCount / $totalCount images" -ForegroundColor $(if ($successCount -eq $totalCount) { "Green" } else { "Yellow" })
    
    if ($successCount -gt 0) {
        Write-Host ""
        Write-Host "Images saved to: $imageDirectory" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Downloaded files:" -ForegroundColor White
        
        foreach ($url in $urlToFileMapping.Keys) {
            $filename = $urlToFileMapping[$url]
            $filePath = Join-Path $imageDirectory $filename
            if (Test-Path $filePath) {
                $fileInfo = Get-Item $filePath
                Write-Host "  - $filename ($($fileInfo.Length) bytes)" -ForegroundColor Gray
            }
        }
        
        if ($CreateRelativePaths) {
            Write-Host ""
            Write-Host "Updated markdown file with local paths created: $markdownFileName`_local.md" -ForegroundColor Cyan
        }
    }
    
    if ($successCount -lt $totalCount) {
        Write-Warning "Some downloads failed. Check the error messages above."
        exit 1
    } else {
        Write-Host ""
        Write-Host "[SUCCESS] All images downloaded successfully!" -ForegroundColor Green
        exit 0
    }
}
catch {
    Write-Error "Script failed: $($_.Exception.Message)"
    exit 1
}
