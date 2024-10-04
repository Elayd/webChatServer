import jwt from 'jsonwebtoken'
import { config } from '../config'
export const protect = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
        return res.status(400).json({ message: 'No token' })
    }
    try {
        const token = authHeader.split(' ')[1]
        jwt.verify(token, config.JWT_SECRET)
        next()
    } catch {
        return res.status(401).json({ message: 'Wrong' })
    }
}
