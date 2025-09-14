package testcases

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"progression_service/model"
	"testing"

	"github.com/google/uuid"
	"github.com/joho/godotenv"
)

var testXpEventId uuid.UUID

func TestCreateXpEvent(t *testing.T) {
	godotenv.Load("../.env")
	var xpEventData = &model.UserXpEvents{
		XpEvent:  "TEST",
		XpPoints: 100,
	}
	payload, _ := json.Marshal(xpEventData)
	req, _ := http.NewRequest(http.MethodPost, "http://localhost:8080/service4/xpevents/create-event", bytes.NewBuffer(payload))
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", os.Getenv("REFRESH_TOKEN_FOR_TESTCASES")))
	req.Header.Set("Content-Type", "application/json")
	createXpEventRes := callApi(req, t, 201)
	var xpEventDataStruct = &struct {
		Data model.UserXpEvents
	}{}
	if err := json.Unmarshal(createXpEventRes, &xpEventDataStruct); err != nil {
		t.Fatalf("Unmarshaling Data")
	}
	testXpEventId = xpEventDataStruct.Data.ID
}

func TestCreateXpEventWithExistEventName(t *testing.T) {
	godotenv.Load("../.env")
	var xpEventData = &model.UserXpEvents{
		XpEvent:  "TEST",
		XpPoints: 100,
	}
	payload, _ := json.Marshal(xpEventData)
	req, _ := http.NewRequest(http.MethodPost, "http://localhost:8080/service4/xpevents/create-event", bytes.NewBuffer(payload))
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", os.Getenv("REFRESH_TOKEN_FOR_TESTCASES")))
	req.Header.Set("Content-Type", "application/json")
	callApi(req, t, 409)
}

func TestCreateXpEventWithUserRole(t *testing.T) {
	godotenv.Load("../.env")
	var xpEventData = &model.UserXpEvents{
		XpEvent:  "TEST",
		XpPoints: 100,
	}
	payload, _ := json.Marshal(xpEventData)
	req, _ := http.NewRequest(http.MethodPost, "http://localhost:8080/service4/xpevents/create-event", bytes.NewBuffer(payload))
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", os.Getenv("REFRESH_TOKEN_FOR_TESTCASES_USER")))
	req.Header.Set("Content-Type", "application/json")
	callApi(req, t, 401)

}
func TestGetXpData(t *testing.T) {
	godotenv.Load("../.env")

	req, _ := http.NewRequest(http.MethodGet, fmt.Sprintf(`http://localhost:8080/service4/xpevents/%s`, testXpEventId), nil)

	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", os.Getenv("REFRESH_TOKEN_FOR_TESTCASES")))
	callApi(req, t, 200)
}

func TestTriggerXpEvent(t *testing.T) {
	godotenv.Load("../.env")
	var xpEventData = &model.UserXpTrigger{
		XpEvent: "TEST",
	}
	payload, _ := json.Marshal(xpEventData)
	req, _ := http.NewRequest(http.MethodPost, "http://localhost:8080/service4/user-xp-events/trigger-xp", bytes.NewBuffer(payload))
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", os.Getenv("REFRESH_TOKEN_FOR_TESTCASES")))
	req.Header.Set("Content-Type", "application/json")
	callApi(req, t, 200)
}

func TestDeleteXpEvent(t *testing.T) {
	godotenv.Load("../.env")

	req, _ := http.NewRequest(http.MethodDelete, fmt.Sprintf(`http://localhost:8080/service4/xpevents/%s`, testXpEventId), nil)
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", os.Getenv("REFRESH_TOKEN_FOR_TESTCASES")))

	callApi(req, t, 200)
}

func TestGetUserXpData(t *testing.T) {
	godotenv.Load("../.env")

	req, _ := http.NewRequest(http.MethodDelete, `http://localhost:8080/service4//user-xp-events/user-xp-data`, nil)
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", os.Getenv("REFRESH_TOKEN_FOR_TESTCASES")))

	callApi(req, t, 200)
}
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
