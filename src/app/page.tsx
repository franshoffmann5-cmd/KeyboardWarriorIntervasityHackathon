"use client"

import { useState, useEffect } from "react"
import LevelBar from "@/components/level-bar"
import FortDisplay from "@/components/fort-display"
import VaultPanel from "@/components/vault-panel"
import LessonsPanel from "@/components/lessons-panel"
import LevelUpOverlay from "@/components/level-up-overlay"
import WelcomeModal from "@/components/welcome-modal"
import SignInModal from "@/components/sign-in-modal"
import VolumeControl from "@/components/VolumeControl"
import FooterAcknowledgements from "@/components/FooterAcknowledgements"
import { useSimpleAudio } from "@/audio/useSimpleAudio"

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

  // Audio manager
  const audio = useSimpleAudio(PLAYLIST);
  
  console.log('🎵 Page component - audio enabled:', audio.enabled, 'volume:', audio.volume, 'muted:', audio.muted);

  // Auto-start music when component mounts
  useEffect(() => {
    let hasStarted = false;
    
    const startMusic = async () => {
      if (hasStarted) return; // Prevent multiple starts
      hasStarted = true;
      
      console.log('🎵 startMusic called - audio enabled:', audio.enabled);
      
      try {
        console.log('🎵 Attempting auto-start music');
        await audio.start();
        console.log('🎵 Auto-start music succeeded');
      } catch (error) {
        console.log('🎵 Auto-start failed (likely due to autoplay policy):', error);
        // Show enable music button if autoplay fails
        setShowMusicEnable(true);
      }
    };

    // Try auto-start with delay
    console.log('🎵 Setting up music start timer');
    const timer = setTimeout(startMusic, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

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
          isSignedIn={isSignedIn}
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
              maxXp={level < 4 ? levelThresholds[level] : 1000}
              minXp={level > 1 ? levelThresholds[level - 1] : 0}
              onClick={() => addXp(100)}
            />
          </div>

          {/* Fort Display */}
          <div className="relative flex-1 flex items-center justify-center w-full">
            <FortDisplay level={level} />
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
              console.log('🎵 Starting music after user interaction');
              await audio.start();
              setShowMusicEnable(false); // Hide music enable button if it was shown
            } catch (error) {
              console.log('🎵 Failed to start music on user interaction:', error);
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

      {/* Enable Music Button (shows if autoplay failed) */}
      {showMusicEnable && (
        <button
          onClick={async () => {
            try {
              await audio.start();
              setShowMusicEnable(false);
            } catch (error) {
              console.log('🎵 Manual music start failed:', error);
            }
          }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blueprint-cyan text-blueprint-dark px-4 py-2 font-pixel text-sm border-2 border-blueprint-cyan hover:bg-white transition-colors z-50"
        >
          🎵 ENABLE MUSIC
        </button>
      )}
    </div>
  )
}
