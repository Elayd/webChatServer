import { handleTokens } from '../helpers/createTokens'
import User from '../models/user'
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import { UserRegistrationSchema } from '../schemas/registrationSchema'
import { zodErrorsMapper } from '../helpers/zodErrorsMapper'
import { z } from 'zod'

interface RegRequest extends Request {
    body: {
        email: string
        password: string
    }
}

export const registration = async (req: RegRequest, res: Response) => {
    const { email, password } = req.body

    try {
        const validatedData = UserRegistrationSchema.parse({ email, password })

        const user = await User.findOne({ email: validatedData.email })

        if (!user) {
            bcrypt.hash(validatedData.password, 10).then((hash) => {
                const user = User.create({
                    email: validatedData.email,
                    password: hash,
                    typeAuth: 'common'
                })
                    .then(() => {
                        return handleTokens(res, user._id)
                    })
                    .catch((err) => {
                        if (err) {
                            res.status(400).json({ error: err })
                        }
                    })
            })
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = zodErrorsMapper<keyof RegRequest['body']>(error.formErrors.fieldErrors)
            res.status(400).json({ errors })
        }
    }
}
