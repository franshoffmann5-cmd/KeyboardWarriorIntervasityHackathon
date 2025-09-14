"use client"

import { useState, useEffect } from "react"
import { Achievement } from "@/lib/achievements"

interface AchievementsModalProps {
  isOpen: boolean
  onClose: () => void
  achievements: Achievement[]
}

export default function AchievementsModal({ isOpen, onClose, achievements }: AchievementsModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  if (!isOpen) return null

  const completedCount = achievements.filter(a => a.completed).length
  const totalXP = achievements
    .filter(a => a.completed)
    .reduce((total, a) => total + a.xpReward, 0)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-blueprint-dark border-2 border-blueprint-cyan p-4 sm:p-6 max-w-md w-full transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mb-4 flex justify-center">
            <div className="w-12 h-12 border-2 border-blueprint-cyan flex items-center justify-center">
              <span className="text-blueprint-cyan font-pixel text-xl">★</span>
            </div>
          </div>

          <h3 className="text-blueprint-cyan font-pixel text-lg sm:text-xl mb-2">
            ACHIEVEMENTS
          </h3>

          <div className="text-blueprint-text font-pixel text-xs sm:text-sm mb-4">
            <div className="flex justify-center gap-4">
              <span>{completedCount}/{achievements.length} COMPLETED</span>
              <span>{totalXP} XP EARNED</span>
            </div>
          </div>
        </div>

        {/* Achievement List */}
        <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`border p-3 flex items-start gap-3 ${
                achievement.completed
                  ? "border-green-500 bg-green-500/10"
                  : "border-blueprint-cyan bg-blueprint/30"
              }`}
            >
              {/* Completion Status */}
              <div className="flex-shrink-0 w-6 h-6 border border-blueprint-cyan flex items-center justify-center mt-1">
                {achievement.completed ? (
                  <span className="text-green-500 font-pixel text-sm">✓</span>
                ) : (
                  <span className="text-blueprint-cyan/50 font-pixel text-xs">○</span>
                )}
              </div>

              {/* Achievement Info */}
              <div className="flex-1 min-w-0">
                <div className={`font-pixel text-sm mb-1 ${
                  achievement.completed ? "text-green-400" : "text-blueprint-cyan"
                }`}>
                  {achievement.title}
                </div>
                
                <div className="text-blueprint-text font-pixel text-xs mb-2 leading-relaxed">
                  {achievement.description}
                </div>

                <div className={`font-pixel text-xs ${
                  achievement.completed ? "text-green-400" : "text-blueprint-cyan"
                }`}>
                  +{achievement.xpReward} XP
                  {achievement.completed && (
                    <span className="ml-2 text-green-500">COMPLETED!</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Summary */}
        <div className="bg-blueprint/30 border border-blueprint-cyan/50 p-3 mb-4">
          <div className="text-blueprint-cyan font-pixel text-xs text-center">
            {completedCount === achievements.length ? (
              "ALL ACHIEVEMENTS UNLOCKED!"
            ) : (
              `${achievements.length - completedCount} MORE TO UNLOCK`
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-center">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-blueprint-cyan text-blueprint-dark font-pixel text-sm hover:bg-white transition-colors duration-200 min-h-[44px]"
          >
            CLOSE
          </button>
        </div>

        {/* Decorative corners */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-blueprint-cyan opacity-50"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-blueprint-cyan opacity-50"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-blueprint-cyan opacity-50"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-blueprint-cyan opacity-50"></div>
      </div>
    </div>
  )
}
