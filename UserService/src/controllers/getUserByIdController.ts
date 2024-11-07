import { Request, Response } from 'express'
import User from '../models/user'
import { ObjectId } from 'mongodb'

interface GetUserByIdRequest extends Request {
    query: {
        userId: string
    }
}

export const getUserByIdController = async (req: GetUserByIdRequest, res: Response) => {
    const { userId } = req.query

    try {
        const user = await User.findOne({ _id: new ObjectId(userId) })
        res.status(200).json(user)
    } catch {
        res.status(500).json({ message: 'Internal server error' })
    }
}
