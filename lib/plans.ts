export interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  limits: {
    eventsPerMonth: number
    invitesPerEvent: number
    marketplaceListings: number
    canSellTickets: boolean
    canSendInvites: boolean
    canAcceptInvites: boolean
    canSellProducts: boolean
  }
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Gratuito",
    price: 0,
    features: ["Visualizar eventos públicos", "Participar do feed", "Comprar produtos no marketplace", "Perfil básico"],
    limits: {
      eventsPerMonth: 0,
      invitesPerEvent: 0,
      marketplaceListings: 0,
      canSellTickets: false,
      canSendInvites: false,
      canAcceptInvites: false,
      canSellProducts: false,
    },
  },
  {
    id: "premium",
    name: "Premium",
    price: 29.9,
    features: [
      "Publicar até 5 eventos por mês",
      "Enviar até 50 convites por evento",
      "Vender até 10 produtos no marketplace",
      "Aceitar convites para eventos secretos",
      "Vender ingressos para seus eventos",
      "Perfil verificado",
    ],
    limits: {
      eventsPerMonth: 5,
      invitesPerEvent: 50,
      marketplaceListings: 10,
      canSellTickets: true,
      canSendInvites: true,
      canAcceptInvites: true,
      canSellProducts: true,
    },
  },
  {
    id: "pro",
    name: "Pro",
    price: 59.9,
    features: [
      "Eventos ilimitados",
      "Convites ilimitados",
      "Marketplace ilimitado",
      "Análises avançadas",
      "Suporte prioritário",
      "Badge exclusivo",
    ],
    limits: {
      eventsPerMonth: -1, // unlimited
      invitesPerEvent: -1, // unlimited
      marketplaceListings: -1, // unlimited
      canSellTickets: true,
      canSendInvites: true,
      canAcceptInvites: true,
      canSellProducts: true,
    },
  },
]

export function getPlanById(planId: string): Plan {
  return PLANS.find((plan) => plan.id === planId) || PLANS[0]
}

export function canUserPerformAction(userPlan: string, action: keyof Plan["limits"]): boolean {
  const plan = getPlanById(userPlan)
  return plan.limits[action] as boolean
}

export function getUserLimit(userPlan: string, limit: keyof Plan["limits"]): number | boolean {
  const plan = getPlanById(userPlan)
  return plan.limits[limit]
}
