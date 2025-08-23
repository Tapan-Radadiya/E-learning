import { connectDB, db } from "./config/connectDb"
import app from "./app"
import http, { Server } from "http"
import "dotenv/config"
import { detectDeletedKeys, initRedisClient } from "./config/connectRedis.config"
import { connectGrpc, grpcServer } from "./grpcServices/server/course.grpc"

const PORT = process.env.PORT || 8080

async function BootStrap() {
    await initRedisClient()
    await detectDeletedKeys()
    await connectDB()
    await connectGrpc()
    const httpServer = http.createServer(app)

    httpServer.listen(PORT, () => {
        console.log(`🚀 Server Ready With Port ${PORT} At http://localhost:${PORT}`);
    })

    process.on('SIGINT', () => shutDown(httpServer))
    process.on('SIGTERM', () => shutDown(httpServer))

}

const shutDown = async (server: Server) => {
    server.close()
    console.log("Server Shut Down . . .")

    grpcServer.tryShutdown(() => {
        console.log("Grpc Server Shut Down . . .")
    })

    await db.close()
    console.log("Database Shut Down . . .")
}

BootStrap()