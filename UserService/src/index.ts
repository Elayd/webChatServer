import './sentry'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import serverSideUser from './routes/serverSideUser'
import clientSideUser from './routes/clientSideUser'
import { handler } from './helpers/errorHandler'
import { Response, Request, NextFunction } from 'express'

dotenv.config()

const app = express()

const corsConfig = {
    origin: true,
    credentials: true
}

app.use(cors(corsConfig))
app.options('*', cors(corsConfig))

mongoose
    .connect(process.env.MONGODB_URI!)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err))

app.use(express.json())

app.use(cookieParser())

// закрою из вне
app.use('/api/serverside/user/', serverSideUser)

app.use('/api/user/', clientSideUser)

app.use(async (err: Error, req: Request, res: Response, _: NextFunction) => {
    await handler.handleError(err, res)
})

app.listen(process.env.PORT, () => {
    console.log(`RUNNING PORT ${process.env.PORT}`)
})
