import User from '../models/user'
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import { ErrorCodes } from '../enums/errorCodes'
import { redisClient } from '../index'
import { createTokens } from '../helpers/createTokens'

interface RegRequest extends Request {
    body: {
        email: string
        password: string
    }
}

export const signUpController = async (req: RegRequest, res: Response) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({ message: 'User already exists', code: ErrorCodes.UserAlreadyExists })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            email: email,
            password: hashedPassword,
            typeAuth: 'common'
        })

        const { accessToken, refreshToken } = createTokens(newUser?._id)

        const expiredIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN!, 10)
        await redisClient.connect()
        await redisClient.setEx(refreshToken, expiredIn, 'true')
        await redisClient.disconnect()

        return res.status(200).json({ accessToken, refreshToken })
    } catch {
        res.status(500).json('Internal server error')
    }
}
