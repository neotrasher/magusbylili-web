import { Router } from 'express'
import { listProducts, getProduct } from '../controllers/productsController.js'
const r = Router()
r.get('/', listProducts)
r.get('/:id', getProduct)
export default r
