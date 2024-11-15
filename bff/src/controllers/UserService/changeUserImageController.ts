import axios from 'axios'
import { Request, Response } from 'express'

interface ChangeUserDataRequest extends Request {
    body: {
        userId: string
        picture: string
    }
}

export const changeUserImageController = async (req: ChangeUserDataRequest, res: Response) => {
    const { userId, picture } = req.body

    try {
        await axios.put(`${process.env.USER_SERVICE_BASE_URL}/changeUserAvatar`, {
            userId,
            picture
        })
        res.status(200).json({ message: 'User data changed successfully' })
    } catch {
        res.status(500).json({ message: 'Internal server error' })
    }
}
