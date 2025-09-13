"use client"

import { useState, useEffect } from "react"

interface FortDisplayProps {
  level: number
}

export default function FortDisplay({ level }: FortDisplayProps) {
  const [animationFrame, setAnimationFrame] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame((prev) => (prev + 1) % 3)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const getFortImage = (currentLevel: number, frame: number) => {
    switch (currentLevel) {
      case 1: // Campfire
        return `/Campfire${frame + 1}.png`
      case 2: // Log Cabin
        return `/LogCabin${frame + 1}.png`
      case 3: // Fortified Outpost
        return `/Fort${frame + 1}.png`
      case 4: // Legendary Castle
        return `/Castle${frame + 1}.png`
      default:
        return `/Campfire${frame + 1}.png`
    }
  }

  const getFortName = (currentLevel: number) => {
    switch (currentLevel) {
      case 1:
        return "CAMPFIRE"
      case 2:
        return "LOG CABIN"
      case 3:
        return "FORTIFIED OUTPOST"
      case 4:
        return "LEGENDARY CASTLE"
      default:
        return "CAMPFIRE"
    }
  }

  return (
    <div className="text-center w-full max-w-lg mx-auto">
      {/* Fort Name */}
      <h2 className="text-blueprint-cyan text-xl md:text-3xl lg:text-4xl xl:text-5xl font-pixel mb-4 sm:mb-6 lg:mb-8 tracking-wider px-2">
        {getFortName(level)}
      </h2>

      {/* Fort Image */}
      <div className="relative inline-block w-full max-w-2xl mx-auto">
        <img
          src={getFortImage(level, animationFrame) || "/placeholder.svg"}
          alt={`Level ${level} fort`}
          className="pixel-art w-full h-64 sm:h-80 md:h-96 lg:h-[32rem] xl:h-[36rem] object-contain border-2 border-blueprint-cyan bg-blueprint-dark/50 p-2 sm:p-4 lg:p-8"
        />

        {/* Glow Effect */}
        <div className="absolute inset-0 border-2 border-blueprint-cyan opacity-30 animate-pulse" />
      </div>
    </div>
  )
}
