import axios from 'axios'
import { NextFunction, Request, Response } from 'express'
import HttpStatusCode from '../../enums/httpStatusCodes'
import { AppError } from '../../helpers/errorHandler'
import { ErrorsDescriptions } from '../../enums/errorsDescriptions'
import { UploadImageUrlRequestSchema } from '../../schemas/uploadImageUrlRequestSchema'

interface UploadImageUrlRequest extends Request {
    query: {
        userId: string
        fileType: string
    }
}

export const uploadImageUrlController = async (req: UploadImageUrlRequest, res: Response, next: NextFunction) => {
    try {
        const { userId, fileType } = UploadImageUrlRequestSchema.parse(req.query)
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
