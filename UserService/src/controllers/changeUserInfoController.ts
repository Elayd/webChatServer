import { Request, Response } from 'express'
import User from '../models/user'

interface ChangeUserDataRequest extends Request {
    body: {
        userId: string
        firstName: string
        secondName: string
    }
}

export const changeUserDataController = async (req: ChangeUserDataRequest, res: Response) => {
    const { userId, firstName, secondName } = req.body

    try {
        await User.updateOne({ _id: userId }, { $set: { firstName: firstName, secondName: secondName } })
        res.status(200).json({ message: 'User data changed successfully' })
    } catch {
        res.status(500).json({ message: 'Internal server error' })
    }
}
