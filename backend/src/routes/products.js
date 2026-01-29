import { Router } from 'express'
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productsController.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
const r = Router()
r.get('/', listProducts)
r.get('/:id', getProduct)
r.post('/', requireAuth, requireAdmin, createProduct)
r.patch('/:id', requireAuth, requireAdmin, updateProduct)
r.delete('/:id', requireAuth, requireAdmin, deleteProduct)
export default r
