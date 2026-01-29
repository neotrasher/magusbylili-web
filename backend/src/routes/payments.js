import express from 'express'
import { 
  createPayment, 
  getTransactionStatus, 
  handleWebhook 
} from '../controllers/paymentsController.js'

const router = express.Router()

// Crear un pago
router.post('/create', createPayment)

// Obtener estado de una transacción
router.get('/transaction/:id', getTransactionStatus)

// Webhook de Wompi
router.post('/webhook', handleWebhook)

export default router