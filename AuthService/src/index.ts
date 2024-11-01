import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import securityRoute from './routes/auth'
import oAuthRoute from './routes/oauth'
import dotenv from 'dotenv'
import RedisClient from './helpers/redisClient'

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

export const redisClient = new RedisClient(process.env.REDIS_URL!)

app.use(express.json())

app.use(cookieParser())

app.use('/api/security/', securityRoute)

app.use('/api/oauth/', oAuthRoute)

app.listen(process.env.PORT, () => {
    console.log(`RUNNING PORT ${process.env.PORT}`)
})
