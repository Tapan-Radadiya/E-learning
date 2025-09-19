import http, { Server } from "http"
import { app } from "./app"
import { connectToDb, db } from "./config/index.config"
import { ConnectGrpc, DisconnectGrpc } from "./GrpcServices/server/enrollment_progress.grpc"
import { enablePrometheus } from "./config/enable.prometheys"

const PORT = process.env.PORT

const bootstrapHttp = async () => {
    const server = http.createServer(app)

    await connectToDb()
    await ConnectGrpc()
    enablePrometheus()
    server.listen(PORT, () => {
        console.log(`🚀 Server Ready With Port ${PORT} At http://localhost:${PORT}`);
    })

    process.on('SIGINT', () => shutDown(server))
    process.on('SIGTERM', () => shutDown(server))
}


const bootstrapHttps = async () => {
    // const server = https.createServer({},app)
}


const shutDown = (server: Server) => {
    db.close()
    console.log("Database ShutDown . . .")

    server.close()
    console.log("Server Shutdown . . .")

    DisconnectGrpc()
}

bootstrapHttp()