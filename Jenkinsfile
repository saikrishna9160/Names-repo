pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Source code checkout completed.'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing application dependencies...'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running application tests...'
            }
        }

    }

    post {
        success {
            echo 'CI pipeline completed successfully.'
        }

        failure {
            echo 'CI pipeline failed.'
        }
    }
}