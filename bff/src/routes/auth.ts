import express from 'express';
import { signInController } from '../controllers/AuthService/signInController';
import { refreshTokenController } from '../controllers/AuthService/refreshController';
import { logoutController } from '../controllers/AuthService/logoutController';
import { tokenExchangeController } from '../controllers/AuthService/tokenExchangeController';
import { signUpController } from '../controllers/AuthService/signUpController';
import { logoutAllController } from '../controllers/AuthService/logoutAllController';

const authRoute = express.Router();

authRoute.post('/signup', signUpController);
authRoute.post('/signin', signInController);
authRoute.post('/refresh', refreshTokenController);
authRoute.post('/logout', logoutController);
authRoute.post('/logoutOtherDevices', logoutAllController);
authRoute.get('/oauth', tokenExchangeController);

export default authRoute;
