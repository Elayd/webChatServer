import './sentry'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import authRoute from './routes/auth'
import { handler } from './helpers/errorHandler'
import { Response, Request, NextFunction } from 'express'
import userRoute from './routes/user'

dotenv.config()

const app = express()

const corsConfig = {
    origin: true,
    credentials: true
}

app.use(cors(corsConfig))
app.options('*', cors(corsConfig))

app.use(express.json())

app.use(cookieParser())

app.use(`/api/v${process.env.API_VERSION}/auth`, authRoute)
app.use(`/api/v${process.env.API_VERSION}/user`, userRoute)

app.use(async (err: Error, req: Request, res: Response, _: NextFunction) => {
    await handler.handleError(err, res)
})

app.listen(process.env.PORT, () => {
    console.log(`RUNNING PORT ${process.env.PORT}`)
})
