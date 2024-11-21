import { NextFunction, Request, Response } from 'express';
import { redisClient } from '../index';
import jwt from 'jsonwebtoken';
import HttpStatusCode from '../enums/httpStatusCodes';
import { AppError } from '../helpers/errorHandler';

interface JwtPayload {
    id: string;
}

export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
        await redisClient.deleteToken(decoded.id.toString(), refreshToken);
        res.status(HttpStatusCode.OK).json({ message: 'Successfully logged out' });
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
