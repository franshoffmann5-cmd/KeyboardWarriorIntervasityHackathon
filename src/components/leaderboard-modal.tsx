"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface LeaderboardEntry {
  id: string
  username: string
  xp: number
  isCurrentUser?: boolean
}

interface LeaderboardModalProps {
  isOpen: boolean
  onClose: () => void
  currentUserXp: number
}

// Mock leaderboard data
const MOCK_USERS: Omit<LeaderboardEntry, 'isCurrentUser'>[] = [
  { id: "1", username: "CyberGuardian", xp: 1090 },
  { id: "2", username: "PasswordMaster", xp: 950 },
  { id: "3", username: "SecureKnight", xp: 825 },
  { id: "4", username: "FortressBuilder", xp: 720 },
  { id: "5", username: "CryptoWarrior", xp: 635 },
  { id: "6", username: "SafetyFirst", xp: 560 },
  { id: "7", username: "ShieldMaster", xp: 490 },
  { id: "8", username: "DefenseExpert", xp: 425 },
  { id: "9", username: "SecurityPro", xp: 370 },
  { id: "10", username: "VaultKeeper", xp: 320 },
]

export default function LeaderboardModal({ isOpen, onClose, currentUserXp }: LeaderboardModalProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState(11)

  useEffect(() => {
    if (!isOpen) return

    // Create current user entry
    const currentUser: LeaderboardEntry = {
      id: "current",
      username: "You",
      xp: currentUserXp,
      isCurrentUser: true
    }

    // Combine with mock users and sort by XP
    const allUsers = [...MOCK_USERS, currentUser].sort((a, b) => b.xp - a.xp)

    // Find user's rank and update leaderboard
    const userIndex = allUsers.findIndex(user => user.id === "current")
    setUserRank(userIndex + 1)

    // Show top 10 with user if they're in top 10, otherwise show top 9 + user
    let displayLeaderboard: LeaderboardEntry[]
    if (userIndex < 10) {
      displayLeaderboard = allUsers.slice(0, 10)
    } else {
      displayLeaderboard = [...allUsers.slice(0, 9), currentUser]
    }

    setLeaderboard(displayLeaderboard)
  }, [isOpen, currentUserXp])

  if (!isOpen) return null

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return "🏆"
      case 2: return "🥈" 
      case 3: return "🥉"
      default: return `#${rank}`
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "text-yellow-400"
      case 2: return "text-gray-300"
      case 3: return "text-yellow-600"
      default: return "text-blueprint-cyan"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-blueprint-dark border-2 border-blueprint-cyan p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-blueprint-cyan font-pixel text-xl">GLOBAL LEADERBOARD</h3>
          <button
            onClick={onClose}
            className="text-blueprint-cyan hover:text-white text-xl font-pixel"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* User's Current Rank */}
        <div className="mb-6 p-3 border border-blueprint-cyan bg-blueprint/30">
          <div className="text-center">
            <div className="text-blueprint-cyan font-pixel text-sm mb-1">YOUR RANK</div>
            <div className={`font-pixel text-lg ${getRankColor(userRank)}`}>
              {getRankIcon(userRank)}
            </div>
            <div className="text-blueprint-text font-pixel text-xs mt-1">{currentUserXp} XP</div>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="space-y-2">
          {leaderboard.map((entry, index) => {
            const actualRank = entry.isCurrentUser && userRank > 10 ? userRank : index + 1
            
            return (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-3 border transition-all duration-300 ${
                  entry.isCurrentUser
                    ? "border-yellow-400 bg-yellow-400/10 shadow-lg"
                    : "border-blueprint-cyan/30 bg-blueprint/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`font-pixel text-sm min-w-[40px] ${getRankColor(actualRank)}`}>
                    {getRankIcon(actualRank)}
                  </div>
                  <div>
                    <div className={`font-pixel text-sm ${
                      entry.isCurrentUser ? "text-yellow-400" : "text-blueprint-text"
                    }`}>
                      {entry.username}
                      {entry.isCurrentUser && " (You)"}
                    </div>
                  </div>
                </div>
                <div className={`font-pixel text-sm ${
                  entry.isCurrentUser ? "text-yellow-400" : "text-blueprint-cyan"
                }`}>
                  {entry.xp.toLocaleString()} XP
                </div>
              </div>
            )
          })}
        </div>

        {/* If user is not in top 10, show indication */}
        {userRank > 10 && userRank > 11 && (
          <div className="mt-4 text-center">
            <div className="text-blueprint-text font-pixel text-xs opacity-70">
              ... {userRank - 11} other players ...
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Button
            onClick={onClose}
            className="bg-blueprint-cyan text-blueprint hover:bg-white font-pixel px-8"
          >
            CLOSE
          </Button>
        </div>
      </div>
    </div>
  )
}
