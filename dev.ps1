# dev.ps1
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

function Start-Development {
    try {
        # Create logs directory if it doesn't exist
        if (-not (Test-Path "logs")) {
            New-Item -ItemType Directory -Path "logs"
        }

        # Start log file
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $logFile = "logs/dev_$timestamp.log"
        Start-Transcript -Path $logFile

        # Check for running processes on ports 3000 and 8787
        $port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
        $port8787 = Get-NetTCPConnection -LocalPort 8787 -ErrorAction SilentlyContinue

        if ($port3000) {
            Write-Status "Killing process using port 3000..." "Warning"
            Stop-Process -Id (Get-Process -Id $port3000.OwningProcess).Id -Force
        }

        if ($port8787) {
            Write-Status "Killing process using port 8787..." "Warning"
            Stop-Process -Id (Get-Process -Id $port8787.OwningProcess).Id -Force
        }

        # Start Vite and Wrangler in separate windows
        Write-Status "Starting development servers..." "Info"

        # Start Vite
        $viteWindow = Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -PassThru

        
        Write-Status "Development servers started successfully!" "Success"
        Write-Status "Vite running on: http://localhost:3000" "Info"
        Write-Status "Log file: $logFile" "Info"

        # Wait for user input to stop servers
        Write-Host "`nPress any key to stop the development servers..." -ForegroundColor Yellow
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

        # Stop the servers
        if ($viteWindow) { Stop-Process -Id $viteWindow.Id -Force }

        Write-Status "Development servers stopped" "Success"
    }
    catch {
        Write-Status "Error during development: $_" "Error"
        if ($viteWindow) { Stop-Process -Id $viteWindow.Id -Force }
        exit 1
    }
    finally {
        Stop-Transcript
    }
}

# Run the development environment
Start-Development