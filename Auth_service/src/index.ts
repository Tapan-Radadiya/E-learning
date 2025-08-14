import { connectDb, db } from "./config/connectDb"
import app from "./app"
import "dotenv/config"
import http, { Server } from "http"
import { connectToGrpc, disconnectToGrpc } from "./GrpcServices/Server/grpc.server"

const PORT = process.env.PORT || 8080

const bootstrap = async () => {
    await connectDb()
    await connectToGrpc()
    const httpServer = http.createServer(app)
    httpServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
    process.on('SIGINT', () => shutDown(httpServer));
    process.on('SIGTERM', () => shutDown(httpServer));
}

const shutDown = async (server: Server) => {
    server.close()
    console.log("Http Server Closed . . .")

    await disconnectToGrpc()

    await db.close()
    console.log("Db Connection Closed . . .")
}
bootstrap()