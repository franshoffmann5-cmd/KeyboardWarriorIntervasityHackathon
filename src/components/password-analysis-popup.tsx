"use client"

import { Button } from "@/components/ui/button"
import { getStrengthColor, getXpMultiplier } from "@/lib/password-strength"

interface PasswordAnalysisPopupProps {
  analysis: {
    score: number
    label: string
    reasons: string[]
  }
  xpInfo?: {
    baseXp: number
    finalXp: number
    isDuplicate?: boolean
  }
  onClose: () => void
}

export default function PasswordAnalysisPopup({ analysis, xpInfo, onClose }: PasswordAnalysisPopupProps) {
  const getStrengthBars = (score: number) => {
    return Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className={`h-2 w-8 border border-blueprint-cyan ${i < score ? "bg-blueprint-cyan" : "bg-transparent"}`}
      />
    ))
  }

  const xpMultiplier = getXpMultiplier(analysis.score)
  const baseXp = xpInfo?.baseXp || 20
  const calculatedXp = Math.round(baseXp * xpMultiplier)
  const finalXp = xpInfo?.finalXp || calculatedXp
  const isDuplicate = xpInfo?.isDuplicate || false

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-blueprint-dark border-2 border-blueprint-cyan p-6 max-w-md w-full mx-4 animate-in fade-in-0 zoom-in-95">
        <h3 className="text-blueprint-cyan font-pixel text-lg mb-4 text-center">PASSWORD ANALYSIS</h3>

        <div className="text-center mb-4">
          <div className={`font-pixel text-xl mb-2 ${getStrengthColor(analysis.score)}`}>{analysis.label}</div>

          <div className="flex justify-center gap-1 mb-4">{getStrengthBars(analysis.score)}</div>

          <div className="text-blueprint-cyan font-pixel text-sm">STRENGTH: {analysis.score}/4</div>
        </div>

        {analysis.reasons.length > 0 && (
          <div className="mb-6">
            <h4 className="text-blueprint-cyan font-pixel text-sm mb-3">ANALYSIS:</h4>
            <ul className="space-y-2">
              {analysis.reasons.map((reason, index) => (
                <li key={index} className="text-blueprint-text font-pixel text-xs flex items-start">
                  <span className="text-blueprint-cyan mr-2">•</span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Gamification Stats */}
        <div className="mb-6 border border-blueprint-cyan bg-blueprint/50 p-3">
          <h4 className="text-blueprint-cyan font-pixel text-sm mb-3 text-center">XP CALCULATION</h4>
          <div className="text-blueprint-text font-pixel text-xs space-y-1">
            <div>XP Multiplier: {xpMultiplier}x</div>
            <div>Base XP ({baseXp}): {calculatedXp} XP</div>
            {isDuplicate && (
              <div>Duplicate Penalty (50%): {finalXp} XP</div>
            )}
            {!isDuplicate && finalXp !== calculatedXp && (
              <div>Final XP: {finalXp} XP</div>
            )}
          </div>
          <div className="text-center mt-2 pt-2 border-t border-blueprint-cyan">
            <span className="text-blueprint-cyan font-pixel text-sm">TOTAL: {finalXp} XP</span>
          </div>
        </div>

        <Button onClick={onClose} className="w-full bg-blueprint-cyan text-blueprint hover:bg-white font-pixel">
          GOT IT
        </Button>
      </div>
    </div>
  )
}
