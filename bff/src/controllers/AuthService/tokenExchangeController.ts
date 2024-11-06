import axios from 'axios'
import { NextFunction, Request, Response } from 'express'
import { AppError } from '../../helpers/errorHandler'
import HttpStatusCode from '../../enums/httpStatusCodes'
import { ErrorsDescriptions } from '../../enums/errorsDescriptions'

interface TokenExchangeRequest extends Request {
    query: {
        code: string
    }
}
interface TokenExchangeResponse extends Response {
    accessToken: string
    refreshToken: string
}

export const tokenExchangeController = async (req: TokenExchangeRequest, res: Response, next: NextFunction) => {
    try {
        const { code } = req.query
        if (!code) {
            return next(new AppError(ErrorsDescriptions.NO_GOOGLE_CODE_ERROR, true, null, HttpStatusCode.BAD_REQUEST))
        }
        const { data } = await axios.get<TokenExchangeResponse>(
            `${process.env.AUTH_SERVICE_BASE_URL}/api/oauth/token?code=${code}`
        )
        const { accessToken, refreshToken } = data
        res.status(HttpStatusCode.OK).json({ accessToken, refreshToken })
    } catch (error) {
        return next(new AppError(ErrorsDescriptions.TOKEN_EXCHANGE_ERROR, true, error))
    }
}
