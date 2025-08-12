import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { signJwt } from '../utils/jwt.js'
export async function register(req, res){
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' })
  const exists = await User.findOne({ email })
  if (exists) return res.status(409).json({ error: 'Email already in use' })
  const hash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, password: hash })
  const token = signJwt({ _id: user._id, name: user.name, email: user.email })
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV==='production', maxAge: 7*24*60*60*1000 })
  res.json({ _id: user._id, name: user.name, email: user.email })
}
export async function login(req, res){
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  const token = signJwt({ _id: user._id, name: user.name, email: user.email })
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV==='production', maxAge: 7*24*60*60*1000 })
  res.json({ _id: user._id, name: user.name, email: user.email })
}
export async function logout(_req, res){
  res.clearCookie('token')
  res.json({ ok: true })
}
