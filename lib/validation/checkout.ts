const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^(\+254|0)[17]\d{8}$/
export const validationRules: ValidationRules = {
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s'-]+$/,
    message: {
      required: "First name is required",
      minLength: "First name must be at least 2 characters",
      maxLength: "First name cannot exceed 50 characters",
      pattern: "First name can only contain letters, spaces, hyphens, and apostrophes"
    }
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s'-]+$/,
    message: {
      required: "Last name is required",
      minLength: "Last name must be at least 2 characters",
      maxLength: "Last name cannot exceed 50 characters",
      pattern: "Last name can only contain letters, spaces, hyphens, and apostrophes"
    }
  },
  email: {
    required: true,
    pattern: emailRegex,
    maxLength: 254,
    message: {
      required: "Email is required",
      pattern: "Please enter a valid email address",
      maxLength: "Email cannot exceed 254 characters"
    }
  },
  phone: {
    required: true,
    pattern: phoneRegex,
    message: {
      required: "Phone number is required",
      pattern: "Please enter a valid Kenyan phone number (e.g., +254712345678 or 0712345678)"
    }
  },
  address: {
    required: true,
    minLength: 10,
    maxLength: 200,
    message: {
      required: "Address is required",
      minLength: "Address must be at least 10 characters",
      maxLength: "Address cannot exceed 200 characters"
    }
  },
  county: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s'-]+$/,
    message: {
      required: "County is required",
      minLength: "County must be at least 2 characters",
      maxLength: "County cannot exceed 50 characters",
      pattern: "County can only contain letters, spaces, hyphens, and apostrophes"
    }
  },
  city: {
    required: false,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s'-]*$/,
    message: {
      minLength: "City must be at least 2 characters",
      maxLength: "City cannot exceed 50 characters",
      pattern: "City can only contain letters, spaces, hyphens, and apostrophes"
    }
  },
  paymentMethod: {
    required: true,
    enum: ['mpesa', 'card'],
    message: {
      required: "Payment method is required",
      enum: "Please select a valid payment method"
    }
  }
}
export const kenyanCounties = [
  'Nairobi', 'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita Taveta',
  'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka Nithi',
  'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga',
  'Murang\'a', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia',
  'Uasin Gishu', 'Elgeyo Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru',
  'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma',
  'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira'
]
interface ValidationRule {
    required: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    enum?: string[]
    message: {
        required?: string
        minLength?: string
        maxLength?: string
        pattern?: string
        enum?: string
    }
}
interface ValidationRules {
    [key: string]: ValidationRule
}
export const validateField = (fieldName: string, value: string | undefined): string | null => {
    const rule: ValidationRule | undefined = (validationRules as ValidationRules)[fieldName]
    if (!rule) return null
    const trimmedValue: string = typeof value === 'string' ? value.trim() : value || ''
    if (rule.required && (!trimmedValue || trimmedValue === '')) {
        return rule.message.required || null
    }
    if (!rule.required && (!trimmedValue || trimmedValue === '')) {
        return null
    }
    if (rule.minLength && trimmedValue.length < rule.minLength) {
        return rule.message.minLength || null
    }
    if (rule.maxLength && trimmedValue.length > rule.maxLength) {
        return rule.message.maxLength || null
    }
    if (rule.pattern && !rule.pattern.test(trimmedValue)) {
        return rule.message.pattern || null
    }
    if (rule.enum && !rule.enum.includes(trimmedValue)) {
        return rule.message.enum || null
    }
    if (fieldName === 'county' && trimmedValue) {
        const isValidCounty: boolean = kenyanCounties.some((county: string) => 
            county.toLowerCase() === trimmedValue.toLowerCase()
        )
        if (!isValidCounty) {
            return "Please enter a valid Kenyan county"
        }
    }
    return null
}
interface CheckoutFormData {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    address?: string
    county?: string
    city?: string
    paymentMethod?: string
}
interface ValidationErrors {
    [key: string]: string
}
interface ValidationResult {
    isValid: boolean
    errors: ValidationErrors
}
export const validateCheckoutForm = (formData: CheckoutFormData): ValidationResult => {
    const errors: ValidationErrors = {}
    Object.keys(validationRules).forEach((fieldName: string) => {
        const error = validateField(fieldName, (formData as any)[fieldName])
        if (error) {
            errors[fieldName] = error
        }
    })
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}
export const validateFieldRealTime = (fieldName: string, value: string | undefined): string | null => {
  return validateField(fieldName, value)
}
export const isFreeShipping = (county: string | undefined): boolean => {
  return county ? county.toLowerCase() === 'nairobi' : false
}
export const calculateShipping = (county: string | undefined): number => {
  return isFreeShipping(county) ? 0 : 500
}
export const formatPhoneNumber = (phone: string | undefined): string => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 12 && cleaned.startsWith('254')) {
    return `+254 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`
  } else if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
  }
  return phone
}
export const normalizePhoneNumber = (phone: string): string => {
    if (!phone) return ''
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10 && cleaned.startsWith('0')) {
        return `+254${cleaned.slice(1)}`
    } else if (cleaned.length === 12 && cleaned.startsWith('254')) {
        return `+${cleaned}`
    } else if (cleaned.length === 9) {
        return `+254${cleaned}`
    }
    return phone
}