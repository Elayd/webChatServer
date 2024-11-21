import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import HttpStatusCode from '../enums/httpStatusCodes';
import { AppError } from '../helpers/errorHandler';

interface ChangeUserDataRequest extends Request {
    body: {
        userId: string;
        firstName: string;
        secondName: string;
    };
}

export const changeUserDataController = async (req: ChangeUserDataRequest, res: Response, next: NextFunction) => {
    const { userId, firstName, secondName } = req.body;

    try {
        await User.updateOne({ _id: userId }, { $set: { firstName: firstName, secondName: secondName } });
        res.status(HttpStatusCode.OK).json({ message: 'User data changed successfully' });
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
