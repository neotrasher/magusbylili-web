import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import User from '../models/User.js'
import { signJwt } from '../utils/jwt.js'
import { sendEmail } from '../utils/mailer.js'

export async function register(req, res){
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' })
  const exists = await User.findOne({ email })
  if (exists) return res.status(409).json({ error: 'Email already in use' })
  const hash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, password: hash })
  const token = signJwt({ _id: user._id, name: user.name, email: user.email, role: user.role })
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV==='production', maxAge: 7*24*60*60*1000 })
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role })
}
export async function login(req, res){
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  const token = signJwt({ _id: user._id, name: user.name, email: user.email, role: user.role })
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV==='production', maxAge: 7*24*60*60*1000 })
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role })
}
export async function logout(_req, res){
  res.clearCookie('token')
  res.json({ ok: true })
}

export async function requestPasswordReset(req, res){
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Missing email' })
  const user = await User.findOne({ email })
  if (user) {
    const token = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = token
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000)
    await user.save()
    const baseUrl = process.env.FRONT_ORIGIN || 'http://localhost:5173'
    const link = `${baseUrl}/reset-password?token=${token}`
    await sendEmail({
      to: user.email,
      subject: 'Restablecer contraseña',
      html: `<p>Hola ${user.name || ''},</p><p>Usa este enlace para cambiar tu contraseña:</p><p><a href="${link}">${link}</a></p><p>Este enlace expira en 1 hora.</p>`
    })
  }
  res.json({ ok: true })
}

export async function resetPassword(req, res){
  const { token, newPassword } = req.body
  if (!token || !newPassword) return res.status(400).json({ error: 'Missing fields' })
  const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: new Date() } })
  if (!user) return res.status(400).json({ error: 'Invalid or expired token' })
  user.password = await bcrypt.hash(newPassword, 10)
  user.resetPasswordToken = null
  user.resetPasswordExpires = null
  await user.save()
  res.json({ ok: true })
}

export async function promoteAdmin(req, res){
  const { email, userId } = req.body
  const adminCount = await User.countDocuments({ role: 'admin' })
  if (adminCount > 0 && req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' })
  }
  if (!email && !userId) return res.status(400).json({ error: 'Missing email or userId' })
  const user = await User.findOne(email ? { email } : { _id: userId })
  if (!user) return res.status(404).json({ error: 'User not found' })
  user.role = 'admin'
  await user.save()
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role })
}
