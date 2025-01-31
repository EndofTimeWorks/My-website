# deploy-master.ps1
#Requires -Version 5.1
Set-StrictMode -Version Latest

# Configure warning and error preferences
$WarningPreference = 'Continue'
$ErrorActionPreference = 'Continue'

# Configure output encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8

# Script Configuration
$CONFIG = @{
    ProjectName     = "personal-site"
    RequiredFiles   = @{
        Root   = @(
            "package.json",
            "wrangler.toml",
            "spotify-worker.js",
            ".env",
            ".dev.vars",
            ".prod.vars"
        )
        Src    = @(
            "App.js",
            "App.css",
            "index.js",
            "App.test.js",
            "reportWebVitals.js",
            "setupTests.js"
        )
        Public = @(
            "index.html",
            "manifest.json",
            "robots.txt"
        )
    }
    RequiredDirs    = @(
        "src",
        "public",
        "build",
        "logs"
    )
    RequiredEnvVars = @{
        ".env"       = @(
            "REACT_APP_SPOTIFY_CLIENT_ID",
            "REACT_APP_SPOTIFY_CLIENT_SECRET",
            "REACT_APP_SPOTIFY_REDIRECT_URI",
            "REACT_APP_WORKER_URL"
        )
        ".prod.vars" = @(
            "SPOTIFY_CLIENT_ID",
            "SPOTIFY_CLIENT_SECRET",
            "SPOTIFY_REDIRECT_URI"
        )
    }
}

# Helper Functions
function Write-Header {
    param([string]$Title)
    $border = "=" * 80
    Write-Host "`n$border" -ForegroundColor Magenta
    Write-Host $Title -ForegroundColor Magenta
    Write-Host "$border" -ForegroundColor Magenta
}

function Write-Status {
    param(
        [string]$Message,
        [string]$Type = "Info",
        [switch]$NoNewline
    )
    
    $colors = @{
        Info    = "Cyan"
        Success = "Green"
        Warning = "Yellow"
        Error   = "Red"
    }
    
    $prefix = switch ($Type) {
        "Success" { "[+]" }
        "Error" { "[-]" }
        "Warning" { "[!]" }
        "Info" { "[*]" }
    }
    
    if ($NoNewline) {
        Write-Host "$prefix $Message" -ForegroundColor $colors[$Type] -NoNewline
    }
    else {
        Write-Host "$prefix $Message" -ForegroundColor $colors[$Type]
    }
}

function Test-NodeEnvironment {
    Write-Header "Checking Node.js Environment"
    $errors = @()
    
    try {
        $nodeVersion = node --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Node.js version: $nodeVersion" "Success"
        }
        else {
            $errors += "Node.js not found"
        }

        $npmVersion = npm --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Status "npm version: $npmVersion" "Success"
        }
        else {
            $errors += "npm not found"
        }
    }
    catch {
        Write-Status "Error checking Node.js environment: $_" "Warning"
    }
    
    return $errors
}

function Test-Dependencies {
    Write-Header "Checking Dependencies"
    $errors = @()
    
    try {
        # Clean existing installations
        if (Test-Path "node_modules") {
            Write-Status "Removing existing node_modules..." "Info"
            Remove-Item "node_modules" -Recurse -Force -ErrorAction Continue
        }
        
        if (Test-Path "package-lock.json") {
            Write-Status "Removing package-lock.json..." "Info"
            Remove-Item "package-lock.json" -Force -ErrorAction Continue
        }

        # Fresh install with warning handling
        Write-Status "Installing dependencies..." "Info"
        
        $npmOutput = npm install --legacy-peer-deps --no-audit 2>&1
        $npmExitCode = $LASTEXITCODE
        
        # Process npm output
        $npmOutput | ForEach-Object {
            if ($_ -match "ERR!") {
                Write-Status $_ "Error"
                $errors += $_
            }
            elseif ($_ -match "WARN") {
                Write-Status $_ "Warning"
            }
            else {
                Write-Status $_ "Info"
            }
        }
        
        if ($npmExitCode -ne 0) {
            $errors += "npm install failed with exit code: $npmExitCode"
        }
        else {
            Write-Status "Dependencies installed successfully" "Success"
        }
    }
    catch {
        Write-Status "Caught exception during dependency installation: $_" "Warning"
    }
    
    return $errors
}

function Test-CloudflareSetup {
    Write-Header "Checking Cloudflare Setup"
    $errors = @()
    
    try {
        $wranglerVersion = npx wrangler --version 2>&1
        Write-Status "Wrangler version: $wranglerVersion" "Success"
        
        $whoami = npx wrangler whoami 2>&1
        if ($whoami -match "You are logged in") {
            Write-Status "Authenticated with Cloudflare" "Success"
        }
        else {
            Write-Status "Not authenticated with Cloudflare. Please log in..." "Warning"
            npx wrangler login
            if ($LASTEXITCODE -ne 0) {
                $errors += "Failed to authenticate with Cloudflare"
            }
        }
    }
    catch {
        Write-Status "Error checking Cloudflare setup: $_" "Warning"
    }
    
    return $errors
}

function Test-ProjectFiles {
    Write-Header "Checking Project Files"
    $errors = @()
    
    foreach ($category in $CONFIG.RequiredFiles.Keys) {
        foreach ($file in $CONFIG.RequiredFiles[$category]) {
            $path = switch ($category) {
                "Root" { $file }
                "Src" { "src/$file" }
                "Public" { "public/$file" }
            }
            
            if (-not (Test-Path $path)) {
                $errors += "Missing required file: $path"
            }
            else {
                Write-Status "Found $path" "Success"
            }
        }
    }
    
    foreach ($dir in $CONFIG.RequiredDirs) {
        if (-not (Test-Path $dir)) {
            Write-Status "Creating directory: $dir" "Info"
            New-Item -Path $dir -ItemType Directory -Force | Out-Null
        }
        Write-Status "Directory exists: $dir" "Success"
    }
    
    return $errors
}

