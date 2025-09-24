pipeline {
    agent any

    tools {
        nodejs "NodeJS-18"   // Make sure this matches the NodeJS name you set in Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/klu2300031508/CicdProject.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                // Example: Copy to Apache/Nginx root (Linux server)
                sh 'cp -r build/* /var/www/html/'
            }
        }
    }
}
