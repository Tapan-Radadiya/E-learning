package mcqtest

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"quiz_service/model"
	"testing"

	"github.com/google/uuid"
	"github.com/joho/godotenv"
)

var tempMcqId uuid.UUID
var tempQuizId uuid.UUID

// MCQ Related
func TestCreateMcq(t *testing.T) {
	godotenv.Load("../../.env")

	payload := model.McqData{
		Question: "Which statement about method overloading and overriding is true?",
		Options: []model.McqOptions{
			{
				OptionText: "Method overloading occurs when two methods have the same name but different parameter lists in the same class.",
				IsCorrect:  true,
			},
			{
				OptionText: "Method overriding requires methods to have different return types.",
				IsCorrect:  false,
			},
			{
				OptionText: "Overloaded methods must be in different classes.",
				IsCorrect:  false,
			},
			{
				OptionText: "Overridden methods cannot call the superclass version of the method.",
				IsCorrect:  false,
			},
		},
	}

	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPost, "http://localhost:8080/service5/mcq/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7", bytes.NewBuffer(body))
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", os.Getenv("REFRESH_TOKEN_FOR_TESTCASES")))
	req.Header.Set("Content-Type", "application/json")
	data := callApi(req, t, 201)

	var mcqCreateData = &struct {
		Data model.Mcqs
	}{}

	if err := json.Unmarshal(data, &mcqCreateData); err != nil {
		t.Fatalf("Failed to unmarshal response: %+v", err)
	}
	tempMcqId = mcqCreateData.Data.ID
}

func TestGetMcqData(t *testing.T) {
	godotenv.Load("../../.env")
	req, _ := http.NewRequest(http.MethodGet, fmt.Sprintf("http://localhost:8080/service5/mcq/%s", tempMcqId), nil)

	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", os.Getenv("REFRESH_TOKEN_FOR_TESTCASES")))
	callApi(req, t, 200)
}

// Quiz Start

func TestCreateQuiz(t *testing.T) {
	godotenv.Load("../../.env")
	courseId, _ := uuid.Parse("77f7527d-a0e3-4a48-af3e-98f6b85f5fc7")
	var data = &model.Quizes{
		Title:         "Java Quiz",
		Description:   "Java Quiz Java QuizJava QuizJava QuizJava QuizJava QuizJava QuizJava Quiz",
		CourseId:      courseId,
		TotalQuestion: 1,
		PassingMarks:  100,
	}
	payload, _ := json.Marshal(data)

	req, _ := http.NewRequest(http.MethodPost, "http://localhost:8080/service5/quiz/add", bytes.NewBuffer(payload))
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", os.Getenv("REFRESH_TOKEN_FOR_TESTCASES")))
	req.Header.Set("Content-Type", "application/json")

	var quizData = &struct {
		Data model.Quizes
	}{}

	res := callApi(req, t, 201)

	if err := json.Unmarshal(res, quizData); err != nil {
		t.Fatalf("Error Unmarshaling Json")
	}
	tempQuizId = quizData.Data.ID
}

func TestDeleteQuiz(t *testing.T) {
	godotenv.Load("../../.env")
	req, _ := http.NewRequest(http.MethodDelete, fmt.Sprintf("http://localhost:8080/service5/quiz/%s", tempQuizId), nil)

	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", os.Getenv("REFRESH_TOKEN_FOR_TESTCASES")))
	callApi(req, t, 200)
}

// Quiz End

func TestDeleteMCQ(t *testing.T) {
	godotenv.Load("../../.env")
	req, _ := http.NewRequest(http.MethodDelete, fmt.Sprintf("http://localhost:8080/service5/mcq/%s", tempMcqId), nil)

	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", os.Getenv("REFRESH_TOKEN_FOR_TESTCASES")))
	callApi(req, t, 200)
}

// MCQ Related

func callApi(req *http.Request, t *testing.T, expectedStatus int) []byte {
	client := http.Client{}

	res, err := client.Do(req)

	if err != nil {
		t.Errorf("Error Exectuting Api")
	}

	if res.StatusCode != expectedStatus {
		t.Errorf("Expected Code %d but Got %d", expectedStatus, res.StatusCode)
	}
	body, _ := io.ReadAll(res.Body)
	defer res.Body.Close()
	return body
}
