import { NextFunction, Request, Response } from 'express'
import User from '../models/user'
import HttpStatusCode from '../enums/httpStatusCodes'
import { AppError } from '../helpers/errorHandler'

type CommonAuthRequest = {
    email: string
    password: string
    typeAuth: 'common'
}

type GoogleAuthRequest = {
    email: string
    typeAuth: 'google'
    given_name: string
    family_name: string
    name: string
    picture: string
}

interface CreateUserControllerRequest extends Request {
    body: CommonAuthRequest | GoogleAuthRequest
}

export const createUserController = async (req: CreateUserControllerRequest, res: Response, next: NextFunction) => {
    const { typeAuth } = req.body
    // Добавить валидацию, так как сюда ходит authService
    try {
        let user: InstanceType<typeof User>

        if (typeAuth === 'google') {
            const { email, given_name, family_name, name, picture } = req.body
            user = await User.create({
                email: email,
                typeAuth: 'google',
                firstName: given_name,
                secondName: family_name,
                fullName: name,
                picture: picture
            })
        } else {
            const { email, password } = req.body

            const login = email.split('@')[0]

            user = await User.create({
                email: email,
                password: password,
                typeAuth: 'common',
                firstName: login,
                secondName: '',
                fullName: '',
                picture: ''
            })
        }
        res.status(HttpStatusCode.CREATED).json(user)
    } catch {
        return next(
            new AppError(
                'INTERNAL_SERVER_ERROR',
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                'Internal server error',
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                true
            )
        )
    }
}
