import { Router } from 'express'
import { login, register, logout } from '../controllers/authController.js'
const r = Router()
r.post('/login', login)
r.post('/register', register)
r.post('/logout', logout)
export default r
