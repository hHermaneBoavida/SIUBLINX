"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth"
import { canUserPerformAction } from "@/lib/plans"
import { PlanUpgradeModal } from "@/components/plan-upgrade-modal"
import { InviteRequestSystem } from "@/components/invite-request-system"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import {
  Heart,
  MessageCircle,
  MapPin,
  Play,
  Pause,
  Volume2,
  Share2,
  Clock,
  Users,
  MoreHorizontal,
  Mail,
  X,
} from "lucide-react"

interface FeedEvent {
  id: string
  name: string
  description: string
  genre: string
  type: string
  location: {
    name: string
    isExact: boolean
    distance: string
  }
  time: string
  date: string
  organizer: {
    name: string
    avatar: string
    verified: boolean
  }
  stats: {
    likes: number
    comments: number
    checkins: number
    isLiked: boolean
    isCheckedIn: boolean
  }
  audio: {
    title: string
    duration: string
    isPlaying: boolean
  }
  image: string
  tags: string[]
}

const MOCK_FEED_EVENTS: FeedEvent[] = [
  {
    id: "1",
    name: "Experiência Techno Noturna",
    description:
      "Prepare-se para uma noite épica de techno com os melhores DJs da cena brasileira. Som de última geração e vibes incomparáveis.",
    genre: "Techno",
    type: "Rave",
    location: {
      name: "Zona Industrial - SP",
      isExact: false,
      distance: "2.5km",
    },
    time: "23:00",
    date: "Hoje",
    organizer: {
      name: "TechnoCollective",
      avatar: "/techno-dj-avatar.png",
      verified: true,
    },
    stats: {
      likes: 127,
      comments: 23,
      checkins: 89,
      isLiked: false,
      isCheckedIn: false,
    },
    audio: {
      title: "Preview Mix - Dark Pulse",
      duration: "2:30",
      isPlaying: false,
    },
    image: "/placeholder-i01y6.png",
    tags: ["Techno", "Dark", "Industrial"],
  },
  {
    id: "2",
    name: "Sessão Bass Exclusiva",
    description:
      "Sessão exclusiva de drum & bass em local revelado apenas para membros VIP. Lineup surpresa com artistas internacionais.",
    genre: "Drum & Bass",
    type: "Secret",
    location: {
      name: "Local Secreto",
      isExact: false,
      distance: "5.2km",
    },
    time: "22:30",
    date: "Amanhã",
    organizer: {
      name: "BassHeads",
      avatar: "/bass-dj-avatar.png",
      verified: true,
    },
    stats: {
      likes: 89,
      comments: 15,
      checkins: 45,
      isLiked: true,
      isCheckedIn: false,
    },
    audio: {
      title: "Exclusive Preview",
      duration: "1:45",
      isPlaying: false,
    },
    image: "/exclusive-drum-bass.png",
    tags: ["Secret", "VIP Only", "International"],
  },
  {
    id: "3",
    name: "Cyber Pulse Festival",
    description:
      "Festival de psytrance com 3 palcos, arte digital interativa e experiências imersivas. Uma jornada psicodélica única.",
    genre: "Psytrance",
    type: "Festival",
    location: {
      name: "Complexo Cultural - Zona Sul",
      isExact: true,
      distance: "8.1km",
    },
    time: "20:00",
    date: "Sábado",
    organizer: {
      name: "PsyCollective",
      avatar: "/psytrance-organizer-avatar.png",
      verified: true,
    },
    stats: {
      likes: 234,
      comments: 67,
      checkins: 156,
      isLiked: true,
      isCheckedIn: true,
    },
    audio: {
      title: "Festival Anthem 2024",
      duration: "3:15",
      isPlaying: false,
    },
    image: "/colorful-psytrance-art.png",
    tags: ["Festival", "3 Stages", "Digital Art"],
  },
]

