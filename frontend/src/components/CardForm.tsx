import { useState } from 'react'
import { CreditCard, Lock, Check } from 'lucide-react'

interface CardFormProps {
  onSubmit: (cardData: CardData) => void
  loading?: boolean
}

export interface CardData {
  cardNumber: string
  cardName: string
  expiryDate: string
  cvv: string
  installments: number
}

export default function CardForm({ onSubmit, loading = false }: CardFormProps) {
  const [cardData, setCardData] = useState<CardData>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    installments: 1
  })

  const [errors, setErrors] = useState<Partial<CardData>>({})

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const chunks = cleaned.match(/.{1,4}/g) || []
    return chunks.join(' ')
  }

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
    }
    return cleaned
  }

  const handleInputChange = (field: keyof CardData, value: string) => {
    let formattedValue = value
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value)
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value)
    } else if (field === 'cvv' || field === 'installments') {
      formattedValue = value.replace(/\D/g, '')
    }

    setCardData(prev => ({ ...prev, [field]: formattedValue }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CardData> = {}

    // Card number validation
    const cleanedCardNumber = cardData.cardNumber.replace(/\s/g, '')
    if (!cleanedCardNumber || cleanedCardNumber.length < 13) {
      newErrors.cardNumber = 'Número de tarjeta inválido'
    }

    // Name validation
    if (!cardData.cardName.trim()) {
      newErrors.cardName = 'Nombre del titular requerido'
    }

    // Expiry date validation
    if (!cardData.expiryDate || !cardData.expiryDate.includes('/')) {
      newErrors.expiryDate = 'Fecha de vencimiento inválida'
    } else {
      const [month, year] = cardData.expiryDate.split('/')
      const currentYear = new Date().getFullYear() % 100
      const currentMonth = new Date().getMonth() + 1
      
      if (!month || !year || parseInt(month) > 12 || parseInt(year) < currentYear) {
        newErrors.expiryDate = 'Fecha de vencimiento inválida'
      } else if (parseInt(year) === currentYear && parseInt(month) < currentMonth) {
        newErrors.expiryDate = 'Tarjeta vencida'
      }
    }

    // CVV validation
    if (!cardData.cvv || cardData.cvv.length < 3) {
      newErrors.cvv = 'CVV inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        ...cardData,
        cardNumber: cardData.cardNumber.replace(/\s/g, '')
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Card Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Número de tarjeta
        </label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={cardData.cardNumber}
            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-colors ${
              errors.cardNumber 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-[#C9A86C]'
            }`}
          />
        </div>
        {errors.cardNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
        )}
      </div>

      {/* Card Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del titular
        </label>
        <input
          type="text"
          value={cardData.cardName}
          onChange={(e) => handleInputChange('cardName', e.target.value)}
          placeholder="JUAN PÉREZ"
          className={`w-full px-4 py-3 border rounded-xl outline-none transition-colors ${
            errors.cardName 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-200 focus:border-[#C9A86C]'
          }`}
        />
        {errors.cardName && (
          <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
        )}
      </div>

      {/* Expiry Date and CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vencimiento
          </label>
          <input
            type="text"
            value={cardData.expiryDate}
            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
            placeholder="MM/AA"
            maxLength={5}
            className={`w-full px-4 py-3 border rounded-xl outline-none transition-colors ${
              errors.expiryDate 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-[#C9A86C]'
            }`}
          />
          {errors.expiryDate && (
            <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVV
          </label>
          <input
            type="text"
            value={cardData.cvv}
            onChange={(e) => handleInputChange('cvv', e.target.value)}
            placeholder="123"
            maxLength={4}
            className={`w-full px-4 py-3 border rounded-xl outline-none transition-colors ${
              errors.cvv 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-[#C9A86C]'
            }`}
          />
          {errors.cvv && (
            <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
          )}
        </div>
      </div>

      {/* Installments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cuotas
        </label>
        <select
          value={cardData.installments}
          onChange={(e) => handleInputChange('installments', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#C9A86C] transition-colors"
        >
          <option value={1}>1 cuota (sin intereses)</option>
          <option value={2}>2 cuotas</option>
          <option value={3}>3 cuotas</option>
          <option value={6}>6 cuotas</option>
          <option value={12}>12 cuotas</option>
          <option value={18}>18 cuotas</option>
          <option value={24}>24 cuotas</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#C9A86C] hover:bg-[#b89559] disabled:bg-gray-300 text-white py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Pagar de forma segura
          </>
        )}
      </button>

      {/* Security info */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Check className="w-4 h-4 text-green-500" />
        Tu información está protegida con encriptación SSL
      </div>
    </form>
  )
}