pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Source code checked out from GitHub - phase 2'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }
        stage('Check Node.js Environment') {
    steps {
        bat '''
            echo ===== NODE VERSION =====
            node --version

            echo ===== NPM VERSION =====
            npm --version

            echo ===== NODE PATH =====
            where node

            echo ===== NPM PATH =====
            where npm
        '''
    }
}

        stage('Install Dependencies') {
    steps {
        bat 'npm install'
    }
}
        stage('Run Tests') {
            steps {
                bat 'npm test'
            }
        }
    }

    post {
        success {
            echo 'CI Pipeline completed successfully!'
        }

        failure {
            echo 'CI Pipeline failed!'
        }
    }
}