export function PersonalizedFeed() {
  const { user } = useAuth()
  const [events, setEvents] = useState<FeedEvent[]>(MOCK_FEED_EVENTS)
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState("")
  const [showInviteSystem, setShowInviteSystem] = useState(false)

  const toggleLike = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              stats: {
                ...event.stats,
                isLiked: !event.stats.isLiked,
                likes: event.stats.isLiked ? event.stats.likes - 1 : event.stats.likes + 1,
              },
            }
          : event,
      ),
    )
  }

  const toggleCheckin = (eventId: string) => {
    if (!user || user.plan === "free") {
      setShowInviteSystem(true)
      return
    }

    if (!canUserPerformAction(user.plan, "canAcceptInvites")) {
      setUpgradeReason("fazer check-in em eventos por convite")
      setShowUpgradeModal(true)
      return
    }

    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              stats: {
                ...event.stats,
                isCheckedIn: !event.stats.isCheckedIn,
                checkins: event.stats.isCheckedIn ? event.stats.checkins - 1 : event.stats.checkins + 1,
              },
            }
          : event,
      ),
    )
  }

  const toggleAudio = (eventId: string) => {
    if (playingAudio === eventId) {
      setPlayingAudio(null)
    } else {
      setPlayingAudio(eventId)
    }
  }

  const getGenreColor = (genre: string) => {
    const colors = {
      Techno: "text-neon-blue border-neon-blue/30",
      "Drum & Bass": "text-neon-green border-neon-green/30",
      Psytrance: "text-neon-purple border-neon-purple/30",
    }
    return colors[genre as keyof typeof colors] || "text-neon-blue border-neon-blue/30"
  }

  return (
    <div className="space-y-6">
      {/* Feed Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neon-green neon-glow">Feed Personalizado</h2>
          <p className="text-muted-foreground">Eventos selecionados para você</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-neon-purple/30 hover:border-neon-purple hover:bg-neon-purple/10 bg-transparent"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Feed Cards */}
      <div className="space-y-6">
        {events.map((event) => (
          <Card key={event.id} className="bg-card/80 backdrop-blur-xl border border-border/30 overflow-hidden">
            {/* Event Header */}
            <div className="p-4 pb-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={event.organizer.avatar || "/placeholder.svg"} alt={event.organizer.name} />
                    <AvatarFallback className="bg-neon-purple/20 text-neon-purple">
                      {event.organizer.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{event.organizer.name}</span>
                      {event.organizer.verified && (
                        <div className="w-4 h-4 bg-neon-green rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {event.date} às {event.time}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge className={`${getGenreColor(event.genre)} bg-transparent`}>{event.genre}</Badge>
              </div>

              <h3 className="font-bold text-lg mb-2">{event.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{event.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-secondary/50">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Event Image */}
            <div className="relative">
              <ImageWithFallback
                src={event.image || "/placeholder.svg"}
                alt={event.name}
                className="w-full h-48"
                fallbackSrc="/cyberpunk-party-neon.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              {/* Audio Player Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
                  <Button
                    size="sm"
                    onClick={() => toggleAudio(event.id)}
                    className={`w-8 h-8 p-0 rounded-full ${
                      playingAudio === event.id
                        ? "bg-neon-green text-black hover:bg-neon-green/90"
                        : "bg-transparent border border-neon-green text-neon-green hover:bg-neon-green/10"
                    }`}
                  >
                    {playingAudio === event.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{event.audio.title}</div>
                    <div className="text-xs text-gray-300">{event.audio.duration}</div>
                  </div>
                  <Volume2 className="h-4 w-4 text-neon-green" />
                </div>
              </div>
            </div>

            {/* Event Info */}
            <CardContent className="p-4">
              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location.name}</span>
                  <span>• {event.location.distance}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{event.stats.checkins} check-ins</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(event.id)}
                    className={`p-2 ${
                      event.stats.isLiked
                        ? "text-red-500 hover:text-red-600"
                        : "text-muted-foreground hover:text-red-500"
                    }`}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${event.stats.isLiked ? "fill-current" : ""}`} />
                    <span className="text-sm">{event.stats.likes}</span>
                  </Button>

                  <Button variant="ghost" size="sm" className="p-2 text-muted-foreground hover:text-neon-blue">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">{event.stats.comments}</span>
                  </Button>

                  <Button variant="ghost" size="sm" className="p-2 text-muted-foreground hover:text-neon-purple">
                    <Share2 className="h-4 w-4 mr-1" />
                    <span className="text-sm">Compartilhar</span>
                  </Button>
                </div>

                <Button
                  size="sm"
                  onClick={() => toggleCheckin(event.id)}
                  className={`${
                    event.stats.isCheckedIn
                      ? "bg-neon-green text-black hover:bg-neon-green/90"
                      : "bg-transparent border border-neon-purple text-neon-purple hover:bg-neon-purple/10"
                  }`}
                  disabled={event.stats.isCheckedIn}
                  title={event.stats.isCheckedIn ? "Check-in já realizado" : "Solicitar convite para check-in"}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  {event.stats.isCheckedIn ? "Check-in Feito" : "Solicitar Convite"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button
          variant="outline"
          className="border-neon-green/30 hover:border-neon-green hover:bg-neon-green/10 bg-transparent"
          onClick={() => alert("Carregando mais eventos...")}
        >
          Carregar Mais Eventos
        </Button>
      </div>

      {/* Invite Request System Modal */}
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
