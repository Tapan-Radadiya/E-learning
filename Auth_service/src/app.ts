import express from "express"
import { Request, Response } from "express"
import userRouter from "./routes/route.model"
import oAuthRouter from "./routes/route.auth"
import "dotenv/config"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import client from "prom-client"
import session from "express-session"
import passport from "passport"

const app = express()

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
    secret:'dsadsanjgfkhfjlashdfa',
    resave:false,
    saveUninitialized:false
}))

// app.use(passport.session())  

app.use('/user', userRouter)
app.use('/oauth',oAuthRouter)
app.get("/metrics", async (req, res) => {
    res.setHeader("Content-Type", client.register.contentType)
    const metrics = await client.register.metrics()
    res.send(metrics)
})

app.use("*", (req: Request, res: Response) => {
    res.send("Invalid Route")
})

export default app