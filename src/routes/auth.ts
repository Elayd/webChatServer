import express from 'express'
import { refreshTokenController } from '../controllers/refreshTokenController'
import { checkAuthController } from '../controllers/checkAuthController'
import { protectedRoute } from '../middlewares/auth'
import { logoutController } from '../controllers/logoutController'
import { signInController } from '../controllers/SignInController'
import { signUpController } from '../controllers/signUpController'

const securityRoute = express.Router()

securityRoute.post('/signin', signInController)
securityRoute.post('/signup', signUpController)
securityRoute.post('/refresh', refreshTokenController)
securityRoute.post('/logout', logoutController)

securityRoute.post('/checkAuth', protectedRoute, checkAuthController)

export default securityRoute
