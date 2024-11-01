import { Request, Response } from 'express'
import { redisClient } from '../index'
import jwt from 'jsonwebtoken'

interface JwtPayload {
    id: string
}
export const logoutAllController = async (req: Request, res: Response) => {
    const { refreshToken } = req.body

    try {
        const decoded = jwt.decode(refreshToken) as JwtPayload
        await redisClient.deleteAllTokensExlCurrent(decoded.id.toString(), refreshToken)
        res.status(200).json({ message: 'Successfully logged from all devices out' })
    } catch (error) {
        console.log(error, 'error')
        res.status(500).json({ message: 'Internal server error' })
    }
}
