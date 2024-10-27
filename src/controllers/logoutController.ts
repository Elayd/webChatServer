import { Request, Response } from 'express'
import { redisClient } from '../index'

export const logoutController = async (req: Request, res: Response) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        return res.status(400).json({ message: 'No refresh token provided' })
    }

    try {
        await redisClient.del(refreshToken)
        res.status(200).json({ message: 'Successfully logged out' })
    } catch (error) {
        console.log(error, 'error')
        res.status(500).json({ message: 'Internal server error' })
    }
}
