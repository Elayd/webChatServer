import express from 'express'
import { getUserInfoController } from '../controllers/UserService/getUserInfoController'
import { protectedRoute } from '../middlewares/auth'
import { changeUserInfoController } from '../controllers/UserService/changeUserInfoController'
import { uploadImageUrlController } from '../controllers/UserService/uploadImageUrlController'
import { changeUserImageController } from '../controllers/UserService/changeUserImageController'

const userRoute = express.Router()

userRoute.get('/getUserInfo', protectedRoute, getUserInfoController)
userRoute.put('/changeUserInfo', protectedRoute, changeUserInfoController)
userRoute.get('/uploadImageUrl', protectedRoute, uploadImageUrlController)
userRoute.put('/changeUserAvatar', protectedRoute, changeUserImageController)

export default userRoute
