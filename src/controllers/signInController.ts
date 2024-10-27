import User from '../models/user'
import bcrypto from 'bcryptjs'
import { Request, Response } from 'express'
import { UserAuthSchema } from '../schemas/authSchema'
import { zodErrorsMapper } from '../helpers/zodErrorsMapper'
import { z } from 'zod'
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
        const validatedData = UserAuthSchema.parse({ email, password })
        const user = await User.findOne({ email: validatedData.email })

        if (!user) return res.status(401).json({ error: "User Doesn't Exist", code: ErrorCodes.UserNotFound })

        if (!user.password) {
            return res.status(400).json({ message: 'Invalid credentials', code: ErrorCodes.InvalidCredentials })
        }

        const matchedPassword = await bcrypto.compare(validatedData.password, user.password)

        if (!matchedPassword) {
            return res.status(400).json({ message: 'Invalid credentials', code: ErrorCodes.InvalidCredentials })
        }

        const { accessToken, refreshToken } = createTokens(user?._id)

        const expiredIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN!, 10)

        await redisClient.setEx(refreshToken, expiredIn, '1')

        return res.status(200).json({ accessToken, refreshToken })
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = zodErrorsMapper<keyof AuthRequest['body']>(error.formErrors.fieldErrors)
            res.status(400).json({ errors, code: ErrorCodes.InvalidRequest })
        }
    }
}
