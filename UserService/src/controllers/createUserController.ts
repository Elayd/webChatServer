import { Request, Response } from 'express'
import User from '../models/user'

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

export const createUserController = async (req: CreateUserControllerRequest, res: Response) => {
    const { typeAuth } = req.body

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

            user = await User.create({
                email: email,
                password: password,
                typeAuth: 'common'
            })
        }
        res.status(200).json(user)
    } catch {
        res.status(500).json({ message: 'Internal server error' })
    }
}
