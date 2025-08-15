"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
  MapPin,
  Palette,
  Shirt,
  Watch,
  Cigarette,
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
  }
  stats: {
    views: number
    likes: number
    isLiked: boolean
  }
  tradeable: boolean
  postedAt: string
  tags: string[]
}

const CATEGORIES = [
  { id: "all", name: "Todos", icon: Eye },
  { id: "clothes", name: "Roupas", icon: Shirt },
  { id: "accessories", name: "Acessórios", icon: Watch },
  { id: "art", name: "Arte", icon: Palette },
  { id: "vapes", name: "Vapes", icon: Cigarette },
]

const MOCK_ITEMS: MarketplaceItem[] = [
  {
    id: "1",
    name: "Jaqueta Cyberpunk LED",
    description: "Jaqueta preta com LEDs programáveis, perfeita para raves. Bateria dura 8 horas.",
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
    },
    stats: {
      views: 127,
      likes: 23,
      isLiked: false,
    },
    tradeable: true,
    postedAt: "2024-01-15",
    tags: ["LED", "Cyberpunk", "Rave", "Tecnologia"],
  },
  {
    id: "2",
    name: "Óculos Holográficos",
    description: "Óculos com lentes holográficas que mudam de cor. Edição limitada.",
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
    },
    stats: {
      views: 89,
      likes: 34,
      isLiked: true,
    },
    tradeable: false,
    postedAt: "2024-01-14",
    tags: ["Holográfico", "Limitado", "Futurista"],
  },
  {
    id: "3",
    name: "Arte Digital NFT - Acid Dreams",
    description: "Obra de arte digital exclusiva inspirada na cultura acid house. Inclui NFT.",
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
    },
    stats: {
      views: 156,
      likes: 67,
      isLiked: false,
    },
    tradeable: true,
    postedAt: "2024-01-13",
    tags: ["NFT", "Digital", "Acid House", "Exclusivo"],
  },
  {
    id: "4",
    name: "Vape Neon Customizado",
    description: "Vape personalizado com luzes neon e sabores exclusivos. Kit completo.",
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
    },
    stats: {
      views: 78,
      likes: 19,
      isLiked: false,
    },
    tradeable: true,
    postedAt: "2024-01-12",
    tags: ["Customizado", "Neon", "Kit Completo"],
  },
]

