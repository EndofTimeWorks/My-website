# deploy.ps1
#Requires -Version 5.1
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

function Deploy-Project {
    try {
        # Start logging
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        if (-not (Test-Path "logs")) { New-Item -ItemType Directory -Path "logs" }
        $logFile = "logs/deploy_$timestamp.log"
        Start-Transcript -Path $logFile

        # Check environment variables
        Write-Status "Checking environment variables..." "Info"
        $requiredVars = @(
            "SPOTIFY_CLIENT_ID",
            "SPOTIFY_CLIENT_SECRET",
            "SPOTIFY_REDIRECT_URI"
        )

        $missingVars = @()
        foreach ($var in $requiredVars) {
            if (-not (Get-Item env:$var -ErrorAction SilentlyContinue)) {
                $missingVars += $var
            }
        }

        if ($missingVars.Count -gt 0) {
            Write-Status "Missing environment variables: $($missingVars -join ', ')" "Error"
            throw "Missing required environment variables"
        }

        # Clean and build
        Write-Status "Cleaning previous builds..." "Info"
        if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }

        Write-Status "Installing dependencies..." "Info"
        npm install

        Write-Status "Building project..." "Info"
        npm run build

        if (-not (Test-Path "dist")) {
            throw "Build failed - dist directory not created"
        }

        # Deploy Worker
        Write-Status "Deploying Cloudflare Worker..." "Info"
        $workerDeploy = npx wrangler deploy spotify-worker.ts 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Status "Worker deployment failed: $workerDeploy" "Error"
            throw "Worker deployment failed"
        }
        Write-Status "Worker deployed successfully" "Success"

        # Deploy Pages
        Write-Status "Deploying to Cloudflare Pages..." "Info"
        $pagesDeploy = npx wrangler pages deploy dist/ 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Status "Pages deployment failed: $pagesDeploy" "Error"
            throw "Pages deployment failed"
        }
        Write-Status "Pages deployed successfully" "Success"

        Write-Status "Deployment completed successfully!" "Success"
        Write-Status "Log file: $logFile" "Info"
    }
    catch {
        Write-Status "Deployment failed: $_" "Error"
        Write-Status "Check the log file for details: $logFile" "Info"
        exit 1
    }
    finally {
        Stop-Transcript
    }
}

# Execute deployment
Deploy-Project