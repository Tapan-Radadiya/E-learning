package mcqservice

import (
	"errors"
	"log"
	"quiz_service/config"
	"quiz_service/gRPC/client"
	"quiz_service/model"

	"github.com/google/uuid"
)

type McqServiceInterface interface {
	AddMcqService(mcqData *model.McqData) (*model.McqData, error)
	DeleteMcqService(mcqId uuid.UUID) (*model.Mcqs, error)
	UpdateMcqService(mcqId uuid.UUID, newMcqData model.McqData) (*model.Mcqs, error)
	GetMcqDetailsService(mcqId uuid.UUID) (*model.Mcqs, error)
	GetAllMcqsService(quizId uuid.UUID) (*[]model.Mcqs, error)
}

type McqService struct{}

func NewMcqService() McqServiceInterface {
	return &McqService{}
}

func (m *McqService) AddMcqService(mcqData *model.McqData) (*model.McqData, error) {

	data, err := client.GrpcClient.GetCourseDetails(mcqData.CourseId.String())
	if err != nil {
		return nil, errors.New("error fetching course data")
	}

	if data.Id == "" {
		return nil, errors.New("invalid course details")
	}

	optionsData := &mcqData.Options

	formatedMcqData := &model.Mcqs{
		CourseId: mcqData.CourseId,
		Question: mcqData.Question,
	}
	if err := config.DB.Create(&formatedMcqData).Error; err != nil {
		log.Fatal("Error Creating Mcq")
		return nil, err
	}
	for i := range *optionsData {
		(*optionsData)[i].MCQId = formatedMcqData.ID
	}

	if err := config.DB.Create(&optionsData).Error; err != nil {
		return nil, err
	}
	return nil, nil
}

func (m *McqService) DeleteMcqService(mcqId uuid.UUID) (*model.Mcqs, error) {
	var mcqData *model.Mcqs

	if err := config.DB.Delete(&mcqData, "id = ?", mcqId).Error; err != nil {
		log.Fatal("Error Deleting Mcq")
		return nil, err
	}
	return mcqData, nil
}

func (m *McqService) UpdateMcqService(mcqId uuid.UUID, newMcqData model.McqData) (*model.Mcqs, error) {
	// var quizData *model.Quizes

	// if err := config.DB.Find(&quizData, "id = ?", newMcqData.QuizId).Error; err != nil {
	// 	return nil, err
	// }

	// if quizData.Title == "" {
	// 	return nil, errors.New("no quiz found")
	// }

	var mcqData *model.Mcqs
	optionsData := &newMcqData.Options

	formatedMcqData := &model.Mcqs{
		CourseId: newMcqData.CourseId,
		Question: newMcqData.Question,
	}

	if err := config.DB.Find(&mcqData, "id = ?", mcqId).Error; err != nil {
		return nil, errors.New("unable to found mcqdata")
	}
	if err := config.DB.Model(&mcqData).Updates(formatedMcqData).Error; err != nil {
		return nil, errors.New("unable to update mcqdata")
	}

	for i := range *optionsData {
		(*optionsData)[i].MCQId = mcqData.ID
	}
	var deleteMcqOption *model.McqOptions
	config.DB.Delete(&deleteMcqOption, "mcq_id = ?", mcqId)
	if err := config.DB.Create(&optionsData).Error; err != nil {
		return nil, err
	}
	return mcqData, nil
}

func (m *McqService) GetMcqDetailsService(mcqId uuid.UUID) (*model.Mcqs, error) {
	var mcqData *model.Mcqs

	if err := config.DB.Preload("Options").First(&mcqData, "id = ?", mcqId).Error; err != nil {
		return nil, errors.New("unable to fetch mcq data")
	}
	return mcqData, nil
}

func (m *McqService) GetAllMcqsService(quizId uuid.UUID) (*[]model.Mcqs, error) {
	client.UserServiceGrpcClient.GetUserDetails("82868365-687d-4773-a64b-0033695b53dd")
	var mcqData *[]model.Mcqs
	// client.
	if err := config.DB.Preload("Options").First(&mcqData, "quiz_id = ?", quizId).Error; err != nil {
		return nil, errors.New("unable to fetch mcq data")
	}
	return mcqData, nil
}
