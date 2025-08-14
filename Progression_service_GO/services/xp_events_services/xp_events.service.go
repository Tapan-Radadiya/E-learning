package xpeventsservices

import (
	"errors"
	"progression_service/config"
	"progression_service/model"
	"strings"

	"github.com/google/uuid"
)

type XPEventsServiceInterface interface {
	AddEventService(xpEventDetails *model.UserXpEvents) (*model.UserXpEvents, error)
	RemoveEventService(xpEventId uuid.UUID) (*model.UserXpEvents, error)
	UpdateEventService(newXpEventData *model.UserXpEvents, xpEventId uuid.UUID) (*model.UserXpEvents, error)
	GetEventDetailsService(xpEventId uuid.UUID) (*model.UserXpEvents, error)
	GetEventDetailsGrpc(xpEventName string) (*model.UserXpEvents, error)
}

type XpEventsService struct{}

func NewXpEventsService() XPEventsServiceInterface {
	return &XpEventsService{}
}

func (xpE *XpEventsService) AddEventService(xpEventData *model.UserXpEvents) (*model.UserXpEvents, error) {

	if strings.Contains(xpEventData.XpEvent, " ") {
		return nil, errors.New("xp events should not contains whiteSpaces")
	}

	userXpData := &model.UserXpEvents{
		XpEvent:  strings.ToUpper(xpEventData.XpEvent),
		XpPoints: xpEventData.XpPoints,
		ID:       uuid.New(),
	}

	if err := config.DB.Create(&userXpData).Error; err != nil {
		return nil, err
	}
	return userXpData, nil
}

func (xpE *XpEventsService) RemoveEventService(xpEventId uuid.UUID) (*model.UserXpEvents, error) {
	var xpEvent model.UserXpEvents

	if err := config.DB.Delete(&xpEvent, "id = ?", xpEventId).Error; err != nil {
		return nil, err
	}
	return &xpEvent, nil
}

func (xpE *XpEventsService) UpdateEventService(newXpEventData *model.UserXpEvents, xpEventId uuid.UUID) (*model.UserXpEvents, error) {
	var xpEvent model.UserXpEvents
	if err := config.DB.First(xpEvent, "id = ?", xpEventId).Error; err != nil {
		return nil, err
	}

	if strings.Contains(newXpEventData.XpEvent, " ") {
		return nil, errors.New("xp events should not contains whiteSpaces")
	}

	newXpData := &model.UserXpEvents{
		XpEvent:  strings.ToUpper(newXpEventData.XpEvent),
		XpPoints: newXpEventData.XpPoints,
	}

	if err := config.DB.Model(&xpEvent).Updates(newXpData).Error; err != nil {
		return nil, err
	}
	return newXpData, nil
}

func (xpE *XpEventsService) GetEventDetailsService(xpEventId uuid.UUID) (*model.UserXpEvents, error) {
	var xpEvent model.UserXpEvents

	if err := config.DB.First(&xpEvent, "id = ?", xpEventId).Error; err != nil {
		return nil, err
	}
	return &xpEvent, nil
}

func (xpE *XpEventsService) GetEventDetailsGrpc(xpEventName string) (*model.UserXpEvents, error) {
	var xpEvent model.UserXpEvents

	if err := config.DB.First(&xpEvent, "xp_event = ?", xpEventName).Error; err != nil {
		return nil, err
	}
	return &xpEvent, nil
}
