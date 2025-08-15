"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Star, Target, Crown, Award, Gift, MapPin, Heart, Flame } from "lucide-react"
import { useAuth } from "@/lib/auth"

interface Challenge {
  id: string
  title: string
  description: string
  points: number
  progress: number
  maxProgress: number
  type: "daily" | "weekly" | "monthly"
  category: "events" | "social" | "marketplace" | "exploration"
  completed: boolean
  expiresAt: string
}

interface LeaderboardUser {
  id: string
  name: string
  avatar: string
  level: number
  points: number
  rank: number
  weeklyPoints: number
  badges: string[]
}

interface Reward {
  id: string
  name: string
  description: string
  cost: number
  type: "avatar" | "badge" | "discount" | "exclusive"
  rarity: "common" | "rare" | "epic" | "legendary"
  image: string
  available: boolean
}

const MOCK_CHALLENGES: Challenge[] = [
  {
    id: "1",
    title: "Party Explorer",
    description: "Faça check-in em 3 eventos diferentes",
    points: 150,
    progress: 2,
    maxProgress: 3,
    type: "daily",
    category: "events",
    completed: false,
    expiresAt: "2024-01-16T23:59:59",
  },
  {
    id: "2",
    title: "Social Butterfly",
    description: "Curta 10 posts no feed",
    points: 50,
    progress: 7,
    maxProgress: 10,
    type: "daily",
    category: "social",
    completed: false,
    expiresAt: "2024-01-16T23:59:59",
  },
  {
    id: "3",
    title: "Secret Hunter",
    description: "Descubra 2 eventos secretos",
    points: 300,
    progress: 1,
    maxProgress: 2,
    type: "weekly",
    category: "exploration",
    completed: false,
    expiresAt: "2024-01-21T23:59:59",
  },
  {
    id: "4",
    title: "Marketplace Master",
    description: "Compre ou troque 1 item no marketplace",
    points: 200,
    progress: 0,
    maxProgress: 1,
    type: "weekly",
    category: "marketplace",
    completed: false,
    expiresAt: "2024-01-21T23:59:59",
  },
]

const MOCK_LEADERBOARD: LeaderboardUser[] = [
  {
    id: "1",
    name: "CyberRaver",
    avatar: "/leaderboard-1.png",
    level: 8,
    points: 4250,
    rank: 1,
    weeklyPoints: 850,
    badges: ["🏆", "🎵", "🔥"],
  },
  {
    id: "2",
    name: "NeonDancer",
    avatar: "/leaderboard-2.png",
    level: 7,
    points: 3890,
    rank: 2,
    weeklyPoints: 720,
    badges: ["⭐", "🎭", "💫"],
  },
  {
    id: "3",
    name: "BassHunter",
    avatar: "/leaderboard-3.png",
    level: 6,
    points: 3456,
    rank: 3,
    weeklyPoints: 650,
    badges: ["🎧", "🌟", "🚀"],
  },
  {
    id: "4",
    name: "Alex",
    avatar: "/user-avatar.png",
    level: 3,
    points: 1250,
    rank: 47,
    weeklyPoints: 180,
    badges: ["🎉", "🎶"],
  },
]

const MOCK_REWARDS: Reward[] = [
  {
    id: "1",
    name: "Avatar Holográfico",
    description: "Avatar exclusivo com efeitos holográficos",
    cost: 500,
    type: "avatar",
    rarity: "epic",
    image: "/reward-avatar-holo.png",
    available: true,
  },
  {
    id: "2",
    name: "Badge Lenda SUBLINX",
    description: "Badge exclusiva para verdadeiros veteranos da plataforma",
    cost: 1000,
    type: "badge",
    rarity: "legendary",
    image: "/reward-badge-legend.png",
    available: false,
  },
  {
    id: "3",
    name: "Desconto 20% Marketplace",
    description: "20% de desconto em qualquer item do marketplace",
    cost: 200,
    type: "discount",
    rarity: "common",
    image: "/reward-discount.png",
    available: true,
  },
  {
    id: "4",
    name: "Acesso VIP Eventos",
    description: "Acesso antecipado a eventos exclusivos por 1 mês",
    cost: 800,
    type: "exclusive",
    rarity: "rare",
    image: "/reward-vip.png",
    available: true,
  },
]

