import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import HttpStatusCode from '../../enums/httpStatusCodes';
import { AppError } from '../../helpers/errorHandler';
import { ErrorsDescriptions } from '../../enums/errorsDescriptions';
import { cacheManager } from '../../helpers/redisCache';
import { ChangeUserDataRequestSchema } from '../../schemas/changeUserDataRequestSchema';

interface ChangeUserDataRequest extends Request {
  body: {
    userId: string;
    firstName: string;
    secondName: string;
  };
}

export const changeUserInfoController = async (req: ChangeUserDataRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, firstName, secondName } = ChangeUserDataRequestSchema.parse(req.body);

    await axios.put(`${process.env.USER_SERVICE_BASE_URL}/changeUserInfo`, {
      userId,
      firstName,
      secondName
    });
    await cacheManager.invalidateQuery(`userInfo:${userId}`);
    res.status(HttpStatusCode.OK).json({ message: 'User data changed successfully' });
  } catch (error) {
    return next(new AppError(ErrorsDescriptions.CHANGE_USER_INFO_ERROR, true, error));
  }
};
