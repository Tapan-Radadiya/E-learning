package router

import (
	usertriggereventscontroller "progression_service/controller/userTriggerEvents_controller"
	usertriggereventsservices "progression_service/services/userTriggerEvents_services"

	"github.com/gofiber/fiber/v2"
)

func RegisterUserXpTriggerRouter(app fiber.Router) {
	service := usertriggereventsservices.NewUserTriggerService()
	userTriggerEvents := usertriggereventscontroller.NewUserTriggerEventsController(service)

	app.Post("/trigger-xp", userTriggerEvents.UserXpTrigger)

	app.Get("/leaderboard", userTriggerEvents.GetLeaderboardData)

	app.Get("/user-xp-data/:userId", userTriggerEvents.GetUserXp)

}
