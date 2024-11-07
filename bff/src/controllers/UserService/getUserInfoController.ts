import { NextFunction, Request, Response } from 'express'
import axios from 'axios'
import { AppError } from '../../helpers/errorHandler'
import HttpStatusCode from '../../enums/httpStatusCodes'
import { ErrorsDescriptions } from '../../enums/errorsDescriptions'
import { User } from '../../types/user'

interface getUserInfoRequest extends Request {
    query: {
        userId: string
    }
}

export const getUserInfoController = async (req: getUserInfoRequest, res: Response, next: NextFunction) => {
    const { userId } = req.query

    try {
        const { data: user } = await axios.get<User>(`${process.env.USER_SERVICE_BASE_URL}/getUserInfo`, {
            params: { userId }
        })

        let userInfo
        if (user?.typeAuth === 'google') {
            userInfo = {
                email: user.email,
                firstName: user.firstName,
                secondName: user.secondName,
                fullName: user.fullName,
                picture: user.picture
            }
        } else {
            userInfo = {
                email: user?.email
                // После добавлю затычные данные
            }
        }
        res.status(HttpStatusCode.OK).json(userInfo)
    } catch (error) {
        return next(new AppError(ErrorsDescriptions.GET_USER_INFO_ERROR, true, error))
    }
}
