"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Music, Star, Heart, Edit3, Save, X, Crown, Award, Target } from "lucide-react"
import { useAuth } from "@/lib/auth"

interface UserStats {
  eventsAttended: number
  totalCheckins: number
  friendsCount: number
  likesReceived: number
  level: number
  points: number
  nextLevelPoints: number
}

interface EventPhoto {
  id: string
  eventName: string
  date: string
  imageUrl: string
  likes: number
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: string
  rarity: "common" | "rare" | "epic" | "legendary"
}

const AVATAR_SKINS = [
  { id: "cyber1", name: "Cyber Punk", url: "/avatar-cyber1.png" },
  { id: "neon2", name: "Neon Warrior", url: "/avatar-neon2.png" },
  { id: "techno3", name: "Techno Ghost", url: "/avatar-techno3.png" },
  { id: "acid4", name: "Acid Dreams", url: "/avatar-acid4.png" },
]

const MOCK_PHOTOS: EventPhoto[] = [
  {
    id: "1",
    eventName: "Neon Nights",
    date: "2024-01-15",
    imageUrl: "/event-photo1.png",
    likes: 23,
  },
  {
    id: "2",
    eventName: "Sessão Bass Exclusiva",
    date: "2024-01-10",
    imageUrl: "/event-photo2.png",
    likes: 45,
  },
  {
    id: "3",
    eventName: "Cyber Pulse",
    date: "2024-01-05",
    imageUrl: "/event-photo3.png",
    likes: 67,
  },
]

const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: "1",
    name: "Party Pioneer",
    description: "Participou do seu primeiro evento exclusivo",
    icon: "🎉",
    unlockedAt: "2024-01-01",
    rarity: "common",
  },
  {
    id: "2",
    name: "Bass Master",
    description: "Participou de 5 eventos de drum & bass",
    icon: "🔊",
    unlockedAt: "2024-01-10",
    rarity: "rare",
  },
  {
    id: "3",
    name: "Secret Agent",
    description: "Descobriu 3 eventos secretos",
    icon: "🕵️",
    unlockedAt: "2024-01-15",
    rarity: "epic",
  },
]

