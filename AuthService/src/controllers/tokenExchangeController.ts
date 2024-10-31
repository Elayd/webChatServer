import { getTokenParams } from '../helpers/oauth'
import User from '../models/user'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import { createTokens } from '../helpers/createTokens'
import { Request, Response } from 'express'
import { ErrorCodes } from '../enums/errorCodes'
import { redisClient } from '../index'
interface GoogleOAuthPayload {
    email: string
    name: string
    given_name: string
    family_name: string
    picture: string
}
interface TokenExchangeRequest extends Request {
    query: {
        code: string
    }
}
export const tokenExchangeController = async (req: TokenExchangeRequest, res: Response) => {
    const { code } = req.query
    try {
        const tokenParam = getTokenParams(code)

        const {
            data: { id_token }
        } = await axios.post(`${process.env.TOKEN_URL}`, tokenParam)

        if (!id_token) return res.status(400).json({ message: 'Auth error' })

        const { email, given_name, family_name, name, picture } = jwt.decode(id_token) as GoogleOAuthPayload

        const user = await User.findOne({ email: email })

        if (!user) {
            const newUser = await User.create({
                email: email,
                typeAuth: 'google',
                firstName: given_name,
                secondName: family_name,
                fullName: name,
                picture: picture
            })
            const { accessToken, refreshToken } = createTokens(newUser?._id)

            const expiredIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN!, 10)
            await redisClient.connect()
            await redisClient.setEx(refreshToken, expiredIn, '1')
            await redisClient.disconnect()

            return res.status(200).json({ accessToken, refreshToken })
        } else {
            const { accessToken, refreshToken } = createTokens(user?._id)
            const expiredIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN!, 10)
            await redisClient.connect()
            await redisClient.setEx(refreshToken, expiredIn, '1')
            await redisClient.disconnect()
            return res.status(200).json({ accessToken, refreshToken })
        }
    } catch (err) {
        console.error('Error: ', err)
        res.status(400).json({ message: 'Bad request', code: ErrorCodes.BadRequest })
    }
}