export function AlternativeMarketplace() {
  const { user } = useAuth()
  const [items, setItems] = useState<MarketplaceItem[]>(MOCK_ITEMS)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState("")

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const toggleLike = (itemId: string) => {
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
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      clothes: "text-neon-blue border-neon-blue/30",
      accessories: "text-neon-green border-neon-green/30",
      art: "text-neon-purple border-neon-purple/30",
      vapes: "text-yellow-400 border-yellow-400/30",
    }
    return colors[category as keyof typeof colors] || "text-muted-foreground border-border/30"
  }

  const getConditionColor = (condition: string) => {
    const colors = {
      new: "text-neon-green",
      used: "text-yellow-400",
      vintage: "text-neon-purple",
    }
    return colors[condition as keyof typeof colors] || "text-muted-foreground"
  }

  const handleSellAction = () => {
    if (!user || !canUserPerformAction(user.plan, "canSellProducts")) {
      setUpgradeReason("vender produtos no marketplace")
      setShowUpgradeModal(true)
      return
    }
    alert("Funcionalidade de venda em desenvolvimento!")
  }

  return (
    <div className="space-y-6">
      {/* Marketplace Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neon-blue neon-glow">Marketplace Alternativo</h2>
          <p className="text-muted-foreground">Feira digital de itens únicos e alternativos</p>
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

      {/* Search and Categories */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar itens, tags ou vendedores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50 focus:border-neon-green focus:ring-neon-green/20"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 ${
                  selectedCategory === category.id
                    ? "bg-neon-green text-black hover:bg-neon-green/90"
                    : "border-neon-green/30 hover:border-neon-green hover:bg-neon-green/10 bg-transparent"
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.name}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="bg-card/80 backdrop-blur-xl border border-border/30 overflow-hidden hover:border-neon-green/50 transition-all cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            <div className="relative h-48">
              <ImageWithFallback
                src={item.images[0] || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-full"
                fallbackSrc="/cyberpunk-marketplace-item.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              {/* Item Stats Overlay */}
              <div className="absolute top-2 right-2 flex gap-2">
                <Badge className={`${getCategoryColor(item.category)} bg-black/60 backdrop-blur-sm`}>
                  {CATEGORIES.find((c) => c.id === item.category)?.name}
                </Badge>
              </div>

              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                <div className="text-white">
                  <div className="text-lg font-bold">R$ {item.price}</div>
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

            {/* Item Info */}
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2 line-clamp-1">{item.name}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>

              <div className="flex items-center gap-2 mb-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={item.seller.avatar || "/placeholder.svg"} alt={item.seller.name} />
                  <AvatarFallback className="bg-neon-green/20 text-neon-green">{item.seller.name[0]}</AvatarFallback>
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

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-secondary/50">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{item.stats.views}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleLike(item.id)
                    }}
                    className={`flex items-center gap-1 ${
                      item.stats.isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                    }`}
                  >
                    <Heart className={`h-3 w-3 ${item.stats.isLiked ? "fill-current" : ""}`} />
                    <span>{item.stats.likes}</span>
                  </button>
                </div>

                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      alert("Chat com vendedor em breve!")
                    }}
                    className="h-7 px-2 border-neon-blue/30 hover:border-neon-blue bg-transparent"
                  >
                    <MessageCircle className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      alert("Compra em breve!")
                    }}
                    className="h-7 px-2 bg-neon-green text-black hover:bg-neon-green/90"
                  >
                    <ShoppingCart className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-card/95 backdrop-blur-xl border border-neon-green/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-xl font-bold text-neon-green">{selectedItem.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedItem(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageWithFallback
                src={selectedItem.images[0] || "/placeholder.svg"}
                alt={selectedItem.name}
                className="w-full h-64 rounded-lg"
                fallbackSrc="/cyberpunk-product-showcase.png"
              />

              <div className="flex justify-between items-start">
                <div>
                  <div className="text-2xl font-bold text-neon-green mb-1">R$ {selectedItem.price}</div>
                  <Badge className={`${getConditionColor(selectedItem.condition)} bg-transparent border`}>
                    {selectedItem.condition === "new"
                      ? "Novo"
                      : selectedItem.condition === "used"
                        ? "Usado"
                        : "Vintage"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {selectedItem.tradeable && (
                    <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/30">
                      <Repeat className="h-3 w-3 mr-1" />
                      Aceita Troca
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground">{selectedItem.description}</p>

              <div className="flex flex-wrap gap-2">
                {selectedItem.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-secondary/50">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="border-t border-border/30 pt-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={selectedItem.seller.avatar || "/placeholder.svg"}
                      alt={selectedItem.seller.name}
                    />
                    <AvatarFallback className="bg-neon-green/20 text-neon-green">
                      {selectedItem.seller.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{selectedItem.seller.name}</span>
                      {selectedItem.seller.verified && (
                        <div className="w-4 h-4 bg-neon-green rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span>{selectedItem.seller.rating}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{selectedItem.seller.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-transparent border border-neon-blue text-neon-blue hover:bg-neon-blue/10"
                    onClick={() => alert("Chat com vendedor em breve!")}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Conversar
                  </Button>
                  <Button
                    className="flex-1 bg-neon-green text-black hover:bg-neon-green/90"
                    onClick={() => alert("Compra em breve!")}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Comprar
                  </Button>
                  {selectedItem.tradeable && (
                    <Button
                      variant="outline"
                      className="border-neon-purple/30 hover:border-neon-purple hover:bg-neon-purple/10 bg-transparent"
                      onClick={() => alert("Sistema de troca em breve!")}
                    >
                      <Repeat className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Load More */}
      {filteredItems.length > 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            className="border-neon-blue/30 hover:border-neon-blue hover:bg-neon-blue/10 bg-transparent"
            onClick={() => alert("Carregando mais itens...")}
          >
            Carregar Mais Itens
          </Button>
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">Nenhum item encontrado</div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("all")
            }}
            className="border-neon-green/30 hover:border-neon-green hover:bg-neon-green/10 bg-transparent"
          >
            Limpar Filtros
          </Button>
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
