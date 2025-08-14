package quizsevice

import (
	"errors"
	"fmt"
	"log"
	"quiz_service/config"
	"quiz_service/gRPC/client"
	"quiz_service/model"

	"github.com/google/uuid"
)

type QuizServiceInterface interface {
	GetQuizService(quizId string) (*[]model.Quizes, error)
	DeleteQuizService(quizId uuid.UUID) (*model.Quizes, error)
	AddQuizService(quizBody *model.Quizes) (*model.Quizes, error)
	UpdateQuizService(quizId uuid.UUID, updatedQuizData *model.Quizes) (*model.Quizes, error)
	GetUserQuizData(userId uuid.UUID) (*[]QuizAttemptWithDetails, error)
}

type QuizService struct{}

func NewQuizService() QuizServiceInterface {
	return &QuizService{}
}

func (q *QuizService) GetQuizService(quizId string) (*[]model.Quizes, error) {
	var quizData []model.Quizes

	if quizId == "all" {
		if err := config.DB.Find(&quizData).Error; err != nil {
			return nil, err
		} else {
			return &quizData, nil
		}
	} else {
		uuidQuiz, err := uuid.Parse(quizId)
		if err != nil {
			return nil, err
		}
		if err := config.DB.First(&quizData, "id = ?", uuidQuiz).Error; err != nil {
			return nil, err
		}
		return &quizData, nil
	}
}

func (q *QuizService) DeleteQuizService(quizId uuid.UUID) (*model.Quizes, error) {
	var quizData *model.Quizes

	if err := config.DB.Delete(&quizData, "id = ?", quizId).Error; err != nil {
		return nil, err
	}
	return quizData, nil
}

func (q *QuizService) AddQuizService(quizBody *model.Quizes) (*model.Quizes, error) {

	courseData, err := client.GrpcClient.GetCourseDetails(quizBody.CourseId.String())
	if err != nil {
		log.Fatal(err)
	}
	if courseData.Id != quizBody.CourseId.String() {
		log.Fatal("Mismatch Of CourseId")
	}

	var totalQue int64

	if err := config.DB.Model(&model.Mcqs{}).Where("course_id = ?", quizBody.CourseId).Count(&totalQue).Error; err != nil {
		return nil, err
	}
	if int64(quizBody.TotalQuestion) > totalQue {
		return nil, errors.New("not enough que to create quiz")
	}
	if err := config.DB.Create(&quizBody).Error; err != nil {
		return nil, err
	}
	return quizBody, nil
}

func (q *QuizService) UpdateQuizService(quizId uuid.UUID, updatedQuizData *model.Quizes) (*model.Quizes, error) {
	var quizData *model.Quizes

	if err := config.DB.First(&quizData, "id = ?", quizId).Error; err != nil {
		return nil, err
	}

	if err := config.DB.Model(&quizData).Updates(updatedQuizData).Error; err != nil {
		return nil, err
	}

	if err := config.DB.First(&quizData, "id = ?", quizId).Error; err != nil {
		return nil, err
	}
	return quizData, nil
}

type QuizAttemptWithDetails struct {
	QuizAttemptID uuid.UUID `gorm:"column:quiz_attempt_id"`
	UserId        uuid.UUID `gorm:"column:userid"`
	QuizId        uuid.UUID `gorm:"column:quizid"`
	QuizTitle     string    `gorm:"column:title"`
	Score         int       `gorm:"column:score"`
	IsPassed      bool      `gorm:"column:is_passed"`
}

func (q *QuizService) GetUserQuizData(userId uuid.UUID) (*[]QuizAttemptWithDetails, error) {
	var results *[]QuizAttemptWithDetails
	err := config.DB.Table("quiz_attempts").
		Joins("LEFT JOIN quizes ON quiz_attempts.quizId = quizes.id").
		Joins("LEFT JOIN quiz_scores ON quiz_scores.quiz_attempt_id = quiz_attempts.id").
		Select(`quiz_attempts.id as quiz_attempt_id,
		 		quiz_attempts.userid as userid,
		  		quiz_attempts.quizid as quizid,
		   		quizes.title as title,
		    	quiz_scores.score as score,
			 	quiz_scores.is_passed as is_passed`).
		Scan(&results).Error
	if err != nil {
		fmt.Println("err", err)
		return nil, errors.New("error fetching quiz attempts")
	}
	fmt.Printf("data %+v", results)
	return results,nil
}
