import bcrypto from 'bcryptjs'
import { NextFunction, Request, Response } from 'express'
import { redisClient } from '../index'
import { createTokens } from '../helpers/createTokens'
import { AppError } from '../helpers/errorHandler'
import HttpStatusCode from '../enums/httpStatusCodes'
import { CustomErrorCodes } from '../enums/customErrorCodes'
import { getUserByEmail } from '../api/getUserByEmail'

interface AuthRequest extends Request {
    body: {
        email: string
        password: string
    }
}
export const signInController = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    try {
        const user = await getUserByEmail(email)

        if (user.typeAuth !== 'common') {
            return next(
                new AppError(
                    'BAD_REQUEST',
                    HttpStatusCode.BAD_REQUEST,
                    'Invalid credentials',
                    HttpStatusCode.BAD_REQUEST,
                    true
                )
            )
        }

        if (!user) {
            return next(
                new AppError(
                    'UNAUTHORIZED',
                    HttpStatusCode.UNAUTHORIZED,
                    'User does not exist',
                    CustomErrorCodes.USER_NOT_FOUND,
                    true
                )
            )
        }

        const matchedPassword = await bcrypto.compare(password, user.password)

        if (!matchedPassword) {
            return next(
                new AppError(
                    'BAD_REQUEST',
                    HttpStatusCode.BAD_REQUEST,
                    'Invalid credentials',
                    CustomErrorCodes.USER_INVALID_CREDENTIALS,
                    true
                )
            )
        }

        const { accessToken, refreshToken } = createTokens(user?._id)

        const expiredIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN!, 10)

        await redisClient.setToken(user?._id.toString(), refreshToken, expiredIn)

        return res.status(HttpStatusCode.OK).json({ accessToken, refreshToken })
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
