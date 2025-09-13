"use client"

import { useState } from "react"
import LevelBar from "@/components/level-bar"
import FortDisplay from "@/components/fort-display"
import VaultPanel from "@/components/vault-panel"
import LessonsPanel from "@/components/lessons-panel"
import LevelUpOverlay from "@/components/level-up-overlay"
import WelcomeModal from "@/components/welcome-modal"
import SignInModal from "@/components/sign-in-modal"

export default function Fortify() {
  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [vaultOpen, setVaultOpen] = useState(false)
  const [lessonsOpen, setLessonsOpen] = useState(false)
  const [vaultEntries, setVaultEntries] = useState([])
  const [showWelcome, setShowWelcome] = useState(true)
  const [showSignIn, setShowSignIn] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)

  // Level thresholds
  const levelThresholds = [0, 150, 300, 500]

  const getCurrentLevel = (currentXp: number) => {
    if (currentXp >= 500) return 4
    if (currentXp >= 300) return 3
    if (currentXp >= 150) return 2
    return 1
  }

  const addXp = (amount: number) => {
    const newXp = xp + amount
    const newLevel = getCurrentLevel(newXp)

    if (newLevel > level) {
      setShowLevelUp(true)
      setTimeout(() => setShowLevelUp(false), 3000)
    }

    setXp(newXp)
    setLevel(newLevel)
  }

  return (
    <div className="min-h-screen bg-blueprint text-blueprint-text font-pixel overflow-hidden relative">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
            linear-gradient(rgba(184, 232, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(184, 232, 255, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Main Layout */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Left Vault Panel */}
        <VaultPanel
          isOpen={vaultOpen}
          onToggle={() => setVaultOpen(!vaultOpen)}
          entries={vaultEntries}
          setEntries={setVaultEntries}
          onXpGain={addXp}
        />

        {/* Center Column */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-4">
          {/* Sign-in indicator in top right */}
          {isSignedIn && (
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 lg:top-6 lg:right-6 flex items-center gap-2 text-blueprint-cyan font-pixel text-sm md:text-base lg:text-lg xl:text-xl z-30">
              <div className="w-2 h-2 md:w-3 md:h-3 lg:w-4 lg:h-4 rounded-full animate-pulse bg-green-400"></div>
              <span className="hidden sm:inline">Signed into Fortify</span>
              <span className="sm:hidden">Online</span>
            </div>
          )}

          {!isSignedIn && (
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 lg:top-6 lg:right-6 z-30">
              <button
                onClick={() => setShowSignIn(true)}
                className="text-blueprint-cyan hover:text-white transition-colors cursor-pointer font-pixel text-sm md:text-base lg:text-lg xl:text-xl"
              >
                <span className="hidden sm:inline">Sign into Fortify</span>
                <span className="sm:hidden">Sign In</span>
              </button>
            </div>
          )}

          {/* XP/Level Progress Bar */}
          <div className="w-full max-w-xs sm:max-w-md lg:max-w-2xl mb-4 sm:mb-6 lg:mb-8 mt-2 sm:mt-3 lg:mt-4">
            <LevelBar
              xp={xp}
              level={level}
              maxXp={level < 4 ? levelThresholds[level] : 1000}
              minXp={level > 1 ? levelThresholds[level - 1] : 0}
            />
          </div>

          {/* Fort Display */}
          <div className="relative flex-1 flex items-center justify-center w-full">
            <FortDisplay level={level} />
          </div>
        </div>

        {/* Right Lessons Panel */}
        <LessonsPanel isOpen={lessonsOpen} onToggle={() => setLessonsOpen(!lessonsOpen)} onXpGain={addXp} />
      </div>

      {/* Level Up Overlay */}
      {showLevelUp && <LevelUpOverlay level={level} />}

      {/* Welcome Modal for first-time users */}
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}

      {/* Sign-in Modal */}
      {showSignIn && (
        <SignInModal
          onClose={() => setShowSignIn(false)}
          onSignIn={() => {
            setIsSignedIn(true)
            setShowSignIn(false)
          }}
        />
      )}

      <button
        onClick={() => addXp(100)}
        className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 lg:bottom-6 lg:right-6 bg-blueprint-cyan text-blueprint-dark px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 font-pixel text-sm md:text-base lg:text-lg xl:text-xl hover:bg-white transition-colors z-40"
      >
        +100 XP
      </button>
    </div>
  )
}
