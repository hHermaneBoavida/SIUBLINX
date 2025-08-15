"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Music, Calendar, Users, Eye, EyeOff, Filter, Volume2, Mail, X } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { canUserPerformAction } from "@/lib/plans"
import { PlanUpgradeModal } from "@/components/plan-upgrade-modal"
import { InviteRequestSystem } from "@/components/invite-request-system"

interface Event {
  id: string
  name: string
  genre: string
  type: string
  x: number // Position on map (percentage)
  y: number // Position on map (percentage)
  attendees: number
  isSecret: boolean
  distance: number // km
  time: string
  description: string
}

const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    name: "Experiência Techno Noturna",
    genre: "Techno",
    type: "Rave",
    x: 25,
    y: 30,
    attendees: 150,
    isSecret: false,
    distance: 2.5,
    time: "23:00",
    description: "Experiência techno imersiva",
  },
  {
    id: "2",
    name: "Sessão Bass Exclusiva",
    genre: "Drum & Bass",
    type: "Club",
    x: 60,
    y: 45,
    attendees: 80,
    isSecret: true,
    distance: 5.2,
    time: "22:30",
    description: "Sessão exclusiva de bass",
  },
  {
    id: "3",
    name: "Cyber Pulse",
    genre: "Psytrance",
    type: "Festival",
    x: 40,
    y: 70,
    attendees: 300,
    isSecret: false,
    distance: 8.1,
    time: "20:00",
    description: "Psychedelic journey",
  },
  {
    id: "4",
    name: "Dark Matter",
    genre: "Dark Techno",
    type: "Warehouse",
    x: 75,
    y: 25,
    attendees: 120,
    isSecret: true,
    distance: 3.7,
    time: "01:00",
    description: "Industrial warehouse party",
  },
  {
    id: "5",
    name: "Acid Dreams",
    genre: "Acid House",
    type: "Loft",
    x: 15,
    y: 60,
    attendees: 60,
    isSecret: true,
    distance: 1.8,
    time: "21:00",
    description: "Intimate acid house session",
  },
]

const GENRES = ["Todos", "Techno", "Drum & Bass", "Psytrance", "Dark Techno", "Acid House"]
const EVENT_TYPES = ["Todos", "Rave", "Club", "Festival", "Warehouse", "Loft"]

