#!/bin/bash

# News Aggregator Docker Deployment Script
# This script builds and deploys the news aggregator application using Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to build the Docker image
build_image() {
    print_status "Building Docker image..."
    docker build -f Dockerfile.Frontend -t news-aggregator:latest .
    print_success "Docker image built successfully"
}

# Function to stop existing containers
stop_containers() {
    print_status "Stopping existing containers..."
    docker-compose down 2>/dev/null || true
    print_success "Existing containers stopped"
}

# Function to start the application
start_application() {
    print_status "Starting the application..."
    docker-compose up -d
    print_success "Application started successfully"
}

# Function to show application status
show_status() {
    print_status "Application Status:"
    docker-compose ps
    
    print_status "Application is available at:"
    echo "  - http://localhost:3000"
    echo "  - http://127.0.0.1:3000"
}

# Function to show logs
show_logs() {
    print_status "Showing application logs (press Ctrl+C to exit):"
    docker-compose logs -f
}

# Main deployment function
deploy() {
    print_status "Starting deployment process..."
    
    check_docker
    build_image
    stop_containers
    start_application
    show_status
    
    print_success "Deployment completed successfully!"
    print_status "You can view logs with: ./deploy.sh logs"
}

# Function to clean up
cleanup() {
    print_status "Cleaning up Docker resources..."
    docker-compose down
    docker system prune -f
    print_success "Cleanup completed"
}

# Function to show help
show_help() {
    echo "News Aggregator Docker Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  deploy    Build and deploy the application (default)"
    echo "  build     Build the Docker image only"
    echo "  start     Start the application"
    echo "  stop      Stop the application"
    echo "  restart   Restart the application"
    echo "  status    Show application status"
    echo "  logs      Show application logs"
    echo "  cleanup   Clean up Docker resources"
    echo "  help      Show this help message"
    echo ""
}

# Parse command line arguments
case "${1:-deploy}" in
    deploy)
        deploy
        ;;
    build)
        check_docker
        build_image
        ;;
    start)
        check_docker
        start_application
        show_status
        ;;
    stop)
        stop_containers
        ;;
    restart)
        check_docker
        stop_containers
        start_application
        show_status
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    cleanup)
        cleanup
        ;;
    help)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
