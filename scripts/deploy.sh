#!/bin/bash

# AI Digital Twin Creator Deployment Script
# Usage: ./deploy.sh [environment]
# Environments: development, production

set -e

ENVIRONMENT=${1:-development}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=================================="
echo "AI Digital Twin Creator Deployment"
echo "Environment: $ENVIRONMENT"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check dependencies
check_dependencies() {
    log_info "Checking dependencies..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    log_info "All dependencies found"
}

# Load environment variables
load_env() {
    if [ -f "$PROJECT_DIR/.env" ]; then
        log_info "Loading environment variables..."
        set -a
        source "$PROJECT_DIR/.env"
        set +a
    else
        log_warn "No .env file found, using defaults"
    fi
}

# Build and start services
deploy() {
    log_info "Building and starting services..."
    
    cd "$PROJECT_DIR"
    
    if [ "$ENVIRONMENT" = "production" ]; then
        docker-compose -f docker-compose.yml up -d --build
    else
        docker-compose up -d --build
    fi
    
    log_info "Services started successfully"
}

# Wait for services to be healthy
wait_for_health() {
    log_info "Waiting for services to be healthy..."
    
    # Wait for database
    timeout=60
    while [ $timeout -gt 0 ]; do
        if docker-compose exec -T postgres pg_isready -U user > /dev/null 2>&1; then
            log_info "Database is ready"
            break
        fi
        sleep 1
        ((timeout--))
    done
    
    if [ $timeout -eq 0 ]; then
        log_error "Database failed to start"
        exit 1
    fi
    
    # Wait for backend
    timeout=30
    while [ $timeout -gt 0 ]; do
        if curl -s http://localhost:8000/health > /dev/null 2>&1; then
            log_info "Backend is ready"
            break
        fi
        sleep 1
        ((timeout--))
    done
}

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."
    
    cd "$PROJECT_DIR"
    docker-compose exec -T backend alembic upgrade head 2>/dev/null || log_warn "No migrations to run"
}

# Deploy Modal functions
deploy_modal() {
    log_info "Deploying Modal AI functions..."
    
    cd "$PROJECT_DIR/backend"
    modal deploy modal_app.py || log_warn "Modal deployment skipped or failed"
}

# Display status
show_status() {
    log_info "Deployment Status:"
    echo ""
    docker-compose ps
    echo ""
    log_info "Application URLs:"
    echo "  Frontend: http://localhost"
    echo "  Backend API: http://localhost/api/v1"
    echo "  API Docs: http://localhost/api/v1/docs"
}

# Main deployment flow
main() {
    check_dependencies
    load_env
    deploy
    wait_for_health
    run_migrations
    
    if [ "$ENVIRONMENT" = "production" ]; then
        deploy_modal
    fi
    
    show_status
    
    log_info "Deployment complete!"
}

# Handle errors
trap 'log_error "Deployment failed"' ERR

# Run main function
main
