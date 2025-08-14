package mcqrouter

import (
	mcqcontroller "quiz_service/controller/mcqController"
	mcqservice "quiz_service/services/mcqService"

	"github.com/gofiber/fiber/v2"
)

func RegisterMcqRouter(app fiber.Router) {
	service := mcqservice.NewMcqService()

	mcqService := mcqcontroller.NewMcqService(service)

	app.Post("/:courseId", mcqService.AddMcq)
	app.Delete("/:mcqId", mcqService.DeleteMcq)
	app.Put("/:mcqId", mcqService.UpdateMcq)
	app.Get("/:mcqId", mcqService.GetMcqDetails)
	app.Get("/get-all-mcqs/:quizId", mcqService.GetAllMcqs)
}
