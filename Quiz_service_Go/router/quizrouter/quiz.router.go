package quizrouter

import (
	quizcontroller "quiz_service/controller/quizController"
	quizsevice "quiz_service/services/quizSevice"

	"github.com/gofiber/fiber/v2"
)

func RegisterQuizRouter(app fiber.Router) {
	service := quizsevice.NewQuizService()

	quizService := quizcontroller.NewQuizController(service)

	app.Get("/quiz-attempts", quizService.GetUserQuizAttempts)
	app.Get("/:quizId", quizService.GetQuizData)
	app.Post("/add", quizService.AddQuiz)
	app.Patch("/", quizService.UpdateQuiz)
	app.Delete("/:quizId", quizService.DeleteQuiz)
}
