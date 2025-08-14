package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"progression_service/config"
	"progression_service/gRPC/client"
	grpcServer "progression_service/gRPC/server"
	"progression_service/middleware"
	"progression_service/router"
	"syscall"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	config.ConnectDB()

	// Xp Event Create Group

	app := fiber.New()
	app.Use(middleware.AuthincateUser)
	app.Use(cors.New())

	appStopSign := make(chan os.Signal, 1)
	signal.Notify(appStopSign, os.Interrupt, syscall.SIGTERM)

	// Establish GRPC Server
	grpcServerInstance := grpcServer.EstablishGrpcServer("localhost:50053")

	// Establish GRPC Client
	err := client.NewGrpcClient("localhost:50052")

	if err != nil {
		log.Fatal("Error Crafting Connection With gRPC At 50052")
	}

	userXpEvents := app.Group("/user-xp-events")
	xpEventRouteGroup := app.Group("/xpevents")

	router.RegisterXpEventRouter(xpEventRouteGroup)
	router.RegisterUserXpTriggerRouter(userXpEvents)

	app.All("*", func(c *fiber.Ctx) error {
		return c.SendString("Ahh! invalid Route")
	})
	log.Fatal(app.Listen(":3003"))

	<-appStopSign
	fmt.Println("Shutting Down Grpc Server")
	grpcServerInstance.GracefulStop()

	fmt.Println("Shutting Down Application Server")
	app.Shutdown()
}
