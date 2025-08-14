import express from "express"
import { Request, Response } from "express"
import userRouter from "./routes/route.model"
import "dotenv/config"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
const app = express()


app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/user', userRouter)

app.use("*", (req: Request, res: Response) => {
    res.send("Invalid Route")
})

export default app