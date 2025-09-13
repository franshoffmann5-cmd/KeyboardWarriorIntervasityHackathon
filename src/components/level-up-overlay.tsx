interface LevelUpOverlayProps {
  level: number
}

export default function LevelUpOverlay({ level }: LevelUpOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blueprint/90 animate-in fade-in duration-500">
      {/* Flash Effect */}
      <div className="absolute inset-0 bg-blueprint-cyan animate-pulse opacity-20" />

      {/* Main Content */}
      <div className="text-center animate-in zoom-in duration-700">
        <h1 className="text-6xl font-pixel text-blueprint-cyan mb-4 animate-bounce">LEVEL UP!</h1>

        <div className="text-2xl font-pixel text-white mb-8">SECURITY LEVEL {level} ACHIEVED</div>

        {/* Sparkle Effects */}
        <div className="relative">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blueprint-cyan animate-ping"
              style={{
                left: `${Math.cos((i * 45 * Math.PI) / 180) * 100 + 50}%`,
                top: `${Math.sin((i * 45 * Math.PI) / 180) * 100 + 50}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
