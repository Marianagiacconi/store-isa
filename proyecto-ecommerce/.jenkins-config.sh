#!/bin/bash

# Jenkins Configuration Script for Store Project
# This script helps set up the environment for Jenkins builds

echo "Setting up Jenkins environment..."

# Install required dependencies
echo "Installing system dependencies..."
sudo apt-get update
sudo apt-get install -y docker.io docker-compose

# Start Docker service
echo "Starting Docker service..."
sudo systemctl start docker
sudo systemctl enable docker

# Add jenkins user to docker group
echo "Adding jenkins user to docker group..."
sudo usermod -aG docker jenkins

# Create local Docker registry if it doesn't exist
echo "Setting up local Docker registry..."
if ! docker ps | grep -q "registry:2"; then
    docker run -d -p 5000:5000 --name registry registry:2
fi

# Set up Docker network for the project
echo "Setting up Docker networks..."
docker network create store-network 2>/dev/null || true
docker network create elk 2>/dev/null || true

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install Java if not present
if ! command -v java &> /dev/null; then
    echo "Installing Java..."
    sudo apt-get install -y openjdk-17-jdk
fi

echo "Jenkins environment setup completed!" 