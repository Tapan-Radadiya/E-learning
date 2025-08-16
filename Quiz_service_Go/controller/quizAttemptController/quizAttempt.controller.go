package quizattemptcontroller

import (
	"quiz_service/common"
	"quiz_service/model"
	quizattemptservice "quiz_service/services/quizAttemptService"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type QuizAttemptController struct {
	QuizAttemptservice quizattemptservice.QuizAttemptServiceInterface
}

func NewQuizAttemptController(service quizattemptservice.QuizAttemptServiceInterface) *QuizAttemptController {
	return &QuizAttemptController{QuizAttemptservice: service}
}

func (q *QuizAttemptController) StartQuiz(c *fiber.Ctx) error {
	quizId, err := uuid.Parse(c.Params("quizId"))

	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Invalid QuizId Format"})
	}

	userId, err := uuid.Parse(c.Locals("UserId").(string))

	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "error parsing userid"})
	}

	data, err := q.QuizAttemptservice.StartQuizService(quizId, userId)
	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Error", "err": err.Error()})
	}

	return common.Response(c, fiber.StatusOK, fiber.Map{"message": "Done", "data": data})
}

func (q *QuizAttemptController) SubmitQuiz(c *fiber.Ctx) error {
	quizId, err := uuid.Parse(c.Params("quizId"))

	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Invalid QuizId Format"})
	}

	userId, err := uuid.Parse(c.Locals("UserId").(string))

	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "error parsing userid"})
	}

	var quizResultBody *model.ExamQuizBody

	if err := c.BodyParser(&quizResultBody); err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Error Parsing Data"})
	}
	data, err := q.QuizAttemptservice.SubmitQuizService(quizResultBody, quizId, userId)

	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Error Submitting Quiz", "err": err.Error()})
	}

	return common.Response(c, fiber.StatusOK, fiber.Map{"message": "Quiz Submitted Successfully", "data": data})
}
