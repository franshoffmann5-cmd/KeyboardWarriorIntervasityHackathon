"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { analyzePasswordStrength, getXpMultiplier } from "@/lib/password-strength"
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
  isSignedIn: boolean
}

export default function VaultPanel({ isOpen, onToggle, entries, setEntries, onXpGain, isSignedIn }: VaultPanelProps) {
  const [newSite, setNewSite] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [xpInfo, setXpInfo] = useState<any>(null)
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
      const analysis = analyzePasswordStrength(newPassword)
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

    const analysis = analyzePasswordStrength(newPassword)

    const newEntry: VaultEntry = {
      id: Date.now().toString(),
      siteName: newSite,
      password: newPassword,
      passwordStrength: analysis.score,
      has2FA: false,
    }

    const updatedEntries = [...entries, newEntry]
    setEntries(updatedEntries)

    // Calculate XP gain based on actual password strength with multiplier
    const baseXp = 20; // Base XP for adding a password
    const strengthXp = Math.round(baseXp * getXpMultiplier(analysis.score))
    onXpGain(strengthXp)

    // Store XP info for display
    setXpInfo({
      baseXp: baseXp,
      finalXp: strengthXp,
      isDuplicate: false
    })

    setAnalysisResult(analysis)
    setShowAnalysis(true)

    setNewSite("")
    setNewPassword("")
  }

  const handleDuplicateWarningProceed = () => {
    if (pendingEntry && analysisResult) {
      const updatedEntries = [...entries, pendingEntry]
      setEntries(updatedEntries)

      // Calculate XP gain, but reduce it due to security risk of duplicate passwords
      const baseXp = 20;
      const fullXp = Math.round(baseXp * getXpMultiplier(analysisResult.score))
      const reducedXp = Math.round(fullXp * 0.5) // Half XP for duplicates
      const finalXp = Math.max(5, reducedXp) // Minimum 5 XP
      onXpGain(finalXp)

      // Store XP info for display
      setXpInfo({
        baseXp: baseXp,
        finalXp: finalXp,
        isDuplicate: true
      })

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
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-20 transition-all duration-500 ease-out ${
          !isSignedIn 
            ? "-translate-x-full opacity-0 pointer-events-none" 
            : isOpen 
              ? "translate-x-64 sm:translate-x-80" 
              : "translate-x-0"
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
        className={`fixed left-0 top-0 h-full w-64 sm:w-80 bg-blueprint-dark border-r-2 border-blueprint-cyan transform transition-all duration-500 ease-out z-40 ${
          !isSignedIn
            ? "-translate-x-full opacity-0 pointer-events-none"
            : isOpen 
              ? "translate-x-0" 
              : "-translate-x-full"
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
        <PasswordAnalysisPopup 
          analysis={analysisResult} 
          xpInfo={xpInfo}
          onClose={() => setShowAnalysis(false)} 
        />
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
