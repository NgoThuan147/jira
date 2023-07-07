pipeline{
    agent any
    tools {nodejs "Node"}
    stages {        
        stage('Install Dependencies'){
            steps {
                bat 'npm install'
            }
        }
        stage('Build'){
            steps {
                bat 'npm run build'
            }
        }
    }
}