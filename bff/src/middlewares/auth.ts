import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import path from 'path'
export const protectedRoute = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
        return res.status(401).json({ message: 'No token' })
    }
    try {
        const token = authHeader.split(' ')[1]
        const publicKEY = fs.readFileSync(path.resolve(process.cwd(), 'public.key'), 'utf8')
        jwt.verify(token, publicKEY, {
            algorithms: ['RS256']
        })
        next()
    } catch {
        return res.status(401).json({ message: 'Wrong' })
    }
}
