"use client"
import { Button } from "@/components/ui/button"
import { Map, Home, User, ShoppingBag, Trophy } from "lucide-react"

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: "feed", label: "Feed", icon: Home },
    { id: "map", label: "Mapa", icon: Map },
    { id: "profile", label: "Perfil", icon: User },
    { id: "marketplace", label: "Mercado", icon: ShoppingBag }, // Traduzido "Market" para "Mercado"
    { id: "rewards", label: "Recompensas", icon: Trophy }, // Traduzido "Rewards" para "Recompensas"
  ]

  return (
    <div className="bg-card/80 backdrop-blur-xl border-t border-border/30 p-4">
      <div className="flex justify-center">
        <div className="flex gap-2 bg-secondary/30 rounded-full p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={`rounded-full px-4 py-2 ${
                  activeTab === tab.id
                    ? "bg-neon-green text-black hover:bg-neon-green/90"
                    : "text-muted-foreground hover:text-neon-green hover:bg-neon-green/10"
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
