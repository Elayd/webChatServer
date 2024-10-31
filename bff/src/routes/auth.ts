import express from 'express'
import { signInController } from '../controllers/AuthService/signInController'
import { refreshTokenController } from '../controllers/AuthService/refreshController'
import { logoutController } from '../controllers/AuthService/logoutController'
import { tokenExchangeController } from '../controllers/AuthService/tokenExchangeController'
import { signUpController } from '../controllers/AuthService/signUpController'

const apiRoute = express.Router()

apiRoute.post('/signup', signUpController)
apiRoute.post('/signin', signInController)
apiRoute.post('/refresh', refreshTokenController)
apiRoute.post('/logout', logoutController)
apiRoute.get('/oauth', tokenExchangeController)

export default apiRoute
