import axios from 'axios'
import { NextFunction, Request, Response } from 'express'
import HttpStatusCode from '../../enums/httpStatusCodes'
import { ErrorsDescriptions } from '../../enums/errorsDescriptions'
import { AppError } from '../../helpers/errorHandler'

interface ChangeUserDataRequest extends Request {
    body: {
        userId: string
        picture: string
    }
}

export const changeUserImageController = async (req: ChangeUserDataRequest, res: Response, next: NextFunction) => {
    const { userId, picture } = req.body

    try {
        await axios.put(`${process.env.USER_SERVICE_BASE_URL}/changeUserAvatar`, {
            userId,
            picture
        })
        res.status(HttpStatusCode.OK).json({ message: 'User data changed successfully' })
    } catch (error) {
        return next(new AppError(ErrorsDescriptions.CHANGE_USER_IMAGE_ERROR, true, error))
    }
}
