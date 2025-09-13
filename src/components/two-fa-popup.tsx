"use client"

import { Button } from "@/components/ui/button"

interface VaultEntry {
  id: string
  siteName: string
  password: string
  passwordStrength: number
  has2FA: boolean
}

interface TwoFAPopupProps {
  entry: VaultEntry
  isActivation: boolean
  onConfirm: (confirmed: boolean) => void
  onClose: () => void
}

export default function TwoFAPopup({ entry, isActivation, onConfirm, onClose }: TwoFAPopupProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-blueprint-dark border-2 border-blueprint-cyan p-6 max-w-md w-full mx-4">
        {isActivation ? (
          <>
            <h3 className="text-blueprint-cyan font-pixel text-lg mb-4 text-center">GREAT CHOICE!</h3>
            <p className="text-blueprint-text font-pixel text-sm mb-6 text-center">
              You have added 2FA for <span className="text-blueprint-cyan">{entry.siteName}</span>! This significantly
              improves your security by requiring a second form of authentication.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => onConfirm(true)}
                className="flex-1 bg-green-500 text-white hover:bg-green-600 font-pixel"
              >
                CONFIRM!
              </Button>
              <Button
                onClick={() => onConfirm(false)}
                className="flex-1 bg-gray-500 text-white hover:bg-gray-600 font-pixel"
              >
                NOT YET...
              </Button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-blueprint-cyan font-pixel text-lg mb-4 text-center">WAIT, WHY?</h3>
            <p className="text-blueprint-text font-pixel text-sm mb-4">
              You decided to deactivate 2FA for <span className="text-blueprint-cyan">{entry.siteName}</span>.
            </p>
            <p className="text-blueprint-text font-pixel text-sm mb-6">
              Two-Factor Authentication adds an extra layer of security that makes it much harder for hackers to access
              your accounts, even if they have your password!
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => onConfirm(true)}
                className="flex-1 bg-red-500 text-white hover:bg-red-600 font-pixel"
              >
                I REMOVED IT
              </Button>
              <Button
                onClick={() => onConfirm(false)}
                className="flex-1 bg-blueprint-cyan text-blueprint hover:bg-white font-pixel"
              >
                NEVERMIND
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
