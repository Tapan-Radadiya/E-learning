import * as grpc from "@grpc/grpc-js"
import * as path from "path"
import * as protoLoader from "@grpc/proto-loader"
// We connect to difference grpc client
const TRIGGEREVENT_PROTO_PATH = path.join(__dirname, "../../proto_files/trigger_user_event.proto")


const triggerEventDefination = protoLoader.loadSync(TRIGGEREVENT_PROTO_PATH, {
    keepCase: true,         // <- This keeps `course_id` as it is -x> courseId
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})

const triggerProto = grpc.loadPackageDefinition(triggerEventDefination).TriggerXPEvent as any


const triggerXpClient = triggerProto.UserXpEventTriggerService(
    'localhost:50053',
    grpc.credentials.createInsecure()
)

const triggerUserXpEvent = async (xpEventData: { userId: string, xpEvent: string }) => {
    const data = await new Promise((res, rej) => {
        triggerXpClient.TriggerUserXPEvent(xpEventData, (err: any, response: any) => {
            if (err) {
                console.log('err->', err)
                rej()
            }
            res(response)
        })
    })
    return data
}
export { triggerUserXpEvent }