import User from '../models/user'
import bcrypto from 'bcryptjs'
import { handleTokens } from '../helpers/createTokens'
import { Request, Response } from 'express'

interface AuthRequest extends Request {
    body: {
        email: string
        password: string
    }
}
export const authController = async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })

    if (!user) return res.status(401).json({ error: "User Doesn't Exist" })

    if (!user.password) {
        return res.status(400).json({ message: 'Invalid credentials' })
    }

    const matchedPassword = await bcrypto.compare(password, user.password)

    if (!matchedPassword) {
        return res.status(400).json({ message: 'Invalid credentials' })
    }

    return handleTokens(res, user._id)
}
