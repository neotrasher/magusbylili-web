import { Router } from 'express'
import { createOrder, listOrders, listAllOrders, updateOrderStatus } from '../controllers/ordersController.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
const r = Router()
r.get('/', requireAuth, listOrders)
r.get('/admin', requireAuth, requireAdmin, listAllOrders)
r.patch('/admin/:id', requireAuth, requireAdmin, updateOrderStatus)
r.post('/', requireAuth, createOrder)
export default r
