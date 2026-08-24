pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Pulling code from Git...'
                checkout scm
            }
        }

        stage('Install and Build using Docker') {
            steps {
                echo "Running npm install and build inside a Node Docker container..."
                sh 'docker run --rm -v "$PWD:/app" -w /app node:18-alpine sh -c "npm install && npm run build"'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building the Docker image for the frontend...'
                sh 'docker build -t asset-management-frontend:latest .'
            }
        }

        stage('Deploy Container') {
            steps {
                echo 'Deploying container...'
                sh 'docker stop asset-frontend || true'
                sh 'docker rm asset-frontend || true'
                sh 'docker run -d --name asset-frontend -p 3000:80 asset-management-frontend:latest'
            }
        }
    }
}