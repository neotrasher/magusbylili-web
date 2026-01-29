import { useState } from 'react'
import { CreditCard, Smartphone, Building2, DollarSign } from 'lucide-react'

interface PaymentMethod {
  id: string
  name: string
  icon: React.ComponentType<any>
  description: string
  color: string
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Tarjeta de crédito o débito',
    icon: CreditCard,
    description: 'Visa, Mastercard, American Express',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
  },
  {
    id: 'pse',
    name: 'PSE',
    icon: Building2,
    description: 'Transferencia desde cualquier banco',
    color: 'bg-green-50 border-green-200 hover:bg-green-100'
  },
  {
    id: 'nequi',
    name: 'Nequi',
    icon: Smartphone,
    description: 'Paga con tu número de celular',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
  },
  {
    id: 'bancolombia',
    name: 'Botón Bancolombia',
    icon: DollarSign,
    description: 'Desde tu app Bancolombia',
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100'
  }
]

interface PaymentMethodSelectorProps {
  selectedMethod: string
  onMethodChange: (method: string) => void
}

export default function PaymentMethodSelector({ selectedMethod, onMethodChange }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Método de pago</h3>
      
      <div className="grid gap-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon
          const isSelected = selectedMethod === method.id
          
          return (
            <button
              key={method.id}
              onClick={() => onMethodChange(method.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                isSelected 
                  ? `${method.color} border-[#C9A86C] shadow-md` 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                isSelected ? 'bg-[#C9A86C] text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              
              {/* Content */}
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-800">{method.name}</div>
                <div className="text-sm text-gray-500">{method.description}</div>
              </div>
              
              {/* Radio button */}
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                isSelected ? 'border-[#C9A86C]' : 'border-gray-300'
              }`}>
                {isSelected && (
                  <div className="w-3 h-3 bg-[#C9A86C] rounded-full" />
                )}
              </div>
            </button>
          )
        })}
      </div>
      
      {/* Info message */}
      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 text-amber-600 mt-0.5">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm text-amber-800">
            <strong>Pago seguro:</strong> Tus datos están encriptados y protegidos. Wompi cumple con los estándares de seguridad más altos de Colombia.
          </div>
        </div>
      </div>
    </div>
  )
}