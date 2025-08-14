package grpcServer

import (
	"context"
	"fmt"
	"log"
	"net"
	pb "progression_service/gRPC/protoFile"
	"progression_service/model"
	usertriggereventsservices "progression_service/services/userTriggerEvents_services"
	xpeventsservices "progression_service/services/xp_events_services"

	"github.com/google/uuid"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

type GrpcServer struct {
	pb.UnimplementedUserXpEventTriggerServiceServer
}

func EstablishGrpcServer(grpcServerPort string) *grpc.Server {
	lis, err := net.Listen("tcp", grpcServerPort)

	if err != nil {
		log.Fatal("Error Connection With GRPC", err)
	}

	s := grpc.NewServer()

	reflection.Register(s)
	pb.RegisterUserXpEventTriggerServiceServer(s, &GrpcServer{})

	go func() {
		log.Printf("Grpc Server Listening On %v", lis.Addr())
		if err := s.Serve(lis); err != nil {
			log.Fatalf("Failed To Start Grpc Server: %v", err)
		}
	}()

	return s
}

func (gs *GrpcServer) TriggerUserXPEvent(ctx context.Context, in *pb.XpEventRequest) (*pb.XpEventResponse, error) {

	userId, err := uuid.Parse(in.UserId)
	if err != nil {
		fmt.Println("Error Parsing Userid")
		return nil, err
	}
	userXpData := &model.UserXpTrigger{
		UserId:  userId,
		XpEvent: in.XpEvent,
	}

	// if err != nil {
	// 	log.Fatal("Error Converting Xp To Int")
	// }

	service := usertriggereventsservices.NewUserTriggerService()

	data, err := service.UserXpTriggerService(userXpData)

	if err != nil {
		fmt.Println("Error Triggering UserXp (gRPC)")
	}
	returnData := &pb.XpEventResponse{
		XpPoint: int32(data.XPPoints),
		UserId:  data.UserId.String(),
	}
	return returnData, nil
}

func (gs *GrpcServer) GetUserXp(ctx context.Context, in *pb.FetchXpDataRequest) (*pb.FetchXpDataResponse, error) {
	userId, err := uuid.Parse(in.UserId)

	if err != nil {
		fmt.Println("Error Parsing Userid")
		return nil, err
	}
	service := usertriggereventsservices.NewUserTriggerService()

	data, err := service.GetUserXpService(userId)
	if err != nil {
		return nil, err
	}

	returnData := &pb.FetchXpDataResponse{
		XpPoint: int32(data.XPPoints),
		UserId:  data.ID.String(),
	}
	return returnData, nil
}

func (gs *GrpcServer) GetEventXpPoints(ctx context.Context, in *pb.FetchEventXpPointsRequest) (*pb.FetchEventXpPointsResponse, error) {
	service := xpeventsservices.NewXpEventsService()

	data, err := service.GetEventDetailsGrpc(in.XpEvent)

	if err != nil {
		return nil, err
	}
	returnData := &pb.FetchEventXpPointsResponse{
		XpEvent:  data.XpEvent,
		XpPoints: int32(data.XpPoints),
	}
	return returnData, nil
}
