import { Request, Response } from 'express'
import axios from 'axios'
import { NextFunction } from '@sentry/node/build/types/integrations/tracing/nest/types'
import { AppError } from '../../helpers/errorHandler'
import HttpStatusCode from '../../enums/httpStatusCodes'
import { ErrorsDescriptions } from '../../enums/errorsDescriptions'

export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        return next(new AppError(ErrorsDescriptions.NO_REFRESH_TOKEN_ERROR, true, null, HttpStatusCode.BAD_REQUEST))
    }

    try {
        await axios.post(`${process.env.AUTH_SERVICE_BASE_URL}/api/security/logout`, {
            refreshToken
        })
        res.status(HttpStatusCode.OK).json({ message: 'Successfully logged out' })
    } catch (error) {
        return next(new AppError(ErrorsDescriptions.LOGOUT_ERROR, true, error))
    }
}
