"use client"
import * as React from "react"
import { CreditCard, Phone, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
interface PaymentStepProps {
  formData: {
    paymentMethod: string
  }
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleCompleteOrder: () => Promise<void>
  isProcessing: boolean
  setCurrentStep: (step: number) => void
}
export const PaymentStep = React.memo(
  ({ formData, handleInputChange, handleCompleteOrder, isProcessing, setCurrentStep }: PaymentStepProps) => (
    <div className="space-y-6">
      <div className="bg-muted/30 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6 text-foreground">Payment Method</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center p-4 bg-background rounded-lg border border-muted hover:bg-muted/20 transition-colors cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="mpesa"
                checked={formData.paymentMethod === "mpesa"}
                onChange={handleInputChange}
                className="mr-3"
              />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium">M-Pesa</div>
                  <div className="text-sm text-muted-foreground">Pay via M-Pesa</div>
                </div>
              </div>
            </label>
            <label className="flex items-center p-4 bg-background rounded-lg border border-muted hover:bg-muted/20 transition-colors cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === "card"}
                onChange={handleInputChange}
                className="mr-3"
              />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Card Payment</div>
                  <div className="text-sm text-muted-foreground">Visa, Mastercard</div>
                </div>
              </div>
            </label>
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
              Back to Details
            </Button>
            <Button className="flex-1 group" onClick={handleCompleteOrder} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span className="relative z-10">Complete Order</span>
                  <Shield className="w-4 h-4 transform group-hover:scale-110 transition-transform" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  ),
)
PaymentStep.displayName = "PaymentStep"
