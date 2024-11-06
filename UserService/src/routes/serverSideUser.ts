import express from 'express'
import { getUserByEmailController } from '../controllers/getUserByEmailController'
import { createUserController } from '../controllers/createUserController'
const serverSideUser = express.Router()

serverSideUser.post('/getUserByEmail', getUserByEmailController)
serverSideUser.post('/createUser', createUserController)

export default serverSideUser