export function EventMap() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS)
  const [secretMode, setSecretMode] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [filters, setFilters] = useState({
    genre: "Todos",
    type: "Todos",
    maxDistance: 10,
  })
  const [showFilters, setShowFilters] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState("")
  const [showInviteSystem, setShowInviteSystem] = useState(false)

  const filteredEvents = events.filter((event) => {
    if (!secretMode && event.isSecret) return false
    if (filters.genre !== "Todos" && event.genre !== filters.genre) return false
    if (filters.type !== "Todos" && event.type !== filters.type) return false
    if (event.distance > filters.maxDistance) return false
    return true
  })

  const getEventIcon = (event: Event) => {
    if (event.isSecret) {
      return <Eye className="h-3 w-3" />
    }
    return <Music className="h-3 w-3" />
  }

  const getEventColor = (genre: string) => {
    const colors = {
      Techno: "text-neon-blue",
      "Drum & Bass": "text-neon-green",
      Psytrance: "text-neon-purple",
      "Dark Techno": "text-red-400",
      "Acid House": "text-yellow-400",
    }
    return colors[genre as keyof typeof colors] || "text-neon-blue"
  }

  const handleInviteRequest = () => {
    if (!user || user.plan === "free") {
      setShowInviteSystem(true)
      return
    }

    if (!canUserPerformAction(user.plan, "canAcceptInvites")) {
      setUpgradeReason("aceitar convites para eventos secretos")
      setShowUpgradeModal(true)
      return
    }
    alert("Solicitação de convite enviada! Aguarde aprovação do organizador.")
  }

  return (
    <div className="space-y-6">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neon-green neon-glow">Mapa de Eventos</h2>
          <p className="text-muted-foreground">Descubra eventos próximos a você</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="border-neon-blue/30 hover:border-neon-blue hover:bg-neon-blue/10"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>

          <Button
            onClick={() => setSecretMode(!secretMode)}
            className={`${
              secretMode
                ? "bg-neon-green text-black hover:bg-neon-green/90"
                : "bg-transparent border-2 border-neon-green text-neon-green hover:bg-neon-green/10"
            } neon-glow`}
          >
            {secretMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {secretMode ? "Modo Secreto Ativo" : "Ativar Modo Secreto"}
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="bg-card/80 backdrop-blur-xl border border-neon-blue/30">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Gênero</label>
                <select
                  value={filters.genre}
                  onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                  className="w-full bg-secondary/50 border border-border/50 rounded-md px-3 py-2 text-sm focus:border-neon-blue focus:ring-neon-blue/20"
                >
                  {GENRES.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Tipo</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="w-full bg-secondary/50 border border-border/50 rounded-md px-3 py-2 text-sm focus:border-neon-blue focus:ring-neon-blue/20"
                >
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Distância: {filters.maxDistance}km
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={filters.maxDistance}
                  onChange={(e) => setFilters({ ...filters, maxDistance: Number.parseInt(e.target.value) })}
                  className="w-full accent-neon-green"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-card/80 backdrop-blur-xl border border-neon-green/30 overflow-hidden">
            <div className="relative h-96 bg-gradient-to-br from-gray-900 via-black to-purple-900">
              {/* Map Background Grid */}
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="border border-neon-green/10"></div>
                  ))}
                </div>
              </div>

              {/* Animated Background Effects */}
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-neon-blue/5 rounded-full blur-2xl pulse-neon"></div>
                <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-neon-green/5 rounded-full blur-2xl pulse-neon"></div>
                <div className="absolute top-2/3 left-1/4 w-20 h-20 bg-neon-purple/5 rounded-full blur-2xl pulse-neon"></div>
              </div>

              {/* Event Markers */}
              {filteredEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${getEventColor(event.genre)} hover:scale-110 transition-all duration-300 neon-glow`}
                  style={{
                    left: `${event.x}%`,
                    top: `${event.y}%`,
                  }}
                >
                  <div className="relative">
                    <div
                      className={`w-8 h-8 rounded-full border-2 border-current bg-current/20 flex items-center justify-center ${event.isSecret ? "animate-pulse" : ""}`}
                    >
                      {getEventIcon(event)}
                    </div>
                    {event.isSecret && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-green rounded-full animate-ping"></div>
                    )}
                  </div>
                </button>
              ))}

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Music className="h-3 w-3 text-neon-blue" />
                  <span className="text-muted-foreground">Evento Público</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Eye className="h-3 w-3 text-neon-green" />
                  <span className="text-muted-foreground">Evento Secreto</span>
                </div>
              </div>

              {/* Event Counter */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-neon-green">{filteredEvents.length}</div>
                  <div className="text-xs text-muted-foreground">eventos</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Event Details Panel */}
        <div className="space-y-4">
          {selectedEvent ? (
            <Card className="bg-card/80 backdrop-blur-xl border border-neon-purple/30">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-neon-purple">{selectedEvent.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                  </div>
                  {selectedEvent.isSecret && (
                    <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">Secreto</Badge>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Music className="h-4 w-4 text-neon-blue" />
                    <span>{selectedEvent.genre}</span>
                    <Badge variant="outline" className="text-xs">
                      {selectedEvent.type}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-neon-green" />
                    <span>Hoje às {selectedEvent.time}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-neon-purple" />
                    <span>{selectedEvent.distance}km de distância</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-yellow-400" />
                    <span>{selectedEvent.attendees} pessoas confirmadas</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-neon-purple text-white hover:bg-neon-purple/90"
                    onClick={handleInviteRequest}
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Solicitar Convite
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-neon-blue/30 hover:border-neon-blue bg-transparent"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card/80 backdrop-blur-xl border border-border/30">
              <CardContent className="p-8 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Clique em um evento no mapa para ver os detalhes</p>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card className="bg-card/80 backdrop-blur-xl border border-neon-blue/30">
            <CardContent className="p-4">
              <h4 className="font-semibold text-neon-blue mb-3">Estatísticas</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Eventos Públicos</span>
                  <span className="text-neon-blue">{filteredEvents.filter((e) => !e.isSecret).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Eventos Secretos</span>
                  <span className="text-neon-green">{filteredEvents.filter((e) => e.isSecret).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total de Pessoas</span>
                  <span className="text-neon-purple">{filteredEvents.reduce((sum, e) => sum + e.attendees, 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invite Request System */}
      {showInviteSystem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-neon-purple/30 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-border/30 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neon-purple">Sistema de Convites</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInviteSystem(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <InviteRequestSystem />
            </div>
          </div>
        </div>
      )}

      {/* Plan Upgrade Modal */}
      <PlanUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={user?.plan || "free"}
        requiredFeature={upgradeReason}
      />
    </div>
  )
}
