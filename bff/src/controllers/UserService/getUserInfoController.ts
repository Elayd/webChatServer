import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import { AppError } from '../../helpers/errorHandler';
import HttpStatusCode from '../../enums/httpStatusCodes';
import { ErrorsDescriptions } from '../../enums/errorsDescriptions';
import { User } from '../../types/user';
import { cacheManager } from '../../helpers/redisCache';
import { GetUserInfoRequestSchema } from '../../schemas/getUserInfoRequestSchema';

interface GetUserInfoRequest extends Request {
  query: {
    userId: string;
  };
}

interface UserInfo {
  userId: string;
  email: string;
  firstName: string;
  secondName: string;
  fullName: string;
  picture: string;
}
export const getUserInfoController = async (req: GetUserInfoRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = GetUserInfoRequestSchema.parse(req.query);

    const cacheKey = `userInfo:${userId}`;

    const userInfo = await cacheManager.cacheRequest<UserInfo>(cacheKey, async () => {
      const { data: user } = await axios.get<User>(`${process.env.USER_SERVICE_BASE_URL}/getUserInfo`, {
        params: { userId }
      });

      const userInfo: UserInfo = {
        userId: userId,
        email: user.email,
        firstName: user.firstName,
        secondName: user.secondName,
        fullName: user.fullName,
        picture: user.picture
      };

      return userInfo;
    });

    res.status(HttpStatusCode.OK).json(userInfo);
  } catch (error) {
    return next(new AppError(ErrorsDescriptions.GET_USER_INFO_ERROR, true, error));
  }
};
