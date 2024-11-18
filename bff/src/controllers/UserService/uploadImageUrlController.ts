import axios from 'axios'
import { NextFunction, Request, Response } from 'express'
import HttpStatusCode from '../../enums/httpStatusCodes'
import { AppError } from '../../helpers/errorHandler'
import { ErrorsDescriptions } from '../../enums/errorsDescriptions'

interface ChangeUserDataRequest extends Request {
    query: {
        userId: string
        fileType: string
    }
}

export const uploadImageUrlController = async (req: ChangeUserDataRequest, res: Response, next: NextFunction) => {
    const { userId, fileType } = req.query

    try {
        const response = await axios.get(`${process.env.USER_SERVICE_BASE_URL}/uploadImageUrl`, {
            params: {
                userId,
                fileType
            }
        })
        res.status(HttpStatusCode.OK).json(response?.data)
    } catch (error) {
        return next(new AppError(ErrorsDescriptions.UPLOAD_IMAGE_URL_ERROR, true, error))
    }
}
