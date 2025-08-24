import express from "express"
import { Request, Response } from "express"
import bodyParser from "body-parser"
import courseRouter from "../src/routes/course.route"
import courseModuleRouter from "../src/routes/course_module.route"
import "dotenv/config"
import cors from "cors"

const app = express()

app.use(cors({ origin: "*" }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.use('/course', courseRouter)

app.use('/course-module', courseModuleRouter)

app.use("*", (req: Request, res: Response) => {
    res.send("Invalid Route")
})

export default app