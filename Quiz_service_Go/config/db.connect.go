package config

import (
	"fmt"
	"log"
	"quiz_service/model"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDb() {
	dsn := "host=localhost user=QuickSilverDB password=QuickSilverDB dbname=quick_silver_db port=5437"
	var err error

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Error Creating Gorm")
	}
	fmt.Println("(Quiz Service) Postgress DB Connected At 5437")
	DB.AutoMigrate(
		&model.McqOptions{},
		&model.Mcqs{},
		&model.QuizAttempts{},
		&model.QuizScore{},
		&model.Quizes{},
	)
}
