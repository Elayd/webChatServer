import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import HttpStatusCode from '../enums/httpStatusCodes';
import { AppError } from '../helpers/errorHandler';
import { ErrorsDescriptions } from '../enums/errorsDescriptions';

export const protectedRoute = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    console.log(1);
    return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'No token' });
  }
  try {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_PUBLIC_KEY!, {
      algorithms: ['RS256']
    });
    next();
  } catch {
    console.log('111');
    return next(new AppError(ErrorsDescriptions.TOKEN_PROVIDED_ERROR, true, null, HttpStatusCode.UNAUTHORIZED));
  }
};
