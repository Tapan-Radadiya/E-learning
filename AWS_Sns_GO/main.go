package main

import (
	awssqs "AWS_Sns_Go/AWS_Sqs"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load()

	if err != nil {
		log.Fatalf("Error Loading ENV File")
	}

	app := fiber.New()
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	// Loading SQS Config
	var sqsCfg awssqs.SQSConfig
	awsErr := sqsCfg.LoadAWSConfig()
	if awsErr != nil {
		log.Fatal("Error Loading AWS Config", awsErr)
	}
	// sqsCfg.SendSQSMsg()

	time.Sleep(2 * time.Second)
	go sqsCfg.ReceiveSQSMsg()

	log.Fatal(app.Listen(":3005"))

}
