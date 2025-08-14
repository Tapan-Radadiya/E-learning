package usertriggereventsservices

import (
	"errors"
	"fmt"
	"log"
	ssehub "progression_service/SSEHub"
	"progression_service/common"
	"progression_service/config"
	user "progression_service/gRPC"
	"progression_service/gRPC/client"
	"progression_service/model"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserTriggerEventInterface interface {
	UserXpTriggerService(userXpTriggerData *model.UserXpTrigger) (*model.UserXp, error)
	GetUserXpService(userId uuid.UUID) (*model.UserXp, error)
	GetLeaderBoardService() ([]UserXpLeaderBoardData, error)
}

type UserTriggerEventService struct{}

// Constructor Function
func NewUserTriggerService() UserTriggerEventInterface {
	return &UserTriggerEventService{}
}

type UserXpLeaderBoardData struct {
	UserId      uuid.UUID
	DisplayName string
	Email       string
	XpPoints    int64
}

func (ute *UserTriggerEventService) UserXpTriggerService(userXpTriggerData *model.UserXpTrigger) (*model.UserXp, error) {
	var eventDetails model.UserXpEvents

	if err := config.DB.First(&eventDetails, "xp_event = ?", userXpTriggerData.XpEvent).Error; err != nil {
		return nil, err
	}

	var userXpData model.UserXp

	if err := config.DB.First(&userXpData, "userid = ?", userXpTriggerData.UserId).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			userXpData.ID = uuid.New() // Creating A New User As This Is User's First Achievement
			userXpData.UserId = userXpTriggerData.UserId
			config.DB.Create(&userXpData)
		} else {
			return nil, err
		}
	}

	userXpData.XPPoints = userXpData.XPPoints + int64(eventDetails.XpPoints)

	if err := config.DB.Model(&userXpData).Updates(userXpData).Error; err != nil {
		return nil, err
	}

	// Send SSE event
	leaderBoardData, err := ute.GetLeaderBoardService()
	if err != nil {
		fmt.Println("Error Updating New Leaderboard", err)
	}
	curLeaderboardData := common.GetJsonMarshalData(leaderBoardData)

	ssehub.Hub.Notifier <- curLeaderboardData
	return &userXpData, nil
}

func (ute *UserTriggerEventService) GetUserXpService(userId uuid.UUID) (*model.UserXp, error) {
	var userData model.UserXp

	if err := config.DB.First(&userData, "userid = ?", userId).Error; err != nil {
		return nil, err
	}
	return &userData, nil
}

func (ute *UserTriggerEventService) GetLeaderBoardService() ([]UserXpLeaderBoardData, error) {
	// fmt.Println("client", client.GrpcClient)
	var userXpLeaderBoard []model.UserXp
	var userIds []string

	if err := config.DB.Order("xp_points desc").Find(&userXpLeaderBoard).Error; err != nil {
		return nil, err
	}

	for _, val := range userXpLeaderBoard {
		userIds = append(userIds, val.UserId.String())
	}
	// GRPC Call
	userProfiles, err := client.GrpcClient.GetUsersProfile(userIds)

	if err != nil {
		log.Fatal(err)
	}
	var userLeaderBoardData []UserXpLeaderBoardData

	profileMap := make(map[string]*user.UserProfile)

	for _, val := range userProfiles {
		profileMap[val.Id] = val
	}

	for _, val := range userXpLeaderBoard {
		var currentUser UserXpLeaderBoardData

		if profile, ok := profileMap[val.UserId.String()]; ok {
			currentUser.DisplayName = profile.DisplayName
			currentUser.Email = profile.Email
			currentUser.UserId = val.UserId
			currentUser.XpPoints = val.XPPoints
			userLeaderBoardData = append(userLeaderBoardData, currentUser)
		}
	}

	return userLeaderBoardData, nil
}
