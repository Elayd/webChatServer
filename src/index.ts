import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from './config'
import securityRoute from './routes/auth'
import oAuthRoute from './routes/oauth'

const app = express()

const corsConfig = {
    origin: true,
    credentials: true
}

app.use(cors(corsConfig))
app.options('*', cors(corsConfig))

mongoose
    .connect(config.MONGO_URI)
    .then(() => console.log('connected db'))
    .catch((error) => console.log(error))

app.use(express.json())

app.use(cookieParser())

console.log(config.ORIGIN)

app.use('/api/security/', securityRoute)

app.use('/api/oauth/', oAuthRoute)

app.listen(config.PORT, () => {
    console.log(`RUNNING PORT ${config.PORT}`)
})
