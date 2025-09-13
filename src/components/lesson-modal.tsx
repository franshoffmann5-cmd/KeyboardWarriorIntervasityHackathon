"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface LessonModalProps {
  lesson: {
    id: number
    title: string
    content: string[]
    quiz: {
      question: string
      options: string[]
      correct: number
    }[]
    xpReward: number
  }
  onComplete: () => void
  onClose: () => void
}

export default function LessonModal({ lesson, onComplete, onClose }: LessonModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [quizScore, setQuizScore] = useState(0)

  const isContentPhase = currentStep < lesson.content.length
  const isQuizPhase = currentStep >= lesson.content.length && currentStep < lesson.content.length + lesson.quiz.length
  const currentQuizIndex = currentStep - lesson.content.length

  const handleNext = () => {
    if (currentStep < lesson.content.length + lesson.quiz.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Calculate quiz score
      const correct = lesson.quiz.reduce((acc, question, index) => {
        return acc + (quizAnswers[index] === question.correct ? 1 : 0)
      }, 0)
      setQuizScore(correct)
      setShowResults(true)
    }
  }

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...quizAnswers]
    newAnswers[currentQuizIndex] = answerIndex
    setQuizAnswers(newAnswers)
  }

  const handleComplete = () => {
    if (quizScore === lesson.quiz.length) {
      onComplete()
    } else {
      onClose()
    }
  }

  if (showResults) {
    const passed = quizScore === lesson.quiz.length
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-blueprint-dark border-2 border-blueprint-cyan p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          <h3 className="text-blueprint-cyan font-pixel text-xl mb-4 text-center">
            {passed ? "GREAT JOB!" : "TRY AGAIN"}
          </h3>

          <p className="text-blueprint-text font-pixel text-sm mb-4 text-center">
            You scored {quizScore}/{lesson.quiz.length} on the quiz.
          </p>

          {passed ? (
            <p className="text-green-400 font-pixel text-sm mb-6 text-center">
              You completed <span className="text-blueprint-cyan">{lesson.title}</span>! You earned {lesson.xpReward}{" "}
              XP!
            </p>
          ) : (
            <p className="text-red-400 font-pixel text-sm mb-6 text-center">
              You need to get all questions correct to complete the lesson. Review the material and try again!
            </p>
          )}

          <div className="flex justify-center">
            <Button
              onClick={handleComplete}
              className="bg-blueprint-cyan text-blueprint hover:bg-white font-pixel px-8"
            >
              {passed ? "CLAIM REWARD" : "CLOSE"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-blueprint-dark border-2 border-blueprint-cyan p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-blueprint-cyan font-pixel text-xl">{lesson.title}</h3>
          <span className="text-blueprint-text font-pixel text-sm">
            {currentStep + 1}/{lesson.content.length + lesson.quiz.length}
          </span>
        </div>

        {isContentPhase && (
          <div className="mb-6">
            <p className="text-blueprint-text font-pixel text-sm leading-relaxed">{lesson.content[currentStep]}</p>
          </div>
        )}

        {isQuizPhase && (
          <div className="mb-6">
            <h4 className="text-blueprint-cyan font-pixel text-sm mb-4">Question {currentQuizIndex + 1}:</h4>
            <p className="text-blueprint-text font-pixel text-sm mb-4">{lesson.quiz[currentQuizIndex].question}</p>

            <div className="space-y-2">
              {lesson.quiz[currentQuizIndex].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleQuizAnswer(index)}
                  className={`w-full text-left p-3 border font-pixel text-sm transition-colors ${
                    quizAnswers[currentQuizIndex] === index
                      ? "border-blueprint-cyan bg-blueprint-cyan/20 text-blueprint-cyan"
                      : "border-blueprint-cyan/50 text-blueprint-text hover:border-blueprint-cyan"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button onClick={onClose} className="bg-gray-500 text-white hover:bg-gray-600 font-pixel">
            CLOSE
          </Button>

          <Button
            onClick={handleNext}
            disabled={isQuizPhase && quizAnswers[currentQuizIndex] === undefined}
            className="bg-blueprint-cyan text-blueprint hover:bg-white font-pixel disabled:opacity-50"
          >
            {currentStep === lesson.content.length + lesson.quiz.length - 1 ? "FINISH" : "NEXT"}
          </Button>
        </div>
      </div>
    </div>
  )
}
