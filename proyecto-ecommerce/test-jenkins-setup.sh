#!/bin/bash

# Test script to verify Jenkins setup
echo "=== Jenkins Setup Verification ==="

# Check if we're in the right directory
if [ ! -f "Jenkinsfile" ]; then
    echo "❌ Error: Jenkinsfile not found. Please run this script from the project root."
    exit 1
fi

echo "✅ Jenkinsfile found"

# Check Docker
if command -v docker &> /dev/null; then
    echo "✅ Docker is installed"
    docker --version
else
    echo "❌ Docker is not installed"
fi

# Check Docker Compose
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose is installed"
    docker-compose --version
else
    echo "❌ Docker Compose is not installed"
fi

# Check Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js is installed"
    node --version
else
    echo "❌ Node.js is not installed"
fi

# Check npm
if command -v npm &> /dev/null; then
    echo "✅ npm is installed"
    npm --version
else
    echo "❌ npm is not installed"
fi

# Check Java
if command -v java &> /dev/null; then
    echo "✅ Java is installed"
    java --version
else
    echo "❌ Java is not installed"
fi

# Check Gradle
if [ -f "backend/gradlew" ]; then
    echo "✅ Gradle wrapper found"
else
    echo "❌ Gradle wrapper not found"
fi

# Check if backend directory exists
if [ -d "backend" ]; then
    echo "✅ Backend directory exists"
    
    # Check package.json
    if [ -f "backend/package.json" ]; then
        echo "✅ package.json found"
    else
        echo "❌ package.json not found"
    fi
    
    # Check build.gradle
    if [ -f "backend/build.gradle" ]; then
        echo "✅ build.gradle found"
    else
        echo "❌ build.gradle not found"
    fi
else
    echo "❌ Backend directory not found"
fi

# Check Docker registry
if docker ps | grep -q "registry:2"; then
    echo "✅ Docker registry is running"
else
    echo "⚠️  Docker registry is not running (will be started during pipeline)"
fi

# Check Docker networks
if docker network ls | grep -q "store-network"; then
    echo "✅ store-network exists"
else
    echo "⚠️  store-network not found (will be created during pipeline)"
fi

if docker network ls | grep -q "elk"; then
    echo "✅ elk network exists"
else
    echo "⚠️  elk network not found (will be created during pipeline)"
fi

# Check Jenkins service
if systemctl is-active --quiet jenkins; then
    echo "✅ Jenkins service is running"
else
    echo "❌ Jenkins service is not running"
fi

# Test Docker build
echo ""
echo "=== Testing Docker Build ==="
if docker build -t test-store:latest -f Dockerfile .; then
    echo "✅ Docker build successful"
    docker rmi test-store:latest
else
    echo "❌ Docker build failed"
fi

echo ""
echo "=== Setup Verification Complete ==="
echo ""
echo "If all checks passed, your Jenkins environment should be ready."
echo "If there are any ❌ errors, please fix them before running the pipeline."
echo ""
echo "To run the setup script: ./jenkins-config.sh" 