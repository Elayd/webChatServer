import User from '../models/user'
import bcrypto from 'bcryptjs'
import { Request, Response } from 'express'
import { ErrorCodes } from '../enums/errorCodes'
import { redisClient } from '../index'
import { createTokens } from '../helpers/createTokens'

interface AuthRequest extends Request {
    body: {
        email: string
        password: string
    }
}
export const signInController = async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) return res.status(401).json({ error: "User Doesn't Exist", code: ErrorCodes.UserNotFound })

        if (!user.password) {
            return res.status(400).json({ message: 'Invalid credentials', code: ErrorCodes.InvalidCredentials })
        }

        const matchedPassword = await bcrypto.compare(password, user.password)

        if (!matchedPassword) {
            return res.status(400).json({ message: 'Invalid credentials', code: ErrorCodes.InvalidCredentials })
        }

        const { accessToken, refreshToken } = createTokens(user?._id)

        const expiredIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN!, 10)

        await redisClient.setToken(user?._id.toString(), refreshToken, expiredIn)

        return res.status(200).json({ accessToken, refreshToken })
    } catch {
        // Сделаю норм обработку
        res.status(500).json('Internal server error')
    }
}
