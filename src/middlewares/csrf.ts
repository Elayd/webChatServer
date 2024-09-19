export const csrfCheck = (req, res, next) => {
    const tokenFromHeader = req.headers['x-csrf-token']
    const tokenFromCookie = req.cookies['csrf-token']

    if (tokenFromHeader !== tokenFromCookie) {
        return res.status(403).json({ error: 'Invalid' })
    }
    next()
}
