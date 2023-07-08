pipeline{
    agent any
    tools {nodejs "Node"}
    stages {        
        stage('Install Dependencies'){
            steps {
                sh 'npm install --package-lock-only'
            }
        }
        stage('Build'){
            steps {
                sh 'npm run build'
            }
        }
    }
}