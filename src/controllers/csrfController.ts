import { Response } from 'express'
import crypto from 'crypto'

export const csrtController = async (_, res: Response) => {
    const token = crypto.randomUUID()
    res.cookie('csrf-token', token, { httpOnly: true, sameSite: 'lax' })
    res.status(200).json(token)
}
