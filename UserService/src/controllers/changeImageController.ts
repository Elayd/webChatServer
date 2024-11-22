import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import HttpStatusCode from '../enums/httpStatusCodes';
import { AppError } from '../helpers/errorHandler';

interface ChangeUserImageRequest extends Request {
  body: {
    userId: string;
    picture: string;
  };
}

export const changeUserImageController = async (req: ChangeUserImageRequest, res: Response, next: NextFunction) => {
  const { userId, picture } = req.body;

  try {
    await User.updateOne({ _id: userId }, { $set: { picture: picture } });
    res.status(HttpStatusCode.OK).json({ message: 'Image was updated' });
  } catch {
    return next(
      new AppError(
        'INTERNAL_SERVER_ERROR',
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        'Internal server error',
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        true
      )
    );
  }
};
