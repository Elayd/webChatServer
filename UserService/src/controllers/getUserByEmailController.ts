import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import HttpStatusCode from '../enums/httpStatusCodes';
import { AppError } from '../helpers/errorHandler';

interface GetUserByEmailRequest extends Request {
  query: {
    email: string;
  };
}

export const getUserByEmailController = async (req: GetUserByEmailRequest, res: Response, next: NextFunction) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });
    res.status(HttpStatusCode.OK).json(user);
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
