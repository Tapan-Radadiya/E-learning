package awssqs

import (
	"AWS_Sns_Go/utils"
	"context"
	"crypto/tls"
	"errors"
	"fmt"
	"log"
	"net/smtp"
	"os"
	"strconv"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/sns"
	"github.com/aws/aws-sdk-go-v2/service/sqs"
	"gopkg.in/gomail.v2"
)

type SQSConfig struct {
	Cfg       aws.Config
	SqsClient *sqs.Client
	SnsClient *sns.Client
	SMTPAuth  *SMTPAuth
}

type SMTPAuth struct {
	Auth             smtp.Auth
	SmtpHost         string
	SmtpPort         int
	SmtpUserName     string
	SmtpUserPassword string
}

type EmailType string

const (
	USER_CREATION = "USER_CREATION"
)

type SQS_Message_Group_Id string

const (
	Email_Sending = "Email_Sending"
)

type EmailBody struct {
	To             string               `json:"to"`
	Body           string               `json:"body"`
	Subject        string               `json:"subject"`
	EmailType      EmailType            `json:"emailType"`
	MessageGroupId SQS_Message_Group_Id `json:"messageGroupId"`
}

func (s *SQSConfig) LoadAWSConfig() error {
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

	s.Cfg = cfg
	// SQS Client
	s.SqsClient = sqs.NewFromConfig(cfg)

	// Setting Smtp Auth Data
	smtpAuthData, err := LoadSMTPAuthConfig()
	if err != nil {
		return err
	}
	s.SMTPAuth = smtpAuthData
	return nil
}

func LoadSMTPAuthConfig() (*SMTPAuth, error) {

	smtPort, err := strconv.Atoi(os.Getenv("SMTP_PORT"))

	if err != nil {
		return nil, err
	}

	smtpHost := os.Getenv("SMTP_HOST")
	smtpUserName := os.Getenv("SMTP_USER")
	smtpUserPassword := os.Getenv("SMTP_PASS")

	if smtPort == 0 || smtpHost == "" || smtpUserName == "" || smtpUserPassword == "" {
		return nil, errors.New("invalid smtp details")
	}

	smtpAuth := &SMTPAuth{
		SmtpHost:         os.Getenv("SMTP_HOST"),
		SmtpPort:         smtPort,
		SmtpUserName:     os.Getenv("SMTP_USER"),
		SmtpUserPassword: os.Getenv("SMTP_PASS"),
	}

	smtpAuth.Auth = smtp.PlainAuth("", smtpAuth.SmtpUserName, smtpAuth.SmtpUserPassword, smtpAuth.SmtpHost)
	return smtpAuth, nil
}

func (s *SQSConfig) ReceiveSQSMsg() {
	fmt.Println("SQS Started. . . .")
	receiveMessageInput := &sqs.ReceiveMessageInput{
		QueueUrl:            aws.String(os.Getenv("AWS_QUEUE_URL")),
		WaitTimeSeconds:     20,
		MaxNumberOfMessages: 10,
	}
	for {
		data, err := s.SqsClient.ReceiveMessage(context.TODO(), receiveMessageInput)
		fmt.Println("data Received", len(data.Messages))

		if err != nil {
			log.Fatalf("failed to Receive message: %v", err)
		}
		if len(data.Messages) == 0 {
			fmt.Println("No messages, waiting...")
		}

		for _, msg := range data.Messages {
			var msgBody EmailBody
			utils.GetJsonUnmarshalData(*msg.Body, &msgBody)

			// jsonMarsheldData := utils.GetJsonMarshalData(*msg.Body)

			// fmt.Printf("Unmarsheling Data %+v", jsonMarsheldData)
			// Unmarshal JsonData

			// Sending Email To User

			s.SMTPAuth.SendEmail(msgBody.To, msgBody.Subject, msgBody.Body)

			// Delete Queue Message After Successfuly Read
			s.DeleteSqsMessage(*msg.ReceiptHandle)
		}

	}
}

func (s *SQSConfig) DeleteSqsMessage(msgReceipt string) {
	s.SqsClient.DeleteMessage(context.TODO(), &sqs.DeleteMessageInput{
		QueueUrl:      aws.String(os.Getenv("AWS_QUEUE_URL")),
		ReceiptHandle: &msgReceipt,
	})
}



func (a *SMTPAuth) SendEmail(toEmail string, subject string, body string) {
	fmt.Printf("Sending To :-> %s", toEmail)
	fmt.Printf("Subject Is :-> %s", subject)
	m := gomail.NewMessage()
	m.SetHeader("From", a.SmtpUserName)
	m.SetHeader("To", toEmail)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)

	d := gomail.NewDialer(a.SmtpHost, a.SmtpPort, a.SmtpUserName, a.SmtpUserPassword)
	d.TLSConfig = &tls.Config{InsecureSkipVerify: true}
	if err := d.DialAndSend(m); err != nil {
		fmt.Printf("Error Sending Email %+v\n", err)
	}
	fmt.Println("Email Sended ")
}
