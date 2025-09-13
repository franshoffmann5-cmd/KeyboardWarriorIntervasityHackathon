"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SignInModalProps {
  onClose: () => void
  onSignIn: () => void
}

export default function SignInModal({ onClose, onSignIn }: SignInModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignIn = () => {
    // Basic validation
    if (email && password) {
      onSignIn()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-blueprint-dark border-2 border-blueprint-cyan p-6 max-w-md w-full mx-4">
        <h3 className="text-blueprint-cyan font-pixel text-xl mb-6 text-center">SIGN INTO FORTIFY</h3>

        <div className="space-y-4 mb-6">
          <Input
            type="email"
            placeholder="Email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-blueprint border-blueprint-cyan text-blueprint-text font-pixel"
          />

          <Input
            type="password"
            placeholder="Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-blueprint border-blueprint-cyan text-blueprint-text font-pixel"
          />
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSignIn} className="flex-1 bg-blueprint-cyan text-blueprint hover:bg-white font-pixel">
            SIGN IN
          </Button>
          <Button onClick={onClose} className="flex-1 bg-gray-500 text-white hover:bg-gray-600 font-pixel">
            CANCEL
          </Button>
        </div>
      </div>
    </div>
  )
}
