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

	SqsConfigErr := utils.LoadAWSConfig()

	if SqsConfigErr != nil {
		log.Fatal("Error Loading SQS Config")
	}

	// Initialize All Grpc Client Service Needed
	client.InitAllGrpcClient()

	log.Fatal(app.Listen(":3004"))
}
