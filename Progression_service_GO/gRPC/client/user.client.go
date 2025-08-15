package client

import (
	"context"
	"fmt"
	"log"
	user "progression_service/gRPC"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type UserGrpcClient struct {
	client user.UserServiceClient
}

var GrpcClient = &UserGrpcClient{}

func NewGrpcClient(addr string) error {
	conn, err := grpc.NewClient(addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return err
	}

	c := user.NewUserServiceClient(conn)

	GrpcClient.client = c

	fmt.Printf("GRPC Client Connection Established At %v\n", addr)
	return nil
}

func (grpcClient *UserGrpcClient) GetUsersProfile(userIds []string) ([]*user.UserProfile, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	req := &user.GetUserDetailsRequest{UserId: userIds}

	res, err := grpcClient.client.GetUsersProfile(ctx, req)
	if err != nil {
		log.Fatal("GetUsersProfile Service", err)
	}
	return res.Profiles, nil
}
