import express from 'express'
import { getUserByEmailController } from '../controllers/getUserByEmailController'
import { createUserController } from '../controllers/createUserController'
const userRoute = express.Router()

userRoute.post('/getUserByEmail', getUserByEmailController)
userRoute.post('/createUser', createUserController)

export default userRoute
