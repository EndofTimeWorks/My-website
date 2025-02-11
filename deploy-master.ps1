# deploy.ps1
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Status {
    param(
        [string]$Message,
        [string]$Type = "Info"
    )
    
    $colors = @{
        Info    = "Cyan"
        Success = "Green"
        Warning = "Yellow"
        Error   = "Red"
    }
    
    $prefix = switch ($Type) {
        "Success" { "[+]" }
        "Error"   { "[-]" }
        "Warning" { "[!]" }
        "Info"    { "[*]" }
    }
    
    Write-Host "$prefix $Message" -ForegroundColor $colors[$Type]
}

function Test-Environment {
    $requiredVars = @{
        "CLOUDFLARE_API_TOKEN" = "For Cloudflare API access"
        "CLOUDFLARE_ACCOUNT_ID" = "For Cloudflare account identification"
    }
    
    $missingVars = @()
    foreach ($var in $requiredVars.GetEnumerator()) {
        if (-not (Get-Item env:$($var.Key) -ErrorAction SilentlyContinue)) {
            $message = "$($var.Key) is missing"
            if ($var.Value) {
                $message += ": $($var.Value)"
            }
            Write-Status $message "Warning"
            $missingVars += $var.Key
        }
    }
    
    if ($missingVars.Count -gt 0) {
        throw "Missing required environment variables: $($missingVars -join ', ')"
    }
}

function Clear-BuildArtifacts {
    $paths = @("dist", "node_modules/.cache")
    foreach ($path in $paths) {
        if (Test-Path $path) {
            Remove-Item -Recurse -Force $path
            Write-Status "Cleaned $path" "Success"
        }
    }
}

function Install-Dependencies {
    Write-Status "Installing dependencies..." "Info"
    npm ci --prefer-offline --no-audit
    if ($LASTEXITCODE -ne 0) {
        npm install
        if ($LASTEXITCODE -ne 0) { throw "Failed to install dependencies" }
    }
    Write-Status "Dependencies installed successfully" "Success"
}

function Start-Build {
    Write-Status "Building project..." "Info"
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Frontend build failed" }
    
    if (-not (Test-Path "dist")) { throw "Build failed - dist directory not created" }
    Write-Status "Build completed successfully" "Success"
}

function Deploy-Frontend {
    Write-Status "Deploying to Cloudflare Pages..." "Info"
    
    npx wrangler pages deploy dist/
    if ($LASTEXITCODE -ne 0) { throw "Pages deployment failed" }
    
    Write-Status "Pages deployed successfully" "Success"
}

function Start-Deployment {
    try {
        # Create log directory if it doesn't exist
        if (-not (Test-Path "logs")) { New-Item -ItemType Directory -Path "logs" }
        
        # Start logging
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $script:logFile = "logs/deploy_$timestamp.log"
        Start-Transcript -Path $script:logFile
        
        Test-Environment
        Clear-BuildArtifacts
        Install-Dependencies
        Start-Build
        Deploy-Frontend
        
        Write-Status "Deployment completed successfully!" "Success"
        Write-Status "Log file: $script:logFile" "Info"
    }
    catch {
        Write-Status "Deployment failed: $_" "Error"
        Write-Status "Check the log file for details: $script:logFile" "Info"
        exit 1
    }
    finally {
        Stop-Transcript
    }
}

# Start deployment
Start-Deployment