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
                            sh "mvn install -DskipTests -Dmaven.test.skip=true"
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
                            sh "docker build --no-cache -t ${svc}:latest ."
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
            echo "All microservices built successfully"
        }
        failure {
            echo "Build failed"
        }
    }
}