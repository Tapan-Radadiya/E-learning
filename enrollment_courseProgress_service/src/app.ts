import express from "express"
import { Request, Response } from "express"
import enrollRouter from "./routes/enrollment.model"
import courseProgressRouter from "./routes/course_progress.model"
import "dotenv/config"

export const app = express()

app.use('/enroll', enrollRouter)
app.use('/course-progress',courseProgressRouter)

app.use("*", (req: Request, res: Response) => {
    res.send("Invalid Route")
})