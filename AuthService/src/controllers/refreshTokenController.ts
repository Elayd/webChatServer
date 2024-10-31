import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { ErrorCodes } from '../enums/errorCodes'
import { redisClient } from '../index'

interface JwtPayload {
    id: string
}

export const refreshTokenController = async (req: Request, res: Response) => {
    const { refreshToken } = req.body

    await redisClient.connect()
    const isRefreshInRedis = await redisClient.exists(refreshToken)
    await redisClient.disconnect()

    if (!isRefreshInRedis) {
        return res.status(400).json({ message: 'Invalid Token', code: ErrorCodes.InvalidToken })
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as JwtPayload

        const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_PRIVATE_KEY!, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })

        res.status(200).json(newAccessToken)
    } catch {
        res.status(401).json({ message: 'Failed', code: ErrorCodes.InvalidToken })
    }
}
