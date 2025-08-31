"use client"
import * as React from "react"
import { ArrowRight, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/global/checkout/custom-input"
interface DetailsStepProps {
  formData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    county: string
  }
  errors: Record<string, string>
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  setCurrentStep: (step: number) => void
  isFreeShipping: boolean
}
export const DetailsStep = React.memo(
  ({ formData, errors, handleInputChange, handleSubmit, setCurrentStep, isFreeShipping }: DetailsStepProps) => (
    <div className="space-y-6">
      <div className="bg-muted/30 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6 text-foreground">Shipping Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name *"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              error={errors.firstName}
              placeholder="John"
            />
            <Input
              label="Last Name *"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              error={errors.lastName}
              placeholder="Doe"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              placeholder="john@example.com"
            />
            <Input
              label="Phone *"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              error={errors.phone}
              placeholder="+254 7XX XXX XXX"
            />
          </div>
          <Input
            label="Address *"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            error={errors.address}
            placeholder="Street address"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="County *"
              name="county"
              value={formData.county}
              onChange={handleInputChange}
              error={errors.county}
              placeholder="e.g., Nairobi, Kiambu, Mombasa"
            />
            <Input
              label="City (Optional)"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              error={errors.city}
              placeholder="e.g., Westlands, CBD"
            />
          </div>
          {formData.county && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {isFreeShipping ? (
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />🎉 Free shipping to {formData.county}!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Shipping to {formData.county}: KSh 500
                  </span>
                )}
              </p>
            </div>
          )}
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
              Back to Cart
            </Button>
            <Button type="submit" className="flex-1">
              Continue to Payment
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  ),
)
DetailsStep.displayName = "DetailsStep"
