import axios from 'axios'
import { NextFunction, Request, Response } from 'express'
import HttpStatusCode from '../../enums/httpStatusCodes'
import { AppError } from '../../helpers/errorHandler'
import { ErrorsDescriptions } from '../../enums/errorsDescriptions'

interface ChangeUserDataRequest extends Request {
    body: {
        userId: string
        firstName: string
        secondName: string
    }
}

export const changeUserInfoController = async (req: ChangeUserDataRequest, res: Response, next: NextFunction) => {
    const { userId, firstName, secondName } = req.body

    try {
        await axios.put(`${process.env.USER_SERVICE_BASE_URL}/changeUserInfo`, {
            userId,
            firstName,
            secondName
        })
        res.status(HttpStatusCode.OK).json({ message: 'User data changed successfully' })
    } catch (error) {
        return next(new AppError(ErrorsDescriptions.CHANGE_USER_INFO_ERROR, true, error))
    }
}
