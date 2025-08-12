import { verifyJwt } from '../utils/jwt.js'
export function requireAuth(req, res, next){
  const token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null)
  const decoded = token ? verifyJwt(token) : null
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })
  req.user = decoded
  next()
}
