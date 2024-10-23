import jwt from 'jsonwebtoken'
import { config } from '../config'
import { Request, Response } from 'express'
import { ErrorCodes } from '../enums/errorCodes'

interface JwtPayload {
    id: string
}

export const refreshController = async (req: Request, res: Response) => {
    const { refreshToken } = req.body
    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token', code: ErrorCodes.InvalidToken })
    }

    try {
        const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET) as JwtPayload
        const newAccessToken = jwt.sign({ id: decoded.id }, config.JWT_SECRET, {
            expiresIn: config.JWT_EXPIRES_IN
        })

        res.status(200).json(newAccessToken)
    } catch {
        res.status(401).json({ message: 'Failed', code: ErrorCodes.InvalidToken })
    }
}
