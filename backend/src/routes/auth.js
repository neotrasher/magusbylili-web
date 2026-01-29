import { Router } from 'express'
import { login, register, logout, promoteAdmin, requestPasswordReset, resetPassword } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'
const r = Router()
r.post('/login', login)
r.post('/register', register)
r.post('/logout', logout)
r.post('/password-reset', requestPasswordReset)
r.post('/password-reset/confirm', resetPassword)
r.post('/promote-admin', requireAuth, promoteAdmin)
export default r
