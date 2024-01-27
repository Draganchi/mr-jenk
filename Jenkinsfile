pipeline {
  agent any
    environment {
      PROJECT_NAME = "buy01"
        PROJECT_VERSION = ""
        NEXUS_DOCKER_REPO = "161.35.24.93:8082/repository/buy02-docker-images"
        NEXUS_DOCKER_LOGIN_CONN = "161.35.24.93:8082"
    }
  stages {
    stage('Run Tests: User Service') {
      agent {
        label 'master'
      }
      steps {
        dir('user-service') {
          sh 'mvn test'
        }
      }
    }
    stage('Run Tests: Product Service') {
      agent {
        label 'master'
      }
      steps {
        dir('product-service') {
          sh 'mvn test'
        }
      }
    }
    stage('Run Tests: Media Service') {
      agent {
        label 'master'
      }
      steps {
        dir('media-service') {
          sh 'mvn test'
        }
      }
    }
    stage('Run Tests: Order Service') {
      agent {
        label 'master'
      }
      steps {
        dir('order-service') {
          sh 'mvn test'
        }
      }
    }
    stage('Run Tests: Angular') {
      agent {
        label 'master'
      }
      steps {
        dir('angular') {
          sh 'export CHROME_BIN=/usr/bin/google-chrome'
            sh 'npm install'
            sh 'ng test --watch=false --progress=false --browsers ChromeHeadless'
        }
      }
    }
    stage('User Service SonarQube Analysis & Quality Gate') {
      steps {
        script {
          dir('user-service') {
            withCredentials([string(credentialsId: 'sonarqube', variable: 'SONAR_AUTH_TOKEN')]) {
              withSonarQubeEnv('ali droplet') {
                sh 'mvn clean compile'
                  sh """
                  mvn sonar:sonar \
                  -Dsonar.projectKey=buy-01-user-service \
                  -Dsonar.host.url=http://64.226.78.45:9000 \
                  -Dsonar.token=$SONAR_AUTH_TOKEN
                  """
              }
            }
            timeout(time: 1, unit: 'HOURS') {
              waitForQualityGate abortPipeline: true
            }
          }
        }
      }
    }
    stage('Product Service SonarQube Analysis & Quality Gate') {
      steps {
        script {
          dir('product-service') {
            withCredentials([string(credentialsId: 'sonarqube', variable: 'SONAR_AUTH_TOKEN')]) {
              withSonarQubeEnv('ali droplet') {
                sh 'mvn clean compile'
                  sh """
                  mvn sonar:sonar \
                  -Dsonar.projectKey=buy-01-product-service \
                  -Dsonar.host.url=http://64.226.78.45:9000 \
                  -Dsonar.token=$SONAR_AUTH_TOKEN
                  """
              }
            }
            timeout(time: 1, unit: 'HOURS') {
              waitForQualityGate abortPipeline: true
            }
          }
        }
      }
    }
    stage('Media Service SonarQube Analysis & Quality Gate') {
      steps {
        script {
          dir('media-service') {
            withCredentials([string(credentialsId: 'sonarqube', variable: 'SONAR_AUTH_TOKEN')]) {
              withSonarQubeEnv('ali droplet') {
                sh 'mvn clean compile'
                  sh """
                  mvn sonar:sonar \
                  -Dsonar.projectKey=buy-01-media-service \
                  -Dsonar.host.url=http://64.226.78.45:9000 \
                  -Dsonar.token=$SONAR_AUTH_TOKEN
                  """
              }
            }
          }
          timeout(time: 1, unit: 'HOURS') {
            waitForQualityGate abortPipeline: true
          }
        }
      }
    }
    stage('Order Service SonarQube Analysis & Quality Gate') {
      steps {
        script {
          dir('order-service') {
            withCredentials([string(credentialsId: 'sonarqube', variable: 'SONAR_AUTH_TOKEN')]) {
              withSonarQubeEnv('ali droplet') {
                sh 'mvn clean compile'
                  sh """
                  mvn sonar:sonar \
                  -Dsonar.projectKey=buy-01-order-service \
                  -Dsonar.host.url=http://64.226.78.45:9000 \
                  -Dsonar.token=$SONAR_AUTH_TOKEN
                  """
              }
            }
          }
          timeout(time: 1, unit: 'HOURS') {
            waitForQualityGate abortPipeline: true
          }
        }
      }
    }
    stage('Angular SonarQube Analysis & Quality Gate') {
      agent {
        label 'master'
      }
      steps {
        dir('angular') {
          sh 'npm install'
            sh 'ng test --watch=false --progress=false --karma-config=karma.conf.js --code-coverage'
            withCredentials([string(credentialsId: 'sonarqube', variable: 'SONAR_AUTH_TOKEN')]) {
              sh """
                sonar-scanner -X \
                -Dsonar.projectKey=buy-01-frontend \
                -Dsonar.host.url=http://64.226.78.45:9000 \
                -Dsonar.token=$SONAR_AUTH_TOKEN \
                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                -Dsonar.testExecutionReportPaths=reports/test-report.xml
                """
            }
          timeout(time: 1, unit: 'HOURS') {
            waitForQualityGate abortPipeline: true
          }
        }
      }
    }
    stage('Extract Version') {
      steps {
        script {
          PROJECT_VERSION = sh(script: "mvn help:evaluate -Dexpression=project.version -q -DforceStdout | sed -r 's/\\x1B\\[[0-9;]*[JKmsu]//g'", returnStdout: true).trim()
            echo "Project Version: ${PROJECT_VERSION}"
        }
      }
    }
    stage('Deploy User Service to Nexus') {
      agent {
        label 'master'
      }
      steps {
        dir('user-service') {
          sh 'mvn clean deploy -Pprod'
        }
      }
    }
    stage('Deploy Product Service to Nexus') {
      agent {
        label 'master'
      }
      steps {
        dir('product-service') {
          sh 'mvn clean deploy'
        }
      }
    }
    stage('Deploy Media Service to Nexus') {
      agent {
        label 'master'
      }
      steps {
        dir('media-service') {
          sh 'mvn clean deploy'
        }
      }
    }
    stage('Deploy Order Service to Nexus') {
      agent {
        label 'master'
      }
      steps {
        dir('order-service') {
          sh 'mvn clean deploy'
        }
      }
    }
    stage('Deploy Frontend to Nexus') {
      agent {
        label 'master'
      }
      steps {
        dir('angular') {
          withCredentials([usernamePassword(credentialsId: 'nexus', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
            sh 'npm install'
              sh 'npm publish'
      }
        }
      }
    }
    stage('Login to Nexus Docker Repository') {
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: 'nexus', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
            sh "echo ${NEXUS_PASSWORD} | docker login ${NEXUS_DOCKER_LOGIN_CONN} -u ${NEXUS_USERNAME} --password-stdin"
          }
        }
      }
    }
    stage('Build and Push Docker Images to Nexus') {
      steps {
        echo "Building and pushing user-service docker image"
          withCredentials([usernamePassword(credentialsId: 'nexus', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
            sh "docker build -t ${NEXUS_DOCKER_REPO}/user-service:${PROJECT_VERSION} -f user-service/Dockerfile-user-nexus --build-arg VERSION=${PROJECT_VERSION} --build-arg NEXUS_USERNAME=${NEXUS_USERNAME} --build-arg NEXUS_PASSWORD=${NEXUS_PASSWORD} ."
          }
        sh "docker push ${NEXUS_DOCKER_REPO}/user-service:${PROJECT_VERSION}"

          echo "Building and pushing product-service docker image"
          withCredentials([usernamePassword(credentialsId: 'nexus', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
            sh "docker build -t ${NEXUS_DOCKER_REPO}/product-service:${PROJECT_VERSION} -f product-service/Dockerfile-product-nexus --build-arg VERSION=${PROJECT_VERSION} --build-arg NEXUS_USERNAME=${NEXUS_USERNAME} --build-arg NEXUS_PASSWORD=${NEXUS_PASSWORD} ."
          }
        sh "docker push ${NEXUS_DOCKER_REPO}/product-service:${PROJECT_VERSION}"

          echo "Building and pushing media-service docker image"
          withCredentials([usernamePassword(credentialsId: 'nexus', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
            sh "docker build -t ${NEXUS_DOCKER_REPO}/media-service:${PROJECT_VERSION} -f media-service/Dockerfile-media-nexus --build-arg VERSION=${PROJECT_VERSION} --build-arg NEXUS_USERNAME=${NEXUS_USERNAME} --build-arg NEXUS_PASSWORD=${NEXUS_PASSWORD} ."
          }
        sh "docker push ${NEXUS_DOCKER_REPO}/media-service:${PROJECT_VERSION}"

          echo "Building and pushing order-service docker image"
          withCredentials([usernamePassword(credentialsId: 'nexus', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
            sh "docker build -t ${NEXUS_DOCKER_REPO}/order-service:${PROJECT_VERSION} -f order-service/Dockerfile-order-nexus --build-arg VERSION=${PROJECT_VERSION} --build-arg NEXUS_USERNAME=${NEXUS_USERNAME} --build-arg NEXUS_PASSWORD=${NEXUS_PASSWORD} ."
          }
        sh "docker push ${NEXUS_DOCKER_REPO}/order-service:${PROJECT_VERSION}"

          echo "Building and pushing frontend docker image"
          dir('angular') {
            withCredentials([usernamePassword(credentialsId: 'nexus', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
              sh "docker build -t ${NEXUS_DOCKER_REPO}/frontend:${PROJECT_VERSION} -f Dockerfile-frontend-nexus --build-arg VERSION=${PROJECT_VERSION} --build-arg NEXUS_USERNAME=${NEXUS_USERNAME} --build-arg NEXUS_PASSWORD=${NEXUS_PASSWORD} ."
            }
            sh "docker push ${NEXUS_DOCKER_REPO}/frontend:${PROJECT_VERSION}"
          }
      }
    }
    stage('Upload Docker Compose File to Nexus') {
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: 'nexus', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
            sh "curl -u ${NEXUS_USERNAME}:${NEXUS_PASSWORD} --upload-file ./docker-compose-nexus.yml http://161.35.24.93:8081/repository/buy02-raw/docker-compose/docker-compose-${PROJECT_VERSION}.yml"
          }
        }
      }
    }
    stage('Deploy to Production') {
      agent {
        label 'deploy'
      }
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: 'nexus', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
          sshagent(credentials: ['jenk to prod']) {
            def file = "${env.HOME}/production/buy-01/docker-compose.yml"
              def rollbackVersionFile = "${env.HOME}/production/rollback_version.txt"
              // check if rollback version file exists and read it
              def lastSuccessfulVersion = ''
              if (fileExists(rollbackVersionFile)) {
                lastSuccessfulVersion = readFile(rollbackVersionFile).trim()
              }

            try {
                sh """
                cd /home/ali/production/buy-01
                docker login 161.35.24.93:8082 -u ${NEXUS_USERNAME} -p ${NEXUS_PASSWORD}
                export PROJECT_VERSION=${PROJECT_VERSION}
                if [ -f /home/production/buy-01/docker-compose.yml ]; then
                  docker-compose --env-file .env.prod down --remove-orphans --volumes
                  docker system prune -a -f
                  rm docker-compose.yml
                fi

                curl -u ${NEXUS_USERNAME}:${NEXUS_PASSWORD} -o /home/ali/production/buy-01/docker-compose.yml http://161.35.24.93:8081/repository/buy02-raw/docker-compose/docker-compose-${PROJECT_VERSION}.yml
                docker-compose --env-file .env.prod up -d
                """

                // health check
                def services = ['buy-01_user-service_1', 'buy-01_product-service_1', 'buy-01_media-service_1', 'buy-01_order-service_1']
                def maxWaitTime = 300 // maximum wait time in seconds
                boolean allHealthy = false
                int elapsedTime = 0
                int checkInterval = 10 // seconds

                while(!allHealthy && elapsedTime < maxWaitTime) {
                  allHealthy = true
                    for (service in services) {
                      def healthStatus = ''
                        try {
                          healthStatus = sh(script: "docker inspect --format='{{.State.Health.Status}}' ${service}", returnStdout: true).trim()
                            echo "Health status of ${service}: ${healthStatus}"
                        } catch (Exception e) {
                          echo "Error inspecting ${service}: ${e.message}"
                            allHealthy = false
                            break
                        }
                      if (healthStatus != 'healthy') {
                        allHealthy = false
                          break
                      }
                    }
                  if (!allHealthy) {
                    sleep(checkInterval)
                      elapsedTime += checkInterval
                  }
                }

              if (allHealthy) {
                // update the rollback version file with the current version number
                writeFile file: rollbackVersionFile, text: PROJECT_VERSION
              } else {
                error("Deployment failed. Rolling back to last successful version.")
              }
            } catch (Exception e) {
              // rollback
              if (lastSuccessfulVersion) {
                echo "Rolling back to version: ${lastSuccessfulVersion}"
                sh """
                cd /home/ali/production/buy-01
                docker-compose --env-file .env.prod down --remove-orphans --volumes
                docker system prune -a -f
                rm docker-compose.yml
                curl -u ${NEXUS_USERNAME}:${NEXUS_PASSWORD} -o docker-compose.yml http://161.35.24.93:8081/repository/buy02-raw/docker-compose/docker-compose-${lastSuccessfulVersion}.yml
                docker login 161.35.24.93:8082 -u ${NEXUS_USERNAME} -p ${NEXUS_PASSWORD}
                docker-compose --env-file .env.prod up -d
                """
                  // mark the build as a failure on rollback
                  currentBuild.result = 'FAILURE'
                  error("Rollback to version ${lastSuccessfulVersion} was successful. Marking build as failure.")
              } else {
                currentBuild.result = 'FAILURE'
                  error("Rollback failed. No previous successful commit available.")
              }
            }
          }
        }
        }
      }
    }
  }
  post {
    success {
      mail to: 'diogodmm@me.com,ali@protonmail.com',
           subject: "Pipeline ${env.PROJECT_NAME} - Build # ${env.BUILD_NUMBER} - SUCCESS",
           body: "The pipeline was a SUCCESS. Check console output at ${env.BUILD_URL} to view the results."
    }
    failure {
      mail to: 'diogodmm@me.com,ali@protonmail.com',
           subject: "Pipeline ${env.PROJECT_NAME} - Build # ${env.BUILD_NUMBER} - FAILURE",
           body: "The pipeline was a FAILURE. Check console output at ${env.BUILD_URL} to view the results."
    }
  }
}
