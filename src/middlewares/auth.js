import { verify } from '../core/jwt'

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers['authorization']
        const { expiry } = verify(token)
        if (expiry >= parseInt(new Date())) { throw "" }
        next()
    }
    catch (e) { res.status(401).send() }
}