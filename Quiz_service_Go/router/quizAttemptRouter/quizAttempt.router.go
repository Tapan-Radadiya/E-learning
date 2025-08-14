package quizattemptrouter

import (
	quizattemptcontroller "quiz_service/controller/quizAttemptController"
	quizattemptservice "quiz_service/services/quizAttemptService"

	"github.com/gofiber/fiber/v2"
)

func RegisterQuizAttemptRouter(app fiber.Router) {
	service := quizattemptservice.NewQuizAttemptService()

	quizAttemptService := quizattemptcontroller.NewQuizAttemptController(service)

	app.Get("/start-quiz/:quizId", quizAttemptService.StartQuiz)
	app.Get("/submit-quiz/:quizId", quizAttemptService.SubmitQuiz)
}
