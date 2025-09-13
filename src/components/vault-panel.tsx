"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import PasswordAnalysisPopup from "./password-analysis-popup"
import TwoFAPopup from "./two-fa-popup"
import DuplicatePasswordPopup from "./duplicate-password-popup"

interface VaultEntry {
  id: string
  siteName: string
  password: string
  passwordStrength: number
  has2FA: boolean
}

interface VaultPanelProps {
  isOpen: boolean
  onToggle: () => void
  entries: VaultEntry[]
  setEntries: (entries: VaultEntry[]) => void
  onXpGain: (amount: number) => void
}

function analyzePassword(password: string) {
  let score = 0
  const suggestions = []

  // Length check
  if (password.length >= 12) {
    score += 1
  } else {
    suggestions.push("Use at least 12 characters")
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    suggestions.push("Include uppercase letters")
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    suggestions.push("Include lowercase letters")
  }

  // Numbers check
  if (/\d/.test(password)) {
    score += 1
  } else {
    suggestions.push("Include numbers")
  }

  // Special characters check
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    score += 1
  } else {
    suggestions.push("Include special characters (!@#$%^&*)")
  }

  // Common patterns check
  if (!/(.)\1{2,}/.test(password) && !/123|abc|qwe|password|admin/i.test(password)) {
    score += 1
  } else {
    suggestions.push("Avoid repeating characters or common patterns")
  }

  const strength = Math.min(score, 4)
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Excellent"]

  return {
    score: strength,
    label: strengthLabels[strength],
    suggestions: suggestions.slice(0, 3), // Limit to top 3 suggestions
  }
}

