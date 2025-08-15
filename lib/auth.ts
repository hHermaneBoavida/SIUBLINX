"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  level: number
  points: number
  plan: "free" | "premium" | "pro" // Added plan field
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo accounts
const DEMO_ACCOUNTS = {
  "admin@sublynx.com": {
    id: "1",
    email: "admin@sublynx.com",
    name: "Admin",
    role: "admin" as const,
    level: 10,
    points: 5000,
    plan: "pro" as const, // Admin has pro plan
    password: "password123",
  },
  "alex@example.com": {
    id: "2",
    email: "alex@example.com",
    name: "Alex",
    role: "user" as const,
    level: 3,
    points: 1250,
    plan: "free" as const, // Regular user has free plan
    password: "password123",
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("sublinx_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const account = DEMO_ACCOUNTS[email as keyof typeof DEMO_ACCOUNTS]

    if (account && account.password === password) {
      const { password: _, ...userWithoutPassword } = account
      setUser(userWithoutPassword)
      localStorage.setItem("sublinx_user", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("sublinx_user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
