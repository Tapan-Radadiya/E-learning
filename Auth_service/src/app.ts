import express from "express"
import { Request, Response } from "express"
import userRouter from "./routes/route.model"
import "dotenv/config"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import client from "prom-client"
const app = express()


app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/user', userRouter)

app.get("/metrics", async (req, res) => {
    res.setHeader("Content-Type", client.register.contentType)
    const metrics = await client.register.metrics()
    res.send(metrics)
})

app.use("*", (req: Request, res: Response) => {
    res.send("Invalid Route")
})

export default app