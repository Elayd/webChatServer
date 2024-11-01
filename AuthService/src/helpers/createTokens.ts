import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import fs from 'fs'
import path from 'path'

export const createTokens = (userId: ObjectId) => {
    const privateKEY = fs.readFileSync(path.resolve('private.key'), 'utf8')
    const accessToken = jwt.sign({ id: userId }, privateKEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
        algorithm: 'RS256'
    })

    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET!, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
    })
    return { accessToken, refreshToken }
}
