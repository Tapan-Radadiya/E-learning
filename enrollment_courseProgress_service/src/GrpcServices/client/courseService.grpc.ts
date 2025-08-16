import * as path from "path"
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import { UUID } from "crypto"

const COURSEPROTOPATH = path.join(__dirname, '../../proto_files/course_service.proto')
const USERPROTOPATH = path.join(__dirname, '../../proto_files/user_service.proto')
const TRIGGEREVENT_PROTO_PATH = path.join(__dirname, "../../proto_files/trigger_user_event.proto")


const coursePackageDefination = protoLoader.loadSync(COURSEPROTOPATH, {
    keepCase: true,         // <- This keeps `course_id` as-is
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})

const userPackageDefination = protoLoader.loadSync(USERPROTOPATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
})

const triggerEventDefination = protoLoader.loadSync(TRIGGEREVENT_PROTO_PATH, {
    keepCase: true,         // <- This keeps `course_id` as-is
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})


const courseProto = grpc.loadPackageDefinition(coursePackageDefination).Course as any
const userProto = grpc.loadPackageDefinition(userPackageDefination).User as any
const triggerProto = grpc.loadPackageDefinition(triggerEventDefination).TriggerXPEvent as any

const courseClient = new courseProto.CourseService(
    'localhost:50051',
    grpc.credentials.createInsecure()
)
const userClient = new userProto.UserService(
    'localhost:50052',
    grpc.credentials.createInsecure()
)
const triggerXpClient = new triggerProto.UserXpEventTriggerService(
    'localhost:50053',
    grpc.credentials.createInsecure()
)

export interface CourseDataInterface {
    id: string,
    title: string,
    description: string,
    thumbnail_url: string,
    createdAt: string,
    updatedAt: string,
}
const getCourseDataGRPCService = async (courseId: string): Promise<CourseDataInterface | null> => {
    try {
        const data: { courseData: CourseDataInterface } = await new Promise((resolve, reject) => {
            courseClient.getCourseData({ course_id: courseId }, (err: any, response: any) => {
                if (err) {
                    reject()
                }
                resolve(response)
            })
        })
        if (data) {
            return data.courseData
        }
        return data
    } catch (error) {
        console.log('error->', error)
        return null
    }
}
interface UserGrpcDetailsInterface {
    id: string,
    display_name: string,
    email: string,
    user_role: string,
}
const getUsersDataGRPCService = async (userId: string[]): Promise<UserGrpcDetailsInterface[] | null> => {
    const data: { profiles: UserGrpcDetailsInterface[] } = await new Promise((resolve, reject) => {
        userClient.GetUsersProfile({ userId }, (err: any, response: any) => {
            if (err) {
                console.log('err->', err)
                reject()
            }
            resolve(response)
        })
    })
    if (data.profiles.length > 0) {
        return data.profiles
    }
    else {
        return null
    }
}

const getCourseModuleGRPCService = async (moduleId: string) => {
    const data = await new Promise((resolve, reject) => {
        courseClient.GetCourseModuleData({ module_id: moduleId }, (err: any, response: any) => {
            if (err) {
                console.log('err->', err)
                reject()
            }
            resolve(response)
        })
    })
    return data
}

const triggerUserXpEvent = async (xpEventData: { userId: string, xpEvent: string }): Promise<{ userId: string, xp_point: number } | null> => {
    const data: { userId: string, xp_point: number } | null = await new Promise((res, rej) => {
        triggerXpClient.TriggerUserXPEvent(xpEventData, (err: any, response: any) => {
            if (err) {
                console.log('err->', err)
                rej(`${err.message} | User Enrolled Successfully`)
            }
            res(response)
        })
    })
    if (data && data.userId)
        return data
    else {
        return data
    }
}

const fetchUserXp = async (userId: string): Promise<{ xp_point: number, userId: string } | null> => {

    const data: { xp_point: number, userId: string } | null = await new Promise((res, rej) => {
        triggerXpClient.GetUserXp({ userId }, (err: any, response: any) => {
            if (err) {
                console.log('err->', err)
                rej()
            }
            res(response)
        })
    })
    // console.log('data->',data)
    if (data) {
        return data
    }
    else return null
}


const fetchXpEventData = async (xpEvent: string) => {
    const data: { xpEvent: string, xpPoints: number } | null = await new Promise((res, rej) => {
        triggerXpClient.GetEventXpPoints({ xpEvent }, (err: any, response: any) => {
            if (err) {
                console.log('err->', err)
                rej()
            }
            res(response)
        })
    })
    if (data) {
        return data
    }
    else return null
}
export {
    getCourseDataGRPCService,
    getUsersDataGRPCService,
    getCourseModuleGRPCService,
    triggerUserXpEvent,
    fetchUserXp,
    fetchXpEventData
}