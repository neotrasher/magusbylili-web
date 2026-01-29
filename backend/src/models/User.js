import mongoose from 'mongoose'
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  pendingEmail: { type: String, default: null },
  emailChangeToken: { type: String, default: null },
  emailChangeExpires: { type: Date, default: null }
}, { timestamps: true })
export default mongoose.model('User', UserSchema)
