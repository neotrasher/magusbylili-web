import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import apiRouter from './routes/index.js'

dotenv.config()
const app = express()

mongoose.connect(process.env.MONGO_URI, { dbName: 'ecommerce' })
  .then(()=> console.log('[DB] connected'))
  .catch(err=> console.error('[DB] error', err))

const allowed = [process.env.FRONT_ORIGIN, 'http://localhost:5173'].filter(Boolean)
app.use(cors({ origin: (origin, cb)=> cb(null, !origin || allowed.includes(origin)), credentials: true }))
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

app.use('/api', apiRouter)

app.get('/health', (_req,res)=> res.json({ ok: true }))

app.use((req,res)=>res.status(404).json({error:'Not found'}))
app.use((err,req,res,next)=>{ console.error(err); res.status(err.status||500).json({error: err.message||'Server error'}) })

export default app
