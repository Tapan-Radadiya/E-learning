import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import * as path from "path"
import { getCourseDetails } from "../../services/course.service"
import { getModuleDetailsService } from "../../services/course_module.service"

const PROTO_PATH = path.join(__dirname, '../../proto_files/Course_service.proto')

const packageDefination = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,         // <- This keeps `course_id` as it is
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})

const courseProto = grpc.loadPackageDefinition(packageDefination).Course as any

const courseServiceImpl = {
    getCourseData: async (
        call: grpc.ServerUnaryCall<any, any>,
        callback: grpc.sendUnaryData<any>
    ) => {

        try {
            const courseId = call.request.course_id
            if (courseId) {
                const { data, statusCode } = await getCourseDetails(courseId)
                if (statusCode === 200) {
                    callback(null, { courseData: data })
                }
            } else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: 'Please Provide Course ID'
                })
            }
        } catch (error) {
            callback({
                code: grpc.status.INTERNAL,
                message: 'Internal Server Error'
            })
        }

    },
    GetCourseModuleData: async (
        call: grpc.ServerUnaryCall<any, any>,
        callback: grpc.sendUnaryData<any>
    ) => {
        try {
            const moduleId = call.request.module_id
            if (moduleId) {
                const { data, statusCode } = await getModuleDetailsService(moduleId)
                if (statusCode === 200) {
                    callback(null, data)
                } else {
                    callback({
                        message: "Data Not Found",
                        name: "Error"
                    })
                }
            }
            else {
                callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    message: "Please Provide ModuleId"
                })
            }
        } catch (error) {
            callback({
                code: grpc.status.INTERNAL,
                message: 'Internal Server Error'
            })
        }
    }
}


export const grpcServer = new grpc.Server()
export const connectGrpc = async () => {
    grpcServer.addService(courseProto.CourseService.service, courseServiceImpl)
    grpcServer.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, _) => {
        if (err) {
            console.log('error->', err)
        }
        console.log("CourseService/ Grpc Server Listening On Port 50051")
    })
}

