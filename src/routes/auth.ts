import express from 'express'
import { authController } from '../controllers/authController'
import { refreshController } from '../controllers/refreshController'
import { registration } from '../controllers/regController'
import { checkAuthController } from '../controllers/checkAuthController'
import { protectedRoute } from '../middlewares/auth'

const securityRoute = express.Router()

securityRoute.post('/auth', authController)
securityRoute.post('/registration', registration)
securityRoute.post('/refresh', refreshController)

securityRoute.post('/checkAuth', protectedRoute, checkAuthController)

export default securityRoute
