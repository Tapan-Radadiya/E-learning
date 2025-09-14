package router

import (
	"progression_service/constants"
	xpeventcontroller "progression_service/controller/xpEventController"
	"progression_service/middleware"
	xpeventsservices "progression_service/services/xp_events_services"

	"github.com/gofiber/fiber/v2"
)

func RegisterXpEventRouter(app fiber.Router) {
	service := xpeventsservices.NewXpEventsService()
	xpEventService := xpeventcontroller.NewXpEventController(service)

	app.Get("/:eventId", xpEventService.GetEventDetail)

	app.Post("/create-event", middleware.AuthorizeUser([]constants.USERROLES{constants.ADMIN}), xpEventService.AddEvent)

	app.Put("/update-event/:eventId", middleware.AuthorizeUser([]constants.USERROLES{constants.ADMIN}), xpEventService.UpdateEvent)

	app.Delete("/:eventId", middleware.AuthorizeUser([]constants.USERROLES{constants.ADMIN}), xpEventService.RemoveEvent)
}
