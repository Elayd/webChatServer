import express from 'express'
import { getUserByIdController } from '../controllers/getUserByIdController'
const clientSideUser = express.Router()

clientSideUser.get('/getUserInfo', getUserByIdController)

export default clientSideUser
