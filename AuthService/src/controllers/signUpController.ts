import User from '../models/user'
import bcrypt from 'bcryptjs'
import { NextFunction, Request, Response } from 'express'
import { redisClient } from '../index'
import { createTokens } from '../helpers/createTokens'
import HttpStatusCode from '../enums/httpStatusCodes'
import { AppError } from '../helpers/errorHandler'
import { CustomErrorCodes } from '../enums/customErrorCodes'

interface RegRequest extends Request {
    body: {
        email: string
        password: string
    }
}

export const signUpController = async (req: RegRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        if (user) {
            return next(
                new AppError(
                    'BAD_REQUEST',
                    HttpStatusCode.BAD_REQUEST,
                    'User already exists',
                    CustomErrorCodes.USER_ALREADY_EXISTS,
                    true
                )
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            email: email,
            password: hashedPassword,
            typeAuth: 'common'
        })

        const { accessToken, refreshToken } = createTokens(newUser?._id)

        const expiredIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN!, 10)
        await redisClient.setToken(newUser?._id.toString(), refreshToken, expiredIn)

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
