"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface DuplicatePasswordPopupProps {
  duplicateSites: string[]
  onClose: () => void
  onProceed: () => void
}

export default function DuplicatePasswordPopup({ 
  duplicateSites, 
  onClose, 
  onProceed 
}: DuplicatePasswordPopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const handleProceed = () => {
    setIsVisible(false)
    setTimeout(onProceed, 300)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-blueprint-dark border-2 border-red-500 p-4 sm:p-6 max-w-md w-full transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="text-center">
          {/* Warning Icon */}
          <div className="mb-4 flex justify-center">
            <div className="w-12 h-12 border-2 border-red-500 flex items-center justify-center">
              <span className="text-red-500 font-pixel text-2xl">!</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-red-500 font-pixel text-lg sm:text-xl mb-4">
            SECURITY WARNING
          </h3>

          {/* Warning Message */}
          <div className="text-blueprint-text font-pixel text-sm mb-4 space-y-2">
            <p className="text-red-400">
              PASSWORD REUSE DETECTED!
            </p>
            <p className="text-blueprint-text">
              This password is already used for:
            </p>
            
            {/* List of duplicate sites */}
            <div className="bg-blueprint/50 border border-red-500/50 p-2 my-3">
              {duplicateSites.map((site, index) => (
                <div key={index} className="text-red-400 font-pixel text-xs">
                  • {site}
                </div>
              ))}
            </div>

            <p className="text-blueprint-text text-xs">
              Using the same password for multiple sites increases your security risk. 
              If one site is compromised, all accounts using this password are at risk.
            </p>
          </div>

          {/* Security Tips */}
          <div className="bg-blueprint/30 border border-blueprint-cyan/50 p-3 mb-4">
            <p className="text-blueprint-cyan font-pixel text-xs mb-2">SECURITY TIP:</p>
            <p className="text-blueprint-text font-pixel text-xs">
              Create a unique password for each account to maximize security.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleClose}
              className="bg-blueprint-cyan text-blueprint hover:bg-white font-pixel text-sm px-4 py-2"
            >
              CHANGE PASSWORD
            </Button>
            <Button
              onClick={handleProceed}
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-pixel text-sm px-4 py-2"
            >
              USE ANYWAY
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
