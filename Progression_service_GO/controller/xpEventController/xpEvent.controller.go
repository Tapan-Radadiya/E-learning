package xpeventcontroller

import (
	"progression_service/common"
	"progression_service/model"
	xpeventsservices "progression_service/services/xp_events_services"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type XpEventController struct {
	XpEventService xpeventsservices.XPEventsServiceInterface
}

func NewXpEventController(service xpeventsservices.XPEventsServiceInterface) *XpEventController {
	return &XpEventController{XpEventService: service}
}

func (xpEvent *XpEventController) AddEvent(c *fiber.Ctx) error {
	var xpData model.UserXpEvents

	if err := c.BodyParser(&xpData); err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Invalid Body"})
	}

	insertedData, err := xpEvent.XpEventService.AddEventService(&xpData)
	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Invalid Body", "error": err})
	}
	return common.Response(c, fiber.StatusCreated, fiber.Map{"message": "Event Created", "data": insertedData})
}

func (xpEvent *XpEventController) RemoveEvent(c *fiber.Ctx) error {

	eventId, err := uuid.Parse(c.Params("eventId"))
	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Invalid EventId"})
	}

	removedEvent, err := xpEvent.XpEventService.RemoveEventService(eventId)

	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Error Removing XpEvent"})
	}

	return common.Response(c, fiber.StatusOK, fiber.Map{"message": "Event Removed", "data": removedEvent})
}

func (xpEvent *XpEventController) UpdateEvent(c *fiber.Ctx) error {
	eventId, err := uuid.Parse(c.Params("eventId"))
	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Invalid EventId"})
	}

	var newXpEvent model.UserXpEvents

	if err := c.BodyParser(&newXpEvent); err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Error Reading body"})
	}

	updatedEvent, err := xpEvent.XpEventService.UpdateEventService(&newXpEvent, eventId)
	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Error Updating Event"})
	}

	return common.Response(c, fiber.StatusOK, fiber.Map{"message": "Event Updated", "data": updatedEvent})
}

func (xpEvent *XpEventController) GetEventDetail(c *fiber.Ctx) error {
	eventId, err := uuid.Parse(c.Params("eventId"))
	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Invalid EventId"})
	}

	eventDetails, err := xpEvent.XpEventService.GetEventDetailsService(eventId)

	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Error Fetching Data"})
	}

	return common.Response(c, fiber.StatusOK, fiber.Map{"message": "Data fetched", "data": eventDetails})
}
