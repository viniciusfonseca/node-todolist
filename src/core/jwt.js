import jwt from 'jsonwebtoken'
const JWT_SECRET = Math.random().toString(36)

export function sign(payload) {
    return jwt.sign(payload, JWT_SECRET)
}

export function verify(token) {
    return jwt.verify(token, JWT_SECRET)
}