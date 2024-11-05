import { NextFunction } from '@sentry/node/build/types/integrations/tracing/nest/types'
import axios from 'axios'
import { Request, Response } from 'express'
import { AppError } from '../../helpers/errorHandler'
import HttpStatusCode from '../../enums/httpStatusCodes'
import { ErrorsDescriptions } from '../../enums/errorsDescriptions'

interface RefreshResponse extends Response {
    accessToken: string
}
export const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        return next(new AppError(ErrorsDescriptions.NO_REFRESH_TOKEN_ERROR, true, null, HttpStatusCode.BAD_REQUEST))
    }

    try {
        const { data: newAccessToken } = await axios.post<RefreshResponse>(
            `${process.env.AUTH_SERVICE_BASE_URL}/api/security/refresh`,
            {
                refreshToken
            }
        )
        res.status(HttpStatusCode.OK).json(newAccessToken)
    } catch (error) {
        return next(new AppError(ErrorsDescriptions.REFRESH_TOKEN_PROBLEM, true, error))
    }
}
