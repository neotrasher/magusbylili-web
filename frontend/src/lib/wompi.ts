import axios from 'axios'

const WOMPI_PUBLIC_KEY = import.meta.env.VITE_WOMPI_PUBLIC_KEY || 'pub_prod_NvZKqB6v6k8s4L4b5z5R3xLq2j5J3'
const WOMPI_BASE_URL = import.meta.env.MODE === 'production' 
  ? 'https://checkout.wompi.co' 
  : 'https://checkout-sandbox.wompi.co'
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

/**
 * Crear un pago con Wompi
 */
export const createWompiPayment = async (paymentData) => {
  try {
    const response = await fetch(`${API_BASE}/payments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al crear el pago')
    }

    return data
  } catch (error) {
    console.error('Create Wompi payment error:', error)
    throw error
  }
}

/**
 * Obtener el estado de una transacción
 */
export const getTransactionStatus = async (transactionId) => {
  try {
    const response = await fetch(`${API_BASE}/payments/transaction/${transactionId}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener el estado')
    }

    return data.data
  } catch (error) {
    console.error('Get transaction status error:', error)
    throw error
  }
}

/**
 * Redirigir al checkout de Wompi para pagos con tarjeta
 */
export const redirectToWompiCheckout = (transactionId) => {
  const checkoutUrl = `${WOMPI_BASE_URL}/checkout/?public-key=${WOMPI_PUBLIC_KEY}&transaction-id=${transactionId}`
  window.location.href = checkoutUrl
}

/**
 * Generar un ID único para referencia de pago
 */
export const generatePaymentReference = () => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `magus_${timestamp}_${random}`
}

/**
 * Formatear cantidad para Wompi (en centavos)
 */
export const formatAmountForWompi = (amount) => {
  return Math.round(amount * 100) // Convertir pesos colombianos a centavos
}

/**
 * Métodos de pago disponibles
 */
export const PAYMENT_METHODS = {
  CARD: 'CARD',
  PSE: 'PSE',
  NEQUI: 'NEQUI',
  BANCOLOMBIA: 'BANCOLOMBIA_TRANSFER',
  CASH: 'CASH'
}