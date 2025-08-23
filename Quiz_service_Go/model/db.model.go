package model

import (
	"time"

	"github.com/google/uuid"
)

type QuizAttempts struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primaryKey:column:id"`
	UserId    uuid.UUID `json:"userid" gorm:"type:uuid;column:userid"`
	QuizId    uuid.UUID `json:"quizid" gorm:"type:uuid;column:quizid"`
	Quiz      Quizes    `json:"quiz" gorm:"foreignKey:QuizId"`
	CreatedAt time.Time `json:"createdat" gorm:"column:createdat"`
	UpdatedAt time.Time `json:"updatedat" gorm:"autoUpdateTime:nano:column:updatedat"`
}

type QuizScore struct {
	ID            uuid.UUID    `json:"id" gorm:"type:uuid;default:uuid_generate_v4();primaryKey:column:id"`
	IsPassed      bool         `json:"is_passed" gorm:"column:is_passed"`
	Score         int          `json:"score" gorm:"column:score"`
	QuizAttemptId uuid.UUID    `json:"quiz_attempt_id" gorm:"type:uuid;column:quiz_attempt_id"`
	QuizAttempts  QuizAttempts `json:"quiz_attempts" gorm:"foreignKey:QuizAttemptId"`
	CreatedAt     time.Time    `json:"createdat" gorm:"column:createdat"`
	UpdatedAt     time.Time    `json:"updatedat" gorm:"autoUpdateTime:nano:column:updatedat"`
}

type Quizes struct {
	ID            uuid.UUID `json:"id" gorm:"type:uuid;default:uuid_generate_v4();primaryKey;column:id;constraint:OnDelete:CASCADE;"`
	Title         string    `json:"title" gorm:"column:title"`
	Description   string    `json:"description" gorm:"column:description"`
	CourseId      uuid.UUID `json:"course_id" gorm:"type:uuid;column:course_id"`
	TotalQuestion int       `json:"totalquestion" gorm:"column:totalquestions"`
	PassingMarks  int       `json:"passingmarks" gorm:"column:passingmarks"`
	CreatedAt     time.Time `json:"createdat" gorm:"column:createdat"`
	UpdatedAt     time.Time `json:"updatedat" gorm:"autoUpdateTime:nano:column:updatedat"`
}

type Mcqs struct {
	ID        uuid.UUID    `json:"id" gorm:"type:uuid;default:uuid_generate_v4();primaryKey:column:id;constraint:OnDelete:CASCADE;"`
	CourseId  uuid.UUID    `json:"course_id" gorm:"type:uuid;column:course_id"`
	Question  string       `json:"question" gorm:"column:question"`
	Options   []McqOptions `gorm:"foreignKey:MCQId"`
	CreatedAt time.Time    `json:"createdat" gorm:"column:createdat"`
	UpdatedAt time.Time    `json:"updatedat" gorm:"autoUpdateTime:nano:column:updatedat"`
}

type McqOptions struct {
	ID         uuid.UUID `json:"id" gorm:"type:uuid;default:uuid_generate_v4();primaryKey:column:id"`
	OptionText string    `json:"option" gorm:"column:option_text"`
	MCQId      uuid.UUID `json:"mcqid" gorm:"type:uuid;column:mcq_id"`
	Mcq        Mcqs      `json:"-" gorm:"foreignKey:MCQId;references:ID;constraint:OnDelete:CASCADE"`
	IsCorrect  bool      `json:"is_correct" gorm:"column:is_correct"`
	CreatedAt  time.Time `json:"createdat" gorm:"column:createdat"`
	UpdatedAt  time.Time `json:"updatedat" gorm:"autoUpdateTime:nano:column:updatedat"`
}

type McqData struct {
	Question string       `json:"question"`
	CourseId uuid.UUID    `json:"course_id"`
	Options  []McqOptions `json:"options"`
}

type McqOptionsBulk struct {
	OptionText string    `json:"option"`
	MCQId      uuid.UUID `json:"mcqid"`
	IsCorrect  bool      `json:"is_correct"`
}

type ExamQuizBody struct {
	QuizAnswer []ExamQuizAnswer `json:"quiz_answer"`
}
type ExamQuizAnswer struct {
	QuestionId string `json:"questionId"`
	AnswerId   string `json:"answerId"`
}
