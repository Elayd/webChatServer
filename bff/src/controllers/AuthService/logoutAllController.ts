import { NextFunction, Request, Response } from 'express'
import axios from 'axios'
import HttpStatusCode from '../../enums/httpStatusCodes'
import { AppError } from '../../helpers/errorHandler'
import { ErrorsDescriptions } from '../../enums/errorsDescriptions'

export const logoutAllController = async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        return next(new AppError(ErrorsDescriptions.NO_REFRESH_TOKEN_ERROR, true, null, HttpStatusCode.BAD_REQUEST))
    }

    try {
        await axios.post(`${process.env.AUTH_SERVICE_BASE_URL}/api/security/logoutOtherDevices`, {
            refreshToken
        })
        res.status(HttpStatusCode.OK).json({ message: 'Successfully logged out from all devices ' })
    } catch (error) {
        return next(new AppError(ErrorsDescriptions.LOGOUT_ALL_ERROR, true, error))
    }
}
