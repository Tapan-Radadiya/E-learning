package router

import (
	xpeventcontroller "progression_service/controller/xpEventController"
	xpeventsservices "progression_service/services/xp_events_services"

	"github.com/gofiber/fiber/v2"
)

func RegisterXpEventRouter(app fiber.Router) {
	service := xpeventsservices.NewXpEventsService()
	xpEventService := xpeventcontroller.NewXpEventController(service)

	app.Get("/:eventId", xpEventService.GetEventDetail)

	app.Post("/create-event", xpEventService.AddEvent)

	app.Put("/update-event/:eventId", xpEventService.UpdateEvent)

	app.Delete("/:eventId", xpEventService.RemoveEvent)
}
