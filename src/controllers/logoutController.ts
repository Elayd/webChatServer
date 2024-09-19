import { Response } from 'express'

export const logoutContoller = (_, res: Response) => {
    res.clearCookie('access-token')
    res.clearCookie('refresh-token')
    return res.status(200).json({ message: 'Successfully logged out ' })
}
