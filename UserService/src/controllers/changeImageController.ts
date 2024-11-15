import { Request, Response } from 'express'
import User from '../models/user'

interface ChangeUserImageRequest extends Request {
    body: {
        userId: string
        picture: string
    }
}

export const changeUserImageController = async (req: ChangeUserImageRequest, res: Response) => {
    const { userId, picture } = req.body

    try {
        await User.updateOne({ _id: userId }, { $set: { picture: picture } })
        res.status(200).json({ message: 'Image was updated' })
    } catch {
        res.status(500).json({ message: 'Internal server error' })
    }
}
