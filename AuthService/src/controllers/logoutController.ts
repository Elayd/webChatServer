import { Request, Response } from 'express'
import { redisClient } from '../index'

export const logoutController = async (req: Request, res: Response) => {
    const { refreshToken } = req.body

    try {
        await redisClient.connect()
        await redisClient.del(refreshToken)
        await redisClient.disconnect()
        res.status(200).json({ message: 'Successfully logged out' })
    } catch (error) {
        console.log(error, 'error')
        res.status(500).json({ message: 'Internal server error' })
    }
}
