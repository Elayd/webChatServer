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

const setAuthCookies = (res, accessToken, refreshToken) => {
    res.cookie('access-token', accessToken, { httpOnly: true, sameSite: 'lax' })
    res.cookie('refresh-token', refreshToken, {
        httpOnly: true,
        path: '/api/security/refresh',
        sameSite: 'lax'
    })
}

export const handleTokensIntoCookie = (res, userId) => {
    const { accessToken, refreshToken } = createTokens(userId)
    setAuthCookies(res, accessToken, refreshToken)
    res.status(200).json({ message: 'successful' })
}
