pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Pulling code from Git...'
                // Since you're running locally, we checkout from the host path
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node modules...'
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                echo 'Building the React application...'
                sh 'npm run build'
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
                // Stop and remove old container if it exists
                sh 'docker stop asset-frontend || true'
                sh 'docker rm asset-frontend || true'
                // Run the new container on port 3000
                sh 'docker run -d --name asset-frontend -p 3000:80 asset-management-frontend:latest'
            }
        }
    }
}