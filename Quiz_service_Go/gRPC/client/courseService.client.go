package client

import (
	"context"
	"fmt"
	"log"
	"quiz_service/gRPC/gRPC_Code/CourseProgress"
	user "quiz_service/gRPC/gRPC_Code/UserData"
	CourseDetails "quiz_service/gRPC/protoFiles"
	"time"

	"github.com/google/uuid"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type CourseServiceClient struct {
	client CourseDetails.CourseServiceClient
}

type CourseProgressClient struct {
	client CourseProgress.CourseProgressServiceClient
}

type UserServiceClient struct {
	client user.UserServiceClient
}

var GrpcClient = &CourseServiceClient{}
var CourseProgressGrpcClient = &CourseProgressClient{}
var UserServiceGrpcClient = &UserServiceClient{}

func NewGrpcClient(port string) error {
	conn, err := grpc.NewClient(port, grpc.WithTransportCredentials(insecure.NewCredentials()))

	if err != nil {
		log.Fatal("Error Creating gRPC Client")
		return err
	}

	c := CourseDetails.NewCourseServiceClient(conn)

	GrpcClient.client = c
	fmt.Printf("Grpc Client Connected Successfully %v\n", port)
	return nil
}

func NewCourseProgressGrpcClient(port string) error {
	conn, err := grpc.NewClient(port, grpc.WithTransportCredentials(insecure.NewCredentials()))

	if err != nil {
		log.Fatal("Error Creating gRPC Client")
		return err
	}

	c := CourseProgress.NewCourseProgressServiceClient(conn)
	CourseProgressGrpcClient.client = c
	fmt.Printf("Grpc Client Connected Successfully %v\n", port)
	return nil
}

func NewUserServiceGrpcClient(port string) error {
	conn, err := grpc.NewClient(port, grpc.WithTransportCredentials(insecure.NewCredentials()))

	if err != nil {
		log.Fatal("Error Creating gRPC Client")
		return err
	}

	c := CourseProgress.NewCourseProgressServiceClient(conn)
	CourseProgressGrpcClient.client = c
	fmt.Printf("Grpc Client Connected Successfully %v\n", port)
	return nil
}

func (grpcClient *CourseServiceClient) GetCourseDetails(courseId string) (*CourseDetails.CourseDetails, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	req := &CourseDetails.CourseDataRequest{CourseId: courseId}

	res, err := grpcClient.client.GetCourseData(ctx, req)
	if err != nil {
		log.Fatal("(gRPC) Error Fetching CourseData")
		return nil, err
	}
	return res.CourseData, nil
}

func (grpcC *CourseProgressClient) GetCourseProgress(courseId uuid.UUID, userId uuid.UUID) (*CourseProgress.CourseProgression, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	fmt.Printf("Course Id %v", courseId)
	fmt.Printf("Course Id %v", userId)
	req := &CourseProgress.CourseProgressRequest{UserId: userId.String(), CourseId: courseId.String()}
	res, err := grpcC.client.GetCourseProgress(ctx, req)
	if err != nil {
		fmt.Printf("(gRPC) Eroor Fetching Course Progress Data %v", err)
		return nil, err
	}
	return res.CourseProgressData, nil
}

func (grpcU *UserServiceClient) GetUserDetails(userId string) (*user.GetUserDetailsResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	req := &user.GetUserDetailsRequest{UserId: []string{userId}}

	res, err := grpcU.client.GetUsersProfile(ctx, req)
	if err != nil {
		log.Fatal("(gRPC) Eroor Fetching User Details")
		return nil, err
	}
	fmt.Printf("Data %v", res)
	return res, nil
}
