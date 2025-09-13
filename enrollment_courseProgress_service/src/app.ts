import express from "express"
import { Request, Response } from "express"
import enrollRouter from "./routes/enrollment.model"
import courseProgressRouter from "./routes/course_progress.model"
import client from "prom-client"
import "dotenv/config"

export const app = express()


app.get('/metrics', async (req, res) => {
    res.setHeader("Content-Type", client.register.contentType)
    const metrics = await client.register.metrics()
    res.send(metrics)
})

app.use('/enroll', enrollRouter)
app.use('/course-progress', courseProgressRouter)



app.use("*", (req: Request, res: Response) => {
    res.send("Invalid Route")
})