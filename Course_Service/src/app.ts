import express from "express"
import { Request, Response } from "express"
import bodyParser from "body-parser"
import courseRouter from "../src/routes/course.route"
import courseModuleRouter from "../src/routes/course_module.route"
import "dotenv/config"
import cors from "cors"
import { HLS_DIR_PATH } from "./constants"
import client from "prom-client"
const app = express()



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/stream-data", cors({
    origin: "http://localhost:4000",
    credentials: true,
    exposedHeaders: ["Content-Range", "Accept-Ranges"],
}), express.static(HLS_DIR_PATH))

app.use('/metrics', async (req, res) => {
    res.setHeader("Content-Type", client.register.contentType)
    const metrics = await client.register.metrics()
    res.send(metrics)
})

app.use('/course', courseRouter)

app.use('/course-module', courseModuleRouter)

app.use("*", (req: Request, res: Response) => {
    res.send("Invalid Route")
})

export default app