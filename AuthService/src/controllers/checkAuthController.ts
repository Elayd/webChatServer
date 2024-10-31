import { Request, Response } from 'express'

// Унесу в UserService + BFF
export const checkAuthController = (req: Request, res: Response) => {
    res.status(200).json({ auth: true })
}
