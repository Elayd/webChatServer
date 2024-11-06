import { Request, Response } from 'express'
import User from '../models/user'

interface GetUserByEmailRequest extends Request {
    body: {
        email: string
    }
}

export const getUserByEmailController = async (req: GetUserByEmailRequest, res: Response) => {
    const { email } = req.body

    console.log(email, 'email')
    try {
        const user = await User.findOne({ email })
        res.status(200).json(user)
    } catch {
        res.status(500).json({ message: 'Internal server error' })
    }
}
