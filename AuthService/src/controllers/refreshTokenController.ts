import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { ErrorCodes } from '../enums/errorCodes'
import { redisClient } from '../index'
import fs from 'fs'
import path from 'path'

interface JwtPayload {
    id: string
}

export const refreshTokenController = async (req: Request, res: Response) => {
    const { refreshToken } = req.body

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as JwtPayload
        const isRefreshInRedis = await redisClient.tokenExist(decoded.id.toString(), refreshToken)

        if (!isRefreshInRedis) {
            return res.status(400).json({ message: 'Invalid Token', code: ErrorCodes.InvalidToken })
        }

        const privateKEY = fs.readFileSync(path.resolve('private.key'), 'utf8')
        const newAccessToken = jwt.sign({ id: decoded.id }, privateKEY, {
            expiresIn: process.env.JWT_EXPIRES_IN,
            algorithm: 'RS256'
        })

        res.status(200).json(newAccessToken)
    } catch {
        res.status(401).json({ message: 'Failed', code: ErrorCodes.InvalidToken })
    }
}
