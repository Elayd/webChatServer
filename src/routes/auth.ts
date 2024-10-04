import express from 'express'
import { authController } from '../controllers/authController'
import { refreshController } from '../controllers/refreshController'
import { registration } from '../controllers/regController'
import { checkAuthController } from '../controllers/checkAuthController'
import { protect } from '../middlewares/auth'
import { logoutContoller } from '../controllers/logoutController'

const securityRoute = express.Router()

securityRoute.post('/auth', authController)
securityRoute.post('/registration', registration)
securityRoute.post('/refresh', refreshController)
securityRoute.post('/logout', logoutContoller)

securityRoute.use(protect)

securityRoute.post('/checkAuth', checkAuthController)

securityRoute.post('/hello', (req, res) => res.status(200).json('right'))

export default securityRoute
