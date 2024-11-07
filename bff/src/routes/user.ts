import express from 'express'
import { getUserInfoController } from '../controllers/UserService/getUserInfoController'
import { protectedRoute } from '../middlewares/auth'

const userRoute = express.Router()

userRoute.get('/getUserInfo', protectedRoute, getUserInfoController)

export default userRoute
