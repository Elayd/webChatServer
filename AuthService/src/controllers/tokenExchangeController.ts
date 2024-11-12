import { getTokenParams } from '../helpers/oauth'
import jwt from 'jsonwebtoken'
import { createTokens } from '../helpers/createTokens'
import { NextFunction, Request, Response } from 'express'
import { redisClient } from '../index'
import { AppError } from '../helpers/errorHandler'
import HttpStatusCode from '../enums/httpStatusCodes'
import { createUser } from '../api/createUser'
import { getUserByEmail } from '../api/getUserByEmail'
import { getOAuthToken } from '../api/getOAuthToken'
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

        const id_token = await getOAuthToken(tokenParam)

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

        let user = await getUserByEmail(email)

        if (!user) {
            user = await createUser({
                email: email,
                typeAuth: 'google',
                firstName: given_name,
                secondName: family_name,
                fullName: name,
                picture: picture
            })
        }

        const { accessToken, refreshToken } = createTokens(user?._id)

        const expiredIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN!, 10)
        await redisClient.setToken(user?._id.toString(), refreshToken, expiredIn)

        return res.status(HttpStatusCode.OK).json({ accessToken, refreshToken, userId: user?._id })
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
