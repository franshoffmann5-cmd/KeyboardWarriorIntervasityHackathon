"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import LessonModal from "./lesson-modal"

interface LessonsPanelProps {
  isOpen: boolean
  onToggle: () => void
  onXpGain: (amount: number) => void
  isSignedIn: boolean
}

const lessons = [
  {
    id: 1,
    title: "Password Basics",
    description: "Learn about strong passwords",
    xpReward: 50,
    content: [
      "Strong passwords are your first line of defense against cyber attacks.",
      "A good password should be at least 12 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special characters.",
      "Avoid using personal information like birthdays, names, or common words that can be easily guessed.",
      "Consider using a passphrase - a series of random words that are easy to remember but hard to crack.",
    ],
    quiz: [
      {
        question: "What is the minimum recommended length for a strong password?",
        options: ["6 characters", "8 characters", "12 characters"],
        correct: 2,
      },
      {
        question: "Which of these makes a password stronger?",
        options: ["Using your birthday", "Mixing uppercase and lowercase", "Using only letters"],
        correct: 1,
      },
      {
        question: "What should you avoid in passwords?",
        options: ["Special characters", "Personal information", "Random words"],
        correct: 1,
      },
    ],
  },
  {
    id: 2,
    title: "Two-Factor Auth",
    description: "Understanding 2FA security",
    xpReward: 75,
    content: [
      "Two-Factor Authentication (2FA) adds an extra layer of security to your accounts.",
      "Even if someone steals your password, they still need the second factor to access your account.",
      "Common 2FA methods include SMS codes, authenticator apps, and hardware tokens.",
      "Authenticator apps like Google Authenticator or Authy are more secure than SMS codes.",
    ],
    quiz: [
      {
        question: "What does 2FA stand for?",
        options: ["Two-Factor Authentication", "Two-File Access", "Two-Form Authorization"],
        correct: 0,
      },
      {
        question: "Which 2FA method is most secure?",
        options: ["SMS codes", "Authenticator apps", "Email codes"],
        correct: 1,
      },
      {
        question: "Why is 2FA important?",
        options: ["It makes passwords longer", "It adds an extra security layer", "It's required by law"],
        correct: 1,
      },
    ],
  },
  {
    id: 3,
    title: "Phishing Awareness",
    description: "Spot malicious emails",
    xpReward: 100,
    content: [
      "Phishing attacks trick you into revealing sensitive information through fake emails or websites.",
      "Always check the sender's email address carefully - look for misspellings or suspicious domains.",
      "Legitimate companies will never ask for passwords or sensitive information via email.",
      "When in doubt, navigate to the website directly instead of clicking email links.",
    ],
    quiz: [
      {
        question: "What is phishing?",
        options: ["A type of fishing", "Tricking people into revealing information", "A computer virus"],
        correct: 1,
      },
      {
        question: "How can you spot a phishing email?",
        options: ["Check the sender's address", "Look for urgent language", "Both of the above"],
        correct: 2,
      },
      {
        question: "What should you do if you receive a suspicious email?",
        options: ["Click all links to investigate", "Delete it immediately", "Forward it to friends"],
        correct: 1,
      },
    ],
  },
]

export default function LessonsPanel({ isOpen, onToggle, onXpGain, isSignedIn }: LessonsPanelProps) {
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  const [currentLesson, setCurrentLesson] = useState<any>(null)
  const [showLessonModal, setShowLessonModal] = useState(false)

  const startLesson = (lesson: any) => {
    setCurrentLesson(lesson)
    setShowLessonModal(true)
  }

  const completeLesson = (lessonId: number, xpReward: number) => {
    if (completedLessons.includes(lessonId)) return

    setCompletedLessons([...completedLessons, lessonId])
    onXpGain(xpReward)
    setShowLessonModal(false)
    setCurrentLesson(null)
  }

  return (
    <>
      {/* Toggle Tab */}
      <div
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-20 transition-all duration-500 ease-out ${
          !isSignedIn
            ? "translate-x-full opacity-0 pointer-events-none"
            : isOpen 
              ? "-translate-x-72 sm:-translate-x-96" 
              : "translate-x-0"
        }`}
      >
        <button
          onClick={onToggle}
          className="bg-blueprint-dark border-2 border-blueprint-cyan border-r-0 px-3 sm:px-4 py-8 sm:py-12 text-blueprint-cyan font-pixel text-sm sm:text-base hover:bg-blueprint-cyan hover:text-blueprint transition-colors min-w-[60px] sm:min-w-[80px] flex items-center justify-center"
        >
          <span className="hidden sm:inline">LESSONS</span>
          <span className="sm:hidden">L</span>
        </button>
      </div>

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-72 sm:w-96 bg-blueprint-dark border-l-2 border-blueprint-cyan transform transition-all duration-500 ease-out z-40 ${
          !isSignedIn
            ? "translate-x-full opacity-0 pointer-events-none"
            : isOpen 
              ? "translate-x-0" 
              : "translate-x-full"
        }`}
      >
        <div className="p-3 sm:p-6 h-full overflow-y-auto">
          <h3 className="text-blueprint-cyan font-pixel text-sm sm:text-lg mb-4 sm:mb-6 text-center border-b-2 border-blueprint-cyan pb-2">
            <span className="hidden sm:inline">CYBER LESSONS</span>
            <span className="sm:hidden">LESSONS</span>
          </h3>

          <div className="space-y-3 sm:space-y-4">
            {lessons.map((lesson) => {
              const isCompleted = completedLessons.includes(lesson.id)

              return (
                <div
                  key={lesson.id}
                  className={`border-2 p-2 sm:p-4 ${
                    isCompleted ? "border-green-500 bg-green-500/10" : "border-blueprint-cyan bg-blueprint/50"
                  }`}
                >
                  <h4 className="text-blueprint-cyan font-pixel text-xs sm:text-sm mb-1 sm:mb-2">{lesson.title}</h4>
                  <p className="text-blueprint-text font-pixel text-xs mb-2 sm:mb-3 leading-relaxed">{lesson.description}</p>

                  <div className="flex justify-between items-center">
                    <span className="text-blueprint-cyan font-pixel text-xs">+{lesson.xpReward} XP</span>

                    <Button
                      onClick={() => startLesson(lesson)}
                      disabled={isCompleted}
                      className={`font-pixel text-xs px-2 sm:px-3 py-1 ${
                        isCompleted
                          ? "bg-green-500 text-white cursor-not-allowed"
                          : "bg-blueprint-cyan text-blueprint hover:bg-white"
                      }`}
                    >
                      {isCompleted ? "DONE" : "START"}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {showLessonModal && currentLesson && (
        <LessonModal
          lesson={currentLesson}
          onComplete={() => completeLesson(currentLesson.id, currentLesson.xpReward)}
          onClose={() => {
            setShowLessonModal(false)
            setCurrentLesson(null)
          }}
        />
      )}
    </>
  )
}
