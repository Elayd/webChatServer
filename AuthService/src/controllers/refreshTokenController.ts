import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { redisClient } from '../index'
import fs from 'fs'
import path from 'path'
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

        const privateKEY = fs.readFileSync(path.resolve('private.key'), 'utf8')
        const newAccessToken = jwt.sign({ id: decoded.id }, privateKEY, {
            expiresIn: process.env.JWT_EXPIRES_IN,
            algorithm: 'RS256'
        })

        res.status(HttpStatusCode.OK).json({ accessToken: newAccessToken })
    } catch {
        return next(
            new AppError('UNAUTHORIZED', HttpStatusCode.UNAUTHORIZED, 'UNAUTHORIZED', HttpStatusCode.FORBIDDEN, true)
        )
    }
}
