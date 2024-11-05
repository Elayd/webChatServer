import { getTokenParams } from '../helpers/oauth'
import User from '../models/user'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import { createTokens } from '../helpers/createTokens'
import { NextFunction, Request, Response } from 'express'
import { redisClient } from '../index'
import { AppError } from '../helpers/errorHandler'
import HttpStatusCode from '../enums/httpStatusCodes'
interface GoogleOAuthPayload {
    email: string
    name: string
    given_name: string
    family_name: string
    picture: string
}
interface TokenExchangeRequest extends Request {
    query: {
        code: string
    }
}
export const tokenExchangeController = async (req: TokenExchangeRequest, res: Response, next: NextFunction) => {
    const { code } = req.query
    try {
        const tokenParam = getTokenParams(code)

        const {
            data: { id_token }
        } = await axios.post(`${process.env.TOKEN_URL}`, tokenParam)

        if (!id_token)
            return next(
                new AppError(
                    'BAD_REQUEST',
                    HttpStatusCode.BAD_REQUEST,
                    'Token exchange error',
                    HttpStatusCode.BAD_REQUEST,
                    true
                )
            )

        const { email, given_name, family_name, name, picture } = jwt.decode(id_token) as GoogleOAuthPayload

        const user = await User.findOne({ email: email })

        if (!user) {
            const newUser = await User.create({
                email: email,
                typeAuth: 'google',
                firstName: given_name,
                secondName: family_name,
                fullName: name,
                picture: picture
            })
            const { accessToken, refreshToken } = createTokens(newUser?._id)

            const expiredIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN!, 10)
            await redisClient.setToken(newUser?._id.toString(), refreshToken, expiredIn)

            return res.status(HttpStatusCode.OK).json({ accessToken, refreshToken })
        } else {
            const { accessToken, refreshToken } = createTokens(user?._id)
            const expiredIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN!, 10)
            await redisClient.setToken(user?._id.toString(), refreshToken, expiredIn)

            return res.status(HttpStatusCode.OK).json({ accessToken, refreshToken })
        }
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
