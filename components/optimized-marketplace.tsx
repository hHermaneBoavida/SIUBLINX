"use client"

import { useState, useMemo, useCallback, memo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth"
import { canUserPerformAction } from "@/lib/plans"
import { PlanUpgradeModal } from "@/components/plan-upgrade-modal"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import {
  Search,
  Filter,
  Heart,
  MessageCircle,
  Star,
  ShoppingCart,
  Repeat,
  Eye,
  Palette,
  Shirt,
  Watch,
  Cigarette,
  Zap,
  TrendingUp,
} from "lucide-react"

interface MarketplaceItem {
  id: string
  name: string
  description: string
  price: number
  category: "clothes" | "accessories" | "art" | "vapes" | "other"
  condition: "new" | "used" | "vintage"
  images: string[]
  seller: {
    name: string
    avatar: string
    rating: number
    verified: boolean
    location: string
    responseTime: string
    totalSales: number
  }
  stats: {
    views: number
    likes: number
    isLiked: boolean
    watchers: number
  }
  tradeable: boolean
  postedAt: string
  tags: string[]
  featured: boolean
  discount?: number
}

const CATEGORIES = [
  { id: "all", name: "Todos", icon: Eye, color: "text-neon-blue" },
  { id: "clothes", name: "Roupas", icon: Shirt, color: "text-neon-green" },
  { id: "accessories", name: "Acessórios", icon: Watch, color: "text-neon-purple" },
  { id: "art", name: "Arte", icon: Palette, color: "text-yellow-400" },
  { id: "vapes", name: "Vapes", icon: Cigarette, color: "text-red-400" },
]

const MOCK_ITEMS: MarketplaceItem[] = [
  {
    id: "1",
    name: "Jaqueta Cyberpunk LED Premium",
    description: "Jaqueta preta com LEDs programáveis RGB, controle via app, bateria 12h. Material resistente à água.",
    price: 350,
    category: "clothes",
    condition: "new",
    images: ["/marketplace-jacket.png"],
    seller: {
      name: "CyberFashion",
      avatar: "/seller-cyber.png",
      rating: 4.8,
      verified: true,
      location: "São Paulo, SP",
      responseTime: "< 1h",
      totalSales: 127,
    },
    stats: {
      views: 1247,
      likes: 89,
      isLiked: false,
      watchers: 23,
    },
    tradeable: true,
    postedAt: "2024-01-15",
    tags: ["LED", "Cyberpunk", "Rave", "Premium", "RGB"],
    featured: true,
    discount: 15,
  },
  {
    id: "2",
    name: "Óculos Holográficos Limitados",
    description: "Óculos com lentes holográficas que mudam de cor. Edição limitada numerada (47/100).",
    price: 180,
    category: "accessories",
    condition: "new",
    images: ["/marketplace-glasses.png"],
    seller: {
      name: "NeonAccessories",
      avatar: "/seller-neon.png",
      rating: 4.9,
      verified: true,
      location: "Rio de Janeiro, RJ",
      responseTime: "< 30min",
      totalSales: 89,
    },
    stats: {
      views: 892,
      likes: 156,
      isLiked: true,
      watchers: 34,
    },
    tradeable: false,
    postedAt: "2024-01-14",
    tags: ["Holográfico", "Limitado", "Numerado", "Exclusivo"],
    featured: true,
  },
  {
    id: "3",
    name: "NFT Art - Acid Dreams Collection",
    description: "Obra digital exclusiva da série Acid Dreams. Inclui NFT verificado + print físico A3.",
    price: 500,
    category: "art",
    condition: "new",
    images: ["/marketplace-nft.png"],
    seller: {
      name: "DigitalArtist",
      avatar: "/seller-artist.png",
      rating: 4.7,
      verified: true,
      location: "Belo Horizonte, MG",
      responseTime: "< 2h",
      totalSales: 45,
    },
    stats: {
      views: 1567,
      likes: 234,
      isLiked: false,
      watchers: 67,
    },
    tradeable: true,
    postedAt: "2024-01-13",
    tags: ["NFT", "Digital", "Acid House", "Print Incluído"],
    featured: false,
  },
  {
    id: "4",
    name: "Vape Neon Customizado Pro",
    description: "Vape personalizado com luzes neon sincronizadas, 5 sabores exclusivos, carregador wireless.",
    price: 120,
    category: "vapes",
    condition: "new",
    images: ["/marketplace-vape.png"],
    seller: {
      name: "VapeCustom",
      avatar: "/seller-vape.png",
      rating: 4.6,
      verified: false,
      location: "Curitiba, PR",
      responseTime: "< 4h",
      totalSales: 23,
    },
    stats: {
      views: 678,
      likes: 45,
      isLiked: false,
      watchers: 19,
    },
    tradeable: true,
    postedAt: "2024-01-12",
    tags: ["Customizado", "Neon", "Wireless", "5 Sabores"],
    featured: false,
    discount: 10,
  },
]

const MarketplaceItemCard = memo(
  ({
    item,
    onToggleLike,
    onSelectItem,
  }: {
    item: MarketplaceItem
    onToggleLike: (id: string) => void
    onSelectItem: (item: MarketplaceItem) => void
  }) => {
    const getCategoryInfo = useCallback((category: string) => {
      return CATEGORIES.find((c) => c.id === category) || CATEGORIES[0]
    }, [])

    const getConditionColor = useCallback((condition: string) => {
      const colors = {
        new: "text-neon-green",
        used: "text-yellow-400",
        vintage: "text-neon-purple",
      }
      return colors[condition as keyof typeof colors] || "text-muted-foreground"
    }, [])

    const categoryInfo = getCategoryInfo(item.category)

    return (
      <Card
        className="bg-card/80 backdrop-blur-xl border border-border/30 overflow-hidden hover:border-neon-green/50 transition-all duration-300 cursor-pointer group"
        onClick={() => onSelectItem(item)}
      >
        <div className="relative h-48 overflow-hidden">
          <ImageWithFallback
            src={item.images[0] || "/placeholder.svg"}
            alt={item.name}
            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
            fallbackSrc="/cyberpunk-marketplace-item.png"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

          <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
            <div className="flex gap-1">
              <Badge className={`${categoryInfo.color} bg-black/60 backdrop-blur-sm border-current/30`}>
                <categoryInfo.icon className="h-3 w-3 mr-1" />
                {categoryInfo.name}
              </Badge>
              {item.featured && (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400/30">
                  <Zap className="h-3 w-3 mr-1" />
                  Destaque
                </Badge>
              )}
            </div>

            {item.discount && <Badge className="bg-red-500/20 text-red-400 border-red-400/30">-{item.discount}%</Badge>}
          </div>

          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
            <div className="text-white">
              <div className="flex items-center gap-2">
                <div className="text-xl font-bold">R$ {item.price}</div>
                {item.discount && (
                  <div className="text-sm text-red-400 line-through">
                    R$ {Math.round(item.price / (1 - item.discount / 100))}
                  </div>
                )}
              </div>
              <div className={`text-xs ${getConditionColor(item.condition)}`}>
                {item.condition === "new" ? "Novo" : item.condition === "used" ? "Usado" : "Vintage"}
              </div>
            </div>

            <div className="flex gap-1">
              {item.tradeable && (
                <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/30 text-xs">
                  <Repeat className="h-3 w-3 mr-1" />
                  Troca
                </Badge>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-neon-green transition-colors">
            {item.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>

          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-6 w-6">
              <AvatarImage src={item.seller.avatar || "/placeholder.svg"} alt={item.seller.name} />
              <AvatarFallback className="bg-neon-green/20 text-neon-green text-xs">
                {item.seller.name[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{item.seller.name}</span>
            {item.seller.verified && (
              <div className="w-3 h-3 bg-neon-green rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
              </div>
            )}
            <div className="flex items-center gap-1 ml-auto">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-xs text-muted-foreground">{item.seller.rating}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{item.stats.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>{item.stats.watchers}</span>
              </div>
            </div>
            <div className="text-neon-blue">Responde em {item.seller.responseTime}</div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs bg-secondary/50 hover:bg-secondary/70 transition-colors"
              >
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-secondary/30">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleLike(item.id)
              }}
              className={`flex items-center gap-1 text-sm transition-colors ${
                item.stats.isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
              }`}
            >
              <Heart className={`h-4 w-4 ${item.stats.isLiked ? "fill-current" : ""}`} />
              <span>{item.stats.likes}</span>
            </button>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  alert("Chat com vendedor em breve!")
                }}
                className="h-8 px-3 border-neon-blue/30 hover:border-neon-blue bg-transparent hover:bg-neon-blue/10 transition-all"
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                Chat
              </Button>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  alert("Compra em breve!")
                }}
                className="h-8 px-3 bg-neon-green text-black hover:bg-neon-green/90 transition-all"
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                Comprar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  },
)

MarketplaceItemCard.displayName = "MarketplaceItemCard"

export function OptimizedMarketplace() {
  const { user } = useAuth()
  const [items, setItems] = useState<MarketplaceItem[]>(MOCK_ITEMS)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState("")
  const [sortBy, setSortBy] = useState("featured") // Adicionado sorting

  const filteredItems = useMemo(() => {
    const filtered = items.filter((item) => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.seller.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })

    switch (sortBy) {
      case "featured":
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "popular":
        filtered.sort((a, b) => b.stats.likes - a.stats.likes)
        break
      case "recent":
        filtered.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
        break
    }

    return filtered
  }, [items, selectedCategory, searchQuery, sortBy])

  const toggleLike = useCallback((itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              stats: {
                ...item.stats,
                isLiked: !item.stats.isLiked,
                likes: item.stats.isLiked ? item.stats.likes - 1 : item.stats.likes + 1,
              },
            }
          : item,
      ),
    )
  }, [])

  const handleSellAction = useCallback(() => {
    if (!user || !canUserPerformAction(user.plan, "canSellProducts")) {
      setUpgradeReason("vender produtos no marketplace")
      setShowUpgradeModal(true)
      return
    }
    alert("Funcionalidade de venda em desenvolvimento!")
  }, [user])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-neon-blue neon-glow">Marketplace Alternativo</h2>
          <p className="text-muted-foreground">Feira digital de itens únicos e alternativos</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>{filteredItems.length} itens encontrados</span>
            <span>•</span>
            <span>{filteredItems.filter((i) => i.featured).length} em destaque</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="border-neon-green/30 hover:border-neon-green hover:bg-neon-green/10"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button size="sm" onClick={handleSellAction} className="bg-neon-green text-black hover:bg-neon-green/90">
            Vender Item
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar itens, tags, vendedores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-border/50 focus:border-neon-green focus:ring-neon-green/20"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-secondary/50 border border-border/50 rounded-md px-3 py-2 text-sm focus:border-neon-blue focus:ring-neon-blue/20"
          >
            <option value="featured">Destaques</option>
            <option value="recent">Mais Recentes</option>
            <option value="popular">Mais Curtidos</option>
            <option value="price-low">Menor Preço</option>
            <option value="price-high">Maior Preço</option>
          </select>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 transition-all duration-200 ${
                  selectedCategory === category.id
                    ? "bg-neon-green text-black hover:bg-neon-green/90"
                    : `border-current/30 hover:border-current hover:bg-current/10 bg-transparent ${category.color}`
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.name}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <MarketplaceItemCard key={item.id} item={item} onToggleLike={toggleLike} onSelectItem={setSelectedItem} />
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-card/95 backdrop-blur-xl border border-neon-green/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-neon-green">{selectedItem.name}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedItem(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ImageWithFallback
                    src={selectedItem.images[0] || "/placeholder.svg"}
                    alt={selectedItem.name}
                    className="w-full h-64 rounded-lg"
                    fallbackSrc="/cyberpunk-marketplace-item.png"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-neon-green">R$ {selectedItem.price}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedItem.condition === "new"
                        ? "Novo"
                        : selectedItem.condition === "used"
                          ? "Usado"
                          : "Vintage"}
                    </div>
                  </div>

                  <p className="text-muted-foreground">{selectedItem.description}</p>

                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={selectedItem.seller.avatar || "/placeholder.svg"}
                        alt={selectedItem.seller.name}
                      />
                      <AvatarFallback>{selectedItem.seller.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{selectedItem.seller.name}</div>
                      <div className="text-sm text-muted-foreground">{selectedItem.seller.location}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-neon-green text-black hover:bg-neon-green/90">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Comprar
                    </Button>
                    <Button variant="outline" className="border-neon-blue/30 hover:border-neon-blue bg-transparent">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
