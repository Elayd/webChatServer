import { Request, Response } from 'express'
import axios from 'axios'

export const logoutAllController = async (req: Request, res: Response) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        return res.status(400).json({ message: 'No refresh token provided' })
    }

    try {
        await axios.post(`${process.env.AUTH_SERVICE_BASE_URL}/api/security/logoutOtherDevices`, {
            refreshToken
        })
        res.status(200).json({ message: 'Successfully logged out from all devices ' })
    } catch (error) {
        // Сделать универсальный обработчик
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500
            const errorRes = error.response?.data || 'An error occurred'
            return res.status(status).json(errorRes)
        }
    }
}
