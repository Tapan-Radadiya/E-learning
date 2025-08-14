package usertriggereventscontroller

import (
	"bufio"
	"fmt"
	"log"
	ssehub "progression_service/SSEHub"
	"progression_service/common"
	"progression_service/model"
	usertriggereventsservices "progression_service/services/userTriggerEvents_services"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/valyala/fasthttp"
)

type UserTriggerEventsController struct {
	userTriggerService usertriggereventsservices.UserTriggerEventInterface
}

// type Server struct {
// 	broker *ssehub.Broker
// }

func NewUserTriggerEventsController(service usertriggereventsservices.UserTriggerEventInterface) *UserTriggerEventsController {
	return &UserTriggerEventsController{userTriggerService: service}
}

func (ut *UserTriggerEventsController) UserXpTrigger(c *fiber.Ctx) error {
	var userXpdata model.UserXpTrigger

	if err := c.BodyParser(&userXpdata); err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Invalid Data In Body"})
	}

	updatedUserXp, err := ut.userTriggerService.UserXpTriggerService(&userXpdata)

	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Error Updating Xp Data"})
	}

	return common.Response(c, fiber.StatusOK, fiber.Map{"message": "Data fetched", "data": updatedUserXp})
}

func (ut *UserTriggerEventsController) GetUserXp(c *fiber.Ctx) error {
	userId, err := uuid.Parse(c.Params("userId"))
	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Invalid UserId"})
	}

	userXpData, err := ut.userTriggerService.GetUserXpService(userId)
	if err != nil {
		return common.Response(c, fiber.StatusConflict, fiber.Map{"message": "Error Fetching Data"})
	}
	return common.Response(c, fiber.StatusOK, fiber.Map{"message": "UserXp Data Fetched", "data": userXpData})
}

func (ut *UserTriggerEventsController) GetLeaderboardData(c *fiber.Ctx) error {

	c.Set("Content-Type", "text/event-stream")
	c.Set("Cache-Control", "no-cache")
	c.Set("Connection", "keep-alive")

	clientChanel := make(chan []byte)

	ssehub.Hub.NewClients <- clientChanel

	// CleanUp Func
	go func() {
		fmt.Println("Cleanup functions triggered")
		<-c.Context().Done()
		ssehub.Hub.CloseClient <- clientChanel
		// close(clientChanel)
	}()

	leaderBoardData, err := ut.userTriggerService.GetLeaderBoardService()

	if err != nil {
		log.Fatal("Err", err)
	}

	// SSE Events
	c.Context().SetBodyStreamWriter(fasthttp.StreamWriter(func(w *bufio.Writer) {
		// Initial Data
		curLeaderboardData := common.GetJsonMarshalData(leaderBoardData)
		if err != nil {
			log.Println("Error Marshaling")
			return
		}
		_, err = w.WriteString("data: " + string(curLeaderboardData) + "\n\n")
		if err != nil {
			log.Println("Error", err)
		}

		if err := w.Flush(); err != nil {
			log.Println("Flush error:", err)
			return
		}

		// Continue Listening The Event
		for {
			if ssehub.Hub == nil {
				log.Println("SSE Hub not initialized!")
				return
			}

			msg, ok := <-clientChanel
			if !ok {
				log.Println("Client channel closed")
				return
			}

			_, err = w.WriteString("data: " + string(msg) + "\n\n")
			if err != nil {
				log.Println("Error", err)
			}
			if err := w.Flush(); err != nil {
				log.Println("Flush error:", err)
				return
			}
		}
	}))
	return nil
	// return common.Response(c, fiber.StatusOK, fiber.Map{"message": "Data Fetched", "data": leaderBoardData})
}
