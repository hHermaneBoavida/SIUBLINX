"use client"

import { useState, Suspense, lazy } from "react"
import { useAuth } from "@/lib/auth"
import { WelcomeScreen } from "@/components/welcome-screen"
import { Navigation } from "@/components/navigation"

const PersonalizedFeed = lazy(() =>
  import("@/components/personalized-feed").then((m) => ({ default: m.PersonalizedFeed })),
)
const EventMap = lazy(() => import("@/components/event-map").then((m) => ({ default: m.EventMap })))
const UserProfile = lazy(() => import("@/components/user-profile").then((m) => ({ default: m.UserProfile })))
const OptimizedMarketplace = lazy(() =>
  import("@/components/optimized-marketplace").then((m) => ({ default: m.OptimizedMarketplace })),
)
const GamificationSystem = lazy(() =>
  import("@/components/gamification-system").then((m) => ({ default: m.GamificationSystem })),
)

const LoadingSkeleton = ({ type }: { type: string }) => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 bg-secondary/50 rounded-lg w-1/3"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-48 bg-secondary/30 rounded-lg border border-border/20"></div>
      ))}
    </div>
  </div>
)

const Page = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("feed")

  if (!user) {
    return <WelcomeScreen />
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "feed":
        return (
          <Suspense fallback={<LoadingSkeleton type="feed" />}>
            <PersonalizedFeed />
          </Suspense>
        )
      case "map":
        return (
          <Suspense fallback={<LoadingSkeleton type="map" />}>
            <EventMap />
          </Suspense>
        )
      case "profile":
        return (
          <Suspense fallback={<LoadingSkeleton type="profile" />}>
            <UserProfile />
          </Suspense>
        )
      case "marketplace":
        return (
          <Suspense fallback={<LoadingSkeleton type="marketplace" />}>
            <OptimizedMarketplace />
          </Suspense>
        )
      case "rewards":
        return (
          <Suspense fallback={<LoadingSkeleton type="rewards" />}>
            <GamificationSystem />
          </Suspense>
        )
      default:
        return (
          <Suspense fallback={<LoadingSkeleton type="feed" />}>
            <PersonalizedFeed />
          </Suspense>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      <div className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-center items-center">
            <div className="flex items-center gap-3">
              <img src="/sublinx-logo.png" alt="SUBLINX Logo" className="w-12 h-12" loading="eager" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
                SUBLINX
              </h1>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">{renderActiveComponent()}</main>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  )
}

export default Page
