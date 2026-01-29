import { useState } from 'react'
import { Building2, Search, ArrowRight } from 'lucide-react'

interface PSEFormData {
  bankCode: string
  documentType: string
  documentNumber: string
  name: string
  email: string
}

interface PSEFormProps {
  onSubmit: (data: PSEFormData) => void
  loading?: boolean
}

// Lista de bancos de Colombia (simplificada)
const banks = [
  { code: '0001', name: 'Bancolombia' },
  { code: '0002', name: 'Davivienda' },
  { code: '0007', name: 'Banco de Bogotá' },
  { code: '0010', name: 'Banco AV Villas' },
  { code: '0012', name: 'Banco Popular' },
  { code: '0013', name: 'Bancoomeva' },
  { code: '0019', name: 'Banco Caja Social' },
  { code: '0023', name: 'Banco Sucre' },
  { code: '0032', name: 'Banco Daviplata' },
  { code: '0044', name: 'Banco WWB' },
  { code: '0049', name: 'Banco Cooperativo Coopcentral' },
  { code: '0053', name: 'Bancoomeva' },
  { code: '0060', name: 'Banco Pichincha' },
  { code: '0105', name: 'Banco Davivienda' },
  { code: '0108', name: 'Banco Agrario' },
  { code: '0128', name: 'Banco Caja Social' },
  { code: '0132', name: 'Banco del Pacífico' },
  { code: '0151', name: 'Banco Falabella' },
  { code: '0192', name: 'Banco GM' },
]

const documentTypes = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'NIT', label: 'NIT' },
  { value: 'PP', label: 'Pasaporte' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
]

export default function PSEForm({ onSubmit, loading = false }: PSEFormProps) {
  const [formData, setFormData] = useState<PSEFormData>({
    bankCode: '',
    documentType: 'CC',
    documentNumber: '',
    name: '',
    email: ''
  })

  const [errors, setErrors] = useState<Partial<PSEFormData>>({})

  const handleInputChange = (field: keyof PSEFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<PSEFormData> = {}

    if (!formData.bankCode) {
      newErrors.bankCode = 'Selecciona un banco'
    }

    if (!formData.documentNumber) {
      newErrors.documentNumber = 'Número de documento requerido'
    } else if (formData.documentNumber.length < 5) {
      newErrors.documentNumber = 'Documento inválido'
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Nombre requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Bank Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Banco
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar banco..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#C9A86C] transition-colors mb-3"
            onChange={(e) => {
              // Aquí podrías implementar filtrado de bancos
            }}
          />
        </div>
        <select
          value={formData.bankCode}
          onChange={(e) => handleInputChange('bankCode', e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl outline-none transition-colors ${
            errors.bankCode 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-200 focus:border-[#C9A86C]'
          }`}
        >
          <option value="">Selecciona tu banco</option>
          {banks.map(bank => (
            <option key={bank.code} value={bank.code}>
              {bank.name}
            </option>
          ))}
        </select>
        {errors.bankCode && (
          <p className="text-red-500 text-sm mt-1">{errors.bankCode}</p>
        )}
      </div>

      {/* Document Type and Number */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de documento
          </label>
          <select
            value={formData.documentType}
            onChange={(e) => handleInputChange('documentType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#C9A86C] transition-colors"
          >
            {documentTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de documento
          </label>
          <input
            type="text"
            value={formData.documentNumber}
            onChange={(e) => handleInputChange('documentNumber', e.target.value)}
            placeholder="1234567890"
            className={`w-full px-4 py-3 border rounded-xl outline-none transition-colors ${
              errors.documentNumber 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-[#C9A86C]'
            }`}
          />
          {errors.documentNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.documentNumber}</p>
          )}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre completo
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="JUAN PÉREZ GONZÁLEZ"
          className={`w-full px-4 py-3 border rounded-xl outline-none transition-colors ${
            errors.name 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-200 focus:border-[#C9A86C]'
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Correo electrónico
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="correo@ejemplo.com"
          className={`w-full px-4 py-3 border rounded-xl outline-none transition-colors ${
            errors.email 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-200 focus:border-[#C9A86C]'
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Info Message */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start gap-2">
          <Building2 className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <strong>Proceso PSE:</strong> Serás redirigido a tu banco para completar el pago de forma segura. Después de autorizar, volverás automáticamente a la tienda.
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            Continuar a banco
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  )
}