"use client"

import { useState } from "react"

interface WelcomeModalProps {
  onClose: () => void
}

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
  const [isAnimating, setIsAnimating] = useState(true)

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(onClose, 300)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div
        className={`bg-blueprint border-2 border-blueprint-cyan p-4 sm:p-6 lg:p-8 xl:p-12 max-w-sm sm:max-w-lg lg:max-w-2xl xl:max-w-4xl mx-4 text-center transform transition-all duration-300 ${
          isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Welcome Title with Animation */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-blueprint-cyan font-pixel text-xl md:text-3xl lg:text-4xl xl:text-5xl mb-2 animate-pulse">WELCOME TO</h1>
          <h2 className="text-blueprint-cyan font-pixel text-2xl md:text-4xl lg:text-5xl xl:text-6xl tracking-wider animate-bounce">FORTIFY</h2>
        </div>

        {/* Description */}
        <div className="mb-6 sm:mb-8 lg:mb-10 text-blueprint-text font-pixel text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed">
          <p className="mb-3 sm:mb-4">
            Your gamified cybersecurity companion that transforms password management into an engaging adventure.
          </p>
          <p className="mb-3 sm:mb-4">
            Build your digital fortress by creating strong passwords, enabling 2FA, and completing security lessons.
          </p>
          <p>Watch your fort evolve from a simple campfire to a mighty castle as you level up your security!</p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleClose}
          className="px-6 sm:px-8 lg:px-12 xl:px-16 py-3 sm:py-4 lg:py-5 xl:py-6 bg-blueprint-dark border-2 border-blueprint-cyan text-blueprint-cyan font-pixel text-sm md:text-base lg:text-lg xl:text-xl hover:bg-blueprint-cyan hover:text-blueprint-dark transition-colors duration-200 transform hover:scale-105 min-h-[44px]"
        >
          START FORTIFYING
        </button>

        {/* Decorative Elements */}
        <div className="absolute top-2 left-2 w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 border-l-2 border-t-2 border-blueprint-cyan opacity-50"></div>
        <div className="absolute top-2 right-2 w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 border-r-2 border-t-2 border-blueprint-cyan opacity-50"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 border-l-2 border-b-2 border-blueprint-cyan opacity-50"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 border-r-2 border-b-2 border-blueprint-cyan opacity-50"></div>
      </div>
    </div>
  )
}
