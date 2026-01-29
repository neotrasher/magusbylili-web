import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import User from '../models/User.js'
import { sendEmail } from '../utils/mailer.js'

export async function me(req, res){
  if (!req.user?._id) return res.json(null)
  res.json({ _id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role })
}

export async function changePassword(req, res){
  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Missing fields' })
  const user = await User.findById(req.user?._id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  const ok = await bcrypt.compare(currentPassword, user.password)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  user.password = await bcrypt.hash(newPassword, 10)
  await user.save()
  res.json({ ok: true })
}

export async function requestEmailChange(req, res){
  const { newEmail } = req.body
  if (!newEmail) return res.status(400).json({ error: 'Missing email' })
  const existing = await User.findOne({ email: newEmail })
  if (existing) return res.status(409).json({ error: 'Email already in use' })
  const user = await User.findById(req.user?._id)
  if (!user) return res.status(404).json({ error: 'User not found' })

  const token = crypto.randomBytes(32).toString('hex')
  user.pendingEmail = newEmail
  user.emailChangeToken = token
  user.emailChangeExpires = new Date(Date.now() + 60 * 60 * 1000)
  await user.save()

  const baseUrl = process.env.FRONT_ORIGIN || 'http://localhost:5173'
  const link = `${baseUrl}/confirm-email?token=${token}`
  await sendEmail({
    to: newEmail,
    subject: 'Confirmar nuevo correo',
    html: `<p>Hola ${user.name || ''},</p><p>Confirma tu nuevo correo haciendo clic aqui:</p><p><a href="${link}">${link}</a></p><p>Este enlace expira en 1 hora.</p>`
  })

  res.json({ ok: true })
}

export async function confirmEmailChange(req, res){
  const { token } = req.body
  if (!token) return res.status(400).json({ error: 'Missing token' })
  const user = await User.findOne({ emailChangeToken: token, emailChangeExpires: { $gt: new Date() } })
  if (!user || !user.pendingEmail) return res.status(400).json({ error: 'Invalid or expired token' })
  user.email = user.pendingEmail
  user.pendingEmail = null
  user.emailChangeToken = null
  user.emailChangeExpires = null
  await user.save()
  res.json({ ok: true, email: user.email })
}
