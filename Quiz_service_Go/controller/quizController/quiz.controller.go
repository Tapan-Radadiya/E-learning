package quizcontroller

import (
	"quiz_service/common"
	"quiz_service/model"
	quizsevice "quiz_service/services/quizSevice"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type QuizController struct {
	QuizService quizsevice.QuizServiceInterface
}

func NewQuizController(service quizsevice.QuizServiceInterface) *QuizController {
	return &QuizController{QuizService: service}
}

func (q *QuizController) AddQuiz(c *fiber.Ctx) error {
	var quizData model.Quizes

	if err := c.BodyParser(&quizData); err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Missing Data"})
	}

	data, err := q.QuizService.AddQuizService(&quizData)

	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Error Creating Quiz", "err": err.Error()})
	}
	return common.Response(c, fiber.StatusCreated, fiber.Map{"message": "Quiz Created", "data": data})
}

func (q *QuizController) DeleteQuiz(c *fiber.Ctx) error {
	quizId, err := uuid.Parse(c.Params("quizId"))

	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Invalid QuizId"})
	}

	deletedQuiz, err := q.QuizService.DeleteQuizService(quizId)
	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Unable To Delete Quiz"})
	}

	return common.Response(c, fiber.StatusOK, fiber.Map{"message": "Quiz Deleted", "data": deletedQuiz})
}

func (q *QuizController) UpdateQuiz(c *fiber.Ctx) error {
	quizId, err := uuid.Parse(c.Params("quizId"))

	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Invalid QuizId"})
	}

	var newQuizData model.Quizes

	if err := c.BodyParser(&newQuizData); err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Invalid Body"})
	}

	updatedQuiz, err := q.QuizService.UpdateQuizService(quizId, &newQuizData)
	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Error Updating Quiz"})
	}

	return common.Response(c, fiber.StatusOK, fiber.Map{"message": "Quiz Updated Successfully", "data": updatedQuiz})
}

func (q *QuizController) GetQuizData(c *fiber.Ctx) error {
	quizId := c.Params("quizId")

	if quizId == "" {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Invalid QuizId"})
	}

	quizData, err := q.QuizService.GetQuizService(quizId)

	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Error Fetching QuizData"})
	}
	return common.Response(c, fiber.StatusOK, fiber.Map{"message": "QuizData Fetched", "data": quizData})
}

func (q *QuizController) GetUserQuizAttempts(c *fiber.Ctx) error {
	userId, err := uuid.Parse(c.Locals("UserId").(string))
	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Invalid userId"})
	}

	data, err := q.QuizService.GetUserQuizData(userId)
	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "error fetching quiz data", "err": err.Error()})
	}
	return common.Response(c, fiber.StatusOK, fiber.Map{"message": "data fetched", "data": data})
}
