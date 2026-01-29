import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { getTransactionStatus } from '../lib/wompi'
import { CheckCircle, XCircle, Clock, ShoppingBag, ArrowLeft, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useSeo } from '../lib/seo'

type PaymentStatus = 'loading' | 'approved' | 'declined' | 'error' | 'pending'

export default function PaymentConfirmation() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<PaymentStatus>('loading')
  const [transaction, setTransaction] = useState<any>(null)
  const [reference, setReference] = useState<string>('')

  useSeo({
    title: 'Confirmacion de pago',
    description: 'Estado de tu pago y confirmacion de compra.',
    canonical: `${import.meta.env.VITE_SITE_URL || window.location.origin}/payment-confirmation`
  })

  useEffect(() => {
    const ref = searchParams.get('ref')
    const transactionId = searchParams.get('transaction_id')
    
    if (ref) {
      setReference(ref)
      checkPaymentStatus(ref, transactionId)
    } else {
      setStatus('error')
    }
  }, [searchParams])

  const checkPaymentStatus = async (ref: string, transactionId?: string | null) => {
    try {
      setStatus('loading')
      
      if (transactionId) {
        // Verificar estado con el ID de transacción
        const data = await getTransactionStatus(transactionId)
        setTransaction(data)

        switch (data.status) {
          case 'APPROVED':
            setStatus('approved')
            break
          case 'DECLINED':
            setStatus('declined')
            break
          case 'ERROR':
            setStatus('error')
            break
          case 'PENDING':
            setStatus('pending')
            break
          default:
            setStatus('pending')
        }
      } else {
        // Esperar un momento y verificar por referencia
        setTimeout(() => {
          setStatus('pending')
        }, 3000)
      }
    } catch (error) {
      console.error('Error checking payment status:', error)
      setStatus('error')
    }
  }

  const handleRetry = () => {
    window.location.href = '/checkout'
  }

  const renderStatusContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center py-12">
            <div className="w-20 h-20 border-4 border-[#C9A86C] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Verificando tu pago...</h2>
            <p className="text-gray-600">Estamos confirmando el estado de tu transacción.</p>
          </div>
        )

      case 'approved':
        return (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">¡Pago exitoso!</h2>
            <p className="text-green-600 text-lg font-medium mb-6">
              Tu orden ha sido confirmada
            </p>
            {transaction && (
              <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left max-w-md mx-auto">
                <h3 className="font-semibold text-gray-800 mb-4">Detalles del pago</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Referencia:</span>
                    <span className="font-medium">{transaction.reference || reference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID Transacción:</span>
                    <span className="font-medium">{transaction.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monto:</span>
                    <span className="font-semibold text-green-600">
                      ${(transaction.amount_in_cents / 100).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Método:</span>
                    <span className="font-medium">
                      {transaction.payment_method_type === 'CARD' ? 'Tarjeta' : 
                       transaction.payment_method_type === 'PSE' ? 'PSE' : 'Otro'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="bg-[#C9A86C] hover:bg-[#b89559] text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Seguir comprando
              </Link>
              <Link
                to="/account"
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Ver mis pedidos
              </Link>
            </div>
          </div>
        )

      case 'declined':
        return (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Pago rechazado</h2>
            <p className="text-red-600 text-lg font-medium mb-6">
              Tu pago no pudo ser procesado
            </p>
            {transaction && (
              <div className="bg-red-50 rounded-xl p-6 mb-6 text-left max-w-md mx-auto">
                <p className="text-red-800 text-sm">
                  <strong>Razón:</strong> {transaction.status_message || 'Transacción declinada por el banco'}
                </p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRetry}
                className="bg-[#C9A86C] hover:bg-[#b89559] text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Intentar de nuevo
              </button>
              <Link
                to="/cart"
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Revisar carrito
              </Link>
            </div>
          </div>
        )

      case 'pending':
        return (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Pago en proceso</h2>
            <p className="text-amber-600 text-lg font-medium mb-6">
              Tu pago está siendo verificado
            </p>
            <div className="bg-amber-50 rounded-xl p-6 mb-6 max-w-md mx-auto">
              <p className="text-amber-800">
                Esto puede tardar unos minutos. Te enviaremos un correo cuando el proceso se complete.
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Link
                to="/"
                className="bg-[#C9A86C] hover:bg-[#b89559] text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        )

      case 'error':
      default:
        return (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Error en el pago</h2>
            <p className="text-red-600 text-lg font-medium mb-6">
              Ocurrió un error procesando tu pago
            </p>
            <div className="bg-red-50 rounded-xl p-6 mb-6 max-w-md mx-auto">
              <p className="text-red-800 text-sm">
                Por favor intenta de nuevo o contacta a soporte si el problema persiste.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRetry}
                className="bg-[#C9A86C] hover:bg-[#b89559] text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Intentar de nuevo
              </button>
              <Link
                to="/"
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Ir a inicio
              </Link>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-[#C9A86C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la tienda
          </Link>
        </div>

        {/* Status content */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            {renderStatusContent()}
          </div>
        </div>
      </div>
    </div>
  )
}