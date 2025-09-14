/**
 * Achievement System for Fortify
 * Tracks user progress and unlocks special rewards
 */

export interface Achievement {
  id: string
  title: string
  description: string
  xpReward: number
  completed: boolean
  checkCompletion: (data: AchievementCheckData) => boolean
}

export interface AchievementCheckData {
  passwordCount: number
  longestPassword: number
  twoFAEnabled: number
}

export interface AchievementUnlock {
  achievement: Achievement
  isNewUnlock: boolean
}

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "keychain",
    title: "KEYCHAIN",
    description: "Store 3 passwords in your vault",
    xpReward: 300,
    completed: false,
    checkCompletion: (data) => data.passwordCount >= 3
  },
  {
    id: "longest_word", 
    title: "LONGEST WORD",
    description: "Create a password longer than 16 characters",
    xpReward: 200,
    completed: false,
    checkCompletion: (data) => data.longestPassword > 16
  },
  {
    id: "security_master",
    title: "SECURITY MASTER", 
    description: "Enable 2FA on at least one account",
    xpReward: 250,
    completed: false,
    checkCompletion: (data) => data.twoFAEnabled >= 1
  }
]

/**
 * Check all achievements for completion and return newly unlocked ones
 */
export function checkAchievements(
  currentAchievements: Achievement[],
  data: AchievementCheckData
): AchievementUnlock[] {
  const unlocked: AchievementUnlock[] = []

  currentAchievements.forEach(achievement => {
    const wasCompleted = achievement.completed
    const isCompleted = achievement.checkCompletion(data)

    if (isCompleted && !wasCompleted) {
      // Newly unlocked achievement
      achievement.completed = true
      unlocked.push({
        achievement: { ...achievement },
        isNewUnlock: true
      })
    } else if (isCompleted) {
      // Already completed
      unlocked.push({
        achievement: { ...achievement },
        isNewUnlock: false
      })
    }
  })

  return unlocked
}

/**
 * Load achievement progress from localStorage
 */
export function loadAchievementProgress(): Achievement[] {
  try {
    const saved = localStorage.getItem('fortify-achievements')
    if (saved) {
      const savedAchievements = JSON.parse(saved)
      
      // Merge with current achievement definitions (in case new achievements were added)
      return ACHIEVEMENTS.map(achievement => {
        const savedAchievement = savedAchievements.find((s: Achievement) => s.id === achievement.id)
        return {
          ...achievement,
          completed: savedAchievement?.completed || false
        }
      })
    }
  } catch (error) {
    console.warn('Failed to load achievement progress:', error)
  }
  
  return [...ACHIEVEMENTS]
}

/**
 * Save achievement progress to localStorage
 */
export function saveAchievementProgress(achievements: Achievement[]): void {
  try {
    localStorage.setItem('fortify-achievements', JSON.stringify(achievements))
  } catch (error) {
    console.warn('Failed to save achievement progress:', error)
  }
}

/**
 * Calculate total XP earned from completed achievements
 */
export function getTotalAchievementXP(achievements: Achievement[]): number {
  return achievements
    .filter(achievement => achievement.completed)
    .reduce((total, achievement) => total + achievement.xpReward, 0)
}
