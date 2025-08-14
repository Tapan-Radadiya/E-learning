package common

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
)

type JWTData struct {
	Email  string
	UserId string
	Role   string
}

func Response(c *fiber.Ctx, statusCode int, jsonData fiber.Map) error {
	return c.Status(statusCode).JSON(jsonData)
}

func DecodeJwtToken(jwtToken string) (*JWTData, bool) {
	var jwtKey = os.Getenv("JWT_ACCESS_TOKEN")
	var byteData = []byte(jwtKey)

	token, err := jwt.Parse(jwtToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			panic("Error Decoding")
		}
		return byteData, nil
	})

	if err != nil {
		fmt.Println("Error Fetching JWT", err)
		return nil, false
	}

	if cliams, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		jwtCliamData := &JWTData{
			Email:  cliams["email"].(string),
			UserId: cliams["id"].(string),
			Role:   cliams["role"].(string),
		}
		return jwtCliamData, true
	} else {
		fmt.Println("Error Cliaming Token")
	}
	return nil, false
}

func GetJsonMarshalData(data any) string {
	marsheledData, err := json.Marshal(data)
	if err != nil {
		log.Fatal("Error Marsheling Json")
	}
	return string(marsheledData)
}
