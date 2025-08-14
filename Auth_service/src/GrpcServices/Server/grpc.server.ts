import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import * as path from "path"
import { getUserProfilesGrpcService } from "../../services/index.service"

const grpcServer = new grpc.Server()

const PROTOPATH = path.join(__dirname, "../../proto_files/UserService.proto")

const packageDefination = protoLoader.loadSync(PROTOPATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
})

const userProto = grpc.loadPackageDefinition(packageDefination).User as any


const userServiceImpl = {
    GetUsersProfile: async (
        call: grpc.ServerUnaryCall<any, any>,
        callback: grpc.sendUnaryData<any>
    ) => {
        try {

            const userIds = call.request.userId
            if (!Array.isArray(userIds)) {
                callback({
                    message: "Invalid Argument",
                    name: "Error",
                    code: grpc.status.INVALID_ARGUMENT
                })
            }

            const { data, statusCode } = await getUserProfilesGrpcService(userIds)
            if (statusCode === 200 && data.length !== 0) {
                callback(null, { profiles: data })
            } else {
                callback({
                    message: "Error Fetching Data",
                    name: "Error"
                })
            }
        } catch (error) {
            callback({
                message: "Error Fetching UsersProfile",
                name: "Error",
                code: grpc.status.INTERNAL
            })
        }
    }
}

export const connectToGrpc = () => {
    grpcServer.addService(userProto.UserService.service, userServiceImpl)
    grpcServer.bindAsync("0.0.0.0:50052", grpc.ServerCredentials.createInsecure(), (err) => {
        if (err) {
            console.log("AuthService/ Error Connecting With GRPC", err)
        }

        console.log("AuthService/ Grpc Server Connect At PORT 50052")
    })
}

export const disconnectToGrpc = () => {
    grpcServer.tryShutdown((err) => {
        if (err) {
            console.log("Error Shutting Down", err)
        }
        console.log("Grpc Server Shuted Down . . .")
    })
}