export function UserProfile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState("cyber1")
  const [showAvatarSelector, setShowAvatarSelector] = useState(false)
  const [bio, setBio] = useState(
    "Apaixonado por música eletrônica e eventos exclusivos. Sempre em busca da próxima experiência única!",
  )
  const [musicPreferences, setMusicPreferences] = useState(["Techno", "Drum & Bass", "Psytrance"])

  const userStats: UserStats = {
    eventsAttended: 12,
    totalCheckins: 89,
    friendsCount: 156,
    likesReceived: 234,
    level: user?.level || 3,
    points: user?.points || 1250,
    nextLevelPoints: 1500,
  }

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: "text-gray-400 border-gray-400/30",
      rare: "text-neon-blue border-neon-blue/30",
      epic: "text-neon-purple border-neon-purple/30",
      legendary: "text-neon-green border-neon-green/30",
    }
    return colors[rarity as keyof typeof colors] || colors.common
  }

  const getLevelInfo = (level: number) => {
    const levels = [
      { name: "Novato", color: "text-gray-400", icon: Target },
      { name: "Explorador", color: "text-neon-blue", icon: Star },
      { name: "Veterano", color: "text-neon-purple", icon: Award },
      { name: "Lenda", color: "text-neon-green", icon: Crown },
    ]
    return levels[Math.min(level - 1, levels.length - 1)] || levels[0]
  }

  const levelInfo = getLevelInfo(userStats.level)
  const LevelIcon = levelInfo.icon

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-card/80 backdrop-blur-xl border border-neon-green/30 overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-neon-blue/20 via-neon-purple/20 to-neon-green/20">
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent"></div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-4 right-4 text-white hover:bg-white/20"
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          </Button>
        </div>

        <CardContent className="relative -mt-16 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-neon-green shadow-lg">
                <AvatarImage
                  src={AVATAR_SKINS.find((s) => s.id === selectedAvatar)?.url || "/placeholder.svg"}
                  alt={user?.name}
                />
                <AvatarFallback className="text-2xl bg-neon-green text-black">{user?.name?.[0]}</AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full bg-neon-green text-black hover:bg-neon-green/90"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-neon-green">{user?.name}</h1>
                <Badge className={`${levelInfo.color} bg-transparent border`}>
                  <LevelIcon className="h-3 w-3 mr-1" />
                  Level {userStats.level} - {levelInfo.name}
                </Badge>
              </div>

              {/* Level Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>{userStats.points} pontos</span>
                  <span>{userStats.nextLevelPoints} para próximo level</span>
                </div>
                <div className="w-full bg-secondary/30 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-neon-blue to-neon-green h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(userStats.points / userStats.nextLevelPoints) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-neon-blue">{userStats.eventsAttended}</div>
                  <div className="text-xs text-muted-foreground">Eventos</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-neon-green">{userStats.totalCheckins}</div>
                  <div className="text-xs text-muted-foreground">Check-ins</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-neon-purple">{userStats.friendsCount}</div>
                  <div className="text-xs text-muted-foreground">Amigos</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-400">{userStats.likesReceived}</div>
                  <div className="text-xs text-muted-foreground">Curtidas</div>
                </div>
              </div>
            </div>
          </div>

          {/* Avatar Selector */}
          {showAvatarSelector && (
            <Card className="mb-4 bg-secondary/50 border border-neon-blue/30">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-neon-blue">Escolher Avatar</h3>
                  <Button size="sm" variant="ghost" onClick={() => setShowAvatarSelector(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {AVATAR_SKINS.map((skin) => (
                    <button
                      key={skin.id}
                      onClick={() => {
                        setSelectedAvatar(skin.id)
                        setShowAvatarSelector(false)
                      }}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        selectedAvatar === skin.id
                          ? "border-neon-green bg-neon-green/10"
                          : "border-border/30 hover:border-neon-green/50"
                      }`}
                    >
                      <Avatar className="h-12 w-12 mx-auto mb-1">
                        <AvatarImage src={skin.url || "/placeholder.svg"} alt={skin.name} />
                        <AvatarFallback>{skin.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="text-xs text-center">{skin.name}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="about" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-secondary/30">
          <TabsTrigger value="about" className="data-[state=active]:bg-neon-green data-[state=active]:text-black">
            Sobre
          </TabsTrigger>
          <TabsTrigger value="gallery" className="data-[state=active]:bg-neon-blue data-[state=active]:text-black">
            Galeria
          </TabsTrigger>
          <TabsTrigger
            value="achievements"
            className="data-[state=active]:bg-neon-purple data-[state=active]:text-black"
          >
            Conquistas
          </TabsTrigger>
        </TabsList>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-4">
          <Card className="bg-card/80 backdrop-blur-xl border border-border/30">
            <CardHeader>
              <h3 className="font-semibold text-neon-green">Bio</h3>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-secondary/50 border-border/50 focus:border-neon-green"
                  rows={3}
                />
              ) : (
                <p className="text-muted-foreground">{bio}</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-xl border border-border/30">
            <CardHeader>
              <h3 className="font-semibold text-neon-blue">Preferências Musicais</h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {musicPreferences.map((genre) => (
                  <Badge key={genre} className="bg-neon-blue/20 text-neon-blue border-neon-blue/30">
                    <Music className="h-3 w-3 mr-1" />
                    {genre}
                  </Badge>
                ))}
                {isEditing && (
                  <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                    + Adicionar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value="gallery" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_PHOTOS.map((photo) => (
              <Card key={photo.id} className="bg-card/80 backdrop-blur-xl border border-border/30 overflow-hidden">
                <div className="relative">
                  <img
                    src={photo.imageUrl || "/placeholder.svg"}
                    alt={photo.eventName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <h4 className="font-semibold text-white text-sm">{photo.eventName}</h4>
                    <div className="flex justify-between items-center text-xs text-gray-300">
                      <span>{new Date(photo.date).toLocaleDateString("pt-BR")}</span>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3 fill-current text-red-500" />
                        <span>{photo.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_ACHIEVEMENTS.map((achievement) => (
              <Card
                key={achievement.id}
                className={`bg-card/80 backdrop-blur-xl border ${getRarityColor(achievement.rarity)}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{achievement.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                      <div className="flex justify-between items-center">
                        <Badge className={`${getRarityColor(achievement.rarity)} bg-transparent text-xs`}>
                          {achievement.rarity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(achievement.unlockedAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
