import axios from 'axios'
import { NextFunction, Request, Response } from 'express'
import HttpStatusCode from '../../enums/httpStatusCodes'
import { ErrorsDescriptions } from '../../enums/errorsDescriptions'
import { AppError } from '../../helpers/errorHandler'
import { cacheManager } from '../../helpers/redisCache'
import { ChangeUserImageRequestSchema } from '../../schemas/changeUserImageRequestSchema'

interface ChangeUserImageRequest extends Request {
    body: {
        userId: string
        picture: string
    }
}

export const changeUserImageController = async (req: ChangeUserImageRequest, res: Response, next: NextFunction) => {
    try {
        const { userId, picture } = ChangeUserImageRequestSchema.parse(req.body)
        await axios.put(`${process.env.USER_SERVICE_BASE_URL}/changeUserAvatar`, {
            userId,
            picture
        })
        await cacheManager.invalidateQuery(`userInfo:${userId}`)
        res.status(HttpStatusCode.OK).json({ message: 'User data changed successfully' })
    } catch (error) {
        return next(new AppError(ErrorsDescriptions.CHANGE_USER_IMAGE_ERROR, true, error))
    }
}
