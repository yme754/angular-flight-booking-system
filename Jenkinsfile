pipeline {
    agent any
    environment {
        PATH = "/usr/local/bin:$PATH"
    }
    tools {
        maven "M3"
        jdk "Java17"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/yme754/angular-flight-booking-system'
            }
        }

        stage('Build Microservices') {
            steps {
                script {
                    def services = [
                        'booking-service',
                        'flight-service',
                        'flight-api-gateway',
                        'flight-service-registery',
                        'flight-security-service',
                        'flight-config-server',
                        'flight-email-service'
                    ]
                    services.each { svc ->
                        dir("backend/${svc}") {
                            sh "mvn clean install -DskipTests -Dmaven.test.skip=true"
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    def services = [
                        'booking-service',
                        'flight-service',
                        'flight-api-gateway',
                        'flight-service-registery',
                        'flight-security-service',
                        'flight-config-server',
                        'flight-email-service'
                    ]
                    services.each { svc ->
                        dir("backend/${svc}") {
                            sh "docker build -t ${svc}:latest ."
                        }
                    }
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh "docker-compose up -d --build"
            }
        }
    }

    post {
        success {
            echo "All microservices built, images created, and deployed successfully!"
        }
        failure {
            echo "Build failed. Check console output for details."
        }
    }
}