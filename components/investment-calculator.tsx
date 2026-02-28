"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface InvestmentCalculatorProps {
  isOpen: boolean
  onClose: () => void
}

export function InvestmentCalculator({ isOpen, onClose }: InvestmentCalculatorProps) {
  const [initialAmount, setInitialAmount] = useState("10000")
  const [monthlyContribution, setMonthlyContribution] = useState("500")
  const [annualReturn, setAnnualReturn] = useState("7")
  const [years, setYears] = useState("10")
  const [result, setResult] = useState<number | null>(null)

  const calculateInvestment = () => {
    const principal = Number.parseFloat(initialAmount) || 0
    const monthly = Number.parseFloat(monthlyContribution) || 0
    const rate = Number.parseFloat(annualReturn) / 100 / 12
    const months = Number.parseInt(years) * 12

    // Future value of initial investment
    const fvPrincipal = principal * Math.pow(1 + rate, months)

    // Future value of monthly contributions (annuity formula)
    const fvMonthly = (monthly * (Math.pow(1 + rate, months) - 1)) / rate

    const total = fvPrincipal + fvMonthly
    setResult(total)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 bg-card border-border space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Investment Calculator</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Initial Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Initial Investment</label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">$</span>
              <input
                type="number"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                className="flex-1 px-3 py-2 bg-secondary text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Monthly Contribution */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Monthly Contribution</label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">$</span>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                className="flex-1 px-3 py-2 bg-secondary text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Annual Return */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Expected Annual Return (%)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(e.target.value)}
                step="0.1"
                className="flex-1 px-3 py-2 bg-secondary text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-muted-foreground">%</span>
            </div>
          </div>

          {/* Years */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Investment Period (years)</label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="w-full px-3 py-2 bg-secondary text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Calculate Button */}
          <Button onClick={calculateInvestment} className="w-full bg-primary text-primary-foreground hover:opacity-90">
            Calculate
          </Button>

          {/* Result */}
          {result !== null && (
            <Card className="bg-secondary p-4 border-border">
              <p className="text-sm text-muted-foreground mb-2">Projected Value:</p>
              <p className="text-3xl font-bold text-primary">${result.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Based on ${initialAmount} initial + ${monthlyContribution}/month @ {annualReturn}% annual return
              </p>
            </Card>
          )}
        </div>

        <Button onClick={onClose} variant="outline" className="w-full bg-transparent">
          Close
        </Button>
      </Card>
    </div>
  )
}
