package utils

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/sqs"
	"github.com/google/uuid"
)

type EmailType string

const (
	USER_CREATION = "USER_CREATION"
)

type SQS_Message_Group_Id string

const (
	Email_Sending = "Email_Sending"
)

type SQSConfig struct {
	Cfg       aws.Config
	SqsClient *sqs.Client
}

var GLOBAL_SQS_CLIENT SQSConfig

type SQSEmailBody struct {
	Body      string
	EmailType      EmailType
	Subject   string
	To  string
	MessageGroupId SQS_Message_Group_Id
}

func LoadAWSConfig() error {
	awsRegions := os.Getenv("AWS_REGION")
	awsAccessKeyId := os.Getenv("AWS_ACCESS_KEY_ID")
	awsSecretAccessKey := os.Getenv("AWS_SECRET_ACCESS_KEY")

	if awsRegions == "" || awsAccessKeyId == "" || awsSecretAccessKey == "" {
		return errors.New("AWS Sqs Config Not Provided")
	}

	cfg, err := config.LoadDefaultConfig(
		context.TODO(),
		config.WithRegion(awsRegions),
		config.WithCredentialsProvider(
			credentials.NewStaticCredentialsProvider(
				awsAccessKeyId,
				awsSecretAccessKey,
				"",
			)))

	if err != nil {
		return err
	}

	GLOBAL_SQS_CLIENT.Cfg = cfg
	// SQS Client
	GLOBAL_SQS_CLIENT.SqsClient = sqs.NewFromConfig(cfg)

	return nil
}

func (s *SQSConfig) SendSQSMsg(emailData SQSEmailBody) {

	data, err := json.Marshal(emailData)

	if err != nil {
		fmt.Println("Error Marshaling Json")
	}

	sendMessageInput := &sqs.SendMessageInput{
		MessageBody:            aws.String(string(data)),
		QueueUrl:               aws.String(os.Getenv("AWS_QUEUE_URL")),
		MessageGroupId:         aws.String("Email_Sending"),
		MessageDeduplicationId: aws.String("dedup-" + uuid.NewString()),
	}

	// fmt.Printf("Data %+v", s.SqsClient)

	_, sqsErr := s.SqsClient.SendMessage(context.TODO(), sendMessageInput)

	if sqsErr != nil {
		log.Fatalf("failed to send message: %v", sqsErr)
	}
}
