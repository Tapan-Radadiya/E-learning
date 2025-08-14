# E-Learning Platform

A comprehensive microservices-based e-learning platform built with Node.js, TypeScript, Go, and modern web technologies.

## Architecture Overview

This platform follows a microservices architecture with the following core services:

- **API Gateway** - Nginx-based gateway with JWT authentication
- **Auth Service** - User authentication and authorization (Node.js/TypeScript)
- **Course Service** - Course management and content delivery (Node.js/TypeScript)
- **Enrollment & Progress Service** - Student enrollment and progress tracking (Node.js/TypeScript)
- **Quiz Service** - Quiz creation and assessment management (Go)
- **Progression Service** - XP system and leaderboards (Go)
- **AWS SNS Service** - Notification and messaging service (Go)

## Tech Stack

### Backend Services
- **Node.js/TypeScript** - Auth, Course, and Enrollment services
- **Go** - Quiz, Progression, and AWS SNS services
- **PostgreSQL** - Primary database
- **Sequelize** - ORM for Node.js services
- **GORM** - ORM for Go services

### Infrastructure
- **Docker** - Containerization
- **Nginx** - API Gateway and load balancing
- **gRPC** - Inter-service communication
- **JWT** - Authentication tokens
- **AWS SNS/SQS** - Message queuing and notifications

## Quick Start

### Prerequisites
- Node.js 18+
- Go 1.19+
- Docker & Docker Compose
- PostgreSQL

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Elearning TEst"
```

2. Set up environment variables:
```bash
# Copy .env files in each service directory
cp Auth_service/.env.example Auth_service/.env
cp Course_Service/.env.example Course_Service/.env
# Repeat for other services
```

3. Start the database:
```bash
docker-compose -f database_up.yaml up -d
```

4. Install dependencies for Node.js services:
```bash
cd Auth_service && npm install
cd ../Course_Service && npm install
cd ../enrollment_courseProgress_service && npm install
cd ../shared-package && npm install
```

5. Install dependencies for Go services:
```bash
cd AWS_Sns_GO && go mod tidy
cd ../Quiz_service_Go && go mod tidy
cd ../Progression_service_GO && go mod tidy
```

6. Run database migrations:
```bash
cd Auth_service && npx sequelize-cli db:migrate
cd ../Course_Service && npx sequelize-cli db:migrate
cd ../enrollment_courseProgress_service && npx sequelize-cli db:migrate
```

7. Start the API Gateway:
```bash
cd Apigateway && docker-compose up -d
```

8. Start individual services:
```bash
# Auth Service
cd Auth_service && npm run dev

# Course Service
cd Course_Service && npm run dev

# Enrollment Service
cd enrollment_courseProgress_service && npm run dev

# Quiz Service
cd Quiz_service_Go && go run main.go

# Progression Service
cd Progression_service_GO && go run main.go

# AWS SNS Service
cd AWS_Sns_GO && go run main.go
```

## Service Details

### Auth Service (Port: 3001)
- User registration and login
- JWT token management
- Role-based access control
- Password reset functionality

### Course Service (Port: 3002)
- Course creation and management
- Module and content organization
- Course metadata handling

### Enrollment & Progress Service (Port: 3003)
- Student course enrollment
- Progress tracking
- Completion status management

### Quiz Service (Port: 8080)
- Quiz creation and management
- MCQ handling
- Quiz attempt tracking
- Results processing

### Progression Service (Port: 8081)
- XP system implementation
- Leaderboard management
- Achievement tracking
- Real-time updates via SSE

### AWS SNS Service (Port: 8082)
- Email notifications
- SMS messaging
- Event-driven communication
- Queue management

## API Documentation

Each service provides its own API documentation:
- Quiz Service: See `Quiz_service_Go/API_DOCUMENTATION.md`
- Other services: Available via Swagger/OpenAPI endpoints

## Database Schema

The platform uses PostgreSQL with the following main tables:
- Users (Auth Service)
- Courses & Modules (Course Service)
- Enrollments & Progress (Enrollment Service)
- Quizzes & Attempts (Quiz Service)
- XP Events & Leaderboards (Progression Service)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.