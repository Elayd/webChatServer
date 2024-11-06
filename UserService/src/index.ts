import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import userRoute from './routes/user'

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

app.use('/api/user/', userRoute)

app.listen(process.env.PORT, () => {
    console.log(`RUNNING PORT ${process.env.PORT}`)
})
