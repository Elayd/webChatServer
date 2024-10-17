import { config } from '../config'
import { getTokenParams } from '../helpers/oauth'
import User from '../models/user'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import { handleTokens } from '../helpers/createTokens'
import { Request, Response } from 'express'

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
    if (!code) return res.status(400).json({ message: 'Authorization code must be provided' })
    try {
        const tokenParam = getTokenParams(code)

        const {
            data: { id_token }
        } = await axios.post(`${config.tokenUrl}`, tokenParam)

        if (!id_token) return res.status(400).json({ message: 'Auth error' })

        const { email, given_name, family_name, name, picture } = jwt.decode(id_token) as GoogleOAuthPayload

        const user = await User.findOne({ email: email })

        if (!user) {
            User.create({
                email: email,
                typeAuth: 'google',
                firstName: given_name,
                secondName: family_name,
                fullName: name,
                picture: picture
            })
                .then((user) => {
                    console.log(user, 'user')
                    handleTokens(res, user?._id)
                })
                .catch((err) => {
                    if (err) {
                        res.status(400).json({ error: err })
                    }
                })
        } else {
            handleTokens(res, user._id)
        }
    } catch (err) {
        console.error('Error: ', err)
        res.status(400).json({ message: 'Bad request' })
    }
}
