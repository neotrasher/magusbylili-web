import { Router } from 'express'
import { createOrder, listOrders } from '../controllers/ordersController.js'
import { requireAuth } from '../middleware/auth.js'
const r = Router()
r.get('/', requireAuth, listOrders)
r.post('/', requireAuth, createOrder)
export default r
