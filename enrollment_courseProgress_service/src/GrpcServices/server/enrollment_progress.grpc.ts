import * as path from "path"
import * as protoLoader from "@grpc/proto-loader"
import * as grpc from "@grpc/grpc-js"
import { getCourseProgressData } from "../../services/course_progress.service"
const COURSEPROTOPATH = path.join(__dirname, '../../proto_files/course_progress.proto')

const enrollmentPackagedDefination = protoLoader.loadSync(COURSEPROTOPATH, {
    keepCase: true,         // <- This keeps `course_id` as it is
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})


const enrollmentProto = grpc.loadPackageDefinition(enrollmentPackagedDefination).CourseProgress as any

const enrollmentServiceImpl = {
    GetCourseProgress: async (
        call: grpc.ServerUnaryCall<any, any>,
        callback: grpc.sendUnaryData<any>
    ) => {
        console.log('courseId-->', call.request);
        const courseId = call.request.courseId
        const userId = call.request.userId
        if (!courseId || !userId) {
            callback({
                code: grpc.status.INVALID_ARGUMENT,
                message: "CourseId Or UserId Missing"
            })
        }

        const data = await getCourseProgressData(courseId, userId)
        if (data.statusCode === 200) {
            const courseProgressData = {
                id: data.data.id,
                progress_percent: data.data.progress_percent,
                is_completed: data.data.is_completed,
            }

            callback(null, { courseProgressData })
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                message: "Unable to find user progress data"
            })
        }
    }
}

export const grpcService = new grpc.Server()

export const ConnectGrpc = () => {
    grpcService.addService(enrollmentProto.CourseProgressService.service, enrollmentServiceImpl)
    grpcService.bindAsync("0.0.0.0:50054", grpc.ServerCredentials.createInsecure(), (err, _) => {
        if (err) {
            console.log('error->', err)
        }
        console.log("Enrollment_Progress/ Grpc Server Listening On Port 50054")
    })
}
export const DisconnectGrpc = () => {
    grpcService.tryShutdown(() => {
        console.log("Grpc Server ShutDown Successfully")
    })
}