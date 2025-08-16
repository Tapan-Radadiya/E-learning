package client

import (
	"context"
	"errors"
	"fmt"
	"log"
	"quiz_service/gRPC/gRPC_Code/CourseProgress"
	user "quiz_service/gRPC/gRPC_Code/UserData"
	XpEvent "quiz_service/gRPC/gRPC_Code/UserXpEvents"
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

type UserXpEventClient struct {
	client XpEvent.UserXpEventTriggerServiceClient
}

var GrpcClient = &CourseServiceClient{}
var CourseProgressGrpcClient = &CourseProgressClient{}
var UserServiceGrpcClient = &UserServiceClient{}
var XpEventGrpcClient = &UserXpEventClient{}

func InitAllGrpcClient() {
	// Course Service Client
	err := NewCourseServiceClient("localhost:50051")
	if err != nil {
		log.Fatal("Error Connecting With Grpc Client", err)
	}

	// User Service Client
	userServiceGrpcErr := NewUserServiceGrpcClient("localhost:50052")
	if userServiceGrpcErr != nil {
		log.Fatal("Error Connecting With Grpc Client(UserService Progress)", err)
	}

	// XpEvent Service Client
	xpEventServiceErr := NewXpEventGrpcClient("localhost:50053")
	if xpEventServiceErr != nil {
		log.Fatal("Error Connecting With Grpc Client(UserService Progress)", err)
	}

	// Course Progress Client
	courseProgressGrpcErr := NewCourseProgressGrpcClient("localhost:50054")
	if courseProgressGrpcErr != nil {
		log.Fatal("Error Connecting With Grpc Client(Course Progress)", err)
	}

}

func NewCourseServiceClient(port string) error {
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

	c := user.NewUserServiceClient(conn)
	UserServiceGrpcClient.client = c
	fmt.Printf("Grpc Client Connected Successfully %v\n", port)
	return nil
}

func NewXpEventGrpcClient(port string) error {
	conn, err := grpc.NewClient(port, grpc.WithTransportCredentials(insecure.NewCredentials()))

	if err != nil {
		log.Fatal("Error Creating gRPC Client")
		return err
	}

	c := XpEvent.NewUserXpEventTriggerServiceClient(conn)
	XpEventGrpcClient.client = c
	fmt.Printf("Grpc Client Connected Successfully %v\n", port)
	return nil
}

// TODO Make Comman Func For Getting Context(ctx)
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

	req := &CourseProgress.CourseProgressRequest{UserId: userId.String(), CourseId: courseId.String()}
	res, err := grpcC.client.GetCourseProgress(ctx, req)
	if err != nil {
		fmt.Printf("(gRPC) Eroor Fetching Course Progress Data %v", err)
		return nil, err
	}
	return res.CourseProgressData, nil
}

func (grpcU *UserServiceClient) GetUserDetails(userId string) (*user.GetUserDetailsResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	req := &user.GetUserDetailsRequest{UserId: []string{userId}}

	res, err := grpcU.client.GetUsersProfile(ctx, req)
	if err != nil {
		log.Fatal("(gRPC) Eroor Fetching User Details")
		return nil, err
	}
	return res, nil
}

func (grpcX *UserXpEventClient) GetUserXp(userId string) (*XpEvent.FetchXpDataResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()
	req := &XpEvent.FetchXpDataRequest{UserId: userId}

	res, err := grpcX.client.GetUserXp(ctx, req)
	if err != nil {
		fmt.Println("(gRPC) Eroor Fetching User XpData")
		return nil, err
	}
	return res, nil
}

func (grpcX *UserXpEventClient) GetEventXpData(xpEvent string) (*XpEvent.FetchEventXpPointsResponse, error) {
	if xpEvent == "" {
		return nil, errors.New("empty xpEvent")
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()
	req := &XpEvent.FetchEventXpPointsRequest{XpEvent: xpEvent}

	res, err := grpcX.client.GetEventXpPoints(ctx, req)
	if err != nil {
		fmt.Println("(gRPC) Eroor Fetching User XpData")
		return nil, err
	}
	return res, nil
}

func (grpcX *UserXpEventClient) TriggerXpEvent(xpEvent string, userId string) (*XpEvent.XpEventResponse, error) {
	if xpEvent == "" || userId == "" {
		return nil, errors.New("empty xpEvent Or UserId")
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()
	req := &XpEvent.XpEventRequest{XpEvent: xpEvent, UserId: userId}

	res, err := grpcX.client.TriggerUserXPEvent(ctx, req)
	if err != nil {
		fmt.Println("(gRPC) Eroor Fetching User XpData")
		return nil, err
	}
	return res, nil
}

func (grpcX *UserXpEventClient) GetUserXpEventClient() *XpEvent.UserXpEventTriggerServiceClient {
	return &grpcX.client
}
