import User from '../models/user'
import bcrypto from 'bcryptjs'
import { handleTokens } from '../helpers/createTokens'

export const authController = async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email: email })

    if (!user) return res.status(400).json({ error: "User Doesn't Exist" })

    const matchedPassword = await bcrypto.compare(password, user?.password)

    if (!user || !matchedPassword) {
        return res.status(400).json({ message: 'Invalid credentials' })
    }

    return handleTokens(res, user._id)
}
