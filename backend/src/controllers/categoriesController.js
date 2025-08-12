import Product from '../models/Product.js'
export async function listCategories(_req, res){
  const cats = await Product.aggregate([
    { $match: { category: { $ne: null } } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $project: { _id: 0, name: '$_id', slug: '$_id', count: 1 } },
    { $sort: { name: 1 } }
  ])
  res.json(cats)
}
