import Order from '../models/Order.js'
export async function listOrders(req, res){
  const orders = await Order.find({ userId: req.user?._id }).sort('-createdAt')
  res.json(orders)
}

export async function listAllOrders(req, res){
  const orders = await Order.find({}).sort('-createdAt')
  res.json(orders)
}

export async function updateOrderStatus(req, res){
  const { status } = req.body
  if (!status) return res.status(400).json({ error: 'Missing status' })
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
  if (!order) return res.status(404).json({ error: 'Order not found' })
  res.json(order)
}

export async function createOrder(req, res){
  const { items=[], address={}, paymentRef } = req.body
  const amount = items.reduce((s,i)=> s + (i.price * i.qty), 0)
  const order = await Order.create({ userId: req.user?._id, items, address, paymentRef, amount, status: 'pending' })
  res.status(201).json(order)
}
