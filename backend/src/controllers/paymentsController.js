import crypto from 'crypto'

// Configuración de Wompi
const WOMPI_CONFIG = {
  public_key: process.env.WOMPI_PUBLIC_KEY || 'pub_prod_NvZKqB6v6k8s4L4b5z5R3xLq2j5J3',
  private_key: process.env.WOMPI_PRIVATE_KEY || 'prv_test_NvZKqB6v6k8s4L4b5z5R3xLq2j5J3',
  acceptance_token: process.env.WOMPI_ACCEPTANCE_TOKEN || 'pw_live_NvZKqB6v6k8s4L4b5z5R3xLq2j5J3',
  base_url: process.env.NODE_ENV === 'production' 
    ? 'https://api.wompi.co/v1' 
    : 'https://api-sandbox.wompi.co/v1'
}

/**
 * Crear una transacción de pago con Wompi
 */
export const createPayment = async (req, res) => {
  try {
    const {
      amount_in_cents,
      currency = 'COP',
      customer_email,
      payment_method,
      reference,
      redirect_url,
      payment_source_id,
      mockStatus
    } = req.body

    // Validaciones básicas
    if (!amount_in_cents || !customer_email || !payment_method) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos'
      })
    }

    if (process.env.WOMPI_MODE === 'mock') {
      const status = (mockStatus || 'APPROVED').toUpperCase()
      return res.json({
        success: true,
        data: {
          id: `mock_${Date.now()}`,
          status,
          reference,
          amount_in_cents,
          currency,
          payment_method_type: payment_method
        }
      })
    }

    // Body para crear la transacción
    const paymentBody = {
      amount_in_cents,
      currency,
      customer_email,
      payment_method,
      reference,
      redirect_url,
      acceptance_token: WOMPI_CONFIG.acceptance_token
    }

    // Si hay un payment_source_id, lo agregamos
    if (payment_source_id) {
      paymentBody.payment_source_id = payment_source_id
    }

    // Headers para la API de Wompi
    const headers = {
      'Authorization': `Bearer ${WOMPI_CONFIG.private_key}`,
      'Content-Type': 'application/json'
    }

    console.log('Creating Wompi payment:', {
      ...paymentBody,
      amount_in_cents: amount_in_cents / 100 // Mostrar en pesos
    })

    // Crear la transacción en Wompi
    const wompiResponse = await fetch(`${WOMPI_CONFIG.base_url}/transactions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(paymentBody)
    })

    const wompiData = await wompiResponse.json()

    if (!wompiResponse.ok) {
      console.error('Wompi API error:', wompiData)
      return res.status(400).json({
        success: false,
        message: 'Error al crear el pago con Wompi',
        error: wompiData
      })
    }

    console.log('Wompi payment created:', wompiData)

    res.json({
      success: true,
      data: wompiData.data
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

/**
 * Obtener el estado de una transacción
 */
export const getTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params

    const response = await fetch(`${WOMPI_CONFIG.base_url}/transactions/${id}`, {
      headers: {
        'Authorization': `Bearer ${WOMPI_CONFIG.private_key}`
      }
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(400).json({
        success: false,
        message: 'Transacción no encontrada'
      })
    }

    res.json({
      success: true,
      data: data.data
    })

  } catch (error) {
    console.error('Get transaction error:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}

/**
 * Webhook para recibir notificaciones de Wompi
 */
export const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-wompi-signature']
    const event = req.body

    console.log('Webhook received:', { signature, event })

    // Verificar la firma del webhook
    if (signature && !verifyWebhookSignature(JSON.stringify(event), signature)) {
      console.error('Invalid webhook signature')
      return res.status(401).json({
        success: false,
        message: 'Firma inválida'
      })
    }

    // Procesar el evento
    const { event: eventType, data } = event

    switch (eventType) {
      case 'transaction.updated':
        const transaction = data
        
        // Actualizar el estado de la orden en la base de datos
        if (transaction.status === 'APPROVED') {
          console.log(`✅ Payment approved: ${transaction.id}`)
          // Aquí actualizarías la orden en tu BD
          // await updateOrderStatus(transaction.reference, 'PAID', transaction)
        } else if (transaction.status === 'DECLINED') {
          console.log(`❌ Payment declined: ${transaction.id}`)
          // await updateOrderStatus(transaction.reference, 'DECLINED', transaction)
        } else if (transaction.status === 'ERROR') {
          console.log(`🚨 Payment error: ${transaction.id}`)
          // await updateOrderStatus(transaction.reference, 'ERROR', transaction)
        }
        break

      default:
        console.log(`Unknown event type: ${eventType}`)
    }

    // Responder a Wompi que recibimos el webhook
    res.status(200).json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({
      success: false,
      message: 'Error procesando webhook'
    })
  }
}

/**
 * Verificar la firma del webhook (simplificado)
 */
function verifyWebhookSignature(payload, signature) {
  try {
    // Para producción, necesitarías implementar la verificación real
    // con el timestamp y la firma de Wompi
    // Por ahora, aceptamos todos los webhooks en desarrollo
    if (process.env.NODE_ENV === 'development') {
      return true
    }
    
    // TODO: Implementar verificación real con crypto
    // const hmac = crypto.createHmac('sha256', WOMPI_CONFIG.private_key)
    //   .update(timestamp + payload)
    //   .digest('base64')
    // return hmac === signature
    
    return true
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}