export function GamificationSystem() {
  const { user } = useAuth()
  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES)
  const [selectedTab, setSelectedTab] = useState("challenges")

  const userRank = MOCK_LEADERBOARD.find((u) => u.name === user?.name)?.rank || 47
  const userWeeklyPoints = MOCK_LEADERBOARD.find((u) => u.name === user?.name)?.weeklyPoints || 180

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: "text-gray-400 border-gray-400/30",
      rare: "text-neon-blue border-neon-blue/30",
      epic: "text-neon-purple border-neon-purple/30",
      legendary: "text-neon-green border-neon-green/30",
    }
    return colors[rarity as keyof typeof colors] || colors.common
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      events: MapPin,
      social: Heart,
      marketplace: Gift,
      exploration: Target,
    }
    return icons[category as keyof typeof icons] || Target
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      events: "text-neon-blue",
      social: "text-red-400",
      marketplace: "text-neon-green",
      exploration: "text-neon-purple",
    }
    return colors[category as keyof typeof colors] || "text-muted-foreground"
  }

  const claimChallenge = (challengeId: string) => {
    setChallenges((prev) =>
      prev.map((challenge) =>
        challenge.id === challengeId && challenge.progress >= challenge.maxProgress
          ? { ...challenge, completed: true }
          : challenge,
      ),
    )
  }

  return (
    <div className="space-y-6">
      {/* Gamification Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neon-green neon-glow">Sistema de Recompensas</h2>
          <p className="text-muted-foreground">Ganhe pontos, suba de nível e desbloqueie recompensas</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-neon-green">{user?.points || 1250} pontos</div>
          <div className="text-sm text-muted-foreground">Rank #{userRank}</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-card/80 backdrop-blur-xl border border-neon-blue/30">
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 text-neon-blue mx-auto mb-2" />
            <div className="text-lg font-bold text-neon-blue">#{userRank}</div>
            <div className="text-xs text-muted-foreground">Ranking Geral</div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-xl border border-neon-green/30">
          <CardContent className="p-4 text-center">
            <Flame className="h-6 w-6 text-neon-green mx-auto mb-2" />
            <div className="text-lg font-bold text-neon-green">{userWeeklyPoints}</div>
            <div className="text-xs text-muted-foreground">Pontos Semanais</div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-xl border border-neon-purple/30">
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 text-neon-purple mx-auto mb-2" />
            <div className="text-lg font-bold text-neon-purple">{user?.level || 3}</div>
            <div className="text-xs text-muted-foreground">Nível Atual</div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-xl border border-yellow-400/30">
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-yellow-400">{challenges.filter((c) => !c.completed).length}</div>
            <div className="text-xs text-muted-foreground">Desafios Ativos</div>
          </CardContent>
        </Card>
      </div>

      {/* Gamification Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-secondary/30">
          <TabsTrigger value="challenges" className="data-[state=active]:bg-neon-green data-[state=active]:text-black">
            Desafios
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="data-[state=active]:bg-neon-blue data-[state=active]:text-black">
            Ranking
          </TabsTrigger>
          <TabsTrigger value="rewards" className="data-[state=active]:bg-neon-purple data-[state=active]:text-black">
            Loja
          </TabsTrigger>
        </TabsList>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="space-y-4">
          <div className="grid gap-4">
            {challenges.map((challenge) => {
              const CategoryIcon = getCategoryIcon(challenge.category)
              const progressPercentage = (challenge.progress / challenge.maxProgress) * 100

              return (
                <Card
                  key={challenge.id}
                  className={`bg-card/80 backdrop-blur-xl border ${
                    challenge.completed
                      ? "border-neon-green/50 bg-neon-green/5"
                      : "border-border/30 hover:border-neon-green/30"
                  } transition-all`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-secondary/30 ${getCategoryColor(challenge.category)}`}>
                          <CategoryIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{challenge.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={`text-xs ${
                                challenge.type === "daily"
                                  ? "bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                                  : challenge.type === "weekly"
                                    ? "bg-neon-purple/20 text-neon-purple border-neon-purple/30"
                                    : "bg-neon-green/20 text-neon-green border-neon-green/30"
                              }`}
                            >
                              {challenge.type === "daily"
                                ? "Diário"
                                : challenge.type === "weekly"
                                  ? "Semanal"
                                  : "Mensal"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Expira em{" "}
                              {new Date(challenge.expiresAt).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-neon-green">+{challenge.points}</div>
                        <div className="text-xs text-muted-foreground">pontos</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progresso</span>
                        <span>
                          {challenge.progress}/{challenge.maxProgress}
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>

                    {challenge.progress >= challenge.maxProgress && !challenge.completed && (
                      <Button
                        onClick={() => claimChallenge(challenge.id)}
                        className="w-full mt-3 bg-neon-green text-black hover:bg-neon-green/90"
                      >
                        <Gift className="h-4 w-4 mr-2" />
                        Resgatar Recompensa
                      </Button>
                    )}

                    {challenge.completed && (
                      <div className="mt-3 text-center text-neon-green font-semibold">
                        <Award className="h-4 w-4 inline mr-2" />
                        Concluído!
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-4">
          <div className="space-y-3">
            {MOCK_LEADERBOARD.slice(0, 10).map((user, index) => (
              <Card
                key={user.id}
                className={`bg-card/80 backdrop-blur-xl border ${
                  user.name === "Alex"
                    ? "border-neon-green/50 bg-neon-green/5"
                    : index < 3
                      ? "border-neon-blue/30"
                      : "border-border/30"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0
                            ? "bg-yellow-400 text-black"
                            : index === 1
                              ? "bg-gray-300 text-black"
                              : index === 2
                                ? "bg-orange-400 text-black"
                                : "bg-secondary text-foreground"
                        }`}
                      >
                        {index < 3 ? <Crown className="h-4 w-4" /> : user.rank}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{user.name}</span>
                        <Badge className="text-xs bg-neon-purple/20 text-neon-purple border-neon-purple/30">
                          Level {user.level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.badges.map((badge, i) => (
                          <span key={i} className="text-sm">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-neon-green">{user.points.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">+{user.weeklyPoints} esta semana</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_REWARDS.map((reward) => (
              <Card
                key={reward.id}
                className={`bg-card/80 backdrop-blur-xl border ${getRarityColor(reward.rarity)} ${
                  !reward.available ? "opacity-50" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={reward.image || "/placeholder.svg"}
                      alt={reward.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{reward.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{reward.description}</p>
                      <Badge className={`${getRarityColor(reward.rarity)} bg-transparent text-xs`}>
                        {reward.rarity}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-neon-green">{reward.cost} pontos</div>
                    <Button
                      size="sm"
                      disabled={!reward.available || (user?.points || 1250) < reward.cost}
                      className={`${
                        reward.available && (user?.points || 1250) >= reward.cost
                          ? "bg-neon-green text-black hover:bg-neon-green/90"
                          : "bg-secondary text-muted-foreground"
                      }`}
                      onClick={() => alert("Sistema de compra em breve!")}
                    >
                      {!reward.available
                        ? "Indisponível"
                        : (user?.points || 1250) < reward.cost
                          ? "Pontos Insuficientes"
                          : "Resgatar"}
                    </Button>
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
