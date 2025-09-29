package quizrouter

import (
	"quiz_service/constants"
	quizcontroller "quiz_service/controller/quizController"
	"quiz_service/middleware"
	quizsevice "quiz_service/services/quizSevice"

	"github.com/gofiber/fiber/v2"
)

func RegisterQuizRouter(app fiber.Router) {
	service := quizsevice.NewQuizService()

	quizService := quizcontroller.NewQuizController(service)

	app.Get("/quiz-attempts", quizService.GetUserQuizAttempts)
	app.Get("/:quizId", quizService.GetQuizData)
	app.Post("/add", middleware.AuthorizeUser([]constants.USERROLES{constants.ADMIN}), quizService.AddQuiz)
	app.Patch("/:quizId", middleware.AuthorizeUser([]constants.USERROLES{constants.ADMIN}), quizService.UpdateQuiz)
	app.Delete("/:quizId", middleware.AuthorizeUser([]constants.USERROLES{constants.ADMIN}), quizService.DeleteQuiz)
}
