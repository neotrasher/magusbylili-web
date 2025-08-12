import { Router } from 'express'
import products from './products.js'
import categories from './categories.js'
import auth from './auth.js'
import orders from './orders.js'
import me from './me.js'

const r = Router()
r.use('/products', products)
r.use('/categories', categories)
r.use('/auth', auth)
r.use('/orders', orders)
r.use('/me', me)
export default r
