import mongoose from 'mongoose'
const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: String,
    price: Number,
    qty: Number
  }],
  amount: Number,
  status: { type: String, default: 'pending' },
  paymentRef: String,
  address: Object
}, { timestamps: true })
export default mongoose.model('Order', OrderSchema)
