# Docker Deployment Guide

This guide explains how to deploy the News Aggregator application using Docker.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)
- Git (to clone the repository)

## Quick Start

### Option 1: Using PowerShell Script (Recommended for Windows)

```powershell
# Deploy the application
.\deploy.ps1

# Or specify a command
.\deploy.ps1 deploy
```

### Option 2: Using Docker Compose Directly

```bash
# Build and start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

### Option 3: Using Docker Commands

```bash
# Build the image
docker build -f Dockerfile.Frontend -t news-aggregator:latest .

# Run the container
docker run -d -p 3000:80 --name news-aggregator-app news-aggregator:latest
```

## Available Commands

### PowerShell Script Commands

| Command | Description |
|---------|-------------|
| `.\deploy.ps1 deploy` | Build and deploy the application (default) |
| `.\deploy.ps1 build` | Build the Docker image only |
| `.\deploy.ps1 start` | Start the application |
| `.\deploy.ps1 stop` | Stop the application |
| `.\deploy.ps1 restart` | Restart the application |
| `.\deploy.ps1 status` | Show application status |
| `.\deploy.ps1 logs` | Show application logs |
| `.\deploy.ps1 cleanup` | Clean up Docker resources |
| `.\deploy.ps1 help` | Show help message |

### Docker Compose Commands

| Command | Description |
|---------|-------------|
| `docker-compose up -d` | Start services in background |
| `docker-compose down` | Stop and remove containers |
| `docker-compose ps` | Show running containers |
| `docker-compose logs -f` | Follow logs |
| `docker-compose restart` | Restart services |
| `docker-compose build` | Build images |

## Configuration Files

### Dockerfile.Frontend
Multi-stage Dockerfile that:
- Builds the React application using Node.js
- Serves the application using Nginx
- Includes security best practices (non-root user)
- Includes health checks

### docker-compose.yml
Development configuration with:
- Port mapping (3000:80)
- Health checks
- Restart policies
- Environment variables

### docker-compose.prod.yml
Production configuration with:
- Port mapping (80:80, 443:443)
- Always restart policy
- Production environment variables
- Network configuration

### nginx.conf
Nginx configuration for:
- SPA routing (fallback to index.html)
- Static file serving with caching
- Security headers
- Performance optimizations

## Deployment Options

### Development Deployment

```bash
# Using docker-compose.yml
docker-compose up -d

# Access at http://localhost:3000
```

### Production Deployment

```bash
# Using docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml up -d

# Access at http://localhost:80
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Node environment | `production` |
| `PUBLIC_URL` | Public URL for assets | `/` |

## Health Checks

The application includes health checks that:
- Check if the application is responding
- Run every 30 seconds
- Have a 3-second timeout
- Retry 3 times before marking as unhealthy

## Security Features

- Non-root user execution
- Minimal Alpine Linux base image
- Security headers in Nginx
- Proper file permissions
- Health check endpoints

## Troubleshooting

### Common Issues

1. **Docker not running**
   ```
   Error: Docker is not running
   Solution: Start Docker Desktop
   ```

2. **Port already in use**
   ```
   Error: Port 3000 is already in use
   Solution: Change port in docker-compose.yml or stop conflicting service
   ```

3. **Build failures**
   ```
   Error: npm install failed
   Solution: Check internet connection and Docker resources
   ```

### Debugging Commands

```bash
# Check container status
docker ps -a

# View container logs
docker logs news-aggregator-app

# Enter container shell
docker exec -it news-aggregator-app sh

# Check Docker system
docker system df
docker system prune
```

### Performance Optimization

1. **Build optimization**
   - Multi-stage builds reduce image size
   - npm ci for faster, reliable builds
   - Alpine Linux for minimal base image

2. **Runtime optimization**
   - Nginx for efficient static file serving
   - Gzip compression enabled
   - Browser caching headers

## Monitoring

### Health Check Endpoints

- Application: `http://localhost:3000/`
- Health check: Built into Docker container

### Logging

```bash
# View application logs
docker-compose logs -f

# View specific service logs
docker-compose logs news-aggregator
```

## Scaling

For production scaling, consider:

1. **Load Balancer**: Use Traefik or Nginx as reverse proxy
2. **Multiple Instances**: Run multiple containers behind load balancer
3. **Container Orchestration**: Use Docker Swarm or Kubernetes
4. **Monitoring**: Implement monitoring with Prometheus/Grafana

## Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove images
docker rmi news-aggregator:latest

# Clean up system
docker system prune -a
```

## Support

For issues or questions:
1. Check Docker Desktop is running
2. Verify port availability
3. Check container logs
4. Review this documentation
