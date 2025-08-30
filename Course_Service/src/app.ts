import express from "express"
import { Request, Response } from "express"
import bodyParser from "body-parser"
import courseRouter from "../src/routes/course.route"
import courseModuleRouter from "../src/routes/course_module.route"
import "dotenv/config"
import cors from "cors"
import * as path from "path"
import * as fs from "fs"
const app = express()

app.use(cors({ origin: "*" }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const HLS_DIR_PATH = path.join(__dirname, "../uploads/HLS_DIR")
app.use("/stream-data", express.static(HLS_DIR_PATH))


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*") // watch it
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next()
})

app.use('/course', courseRouter)

app.use('/course-module', courseModuleRouter)

app.use("*", (req: Request, res: Response) => {
    res.send("Invalid Route")
})

export default app