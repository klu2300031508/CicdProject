# News Aggregator Docker Deployment Script (PowerShell)
# This script builds and deploys the news aggregator application using Docker

param(
    [Parameter(Position=0)]
    [string]$Command = "deploy"
)

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Function to check if Docker is running
function Test-Docker {
    try {
        docker info | Out-Null
        Write-Success "Docker is running"
        return $true
    }
    catch {
        Write-Error "Docker is not running. Please start Docker Desktop and try again."
        exit 1
    }
}

# Function to build the Docker image
function Build-Image {
    Write-Status "Building Docker image..."
    docker build -f Dockerfile.Frontend -t news-aggregator:latest .
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Docker image built successfully"
    } else {
        Write-Error "Failed to build Docker image"
        exit 1
    }
}

# Function to stop existing containers
function Stop-Containers {
    Write-Status "Stopping existing containers..."
    docker-compose down 2>$null
    Write-Success "Existing containers stopped"
}

# Function to start the application
function Start-Application {
    Write-Status "Starting the application..."
    docker-compose up -d
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Application started successfully"
    } else {
        Write-Error "Failed to start application"
        exit 1
    }
}

# Function to show application status
function Show-Status {
    Write-Status "Application Status:"
    docker-compose ps
    
    Write-Status "Application is available at:"
    Write-Host "  - http://localhost:3000" -ForegroundColor Cyan
    Write-Host "  - http://127.0.0.1:3000" -ForegroundColor Cyan
}

# Function to show logs
function Show-Logs {
    Write-Status "Showing application logs (press Ctrl+C to exit):"
    docker-compose logs -f
}

# Main deployment function
function Deploy {
    Write-Status "Starting deployment process..."
    
    Test-Docker
    Build-Image
    Stop-Containers
    Start-Application
    Show-Status
    
    Write-Success "Deployment completed successfully!"
    Write-Status "You can view logs with: .\deploy.ps1 logs"
}

# Function to clean up
function Cleanup {
    Write-Status "Cleaning up Docker resources..."
    docker-compose down
    docker system prune -f
    Write-Success "Cleanup completed"
}

# Function to show help
function Show-Help {
    Write-Host "News Aggregator Docker Deployment Script" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\deploy.ps1 [COMMAND]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  deploy    Build and deploy the application (default)"
    Write-Host "  build     Build the Docker image only"
    Write-Host "  start     Start the application"
    Write-Host "  stop      Stop the application"
    Write-Host "  restart   Restart the application"
    Write-Host "  status    Show application status"
    Write-Host "  logs      Show application logs"
    Write-Host "  cleanup   Clean up Docker resources"
    Write-Host "  help      Show this help message"
    Write-Host ""
}

# Parse command line arguments
switch ($Command.ToLower()) {
    "deploy" {
        Deploy
    }
    "build" {
        Test-Docker
        Build-Image
    }
    "start" {
        Test-Docker
        Start-Application
        Show-Status
    }
    "stop" {
        Stop-Containers
    }
    "restart" {
        Test-Docker
        Stop-Containers
        Start-Application
        Show-Status
    }
    "status" {
        Show-Status
    }
    "logs" {
        Show-Logs
    }
    "cleanup" {
        Cleanup
    }
    "help" {
        Show-Help
    }
    default {
        Write-Error "Unknown command: $Command"
        Show-Help
        exit 1
    }
}
