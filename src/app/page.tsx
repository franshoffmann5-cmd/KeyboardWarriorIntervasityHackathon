"use client"

import { useState, useEffect } from "react"
import LevelBar from "@/components/level-bar"
import FortDisplay from "@/components/fort-display"
import VaultPanel from "@/components/vault-panel"
import LessonsPanel from "@/components/lessons-panel"
import LevelUpOverlay from "@/components/level-up-overlay"
import WelcomeModal from "@/components/welcome-modal"
import SignInModal from "@/components/sign-in-modal"
import LeaderboardModal from "@/components/leaderboard-modal"
import AchievementsModal from "@/components/achievements-modal"
import AchievementUnlockOverlay from "@/components/achievement-unlock-overlay"
import VolumeControl from "@/components/VolumeControl"
import FooterAcknowledgements from "@/components/FooterAcknowledgements"
import { useSimpleAudio } from "@/audio/useSimpleAudio"
import { 
  Achievement, 
  AchievementCheckData,
  loadAchievementProgress,
  saveAchievementProgress,
  checkAchievements 
} from "@/lib/achievements"

// Chiptune playlist
const PLAYLIST = [
  "/1 - Pix - No Destination (royalty free 8-bit music).mp3",
  "/2 - Pix - City Over Clouds (royalty free 8-bit music).mp3",
  "/3 - Pix - No Worries (royalty free 8-bit music).mp3",
  "/4 - Pix - No Muscle No Problem (royalty free 8-bit music).mp3",
  "/5 - Pix - Hello, it's Me! (royalty free 8-bit music).mp3",
  "/6 - Pix - Something Wrong with my Dog (royalty free 8-bit music).mp3"
];

interface VaultEntry {
  id: string
  siteName: string
  password: string
  passwordStrength: number
  has2FA: boolean
}

