pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
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

        stage('Start Application') {
            steps {
                bat '''
                    start "Names App" /B cmd /c "npm start > app.log 2>&1"
                    timeout /t 5 /nobreak
                '''
            }
        }

        stage('Health Check') {
            steps {
                bat '''
                    curl -f http://localhost:3000/health
                '''
            }
        }
    }
}