export default function VaultPanel({ isOpen, onToggle, entries, setEntries, onXpGain }: VaultPanelProps) {
  const [newSite, setNewSite] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [show2FAPopup, setShow2FAPopup] = useState(false)
  const [current2FAEntry, setCurrent2FAEntry] = useState<VaultEntry | null>(null)
  const [is2FAActivation, setIs2FAActivation] = useState(true)
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false)
  const [duplicateSites, setDuplicateSites] = useState<string[]>([])
  const [pendingEntry, setPendingEntry] = useState<VaultEntry | null>(null)

  const addEntry = () => {
    if (!newSite.trim() || !newPassword.trim()) return

    // Check for duplicate passwords
    const duplicates = entries.filter(entry => entry.password === newPassword)
    
    if (duplicates.length > 0) {
      const duplicateSiteNames = duplicates.map(entry => entry.siteName)
      setDuplicateSites(duplicateSiteNames)
      
      // Create the pending entry for later use
      const analysis = analyzePassword(newPassword)
      const newEntry: VaultEntry = {
        id: Date.now().toString(),
        siteName: newSite,
        password: newPassword,
        passwordStrength: analysis.score,
        has2FA: false,
      }
      setPendingEntry(newEntry)
      setAnalysisResult(analysis)
      
      // Show duplicate warning
      setShowDuplicateWarning(true)
      return
    }

    // No duplicates, proceed normally
    proceedWithEntry()
  }

  const proceedWithEntry = () => {
    if (!newSite.trim() || !newPassword.trim()) return

    const analysis = analyzePassword(newPassword)

    const newEntry: VaultEntry = {
      id: Date.now().toString(),
      siteName: newSite,
      password: newPassword,
      passwordStrength: analysis.score,
      has2FA: false,
    }

    const updatedEntries = [...entries, newEntry]
    setEntries(updatedEntries)

    // Calculate XP gain based on actual password strength
    const strengthXp = analysis.score * 10
    onXpGain(strengthXp)

    setAnalysisResult(analysis)
    setShowAnalysis(true)

    setNewSite("")
    setNewPassword("")
  }

  const handleDuplicateWarningProceed = () => {
    if (pendingEntry && analysisResult) {
      const updatedEntries = [...entries, pendingEntry]
      setEntries(updatedEntries)

      // Calculate XP gain, but reduce it due to security risk
      const strengthXp = Math.max(1, analysisResult.score * 5) // Half XP for duplicate passwords
      onXpGain(strengthXp)

      setAnalysisResult(analysisResult)
      setShowAnalysis(true)

      setNewSite("")
      setNewPassword("")
    }
    
    setShowDuplicateWarning(false)
    setPendingEntry(null)
    setDuplicateSites([])
  }

  const handleDuplicateWarningClose = () => {
    setShowDuplicateWarning(false)
    setPendingEntry(null)
    setDuplicateSites([])
    // Keep the form fields filled so user can modify the password
  }

  const toggle2FA = (id: string) => {
    const entry = entries.find((e) => e.id === id)
    if (!entry) return

    setCurrent2FAEntry(entry)
    setIs2FAActivation(!entry.has2FA)
    setShow2FAPopup(true)
  }

  const handle2FAConfirm = (confirmed: boolean) => {
    if (!current2FAEntry) return

    if (confirmed) {
      const updatedEntries = entries.map((entry) => {
        if (entry.id === current2FAEntry.id) {
          const updated = { ...entry, has2FA: !entry.has2FA }
          // Give bonus XP for enabling 2FA
          if (updated.has2FA) {
            onXpGain(25)
          }
          return updated
        }
        return entry
      })
      setEntries(updatedEntries)
    }

    setShow2FAPopup(false)
    setCurrent2FAEntry(null)
  }

  return (
    <>
      {/* Toggle Tab */}
      <div
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-20 transition-transform duration-300 ${
          isOpen ? "translate-x-64 sm:translate-x-80" : "translate-x-0"
        }`}
      >
        <button
          onClick={onToggle}
          className="bg-blueprint-dark border-2 border-blueprint-cyan border-l-0 px-3 sm:px-4 py-8 sm:py-12 text-blueprint-cyan font-pixel text-sm sm:text-base hover:bg-blueprint-cyan hover:text-blueprint transition-colors min-w-[60px] sm:min-w-[80px] flex items-center justify-center"
        >
          <span className="hidden sm:inline">VAULT</span>
          <span className="sm:hidden">V</span>
        </button>
      </div>

      {/* Panel */}
      <div
        className={`fixed left-0 top-0 h-full w-64 sm:w-80 bg-blueprint-dark border-r-2 border-blueprint-cyan transform transition-transform duration-300 z-10 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-3 sm:p-6 h-full overflow-y-auto">
          <h3 className="text-blueprint-cyan font-pixel text-sm sm:text-lg mb-4 sm:mb-6 text-center border-b-2 border-blueprint-cyan pb-2">
            <span className="hidden sm:inline">PASSWORD VAULT</span>
            <span className="sm:hidden">VAULT</span>
          </h3>

          {/* Add New Entry */}
          <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
            <Input
              placeholder="Website name..."
              value={newSite}
              onChange={(e) => setNewSite(e.target.value)}
              className="bg-blueprint border-blueprint-cyan text-blueprint-text font-pixel"
            />

            <Input
              type="password"
              placeholder="Enter password..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-blueprint border-blueprint-cyan text-blueprint-text font-pixel"
            />

            <Button onClick={addEntry} className="w-full bg-blueprint-cyan text-blueprint hover:bg-white font-pixel">
              ADD ENTRY
            </Button>
          </div>

          {/* Vault Entries */}
          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="border border-blueprint-cyan p-3 bg-blueprint/50">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-blueprint-text font-pixel text-sm">{entry.siteName}</span>
                  <span className="text-blueprint-cyan font-pixel text-xs">STR: {entry.passwordStrength}/4</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-blueprint-cyan font-pixel text-xs">2FA</span>
                  <Switch checked={entry.has2FA} onCheckedChange={() => toggle2FA(entry.id)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAnalysis && analysisResult && (
        <PasswordAnalysisPopup analysis={analysisResult} onClose={() => setShowAnalysis(false)} />
      )}

      {show2FAPopup && current2FAEntry && (
        <TwoFAPopup
          entry={current2FAEntry}
          isActivation={is2FAActivation}
          onConfirm={handle2FAConfirm}
          onClose={() => setShow2FAPopup(false)}
        />
      )}

      {showDuplicateWarning && (
        <DuplicatePasswordPopup
          duplicateSites={duplicateSites}
          onClose={handleDuplicateWarningClose}
          onProceed={handleDuplicateWarningProceed}
        />
      )}
    </>
  )
}
