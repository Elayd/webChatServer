import axios from 'axios'
import { Request, Response } from 'express'

interface TokenExchangeRequest extends Request {
    query: {
        code: string
    }
}
interface TokenExchangeResponse extends Response {
    accessToken: string
    refreshToken: string
}

export const tokenExchangeController = async (req: TokenExchangeRequest, res: Response) => {
    try {
        const { code } = req.query
        if (!code) return res.status(400).json({ message: 'Authorization code must be provided' })
        const { data } = await axios.get<TokenExchangeResponse>(
            `${process.env.AUTH_SERVICE_BASE_URL}/api/oauth/token?code=${code}`
        )
        const { accessToken, refreshToken } = data
        res.status(200).json({ accessToken, refreshToken })
    } catch (error) {
        console.log(error, 'error')
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500
            const errorRes = error.response?.data || 'An error occurred'
            return res.status(status).json(errorRes)
        }
    }
}
