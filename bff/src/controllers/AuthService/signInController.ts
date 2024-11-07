import { NextFunction, Request, Response } from 'express'
import axios from 'axios'
import { AppError } from '../../helpers/errorHandler'
import { UserAuthSchema } from '../../schemas/userAuthSchema'
import HttpStatusCode from '../../enums/httpStatusCodes'
import { ErrorsDescriptions } from '../../enums/errorsDescriptions'

interface SignInRequest extends Request {
    body: {
        email: string
        password: string
    }
}
interface SignInResponse extends Response {
    accessToken: string
    refreshToken: string
    userId: string
}
export const signInController = async (req: SignInRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    try {
        const validatedData = UserAuthSchema.parse({ email, password })
        const { data } = await axios.post<SignInResponse>(
            `${process.env.AUTH_SERVICE_BASE_URL}/api/security/signin`,
            validatedData
        )
        const { accessToken, refreshToken, userId } = data
        res.status(HttpStatusCode.OK).json({ accessToken, refreshToken, userId })
    } catch (error) {
        return next(new AppError(ErrorsDescriptions.SIGNIN_ERROR, true, error))
    }
}
