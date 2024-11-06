import { NextFunction, Request, Response } from 'express'
import axios from 'axios'
import { AppError } from '../../helpers/errorHandler'
import { UserAuthSchema } from '../../schemas/userAuthSchema'
import HttpStatusCode from '../../enums/httpStatusCodes'
import { ErrorsDescriptions } from '../../enums/errorsDescriptions'

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

export const signUpController = async (req: SignUpRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    try {
        const validatedData = UserAuthSchema.parse({ email, password })

        const { data } = await axios.post<SignUpResponse>(
            `${process.env.AUTH_SERVICE_BASE_URL}/api/security/signup`,
            validatedData
        )
        const { accessToken, refreshToken } = data
        res.status(HttpStatusCode.OK).json({ accessToken, refreshToken })
    } catch (error) {
        return next(new AppError(ErrorsDescriptions.SIGNUP_ERROR, true, error))
    }
}
