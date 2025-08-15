"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Zap, X } from "lucide-react"
import { PLANS } from "@/lib/plans"

interface PlanUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: string
  requiredFeature: string
}

export function PlanUpgradeModal({ isOpen, onClose, currentPlan, requiredFeature }: PlanUpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>("premium")

  if (!isOpen) return null

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "premium":
        return <Crown className="h-5 w-5 text-neon-green" />
      case "pro":
        return <Zap className="h-5 w-5 text-neon-purple" />
      default:
        return null
    }
  }

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case "premium":
        return "border-neon-green/50 bg-neon-green/5"
      case "pro":
        return "border-neon-purple/50 bg-neon-purple/5"
      default:
        return "border-border/30"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-card/95 backdrop-blur-xl border border-neon-green/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-neon-green">Upgrade Necessário</h3>
            <p className="text-muted-foreground">Para {requiredFeature}, você precisa de um plano premium</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PLANS.filter((plan) => plan.id !== "free").map((plan) => (
              <Card
                key={plan.id}
                className={`cursor-pointer transition-all ${
                  selectedPlan === plan.id ? getPlanColor(plan.id) : "border-border/30 hover:border-neon-green/30"
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getPlanIcon(plan.id)}
                      <h4 className="text-xl font-bold">{plan.name}</h4>
                    </div>
                    {plan.id === "pro" && (
                      <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/30">Mais Popular</Badge>
                    )}
                  </div>
                  <div className="text-3xl font-bold text-neon-green">
                    R$ {plan.price.toFixed(2)}
                    <span className="text-sm text-muted-foreground font-normal">/mês</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-neon-green flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full ${
                      selectedPlan === plan.id
                        ? "bg-neon-green text-black hover:bg-neon-green/90"
                        : "bg-transparent border border-neon-green text-neon-green hover:bg-neon-green/10"
                    }`}
                    onClick={() => {
                      alert(`Upgrade para ${plan.name} em breve! Sistema de pagamento será implementado.`)
                      onClose()
                    }}
                  >
                    {selectedPlan === plan.id ? "Escolher Este Plano" : "Selecionar"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center pt-4 border-t border-border/30">
            <p className="text-sm text-muted-foreground mb-4">Todos os planos incluem 7 dias de teste gratuito</p>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-border/30 hover:border-neon-blue hover:bg-neon-blue/10 bg-transparent"
            >
              Continuar com Plano Gratuito
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
