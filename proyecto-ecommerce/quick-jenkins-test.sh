#!/bin/bash

# Quick Jenkins test script (without Docker build)
echo "=== Quick Jenkins Environment Test ==="

# Check if we're in the right directory
if [ ! -f "Jenkinsfile" ]; then
    echo "❌ Error: Jenkinsfile not found. Please run this script from the project root."
    exit 1
fi

echo "✅ Jenkinsfile found"

# Quick dependency checks
echo ""
echo "=== Dependencies Check ==="

# Check Docker
if command -v docker &> /dev/null; then
    echo "✅ Docker is installed"
else
    echo "❌ Docker is not installed"
fi

# Check Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js is installed"
else
    echo "❌ Node.js is not installed"
fi

# Check Java
if command -v java &> /dev/null; then
    echo "✅ Java is installed"
else
    echo "❌ Java is not installed"
fi

# Check Gradle wrapper
if [ -f "backend/gradlew" ]; then
    echo "✅ Gradle wrapper found"
else
    echo "❌ Gradle wrapper not found"
fi

# Check package.json
if [ -f "backend/package.json" ]; then
    echo "✅ package.json found"
else
    echo "❌ package.json not found"
fi

# Check Jenkins service
if systemctl is-active --quiet jenkins; then
    echo "✅ Jenkins service is running"
else
    echo "❌ Jenkins service is not running"
fi

# Quick build test (without Docker)
echo ""
echo "=== Quick Build Test ==="

# Test Gradle build (skip tests for speed)
echo "Testing Gradle build..."
cd backend
if ./gradlew clean build -x test --no-daemon; then
    echo "✅ Gradle build successful"
else
    echo "❌ Gradle build failed"
    exit 1
fi

# Test npm install
echo "Testing npm install..."
if npm ci --silent; then
    echo "✅ npm install successful"
else
    echo "❌ npm install failed"
    exit 1
fi

# Test frontend build
echo "Testing frontend build..."
if npm run webapp:build:prod --silent; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

cd ..

echo ""
echo "=== Quick Test Complete ==="
echo "✅ All basic builds are working!"
echo ""
echo "Your Jenkins environment appears to be properly configured."
echo "The pipeline should work correctly now."
echo ""
echo "To run the full test with Docker: ./test-jenkins-setup.sh" 