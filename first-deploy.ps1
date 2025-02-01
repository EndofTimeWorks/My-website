# first-time-setup.ps1
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
        Input   = "Magenta"
    }
    
    $prefix = switch ($Type) {
        "Success" { "[+]" }
        "Error"   { "[-]" }
        "Warning" { "[!]" }
        "Info"    { "[*]" }
        "Input"   { "[?]" }
    }
    
    Write-Host "$prefix $Message" -ForegroundColor $colors[$Type]
}

function Get-UserInput {
    param(
        [string]$Prompt,
        [switch]$IsPassword
    )
    
    Write-Status $Prompt "Input"
    if ($IsPassword) {
        $secureString = Read-Host -AsSecureString
        $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureString)
        $string = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
        return $string
    } else {
        return Read-Host
    }
}

function Open-BrowserIfConfirmed {
    param([string]$Url, [string]$Message)
    
    Write-Status $Message "Info"
    $response = Get-UserInput "Would you like to open the browser now? (y/n)"
    if ($response -eq 'y') {
        Start-Process $Url
        Write-Status "Browser opened. Press Enter once you've completed this step." "Input"
        Read-Host | Out-Null
    }
}

function Install-RequiredTools {
    Write-Status "Checking required tools..." "Info"
    
    # Check Node.js
    if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
        Write-Status "Node.js is not installed. Please install it from: https://nodejs.org/" "Error"
        Open-BrowserIfConfirmed "https://nodejs.org/" "Opening Node.js download page..."
        throw "Node.js is required to continue"
    }
    
    # Check Git
    if (-not (Get-Command "git" -ErrorAction SilentlyContinue)) {
        Write-Status "Git is not installed. Please install it from: https://git-scm.com/" "Error"
        Open-BrowserIfConfirmed "https://git-scm.com/downloads" "Opening Git download page..."
        throw "Git is required to continue"
    }
    
    # Install wrangler globally
    Write-Status "Installing Wrangler CLI..." "Info"
    npm install -g wrangler
    if ($LASTEXITCODE -ne 0) { throw "Failed to install Wrangler" }
}

function Setup-CloudflareAccount {
    Write-Status "Setting up Cloudflare account..." "Info"
    Write-Status "If you don't have a Cloudflare account, you'll need to create one." "Info"
    Open-BrowserIfConfirmed "https://dash.cloudflare.com/sign-up" "Opening Cloudflare signup page..."
    
    # Login to Cloudflare using Wrangler
    Write-Status "Logging in to Cloudflare..." "Info"
    npx wrangler login
    if ($LASTEXITCODE -ne 0) { throw "Failed to login to Cloudflare" }
    
    # Get Account ID
    Write-Status "Please get your Cloudflare Account ID from the Cloudflare Dashboard." "Info"
    Write-Status "You can find it at https://dash.cloudflare.com/ in the right sidebar." "Info"
    Open-BrowserIfConfirmed "https://dash.cloudflare.com/" "Opening Cloudflare Dashboard..."
    
    $accountId = Get-UserInput "Enter your Cloudflare Account ID"
    $apiToken = Get-UserInput "Enter your Cloudflare API Token (from https://dash.cloudflare.com/profile/api-tokens)" -IsPassword
    
    # Create .env.local file
    Write-Status "Creating .env.local file..." "Info"
    $envContent = @"
CLOUDFLARE_API_TOKEN=$apiToken
CLOUDFLARE_ACCOUNT_ID=$accountId
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REDIRECT_URI=
"@
    Set-Content -Path ".env.local" -Value $envContent
    Write-Status "Created .env.local file with Cloudflare credentials" "Success"
}

function Setup-SpotifyApp {
    Write-Status "Setting up Spotify Developer App..." "Info"
    Open-BrowserIfConfirmed "https://developer.spotify.com/dashboard" "Opening Spotify Developer Dashboard..."
    
    Write-Status "Create a new app in the Spotify Developer Dashboard" "Info"
    Write-Status "Once created, get the Client ID and Client Secret" "Info"
    
    $clientId = Get-UserInput "Enter your Spotify Client ID"
    $clientSecret = Get-UserInput "Enter your Spotify Client Secret" -IsPassword
    $redirectUri = "https://personal-site.pages.dev/callback"
    
    # Update .env.local file
    $envContent = Get-Content ".env.local" -Raw
    $envContent = $envContent.Replace("SPOTIFY_CLIENT_ID=", "SPOTIFY_CLIENT_ID=$clientId")
    $envContent = $envContent.Replace("SPOTIFY_CLIENT_SECRET=", "SPOTIFY_CLIENT_SECRET=$clientSecret")
    $envContent = $envContent.Replace("SPOTIFY_REDIRECT_URI=", "SPOTIFY_REDIRECT_URI=$redirectUri")
    Set-Content -Path ".env.local" -Value $envContent
    
    Write-Status "Updated .env.local file with Spotify credentials" "Success"
}

function Setup-Project {
    Write-Status "Setting up project..." "Info"
    
    # Install dependencies
    Write-Status "Installing project dependencies..." "Info"
    npm install
    if ($LASTEXITCODE -ne 0) { throw "Failed to install dependencies" }
    
    # Initialize git if not already initialized
    if (-not (Test-Path ".git")) {
        Write-Status "Initializing git repository..." "Info"
        git init
        git add .
        git commit -m "Initial commit"
    }
    
    # Create initial wrangler.toml if it doesn't exist
    if (-not (Test-Path "wrangler.toml")) {
        Write-Status "Creating wrangler.toml..." "Info"
        $wranglerContent = @"
name = "personal-site"
main = "src/worker/index.ts"
compatibility_date = "2024-02-01"

[build]
command = "npm run build:worker"

[env.production]
name = "personal-site"
vars = { ENVIRONMENT = "production" }

[env.development]
name = "personal-site-dev"
vars = { ENVIRONMENT = "development" }

[dev]
port = 8787
"@
        Set-Content -Path "wrangler.toml" -Value $wranglerContent
    }
}

function Start-FirstTimeSetup {
    try {
        Write-Status "Starting first-time setup..." "Info"
        
        # Create log directory if it doesn't exist
        if (-not (Test-Path "logs")) { 
            New-Item -ItemType Directory -Path "logs" | Out-Null
        }
        
        # Start logging
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $logFile = "logs/setup_$timestamp.log"
        Start-Transcript -Path $logFile
        
        # Run setup steps
        Install-RequiredTools
        Setup-CloudflareAccount
        Setup-SpotifyApp
        Setup-Project
        
        Write-Status "First-time setup completed successfully!" "Success"
        Write-Status "You can now run './deploy-master.ps1' to deploy your site" "Info"
        Write-Status "Log file: $logFile" "Info"
    }
    catch {
        Write-Status "Setup failed: $_" "Error"
        Write-Status "Check the log file for details: $logFile" "Info"
        exit 1
    }
    finally {
        Stop-Transcript
    }
}

# Start setup
Start-FirstTimeSetup