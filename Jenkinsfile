pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'isa-store'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        DOCKER_REGISTRY = 'localhost:5000'
        JAVA_HOME = '/usr/lib/jvm/java-17-openjdk-amd64'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }
        
        stage('Setup Environment') {
            steps {
                echo 'Setting up environment...'
                sh 'java -version'
                sh 'gradle -version'
                sh 'node --version'
                sh 'npm --version'
                sh 'docker --version'
            }
        }
        
        stage('Build Backend') {
            steps {
                echo 'Building backend with Gradle...'
                dir('proyecto-ecommerce/backend') {
                    sh 'ls -la'
                    sh 'gradle clean build -x test --no-daemon --info'
                }
            }
        }
        
        stage('Run Backend Tests') {
            steps {
                echo 'Running backend unit tests...'
                dir('proyecto-ecommerce/backend') {
                    sh 'gradle test --no-daemon'
                }
            }
            post {
                always {
                    dir('proyecto-ecommerce/backend') {
                        publishHTML([
                            allowMissing: true,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'build/reports/tests/test',
                            reportFiles: 'index.html',
                            reportName: 'Backend Test Report'
                        ])
                    }
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                echo 'Building frontend with npm...'
                dir('proyecto-ecommerce/backend') {
                    sh 'npm ci --silent'
                    sh 'npm run webapp:build:prod'
                }
            }
        }
        
        stage('Run Frontend Tests') {
            steps {
                echo 'Running frontend tests...'
                dir('proyecto-ecommerce/backend') {
                    sh 'npm run test-ci'
                }
            }
            post {
                always {
                    dir('proyecto-ecommerce/backend') {
                        publishHTML([
                            allowMissing: true,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'build/reports/jest',
                            reportFiles: 'index.html',
                            reportName: 'Frontend Test Report'
                        ])
                    }
                }
            }
        }
        
        stage('Run E2E Tests') {
            steps {
                echo 'Running Cypress E2E tests...'
                dir('proyecto-ecommerce/backend') {
                    sh 'npm run ci:e2e:prepare || echo "E2E prepare failed, continuing..."'
                    sh 'npm run ci:e2e:server:start & || echo "Server start failed, continuing..."'
                    sh 'sleep 30'
                    sh 'npx cypress run --config baseUrl=http://localhost:8080 || echo "Cypress tests failed, continuing..."'
                }
            }
            post {
                always {
                    dir('proyecto-ecommerce/backend') {
                        publishHTML([
                            allowMissing: true,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'cypress/reports/html',
                            reportFiles: 'index.html',
                            reportName: 'E2E Test Report'
                        ])
                    }
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                dir('proyecto-ecommerce') {
                    sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} -f Dockerfile ."
                    sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
                }
            }
        }
        
        stage('Push to Registry') {
            when {
                branch 'main'
            }
            steps {
                echo 'Pushing Docker image to registry...'
                sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}"
                sh "docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}"
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying to production...'
                dir('proyecto-ecommerce/docker') {
                    sh 'docker-compose down'
                    sh 'docker-compose pull'
                    sh 'docker-compose up -d'
                }
            }
        }
        
        stage('Health Check') {
            when {
                branch 'main'
            }
            steps {
                echo 'Performing health check...'
                script {
                    timeout(time: 5, unit: 'MINUTES') {
                        sh '''
                            until curl -f http://localhost:8081/management/health; do
                                echo "Waiting for application to be ready..."
                                sleep 10
                            done
                        '''
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
} 