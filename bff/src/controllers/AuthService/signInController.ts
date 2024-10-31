import { Request, Response } from 'express'

import { z } from 'zod'
import axios from 'axios'
import { UserAuthSchema } from '../../schemas/authSchema'
import { zodErrorsMapper } from '../../helpers/zodErrorsMapper'

interface SignInRequest extends Request {
    body: {
        email: string
        password: string
    }
}
interface SignInResponse extends Response {
    accessToken: string
    refreshToken: string
}
export const signInController = async (req: SignInRequest, res: Response) => {
    const { email, password } = req.body

    try {
        const validatedData = UserAuthSchema.parse({ email, password })
        const { data } = await axios.post<SignInResponse>(
            `${process.env.AUTH_SERVICE_BASE_URL}/api/security/signin`,
            validatedData
        )
        const { accessToken, refreshToken } = data
        res.status(200).json({ accessToken, refreshToken })
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500
            const errorRes = error.response?.data || 'An error occurred'
            return res.status(status).json(errorRes)
        }

        if (error instanceof z.ZodError) {
            const errors = zodErrorsMapper<keyof SignInRequest['body']>(error.formErrors.fieldErrors)
            res.status(400).json({ errors })
        }
    }
}
