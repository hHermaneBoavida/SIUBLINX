"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { useAuth } from "@/lib/auth"
import { Eye, EyeOff, Mail, Lock, Chrome, Apple, Music } from "lucide-react"

export function WelcomeScreen() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await login(email, password)
    if (!success) {
      setError("Credenciais inválidas. Tente admin@sublynx.com / password123")
    }
  }

  const handleGuestMode = async () => {
    const success = await login("guest@sublynx.com", "guest123")
    if (!success) {
      setError("Erro ao entrar como visitante. Tente novamente.")
    }
  }

  const handleSocialLogin = (provider: string) => {
    alert(`Login com ${provider} será implementado em breve! Por enquanto, use as contas de demonstração.`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-blue/10 rounded-full blur-3xl pulse-neon"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-green/10 rounded-full blur-3xl pulse-neon"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-neon-purple/10 rounded-full blur-3xl pulse-neon"></div>
      </div>

      <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border-2 border-neon-green/30 shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex flex-col items-center">
            <div className="mb-4">
              <img
                src="/sublinx-logo.png"
                alt="SUBLINX Logo"
                className="w-24 h-24 mx-auto filter drop-shadow-[0_0_10px_#00ff88] hover:drop-shadow-[0_0_20px_#00ff88] transition-all duration-300"
              />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent neon-glow tracking-wider mb-4">
              SUBLINX
            </h1>
            <div className="h-1 w-16 bg-gradient-to-r from-neon-blue to-neon-green mx-auto mt-2 rounded-full"></div>
          </div>
          <CardDescription className="text-muted-foreground text-center">
            Descubra os Eventos Tenebrosos e Discretos
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border/50 focus:border-neon-green focus:ring-neon-green/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-secondary/50 border-border/50 focus:border-neon-green focus:ring-neon-green/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-destructive text-sm text-center bg-destructive/10 p-2 rounded border border-destructive/20">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-neon-green text-black hover:bg-neon-green/90 font-bold py-3 neon-glow"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar com E-mail"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">ou continue com</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="border-neon-blue/30 hover:border-neon-blue hover:bg-neon-blue/10 bg-transparent"
              onClick={() => handleSocialLogin("Gmail")}
            >
              <Chrome className="h-4 w-4 text-neon-blue" />
            </Button>
            <Button
              variant="outline"
              className="border-neon-purple/30 hover:border-neon-purple hover:bg-neon-purple/10 bg-transparent"
              onClick={() => handleSocialLogin("Apple")}
            >
              <Apple className="h-4 w-4 text-neon-purple" />
            </Button>
            <Button
              variant="outline"
              className="border-neon-green/30 hover:border-neon-green hover:bg-neon-green/10 bg-transparent"
              onClick={() => handleSocialLogin("Spotify")}
            >
              <Music className="h-4 w-4 text-neon-green" />
            </Button>
          </div>

          <Button
            variant="ghost"
            className="w-full text-muted-foreground hover:text-neon-green"
            onClick={handleGuestMode}
          >
            Entrar como Visitante
          </Button>

          <div className="text-center text-xs text-muted-foreground">
            <p>Contas de demonstração:</p>
            <p>Admin: admin@sublynx.com / password123</p>
            <p>User: alex@example.com / password123</p>
            <p>Visitante: guest@sublynx.com / guest123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
