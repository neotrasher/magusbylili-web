import { Router } from 'express'
import { me } from '../controllers/meController.js'
import { requireAuth } from '../middleware/auth.js'
const r = Router()
r.get('/', requireAuth, me)
export default r
