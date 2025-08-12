import Order from '../models/Order.js'
export async function listOrders(req, res){
  const orders = await Order.find({ userId: req.user?._id }).sort('-createdAt')
  res.json(orders)
}
export async function createOrder(req, res){
  const { items=[], address={}, paymentRef } = req.body
  const amount = items.reduce((s,i)=> s + (i.price * i.qty), 0)
  const order = await Order.create({ userId: req.user?._id, items, address, paymentRef, amount, status: 'pending' })
  res.status(201).json(order)
}
