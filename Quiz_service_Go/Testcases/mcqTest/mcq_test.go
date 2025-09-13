package mcqtest

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"quiz_service/model"
	"testing"

	"github.com/google/uuid"
)

var tempMCq uuid.UUID

type createMcq struct {
	Question string      `json:"question"`
	Options  []mcqOption `json:"options"`
}

type mcqOption struct {
	Option    string `json:"option"`
	IsCorrect bool   `json:"isCorrect"`
}

func TestCreateMcq(t *testing.T) {

	payload := createMcq{
		Question: "Which statement about method overloading and overriding is true?",
		Options: []mcqOption{
			{
				Option:    "Method overloading occurs when two methods have the same name but different parameter lists in the same class.",
				IsCorrect: true,
			},
			{
				Option:    "Method overriding requires methods to have different return types.",
				IsCorrect: false,
			},
			{
				Option:    "Overloaded methods must be in different classes.",
				IsCorrect: false,
			},
			{
				Option:    "Overridden methods cannot call the superclass version of the method.",
				IsCorrect: false,
			},
		},
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest(http.MethodPost, "http://localhost:8080/service5/mcq/77f7527d-a0e3-4a48-af3e-98f6b85f5fc7", bytes.NewBuffer(body))

	req.Header.Add("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJhZGFkaXlhdGFwYW45MEBnbWFpbC5jb20iLCJpZCI6Ijk2MjQwN2QxLThhODUtNGFhYi1hYzViLWFkNDQyMmUxNWYzYiIsInJvbGUiOiJBRE1JTiIsIm1mYSI6dHJ1ZSwiaWF0IjoxNzU3ODAyODI3LCJleHAiOjE3NTc4MDM3Mjd9.rHefrgNBLvuLF_DQVZO_LhpQvg1S3kmFds_lAI4pkD4")

	data := callApi(req, t, 201)

	var mcqCreateData model.Mcqs

	if err := json.Unmarshal(data, &mcqCreateData); err != nil {
		t.Fatalf("Failed to unmarshal response: %v", err)
	}
	tempMCq = mcqCreateData.ID
}

func TestDeleteMCQ(t *testing.T) {
	fmt.Print("tempMCq", tempMCq)
	req, _ := http.NewRequest(http.MethodDelete, fmt.Sprintf("http://localhost:8080/service5/mcq/%s", tempMCq), nil)
	req.Header.Add("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJhZGFkaXlhdGFwYW45MEBnbWFpbC5jb20iLCJpZCI6Ijk2MjQwN2QxLThhODUtNGFhYi1hYzViLWFkNDQyMmUxNWYzYiIsInJvbGUiOiJBRE1JTiIsIm1mYSI6dHJ1ZSwiaWF0IjoxNzU3ODAyODI3LCJleHAiOjE3NTc4MDM3Mjd9.rHefrgNBLvuLF_DQVZO_LhpQvg1S3kmFds_lAI4pkD4")
	callApi(req, t, 200)
}

func callApi(req *http.Request, t *testing.T, expectedStatus int) []byte {
	client := http.Client{}

	res, err := client.Do(req)

	if err != nil {
		t.Errorf("Error Exectuting Api")
	}
	fmt.Print("res.Body", res.Body)
	defer res.Body.Close()
	if res.StatusCode != expectedStatus {
		t.Errorf("Expected Code %d but Got %d", expectedStatus, res.StatusCode)
	}

	body, _ := io.ReadAll(res.Body)
	return body
}
