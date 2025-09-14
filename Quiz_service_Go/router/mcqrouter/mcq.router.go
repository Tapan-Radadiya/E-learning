package mcqrouter

import (
	"quiz_service/constants"
	mcqcontroller "quiz_service/controller/mcqController"
	"quiz_service/middleware"
	mcqservice "quiz_service/services/mcqService"

	"github.com/gofiber/fiber/v2"
)

func RegisterMcqRouter(app fiber.Router) {
	service := mcqservice.NewMcqService()

	mcqService := mcqcontroller.NewMcqService(service)

	app.Post("/:courseId", middleware.AuthorizeUser([]constants.USERROLES{constants.ADMIN}), mcqService.AddMcq)
	app.Delete("/:mcqId", middleware.AuthorizeUser([]constants.USERROLES{constants.ADMIN}), mcqService.DeleteMcq)
	app.Put("/:mcqId", middleware.AuthorizeUser([]constants.USERROLES{constants.ADMIN}), mcqService.UpdateMcq)
	app.Get("/:mcqId", middleware.AuthorizeUser([]constants.USERROLES{constants.ADMIN}), mcqService.GetMcqDetails)
	app.Get("/get-all-mcqs/:quizId", middleware.AuthorizeUser([]constants.USERROLES{constants.ADMIN}), mcqService.GetAllMcqs)
}
