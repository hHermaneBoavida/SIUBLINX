"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth"
import { Mail, Check, X, MessageCircle, CreditCard, MapPin, Calendar, Users, Music } from "lucide-react"

interface InviteRequest {
  id: string
  eventId: string
  eventName: string
  eventImage: string
  requesterName: string
  requesterAvatar: string
  message: string
  status: "pending" | "approved" | "rejected"
  timestamp: string
}

interface EventDetails {
  id: string
  name: string
  description: string
  fullDescription: string
  image: string // Adicionado campo image
  location: {
    exact: string
    coordinates: string
  }
  price: number
  availableTickets: number
  lineup: string[]
  amenities: string[]
  rules: string[]
}

const MOCK_INVITE_REQUESTS: InviteRequest[] = [
  {
    id: "1",
    eventId: "2",
    eventName: "Sessão Bass Exclusiva",
    eventImage: "/exclusive-drum-bass.png",
    requesterName: "Alex Silva",
    requesterAvatar: "/placeholder.svg",
    message: "Sou fã de drum & bass há anos e adoraria participar desta sessão exclusiva!",
    status: "pending",
    timestamp: "há 2 horas",
  },
  {
    id: "2",
    eventId: "4",
    eventName: "Dark Matter",
    eventImage: "/placeholder.svg",
    requesterName: "Maria Santos",
    requesterAvatar: "/placeholder.svg",
    message: "Tenho experiência em eventos underground e respeito as regras da comunidade.",
    status: "approved",
    timestamp: "há 1 dia",
  },
]

const MOCK_EVENT_DETAILS: EventDetails = {
  id: "2",
  name: "Sessão Bass Exclusiva",
  description: "Sessão exclusiva de drum & bass em local revelado apenas para membros VIP.",
  fullDescription:
    "Uma experiência única de drum & bass com lineup internacional secreto. O evento acontece em um warehouse reformado com sistema de som de última geração. Apenas 80 pessoas selecionadas terão acesso a esta noite épica.",
  image: "/exclusive-drum-bass.png",
  location: {
    exact: "Warehouse 47 - Rua Industrial, 234 - Vila Madalena",
    coordinates: "-23.5505, -46.6333",
  },
  price: 85,
  availableTickets: 12,
  lineup: ["DJ Shadow Bass", "MC Velocity", "Producer X", "Local Hero"],
  amenities: ["Bar Premium", "Área VIP", "Coat Check", "Segurança 24h"],
  rules: ["Proibido fotos/vídeos", "Dress code: Dark/Industrial", "Idade mínima: 21 anos"],
}

