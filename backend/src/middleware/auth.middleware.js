import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function requireAuth(req, _resp, next){
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ')? header.slice(7) : null
    if (!token){
        const e = new Error('Unauthorized')
        e.statusCode = 401
        return next (e)
    }
    try {
        req.user = jwt.verify(token, env.JWT_SECRET)
        next()
    }catch(error){
        const e = new Error('Invalid Token')
        e.statusCode = 401
        next(e)
    }
}