interface LevelBarProps {
  xp: number
  level: number
  maxXp: number
  minXp: number
}

export default function LevelBar({ xp, level, maxXp, minXp }: LevelBarProps) {
  const progress = ((xp - minXp) / (maxXp - minXp)) * 100

  return (
    <div className="w-full">
      {/* Level Display */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-blueprint-cyan text-sm md:text-base lg:text-lg xl:text-xl font-pixel">LEVEL {level}</span>
        <span className="text-blueprint-cyan text-sm md:text-base lg:text-lg xl:text-xl font-pixel">
          {xp} / {maxXp} XP
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-full h-5 md:h-7 lg:h-8 xl:h-10 border-2 border-blueprint-cyan bg-blueprint-dark">
        {/* Progress Fill */}
        <div
          className="h-full bg-gradient-to-r from-blueprint-cyan to-white transition-all duration-500 ease-out pixel-glow"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />

        {/* Pixel Border Effect */}
        <div className="absolute inset-0 border border-blueprint-cyan opacity-50" />

        {/* Inner Glow */}
        <div
          className="absolute top-0 h-full bg-blueprint-cyan opacity-30 transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  )
}
