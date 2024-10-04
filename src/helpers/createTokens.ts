import jwt from 'jsonwebtoken'
import { config } from '../config'

const createTokens = (userId) => {
    const accessToken = jwt.sign({ id: userId }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN
    })
    const refreshToken = jwt.sign({ id: userId }, config.JWT_REFRESH_SECRET, {
        expiresIn: config.JWT_REFRESH_EXPIRES_IN
    })
    return { accessToken, refreshToken }
}

export const handleTokens = (res, userId) => {
    const { accessToken, refreshToken } = createTokens(userId)
    res.status(200).json({ accessToken, refreshToken })
}
