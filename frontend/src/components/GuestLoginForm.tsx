import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { toast } from 'sonner'

interface GuestLoginFormProps {
  onSubmit: (email: string, password: string) => void
  onSwitchToRegister: () => void
  loading?: boolean
}

export default function GuestLoginForm({ onSubmit, onSwitchToRegister, loading = false }: GuestLoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '' })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validate = (): boolean => {
    const newErrors: typeof errors = { email: '', password: '' }

    if (!formData.email.trim()) {
      newErrors.email = 'Email requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.password) {
      newErrors.password = 'Contraseña requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres'
    }

    setErrors(newErrors)
    return Object.values(newErrors).every(error => !error)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData.email, formData.password)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <Lock className="w-5 h-5 text-[#C9A86C]" />
        Iniciar sesión
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="tu@email.com"
              className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-colors ${
                errors.email 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-200 focus:border-[#C9A86C]'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="•••••••"
              className={`w-full pl-10 pr-12 py-3 border rounded-xl outline-none transition-colors ${
                errors.password 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-200 focus:border-[#C9A86C]'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#C9A86C] hover:bg-[#b89559] disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Procesando...
            </>
          ) : (
            'Iniciar sesión'
          )}
        </button>

        {/* Switch to Register */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            ¿No tienes cuenta?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-[#C9A86C] hover:text-[#b89559] font-medium transition-colors"
            >
              Crear cuenta
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}