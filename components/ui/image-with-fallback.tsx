"use client"

import { useState } from "react"
import Image from "next/image"
import { Loader2 } from "lucide-react"

interface ImageWithFallbackProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
  priority?: boolean
}

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className = "",
  fallbackSrc = "/cyberpunk-neon-abstract.png",
  priority = false,
}: ImageWithFallbackProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setCurrentSrc(fallbackSrc)
      setIsLoading(false)
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-secondary/20 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-neon-green" />
        </div>
      )}

      <Image
        src={currentSrc || "/placeholder.svg"}
        alt={alt}
        width={width || 400}
        height={height || 400}
        className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"} ${
          width && height ? "" : "w-full h-full"
        } object-cover`}
        onLoad={handleLoad}
        onError={handleError}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {hasError && !isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="text-xs">Imagem não disponível</div>
          </div>
        </div>
      )}
    </div>
  )
}
