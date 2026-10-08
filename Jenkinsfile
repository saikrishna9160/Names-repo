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
    post {
        always {
            junit 'test-results.xml'
        }
    }
}

        stage('Start Application') {
    steps {
        bat '''
            start "Names App" /B cmd /c "npm start > app.log 2>&1"
            ping 127.0.0.1 -n 6 > nul
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
