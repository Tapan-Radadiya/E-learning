package router

import (
	usertriggereventscontroller "progression_service/controller/userTriggerEvents_controller"
	"progression_service/middleware"
	usertriggereventsservices "progression_service/services/userTriggerEvents_services"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func RegisterUserXpTriggerRouter(app fiber.Router) {
	service := usertriggereventsservices.NewUserTriggerService()
	userTriggerEvents := usertriggereventscontroller.NewUserTriggerEventsController(service)

	app.Post("/trigger-xp", middleware.AuthincateUser, userTriggerEvents.UserXpTrigger)

	app.Get("/leaderboard", cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET",
	}), userTriggerEvents.GetLeaderboardData)

	app.Get("/user-xp-data", middleware.AuthincateUser, userTriggerEvents.GetUserXp)

}
