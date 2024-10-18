import { handleTokens } from '../helpers/createTokens'
import User from '../models/user'
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'

interface RegRequest extends Request {
    body: {
        email: string
        password: string
    }
}

export const registration = async (req: RegRequest, res: Response) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
        bcrypt.hash(password, 10).then((hash) => {
            const user = User.create({
                email: email,
                password: hash,
                typeAuth: 'common'
            })
                .then(() => {
                    return handleTokens(res, user._id)
                })
                .catch((err) => {
                    if (err) {
                        res.status(400).json({ error: err })
                    }
                })
        })
    }
}
