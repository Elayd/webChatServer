import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { redisClient } from '../index'
import { AppError } from '../helpers/errorHandler'
import HttpStatusCode from '../enums/httpStatusCodes'

interface JwtPayload {
    id: string
}

export const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as JwtPayload
        const isRefreshInRedis = await redisClient.tokenExist(decoded.id.toString(), refreshToken)

        if (!isRefreshInRedis) {
            return next(
                new AppError('Forbidden', HttpStatusCode.FORBIDDEN, 'Access Forbidden', HttpStatusCode.FORBIDDEN, true)
            )
        }

        const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_PRIVATE_KEY!, {
            expiresIn: process.env.JWT_EXPIRES_IN,
            algorithm: 'RS256'
        })

        res.status(HttpStatusCode.OK).json({ accessToken: newAccessToken, userId: decoded.id })
    } catch {
        return next(new AppError('FORBIDDEN', HttpStatusCode.FORBIDDEN, 'FORBIDDEN', HttpStatusCode.FORBIDDEN, true))
    }
}
