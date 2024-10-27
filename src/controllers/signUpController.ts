import User from '../models/user'
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import { UserRegistrationSchema } from '../schemas/registrationSchema'
import { zodErrorsMapper } from '../helpers/zodErrorsMapper'
import { z } from 'zod'
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
        const validatedData = UserRegistrationSchema.parse({ email, password })

        const user = await User.findOne({ email: validatedData.email })

        if (user) {
            return res.status(400).json({ error: 'User already exists', code: ErrorCodes.UserAlreadyExists })
        }

        const hashedPassword = await bcrypt.hash(validatedData.password, 10)
        const newUser = await User.create({
            email: validatedData.email,
            password: hashedPassword,
            typeAuth: 'common'
        })

        const { accessToken, refreshToken } = createTokens(newUser?._id)

        const expiredIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN!, 10)
        await redisClient.setEx(refreshToken, expiredIn, 'true')

        return res.status(200).json({ accessToken, refreshToken })
    } catch (error) {
        // Обработать другие ошибки
        if (error instanceof z.ZodError) {
            const errors = zodErrorsMapper<keyof RegRequest['body']>(error.formErrors.fieldErrors)
            res.status(400).json({ errors, code: ErrorCodes.InvalidRequest })
        }
    }
}
