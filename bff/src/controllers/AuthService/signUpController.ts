import { z } from 'zod'
import { Request, Response } from 'express'
import axios from 'axios'
import { UserAuthSchema } from '../../schemas/authSchema'
import { zodErrorsMapper } from '../../helpers/zodErrorsMapper'

interface SignUpRequest extends Request {
    body: {
        email: string
        password: string
    }
}

interface SignUpResponse extends Response {
    accessToken: string
    refreshToken: string
}

export const signUpController = async (req: SignUpRequest, res: Response) => {
    const { email, password } = req.body

    try {
        const validatedData = UserAuthSchema.parse({ email, password })

        const { data } = await axios.post<SignUpResponse>(
            `${process.env.AUTH_SERVICE_BASE_URL}/api/security/signup`,
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
            const errors = zodErrorsMapper<keyof SignUpRequest['body']>(error.formErrors.fieldErrors)
            res.status(400).json({ errors })
        }
    }
}
