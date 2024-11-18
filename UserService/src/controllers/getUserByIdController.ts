import { Request, Response, NextFunction } from 'express'
import User from '../models/user'
import { ObjectId } from 'mongodb'
import HttpStatusCode from '../enums/httpStatusCodes'
import { AppError } from '../helpers/errorHandler'

interface GetUserByIdRequest extends Request {
    query: {
        userId: string
    }
}

export const getUserByIdController = async (req: GetUserByIdRequest, res: Response, next: NextFunction) => {
    const { userId } = req.query

    try {
        const user = await User.findOne({ _id: new ObjectId(userId) })
        res.status(HttpStatusCode.OK).json(user)
    } catch {
        return next(
            new AppError(
                'INTERNAL_SERVER_ERROR',
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                'Internal server error',
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                true
            )
        )
    }
}
