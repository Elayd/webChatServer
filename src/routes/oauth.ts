import express from 'express'
import { getOAuthUrlController } from '../controllers/getOAuthUrlController'
import { tokenExchangeController } from '../controllers/tokenExchangeController'

const oAuthRoute = express.Router()

oAuthRoute.get('/url', getOAuthUrlController)

oAuthRoute.get('/token', tokenExchangeController)

export default oAuthRoute
