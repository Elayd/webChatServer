import express from 'express'
import { refreshTokenController } from '../controllers/refreshTokenController'
import { checkAuthController } from '../controllers/checkAuthController'
import { protectedRoute } from '../middlewares/auth'
import { logoutController } from '../controllers/logoutController'
import { signUpController } from '../controllers/signUpController'
import { signInController } from '../controllers/signInController'
import { logoutAllController } from '../controllers/logoutAllController'

const securityRoute = express.Router()

securityRoute.post('/signin', signInController)
securityRoute.post('/signup', signUpController)
securityRoute.post('/refresh', refreshTokenController)
securityRoute.post('/logout', logoutController)
securityRoute.post('/logoutOtherDevices', logoutAllController)

securityRoute.post('/checkAuth', protectedRoute, checkAuthController)

export default securityRoute
