"use client"

import { Button } from "@/components/ui/button"

interface PasswordAnalysisPopupProps {
  analysis: {
    score: number
    label: string
    suggestions: string[]
  }
  onClose: () => void
}

export default function PasswordAnalysisPopup({ analysis, onClose }: PasswordAnalysisPopupProps) {
  const getStrengthColor = (score: number) => {
    if (score <= 1) return "text-red-400"
    if (score <= 2) return "text-orange-400"
    if (score <= 3) return "text-yellow-400"
    return "text-green-400"
  }

  const getStrengthBars = (score: number) => {
    return Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className={`h-2 w-8 border border-blueprint-cyan ${i < score ? "bg-blueprint-cyan" : "bg-transparent"}`}
      />
    ))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-blueprint-dark border-2 border-blueprint-cyan p-6 max-w-md w-full mx-4 animate-in fade-in-0 zoom-in-95">
        <h3 className="text-blueprint-cyan font-pixel text-lg mb-4 text-center">PASSWORD ANALYSIS</h3>

        <div className="text-center mb-4">
          <div className={`font-pixel text-xl mb-2 ${getStrengthColor(analysis.score)}`}>{analysis.label}</div>

          <div className="flex justify-center gap-1 mb-4">{getStrengthBars(analysis.score)}</div>

          <div className="text-blueprint-cyan font-pixel text-sm">STRENGTH: {analysis.score}/4</div>
        </div>

        {analysis.suggestions.length > 0 && (
          <div className="mb-6">
            <h4 className="text-blueprint-cyan font-pixel text-sm mb-3">IMPROVEMENTS:</h4>
            <ul className="space-y-2">
              {analysis.suggestions.map((suggestion, index) => (
                <li key={index} className="text-blueprint-text font-pixel text-xs flex items-start">
                  <span className="text-blueprint-cyan mr-2">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button onClick={onClose} className="w-full bg-blueprint-cyan text-blueprint hover:bg-white font-pixel">
          GOT IT
        </Button>
      </div>
    </div>
  )
}
