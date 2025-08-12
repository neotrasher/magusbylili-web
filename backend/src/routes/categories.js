import { Router } from 'express'
import { listCategories } from '../controllers/categoriesController.js'
const r = Router()
r.get('/', listCategories)
export default r
