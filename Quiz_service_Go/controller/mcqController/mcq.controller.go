package mcqcontroller

import (
	"fmt"
	"quiz_service/common"
	"quiz_service/model"
	mcqservice "quiz_service/services/mcqService"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type McqServiceController struct {
	McqService mcqservice.McqServiceInterface
}

func NewMcqService(service mcqservice.McqServiceInterface) *McqServiceController {
	return &McqServiceController{McqService: service}
}

func (m *McqServiceController) AddMcq(c *fiber.Ctx) error {

	var mcqData *model.McqData

	courseId := c.Params("courseId")

	parsedId, err := uuid.Parse(courseId)
	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"messsage": "Invalid QuizId"})
	}
	if err := c.BodyParser(&mcqData); err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Invalid Body"})
	}

	mcqData.CourseId = parsedId

	data, err := m.McqService.AddMcqService(mcqData)
	if err != nil {
		fmt.Println("errrr", err)
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Error Inserting Mcq", "error": err})
	}
	return common.Response(c, fiber.StatusOK, fiber.Map{"message": "Mcq Created", "data": data})
}

func (m *McqServiceController) DeleteMcq(c *fiber.Ctx) error {
	mcqId := c.Params("mcqId")

	parsedMcqId, err := uuid.Parse(mcqId)
	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Invalid McqId"})
	}

	data, err := m.McqService.DeleteMcqService(parsedMcqId)
	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Error Deleting Mcq"})
	}
	return common.Response(c, fiber.StatusOK, fiber.Map{"message": "Mcq Deleted", "data": data})
}

func (m *McqServiceController) UpdateMcq(c *fiber.Ctx) error {
	mcqId := c.Params("mcqId")

	parsedMcqId, err := uuid.Parse(mcqId)
	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Invalid McqId"})
	}

	var mcqData *model.McqData

	if err := c.BodyParser(&mcqData); err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Error Parsing Body"})
	}

	data, err := m.McqService.UpdateMcqService(parsedMcqId, *mcqData)
	if err != nil {
		fmt.Println("err", err)
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Error Updating Mcq", "err": err})
	}

	return common.Response(c, fiber.StatusOK, fiber.Map{"message": "Mcq Updated", "data": data})
}

func (m *McqServiceController) GetMcqDetails(c *fiber.Ctx) error {
	mcqId := c.Params("mcqId")

	parsedMcqId, err := uuid.Parse(mcqId)
	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Invalid McqId"})
	}

	data, err := m.McqService.GetMcqDetailsService(parsedMcqId)
	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Error Fethcing McqData", "error": err})
	}
	return common.Response(c, fiber.StatusOK, fiber.Map{"message": "Data Fetched", "data": data})
}

func (m *McqServiceController) GetAllMcqs(c *fiber.Ctx) error {
	quizId := c.Params("quizId")

	parsedQuizId, err := uuid.Parse(quizId)
	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Invalid McqId"})
	}

	data, err := m.McqService.GetAllMcqsService(parsedQuizId)
	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Error Fethcing All Mcqs", "error": err})
	}
	return common.Response(c, fiber.StatusOK, fiber.Map{"message": "Data Fetched", "data": data})
}
