package main

import (
	"log"
	"quiz_service/config"
	"quiz_service/gRPC/client"
	"quiz_service/middleware"
	"quiz_service/router/mcqrouter"
	quizattemptrouter "quiz_service/router/quizAttemptRouter"
	"quiz_service/router/quizrouter"
	"quiz_service/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	config.ConnectDb()

	app := fiber.New()
	app.Use(middleware.AuthincateUser)

	// Routes
	quizRouterGroup := app.Group("/quiz")
	quizrouter.RegisterQuizRouter(quizRouterGroup)

	mcqRouterGroup := app.Group("/mcq")
	mcqrouter.RegisterMcqRouter(mcqRouterGroup)

	quizAttemptGroup := app.Group("/quiz-attempt")
	quizattemptrouter.RegisterQuizAttemptRouter(quizAttemptGroup)
	// Routes

	// Load SQS
	var sqsConfig utils.SQSConfig
	sqsConfigErr := sqsConfig.LoadAWSConfig()
	if sqsConfigErr != nil {
		log.Fatal("Error Loading SQS Config")
	}

	err := client.NewGrpcClient("localhost:50051")
	if err != nil {
		log.Fatal("Error Connecting With Grpc Client", err)
	}
	courseProgressGrpcErr := client.NewCourseProgressGrpcClient("localhost:50054")
	if courseProgressGrpcErr != nil {
		log.Fatal("Error Connecting With Grpc Client(Course Progress)", err)
	}

	userServiceGrpcErr := client.NewUserServiceGrpcClient("localhost:50052")
	if userServiceGrpcErr != nil {
		log.Fatal("Error Connecting With Grpc Client(UserService Progress)", err)
	}
	log.Fatal(app.Listen(":3004"))
}
