import axios from 'axios'
import { Request, Response } from 'express'

interface ChangeUserDataRequest extends Request {
    query: {
        userId: string
        fileType: string
    }
}

export const uploadImageUrlController = async (req: ChangeUserDataRequest, res: Response) => {
    const { userId, fileType } = req.query

    try {
        const response = await axios.get(`${process.env.USER_SERVICE_BASE_URL}/uploadImageUrl`, {
            params: {
                userId,
                fileType
            }
        })
        res.status(200).json(response.data)
    } catch (error) {
        console.log(error, 'error')
        res.status(500).json({ message: 'Internal server error' })
    }
}
