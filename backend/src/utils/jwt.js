import jwt from 'jsonwebtoken'

function getSecret(){
  const secret = process.env.JWT_SECRET
  if (secret) return secret
  if (process.env.NODE_ENV !== 'production') return 'dev-secret-change-me'
  return null
}

export function signJwt(payload, opts={}){
  const secret = getSecret()
  if (!secret) throw new Error('JWT_SECRET is required')
  return jwt.sign(payload, secret, { expiresIn: process.env.JWT_EXPIRES || '7d', ...opts })
}
export function verifyJwt(token){
  const secret = getSecret()
  if (!secret) return null
  try { return jwt.verify(token, secret) } catch { return null }
}
