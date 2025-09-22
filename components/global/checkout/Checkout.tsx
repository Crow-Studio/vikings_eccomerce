"use client"
import type React from "react"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useCartStore } from "@/store/cart-store"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StepIndicator } from "@/components/global/checkout/step-indicator"
import { CartStep } from "@/components/global/checkout/cart-step"
import { DetailsStep } from "@/components/global/checkout/detail-step"
import { PaymentStep } from "@/components/global/checkout/payment-step"
import { OrderSummary } from "@/components/global/checkout/order-summary"
export default function VikingsCheckout() {
  const router = useRouter()
  const { items, clearCart, getTotalPrice } = useCartStore() 
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    county: "",
    paymentMethod: "mpesa",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const isFreeShipping = formData.county.toLowerCase() === "nairobi"
  const subtotal = getTotalPrice() 
  const shipping = isFreeShipping ? 0 : 500
  const total = subtotal + shipping
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }))
      }
    },
    [errors],
  )
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.county.trim()) newErrors.county = "County is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (validateForm()) {
        setCurrentStep(3)
      }
    },
    [validateForm],
  )
  const handleCompleteOrder = useCallback(async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    clearCart() 
    router.push("/checkout/success")
  }, [router, clearCart])
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 to-primary/5 relative">
      {}
      <div className="max-w-7xl mx-auto">
        {}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4 cursor-pointer">
            <Link href="/products">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4" />
                Back to Products
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Checkout</h1>
          {}
          <div className="flex items-center justify-between max-w-md mb-6">
            <StepIndicator step={1} title="Cart" isActive={currentStep === 1} isCompleted={currentStep > 1} />
            <div className="flex-1 h-px bg-muted mx-4"></div>
            <StepIndicator step={2} title="Details" isActive={currentStep === 2} isCompleted={currentStep > 2} />
            <div className="flex-1 h-px bg-muted mx-4"></div>
            <StepIndicator step={3} title="Payment" isActive={currentStep === 3} isCompleted={false} />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {}
          <div className="lg:col-span-2">
            {currentStep === 1 && <CartStep setCurrentStep={setCurrentStep} />}
            {currentStep === 2 && (
              <DetailsStep
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                setCurrentStep={setCurrentStep}
                isFreeShipping={isFreeShipping}
              />
            )}
            {currentStep === 3 && (
              <PaymentStep
                formData={formData}
                handleInputChange={handleInputChange}
                handleCompleteOrder={handleCompleteOrder}
                isProcessing={isProcessing}
                setCurrentStep={setCurrentStep}
              />
            )}
          </div>
          {}
          <div className="lg:col-span-1">
            <OrderSummary
              items={items} 
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              isFreeShipping={isFreeShipping}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
