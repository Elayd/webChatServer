import { Request, Response } from 'express'
export const checkAuthController = (req: Request, res: Response) => {
    res.status(200).json({ auth: true })
}
