"use client"

import { useState, useEffect } from "react"
import { Achievement } from "@/lib/achievements"

interface AchievementUnlockOverlayProps {
  achievement: Achievement | null
  onClose: () => void
}

export default function AchievementUnlockOverlay({ achievement, onClose }: AchievementUnlockOverlayProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)
      // Auto-close after 4 seconds
      const timer = setTimeout(() => {
        handleClose()
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [achievement])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 500)
  }

  if (!achievement) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-blueprint-dark border-2 border-yellow-400 p-6 sm:p-8 max-w-sm sm:max-w-md w-full text-center transition-all duration-500 ${
          isVisible 
            ? "scale-100 opacity-100 animate-pulse" 
            : "scale-110 opacity-0"
        }`}
        style={{
          boxShadow: isVisible ? "0 0 30px rgba(255, 215, 0, 0.5)" : "none"
        }}
      >
        {/* Achievement Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-yellow-400 bg-yellow-400/20 flex items-center justify-center relative">
            <span className="text-yellow-400 font-pixel text-2xl sm:text-3xl">★</span>
            {/* Sparkle effect */}
            <div className="absolute inset-0 border-2 border-yellow-400 animate-ping opacity-50"></div>
          </div>
        </div>

        {/* Achievement Unlocked Text */}
        <div className="mb-4">
          <div className="text-yellow-400 font-pixel text-lg sm:text-xl mb-2 tracking-wider">
            ACHIEVEMENT UNLOCKED!
          </div>
          <div className="text-blueprint-cyan font-pixel text-base sm:text-lg mb-1">
            {achievement.title}
          </div>
          <div className="text-blueprint-text font-pixel text-xs sm:text-sm leading-relaxed">
            {achievement.description}
          </div>
        </div>

        {/* XP Reward */}
        <div className="bg-yellow-400/20 border border-yellow-400 p-3 mb-6">
          <div className="text-yellow-400 font-pixel text-sm sm:text-base">
            +{achievement.xpReward} XP EARNED!
          </div>
        </div>

        {/* Completion Checkmark */}
        <div className="mb-4">
          <div className="w-8 h-8 border-2 border-green-500 bg-green-500/20 flex items-center justify-center mx-auto">
            <span className="text-green-500 font-pixel text-lg">✓</span>
          </div>
        </div>

        {/* Click to continue */}
        <button
          onClick={handleClose}
          className="text-blueprint-cyan/70 font-pixel text-xs hover:text-blueprint-cyan transition-colors"
        >
          CLICK TO CONTINUE
        </button>

        {/* Decorative corners with glow */}
        <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-yellow-400 opacity-80"></div>
        <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-yellow-400 opacity-80"></div>
        <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-yellow-400 opacity-80"></div>
        <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-yellow-400 opacity-80"></div>

        {/* Extra glow effect */}
        <div className="absolute inset-0 border-2 border-yellow-400/30 animate-pulse"></div>
      </div>
    </div>
  )
}
