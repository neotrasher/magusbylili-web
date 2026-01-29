import { Router } from 'express'
import { me, changePassword, requestEmailChange, confirmEmailChange } from '../controllers/meController.js'
import { requireAuth } from '../middleware/auth.js'
const r = Router()
r.get('/', requireAuth, me)
r.post('/change-password', requireAuth, changePassword)
r.post('/change-email', requireAuth, requestEmailChange)
r.post('/change-email/confirm', confirmEmailChange)
export default r
