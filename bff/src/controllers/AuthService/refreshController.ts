import axios from 'axios'
import { Request, Response } from 'express'

interface RefreshResponse extends Response {
    accessToken: string
}
export const refreshTokenController = async (req: Request, res: Response) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        return res.status(400).json({ message: 'No refresh token provided' })
    }

    try {
        const { data: newAccessToken } = await axios.post<RefreshResponse>(
            `${process.env.AUTH_SERVICE_BASE_URL}/api/security/refresh`,
            {
                refreshToken
            }
        )
        res.status(200).json(newAccessToken)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500
            const errorRes = error.response?.data || 'An error occurred'
            return res.status(status).json(errorRes)
        }
    }
}
