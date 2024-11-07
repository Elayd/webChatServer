import express from 'express'
import { signInController } from '../controllers/AuthService/signInController'
import { refreshTokenController } from '../controllers/AuthService/refreshController'
import { logoutController } from '../controllers/AuthService/logoutController'
import { tokenExchangeController } from '../controllers/AuthService/tokenExchangeController'
import { signUpController } from '../controllers/AuthService/signUpController'
import { logoutAllController } from '../controllers/AuthService/logoutAllController'
import { getUserInfoController } from '../controllers/UserService/getUserInfoController'
import { protectedRoute } from '../middlewares/auth'

const apiRoute = express.Router()

apiRoute.post('/signup', signUpController)
apiRoute.post('/signin', signInController)
apiRoute.post('/refresh', refreshTokenController)
apiRoute.post('/logout', logoutController)
apiRoute.post('/logoutOtherDevices', logoutAllController)
apiRoute.get('/oauth', tokenExchangeController)

apiRoute.get('/getUserInfo', protectedRoute, getUserInfoController)

export default apiRoute
