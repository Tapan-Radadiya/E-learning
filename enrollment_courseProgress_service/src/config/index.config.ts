import { Sequelize } from "sequelize"
import "dotenv/config"
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import * as path from "path"

export const db = new Sequelize(process.env.POSTGRESS_CONN_URL!, {
    dialect: 'postgres',
    logging: false
})


export const connectToDb = async () => {
    try {
        await db.authenticate()
        console.log('Enrollment/CourseProgress: Connected to database')
    } catch (error) {
        console.error('Error connecting to database:', error)
    }
}

const PROTOPATH = path.join(__dirname, '../proto_files/course_service.proto')

const packageDefination = protoLoader.loadSync(PROTOPATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
})
const courseProto = grpc.loadPackageDefinition(packageDefination).Course as any


export const coursServiceClient = new courseProto.CourseService(
    'localhost:50051',
    grpc.credentials.createInsecure()
)