export function InviteRequestSystem() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<InviteRequest[]>(MOCK_INVITE_REQUESTS)
  const [selectedRequest, setSelectedRequest] = useState<InviteRequest | null>(null)
  const [showEventDetails, setShowEventDetails] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [requestMessage, setRequestMessage] = useState("")

  const handleApproveRequest = (requestId: string) => {
    setRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: "approved" as const } : req)))
    alert("Convite aprovado! O solicitante foi notificado.")
  }

  const handleRejectRequest = (requestId: string) => {
    setRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: "rejected" as const } : req)))
    alert("Convite rejeitado.")
  }

  const handleSendInviteRequest = (eventId: string) => {
    if (!requestMessage.trim()) {
      alert("Por favor, escreva uma mensagem para o organizador.")
      return
    }

    const newRequest: InviteRequest = {
      id: Date.now().toString(),
      eventId,
      eventName: "Evento Solicitado",
      eventImage: "/placeholder.svg",
      requesterName: user?.name || "Usuário",
      requesterAvatar: "/placeholder.svg",
      message: requestMessage,
      status: "pending",
      timestamp: "agora",
    }

    setRequests((prev) => [newRequest, ...prev])
    setRequestMessage("")
    alert("Solicitação de convite enviada! Aguarde a aprovação do organizador.")
  }

  const handleBuyTicket = () => {
    alert(`Redirecionando para pagamento de R$ ${MOCK_EVENT_DETAILS.price}...`)
  }

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return
    alert(`Mensagem enviada: "${chatMessage}"`)
    setChatMessage("")
  }

  // Organizer View - Para usuários com planos que podem gerenciar eventos
  if (user?.plan !== "free") {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-neon-green neon-glow mb-2">Solicitações de Convite</h3>
          <p className="text-muted-foreground">Gerencie as solicitações para seus eventos</p>
        </div>

        <div className="grid gap-4">
          {requests.map((request) => (
            <Card key={request.id} className="bg-card/80 backdrop-blur-xl border border-border/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={request.requesterAvatar || "/placeholder.svg"} alt={request.requesterName} />
                    <AvatarFallback>{request.requesterName[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{request.requesterName}</h4>
                        <p className="text-sm text-muted-foreground">Solicitou convite para: {request.eventName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            request.status === "approved"
                              ? "bg-neon-green/20 text-neon-green border-neon-green/30"
                              : request.status === "rejected"
                                ? "bg-red-500/20 text-red-500 border-red-500/30"
                                : "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                          }
                        >
                          {request.status === "approved"
                            ? "Aprovado"
                            : request.status === "rejected"
                              ? "Rejeitado"
                              : "Pendente"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{request.timestamp}</span>
                      </div>
                    </div>

                    <p className="text-sm mb-3 bg-secondary/30 p-3 rounded-lg">{request.message}</p>

                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveRequest(request.id)}
                          className="bg-neon-green text-black hover:bg-neon-green/90"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectRequest(request.id)}
                          className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Rejeitar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedRequest(request)
                            setShowChat(true)
                          }}
                          className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Chat
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // User View - Para usuários gratuitos
  const approvedRequest = requests.find((r) => r.status === "approved" && r.eventId === "2")

  return (
    <div className="space-y-6">
      {/* Request Form */}
      <Card className="bg-card/80 backdrop-blur-xl border border-neon-purple/30">
        <CardHeader>
          <CardTitle className="text-neon-purple">Solicitar Convite para Evento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Escreva uma mensagem para o organizador explicando por que você gostaria de participar..."
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            className="bg-secondary/50 border-border/50 focus:border-neon-purple"
          />
          <Button
            onClick={() => handleSendInviteRequest("2")}
            className="bg-neon-purple text-white hover:bg-neon-purple/90"
          >
            <Mail className="h-4 w-4 mr-2" />
            Enviar Solicitação
          </Button>
        </CardContent>
      </Card>

      {/* Approved Event Details */}
      {approvedRequest && (
        <Card className="bg-card/80 backdrop-blur-xl border border-neon-green/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-neon-green" />
              <CardTitle className="text-neon-green">Convite Aprovado!</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Event Full Details */}
            <div className="space-y-4">
              <img
                src={MOCK_EVENT_DETAILS.image || "/placeholder.svg"} // Corrigido para usar image ao invés de id
                alt={MOCK_EVENT_DETAILS.name}
                className="w-full h-48 object-cover rounded-lg"
              />

              <div>
                <h3 className="text-xl font-bold mb-2">{MOCK_EVENT_DETAILS.name}</h3>
                <p className="text-muted-foreground mb-4">{MOCK_EVENT_DETAILS.fullDescription}</p>
              </div>

              {/* Location */}
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-neon-green mt-0.5" />
                <div>
                  <p className="font-semibold">Local Exato:</p>
                  <p className="text-sm text-muted-foreground">{MOCK_EVENT_DETAILS.location.exact}</p>
                </div>
              </div>

              {/* Lineup */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Music className="h-4 w-4 text-neon-blue" />
                  Lineup
                </h4>
                <div className="flex flex-wrap gap-2">
                  {MOCK_EVENT_DETAILS.lineup.map((artist) => (
                    <Badge key={artist} className="bg-neon-blue/20 text-neon-blue border-neon-blue/30">
                      {artist}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="font-semibold mb-2">Comodidades</h4>
                <div className="grid grid-cols-2 gap-2">
                  {MOCK_EVENT_DETAILS.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-sm">
                      <Check className="h-3 w-3 text-neon-green" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rules */}
              <div>
                <h4 className="font-semibold mb-2">Regras do Evento</h4>
                <ul className="space-y-1">
                  {MOCK_EVENT_DETAILS.rules.map((rule, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-neon-purple">•</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border/30">
              <Button onClick={handleBuyTicket} className="flex-1 bg-neon-green text-black hover:bg-neon-green/90">
                <CreditCard className="h-4 w-4 mr-2" />
                Comprar Ingresso - R$ {MOCK_EVENT_DETAILS.price}
              </Button>
              <Button
                onClick={() => setShowChat(true)}
                variant="outline"
                className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat com Organizador
              </Button>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {MOCK_EVENT_DETAILS.availableTickets} ingressos disponíveis
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Evento hoje às 22:30
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Modal */}
      {showChat && (
        <Card className="bg-card/80 backdrop-blur-xl border border-neon-blue/30">
          <CardHeader>
            <CardTitle className="text-neon-blue">Chat com Organizador</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-32 bg-secondary/30 rounded-lg p-3 overflow-y-auto">
              <div className="text-sm text-muted-foreground text-center">
                Inicie uma conversa com o organizador do evento
              </div>
            </div>
            <div className="flex gap-2">
              <Textarea
                placeholder="Digite sua mensagem..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 bg-secondary/50 border-border/50 focus:border-neon-blue"
                rows={2}
              />
              <Button onClick={handleSendMessage} className="bg-neon-blue text-white hover:bg-neon-blue/90">
                Enviar
              </Button>
            </div>
            <Button variant="outline" onClick={() => setShowChat(false)} className="w-full border-border/30">
              Fechar Chat
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
