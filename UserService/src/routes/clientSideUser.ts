import express from 'express';
import { getUserByIdController } from '../controllers/getUserByIdController';
import { changeUserDataController } from '../controllers/changeUserInfoController';
import { uploadImageUrlController } from '../controllers/uploadImageUrlController';
import { changeUserImageController } from '../controllers/changeImageController';
const clientSideUser = express.Router();

clientSideUser.get('/getUserInfo', getUserByIdController);
clientSideUser.put('/changeUserInfo', changeUserDataController);
clientSideUser.get('/uploadImageUrl', uploadImageUrlController);
clientSideUser.put('/changeUserAvatar', changeUserImageController);

export default clientSideUser;
