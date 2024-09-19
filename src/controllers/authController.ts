import User from '../models/user'
import bcrypto from 'bcryptjs'
import { handleTokensIntoCookie } from '../helpers/createTokens'

export const authController = async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email: email })

    if (!user) return res.status(400).json({ error: "User Doesn't Exist" })

    const matchedPassword = await bcrypto.compare(password, user?.password)

    if (!user || !matchedPassword) {
        return res.status(400).json({ message: 'Invalid credentials' })
    }

    return handleTokensIntoCookie(res, user._id)
}
