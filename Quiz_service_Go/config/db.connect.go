package config

import (
	"fmt"
	"log"
	"os"
	"quiz_service/model"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDb() {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s",
		os.Getenv("DATABASE_HOST"),
		os.Getenv("DATABASE_USER"),
		os.Getenv("DATABASE_PASSWORD"),
		os.Getenv("DATABASE_DB_NAME"),
		os.Getenv("DATABASE_PORT"))
	var err error

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Error Creating Gorm")
	}
	fmt.Println("(Quiz Service) Postgress DB Connected At 5440")
	DB.AutoMigrate(
		&model.McqOptions{},
		&model.Mcqs{},
		&model.QuizAttempts{},
		&model.QuizScore{},
		&model.Quizes{},
	)
}
