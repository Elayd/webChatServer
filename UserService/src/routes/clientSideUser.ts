import express from 'express'
import { getUserByEmailController } from '../controllers/getUserByEmailController'
const clientSideUser = express.Router()

clientSideUser.post('/getUserInfo', getUserByEmailController)

export default clientSideUser
