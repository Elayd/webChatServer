import express from 'express'
import { tokenExchangeController } from '../controllers/tokenExchangeController'

const oAuthRoute = express.Router()

oAuthRoute.get('/token', tokenExchangeController)

export default oAuthRoute
