import Product from '../models/Product.js'
export async function listProducts(req, res){
  const page = Math.max(1, parseInt(req.query.page) || 1)
  const limit = Math.min(100, parseInt(req.query.limit) || 12)
  const q = {}
  if (req.query.category) q.category = req.query.category
  if (req.query.q) q.title = { $regex: req.query.q, $options: 'i' }
  const sort = req.query.sort || '-createdAt'
  const [items, total] = await Promise.all([
    Product.find(q).sort(sort).skip((page-1)*limit).limit(limit),
    Product.countDocuments(q)
  ])
  res.json({ data: items, total, page, limit })
}
export async function getProduct(req, res){
  const p = await Product.findById(req.params.id)
  if (!p) return res.status(404).json({ error: 'Product not found' })
  res.json(p)
}
