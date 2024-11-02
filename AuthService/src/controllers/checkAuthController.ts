import { Request, Response } from 'express'
import HttpStatusCode from '../enums/httpStatusCodes'

// Унесу в UserService + BFF
export const checkAuthController = (req: Request, res: Response) => {
    res.status(HttpStatusCode.OK).json({ auth: true })
}
