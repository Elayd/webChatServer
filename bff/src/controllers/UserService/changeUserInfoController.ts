import axios from 'axios'
import { Request, Response } from 'express'

interface ChangeUserDataRequest extends Request {
    body: {
        userId: string
        firstName: string
        secondName: string
    }
}

export const changeUserInfoController = async (req: ChangeUserDataRequest, res: Response) => {
    const { userId, firstName, secondName } = req.body

    try {
        await axios.put(`${process.env.USER_SERVICE_BASE_URL}/changeUserInfo`, {
            userId,
            firstName,
            secondName
        })
        res.status(200).json({ message: 'User data changed successfully' })
    } catch {
        res.status(500).json({ message: 'Internal server error' })
    }
}