export default function Fortify() {
  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [vaultOpen, setVaultOpen] = useState(false)
  const [lessonsOpen, setLessonsOpen] = useState(false)
  const [vaultEntries, setVaultEntries] = useState<VaultEntry[]>([])
  const [showWelcome, setShowWelcome] = useState(true)
  const [showSignIn, setShowSignIn] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [showMusicEnable, setShowMusicEnable] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  
  // Achievement system
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [showAchievements, setShowAchievements] = useState(false)
  const [showAchievementUnlock, setShowAchievementUnlock] = useState<Achievement | null>(null)

  // Audio manager
  const audio = useSimpleAudio(PLAYLIST);

  // Auto-start music when component mounts
  useEffect(() => {
    let hasStarted = false;
    
    const startMusic = async () => {
      if (hasStarted) return; // Prevent multiple starts
      hasStarted = true;
      
      try {
        await audio.start();
      } catch (error) {
        // Show enable music button if autoplay fails
        setShowMusicEnable(true);
      }
    };

    // Try auto-start with delay
    const timer = setTimeout(startMusic, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Load achievements on mount
  useEffect(() => {
    const loadedAchievements = loadAchievementProgress()
    setAchievements(loadedAchievements)
  }, [])

  // Check achievements when vault entries change
  useEffect(() => {
    if (vaultEntries.length > 0 && achievements.length > 0) {
      checkAndUpdateAchievements()
    }
  }, [vaultEntries.length, achievements.length]);

  // Level thresholds
  const levelThresholds = [0, 250, 500, 750, 1500]

  const getCurrentLevel = (currentXp: number) => {
    //if (currentXp >= 1500) return 5
    if (currentXp >= 750) return 4
    if (currentXp >= 500) return 3
    if (currentXp >= 250) return 2
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

  // Check achievements function
  const checkAndUpdateAchievements = () => {
    const checkData: AchievementCheckData = {
      passwordCount: vaultEntries.length,
      longestPassword: Math.max(0, ...vaultEntries.map(entry => entry.password.length)),
      twoFAEnabled: vaultEntries.filter(entry => entry.has2FA).length
    }

    const unlocks = checkAchievements(achievements, checkData)
    const newUnlocks = unlocks.filter(unlock => unlock.isNewUnlock)

    if (newUnlocks.length > 0) {
      // Update achievements state
      const updatedAchievements = [...achievements]
      setAchievements(updatedAchievements)
      saveAchievementProgress(updatedAchievements)

      // Show achievement unlock notifications one by one
      newUnlocks.forEach((unlock, index) => {
        setTimeout(() => {
          addXp(unlock.achievement.xpReward)
          setShowAchievementUnlock(unlock.achievement)
        }, index * 500) // Stagger multiple achievement unlocks
      })
    }
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
          isSignedIn={isSignedIn}
          onAchievementCheck={checkAndUpdateAchievements}
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
                className="relative text-blueprint-cyan hover:text-white transition-all duration-300 cursor-pointer font-pixel text-sm md:text-base lg:text-lg xl:text-xl hover:scale-105 animate-pulse hover:animate-none group"
              >
                {/* Glowing border effect */}
                <div className="absolute inset-0 border-2 border-blueprint-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping group-hover:animate-none"></div>
                
                {/* Main text with glow effect */}
                <div className="relative px-3 py-2 border border-blueprint-cyan/50 hover:border-blueprint-cyan bg-blueprint-dark/20 hover:bg-blueprint-dark/40 transition-all duration-300 hover:shadow-lg hover:shadow-blueprint-cyan/20">
                  <span className="hidden sm:inline">🔐 Sign into Fortify</span>
                  <span className="sm:hidden">🔐 Sign In</span>
                </div>
              </button>
            </div>
          )}

          {/* XP/Level Progress Bar */}
          <div className="w-full max-w-xs sm:max-w-md lg:max-w-2xl mb-4 sm:mb-6 lg:mb-8 mt-2 sm:mt-3 lg:mt-4">
            <LevelBar
              xp={xp}
              level={level}
              maxXp={level < 5 ? levelThresholds[level] : 2000}
              minXp={level > 1 ? levelThresholds[level - 1] : 0}
              onClick={() => addXp(100)}
            />
          </div>

          {/* Fort Display with Side Buttons */}
          <div className="relative flex-1 flex items-center justify-center w-full">
            <div className="flex items-center justify-center w-full max-w-7xl">
              {/* Left Star Button */}
              <div className={`flex justify-end pr-12 sm:pr-16 lg:pr-24 xl:pr-32 flex-1 transition-all duration-300 ${
                !isSignedIn ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}>
                <button 
                  onClick={() => setShowAchievements(true)}
                  className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 border-2 border-blueprint-cyan bg-blueprint-dark/50 hover:bg-blueprint-dark/80 transition-all duration-300 hover:scale-105 hover:border-white group"
                >
                  <img 
                    src="/Star.png" 
                    alt="Star" 
                    className="w-full h-full object-contain p-1 sm:p-2 filter brightness-90 group-hover:brightness-110 transition-all duration-300"
                  />
                </button>
              </div>

              {/* Central Fort Display */}
              <div className="flex-shrink-0">
                <FortDisplay level={level} />
              </div>

              {/* Right Trophy Button */}
              <div className={`flex justify-start pl-12 sm:pl-16 lg:pl-24 xl:pl-32 flex-1 transition-all duration-300 ${
                !isSignedIn ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}>
                <button 
                  onClick={() => setShowLeaderboard(true)}
                  className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 border-2 border-blueprint-cyan bg-blueprint-dark/50 hover:bg-blueprint-dark/80 transition-all duration-300 hover:scale-105 hover:border-white group"
                >
                  <img 
                    src="/Trophy.png" 
                    alt="Trophy" 
                    className="w-full h-full object-contain p-1 sm:p-2 filter brightness-90 group-hover:brightness-110 transition-all duration-300"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Lessons Panel */}
        <LessonsPanel 
          isOpen={lessonsOpen} 
          onToggle={() => setLessonsOpen(!lessonsOpen)} 
          onXpGain={addXp} 
          isSignedIn={isSignedIn}
        />

        {/* Audio Controls - moved inside main layout for proper z-index layering */}
        <VolumeControl
          volume={audio.volume}
          muted={audio.muted}
          onChange={audio.setVolume}
          onToggleMute={audio.toggleMute}
        />
        <FooterAcknowledgements />
      </div>

      {/* Level Up Overlay */}
      {showLevelUp && <LevelUpOverlay level={level} />}

      {/* Welcome Modal for first-time users */}
      {showWelcome && (
        <WelcomeModal 
          onClose={async () => {
            setShowWelcome(false);
            // Try to start music with user interaction
            try {
              await audio.start();
              setShowMusicEnable(false); // Hide music enable button if it was shown
            } catch (error) {
              // Music start failed
            }
          }} 
        />
      )}

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

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <LeaderboardModal
          isOpen={showLeaderboard}
          onClose={() => setShowLeaderboard(false)}
          currentUserXp={xp}
        />
      )}

      {/* Achievements Modal */}
      {showAchievements && (
        <AchievementsModal
          isOpen={showAchievements}
          onClose={() => setShowAchievements(false)}
          achievements={achievements}
        />
      )}

      {/* Achievement Unlock Overlay */}
      {showAchievementUnlock && (
        <AchievementUnlockOverlay
          achievement={showAchievementUnlock}
          onClose={() => setShowAchievementUnlock(null)}
        />
      )}

      {/* Enable Music Button (shows if autoplay failed) */}
      {showMusicEnable && (
        <button
          onClick={async () => {
            try {
              await audio.start();
              setShowMusicEnable(false);
            } catch (error) {
              // Manual music start failed
            }
          }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blueprint-cyan text-blueprint-dark px-4 py-2 font-pixel text-sm border-2 border-blueprint-cyan hover:bg-white transition-colors z-50"
        >
          ENABLE MUSIC
        </button>
      )}
    </div>
  )
}
