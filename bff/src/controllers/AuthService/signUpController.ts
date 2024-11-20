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
    userId: string
}

export const signUpController = async (req: SignUpRequest, res: Response, next: NextFunction) => {
    try {
        const validatedData = UserAuthSchema.parse(req.body)

        const { data } = await axios.post<SignUpResponse>(
            `${process.env.AUTH_SERVICE_BASE_URL}/api/security/signup`,
            validatedData
        )
        const { accessToken, refreshToken, userId } = data
        res.status(HttpStatusCode.CREATED).json({ accessToken, refreshToken, userId })
    } catch (error) {
        return next(new AppError(ErrorsDescriptions.SIGNUP_ERROR, true, error))
    }
}