function Test-EnvVars {
    Write-Header "Checking Environment Variables"
    $errors = @()
    
    foreach ($file in $CONFIG.RequiredEnvVars.Keys) {
        if (Test-Path $file) {
            $content = Get-Content $file -Raw
            foreach ($var in $CONFIG.RequiredEnvVars[$file]) {
                if (-not ($content -match $var)) {
                    $errors += "Missing $var in $file"
                }
            }
        }
        else {
            $errors += "Missing file: $file"
        }
    }
    
    return $errors
}

function Build-Project {
    Write-Header "Building Project"
    $errors = @()
    
    try {
        if (Test-Path "build") {
            Remove-Item "build" -Recurse -Force -ErrorAction Continue
            Write-Status "Cleaned previous build" "Success"
        }
        
        Write-Status "Building project..." "Info"
        $buildOutput = npm run build 2>&1

        # Process build output
        $buildOutput | ForEach-Object {
            if ($_ -match "ERR!") {
                Write-Status $_ "Error"
                $errors += $_
            }
            elseif ($_ -match "WARN") {
                Write-Status $_ "Warning"
            }
            else {
                Write-Status $_ "Info"
            }
        }

        if ($LASTEXITCODE -ne 0) {
            $errors += "Build failed with exit code: $LASTEXITCODE"
        }
        else {
            Write-Status "Build completed successfully" "Success"
        }
    }
    catch {
        Write-Status "Error during build: $_" "Warning"
    }
    
    return $errors
}

function Deploy-Project {
    Write-Header "Deploying Project"
    $errors = @()
    
    try {
        # Deploy worker
        Write-Status "Deploying Cloudflare Worker..." "Info"
        $workerOutput = npx wrangler deploy spotify-worker.js --minify 2>&1
        
        $workerOutput | ForEach-Object {
            if ($_ -match "ERR!") {
                Write-Status $_ "Error"
                $errors += $_
            }
            elseif ($_ -match "WARN") {
                Write-Status $_ "Warning"
            }
            else {
                Write-Status $_ "Info"
            }
        }

        if ($LASTEXITCODE -ne 0) {
            $errors += "Worker deployment failed with exit code: $LASTEXITCODE"
        }
        else {
            Write-Status "Worker deployed successfully" "Success"
        }

        # Deploy pages
        Write-Status "Deploying to Cloudflare Pages..." "Info"
        $pagesOutput = npx wrangler pages deploy build/ 2>&1
        
        $pagesOutput | ForEach-Object {
            if ($_ -match "ERR!") {
                Write-Status $_ "Error"
                $errors += $_
            }
            elseif ($_ -match "WARN") {
                Write-Status $_ "Warning"
            }
            else {
                Write-Status $_ "Info"
            }
        }

        if ($LASTEXITCODE -ne 0) {
            $errors += "Pages deployment failed with exit code: $LASTEXITCODE"
        }
        else {
            Write-Status "Pages deployed successfully" "Success"
        }
    }
    catch {
        Write-Status "Error during deployment: $_" "Warning"
    }
    
    return $errors
}

# Main execution
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "logs/deploy_$timestamp.log"

if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" | Out-Null
}

Start-Transcript -Path $logFile

try {
    Write-Header "Starting Deployment Process"
    $allErrors = @()
    $continueDeployment = $true
    
    $allErrors += Test-NodeEnvironment
    $allErrors += Test-Dependencies
    $allErrors += Test-CloudflareSetup
    $allErrors += Test-ProjectFiles
    $allErrors += Test-EnvVars
    
    if ($allErrors.Count -gt 0) {
        Write-Header "Validation Warnings/Errors"
        foreach ($error in $allErrors) {
            Write-Status $error "Warning"
        }
        Write-Status "Found $($allErrors.Count) issues during validation" "Warning"
        $userResponse = Read-Host "Do you want to continue with deployment? (y/n)"
        $continueDeployment = $userResponse -eq 'y'
    }
    
    if ($continueDeployment) {
        $buildErrors = Build-Project
        if ($buildErrors) {
            Write-Status "Build completed with warnings:" "Warning"
            foreach ($error in $buildErrors) {
                Write-Status $error "Warning"
            }
            $userResponse = Read-Host "Do you want to continue with deployment? (y/n)"
            $continueDeployment = $userResponse -eq 'y'
        }
        
        if ($continueDeployment) {
            $deployErrors = Deploy-Project
            if ($deployErrors) {
                Write-Status "Deployment completed with warnings:" "Warning"
                foreach ($error in $deployErrors) {
                    Write-Status $error "Warning"
                }
            }
            else {
                Write-Header "Deployment Successful"
                Write-Status "All components deployed successfully!" "Success"
            }
        }
    }
    
    Write-Status "Log file: $logFile" "Info"
}
catch {
    Write-Header "Deployment Error"
    Write-Status $_.Exception.Message "Error"
    Write-Status "Check the log file for details: $logFile" "Info"
    
    Write-Header "Troubleshooting Steps"
    Write-Status "1. Check the log file: $logFile" "Info"
    Write-Status "2. Verify Node.js and npm installations" "Info"
    Write-Status "3. Check Cloudflare authentication: npx wrangler login" "Info"
    Write-Status "4. Verify all required files exist" "Info"
    Write-Status "5. Check build output" "Info"
    
    exit 1
}
finally {
    Stop-Transcript
}