package quizattemptservice

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"quiz_service/common"
	"quiz_service/config"
	emailtemplate "quiz_service/emailTemplate"
	"quiz_service/gRPC/client"
	"quiz_service/model"
	"quiz_service/utils"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type QuizAttemptServiceInterface interface {
	StartQuizService(quizId uuid.UUID, userId uuid.UUID) (*[]model.Mcqs, error)
	SubmitQuizService(quizAnswers *model.ExamQuizBody, quizId uuid.UUID, userId uuid.UUID) (*model.QuizScore, error)
	GetQuizResultsService()
}

type QuizAttemptService struct{}

func NewQuizAttemptService() QuizAttemptServiceInterface {
	return &QuizAttemptService{}
}

type grpcCourseData struct {
	Id               string
	Progress_percent int
	Is_completed     bool
}

func (q *QuizAttemptService) StartQuizService(quizId uuid.UUID, userId uuid.UUID) (*[]model.Mcqs, error) {
	var quizData model.Quizes
	var isQuizAttemptExists model.QuizAttempts
	var isThisQuizIsPending model.QuizScore

	if err := config.DB.First(&quizData, "id = ?", quizId).Error; err != nil {
		return nil, errors.New("error fetching quiz data")
	}

	// Finding Last Quiz and checking is user has complted or not
	err := config.DB.Order("createdat desc").First(&isQuizAttemptExists, "quizId = ? and userId = ?", quizId, userId).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		// if not record in Quiz_attempt then user is first time
		// Do Nothing
	} else {
		// if Record Found then checking that is quizscore record exists with this quizattemptid
		// if not exists then user has not completed the quiz
		pendingQuizErr := config.DB.First(&isThisQuizIsPending, "quiz_attempt_id = ?", isQuizAttemptExists.ID).Error
		if errors.Is(pendingQuizErr, gorm.ErrRecordNotFound) {
			return nil, errors.New("please complete pending quiz then after you can start new")
		}
	}

	userCourseProgress, err := client.CourseProgressGrpcClient.GetCourseProgress(quizData.CourseId, userId)
	if err != nil {
		return nil, errors.New("error fetching course progress (gRPC)")
	}
	data := string(common.GetJsonMarshalData(userCourseProgress))

	var userProgress grpcCourseData

	unmarshalerr := json.Unmarshal([]byte(data), &userProgress)

	if unmarshalerr != nil {
		// return nil, unmarshalerr
		return nil, errors.New("error unmarshaling json")
	}

	if !userProgress.Is_completed {
		// User Has Not Completed Course
		return nil, errors.New("user has not completed course ")
	}

	var mcqsData *[]model.Mcqs

	if err := config.DB.Preload("Options").Order("RANDOM()").Limit(quizData.TotalQuestion).Find(&mcqsData, "course_id = ?", quizData.CourseId).Error; err != nil {
		return nil, err
	}
	quizAttempt := &model.QuizAttempts{
		ID:     uuid.New(),
		UserId: userId,
		QuizId: quizId,
	}

	if err := config.DB.Create(&quizAttempt).Error; err != nil {
		return nil, errors.New("error creating quizattempt")
	}
	return mcqsData, nil
}

func (q *QuizAttemptService) SubmitQuizService(quizAnswers *model.ExamQuizBody, quizId uuid.UUID, userId uuid.UUID) (*model.QuizScore, error) {
	var quizData model.Quizes
	var userQuizAttempt model.QuizAttempts

	var correctAnswer int

	// Fetching QuizData
	if err := config.DB.First(&quizData, "id = ?", quizId).Error; err != nil {
		return nil, errors.New("error fetching quiz data")
	}

	// Is user has started quiz or not
	if err := config.DB.First(&userQuizAttempt, "quizId = ? and userId = ?", quizId, userId).Error; err != nil {
		return nil, errors.New("user has not started quiz yet")
	}

	marksPerQue := 100 / quizData.TotalQuestion
	fmt.Printf("Data %+v", quizAnswers)
	// Evaluating right answers
	for _, val := range quizAnswers.QuizAnswer {
		var mcqOptions *model.McqOptions
		if err := config.DB.First(&mcqOptions, "id = ?", val.AnswerId).Error; err != nil {
			return nil, errors.New("invalid mcq found try again")
		}
		if mcqOptions.IsCorrect {
			correctAnswer += 1
		}
	}

	usersScore := marksPerQue * correctAnswer

	// Storing user quiz score
	usersScoreRecord := model.QuizScore{
		ID:            uuid.New(),
		Score:         usersScore,
		QuizAttemptId: userQuizAttempt.ID,
	}

	if usersScore > quizData.PassingMarks {
		usersScoreRecord.IsPassed = true
		if err := config.DB.Create(&usersScoreRecord).Error; err != nil {
			return nil, errors.New("error storing mcq marks try after sometime")
		}

	} else {
		usersScoreRecord.IsPassed = false
		if err := config.DB.Create(&usersScoreRecord).Error; err != nil {
			return nil, errors.New("error storing mcq marks try after sometime")
		}
	}

	return &usersScoreRecord, nil
}

func AddSqsMsg(userScore *model.QuizScore, courseId string) {
	courseData, err := client.GrpcClient.GetCourseDetails(courseId)

	if err != nil {
		fmt.Println("Error Fetching Course Data Through gRPC")
	}

	emailTemplatebody := emailtemplate.UserPassEmailTemplateStruct{
		UserDisplayName:   "",
		CourseTitle:       courseData.Title,
		CourseDescription: courseData.Description,
		ThumbnailURL:      fmt.Sprintf("%s%s", os.Getenv("AWS_CLOUD_FRONT_URL"), courseData.ThumbnailUrl),
		QuizScore:         userScore.Score,
		IsPassed:          userScore.IsPassed,
		EarnedXP:          0,
		TotalXP:           0,
	}

	var sqsSendMsg utils.SQSConfig

	sqsEmailBody := &utils.SQSEmailBody{
		EmailBody: emailtemplate.UserPassEmailTemplate(&emailTemplatebody),
	}

	sqsSendMsg.SendSQSMsg(*sqsEmailBody)
}

func (q *QuizAttemptService) GetQuizResultsService() {

}
