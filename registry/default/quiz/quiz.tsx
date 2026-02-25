"use client"

import * as React from "react"
import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/default/ui/button"
import { Progress } from "@/registry/default/ui/progress"
import { Badge } from "@/registry/default/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/registry/default/ui/card"
import { CheckCircle2, XCircle, ChevronRight, Trophy } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type QuizOptionId = string

export interface QuizOption {
  id: QuizOptionId
  label: string
  /** Shown beneath the option after the answer is revealed */
  explanation?: string
}

export type QuizQuestionType = "single" | "multiple" | "true-false"

export interface QuizQuestion {
  id: string
  type: QuizQuestionType
  question: string
  options: QuizOption[]
  correctIds: QuizOptionId[]
  hint?: string
  /** Points for a correct answer (default: 1) */
  points?: number
}

export interface QuizData {
  title: string
  description?: string
  questions: QuizQuestion[]
  showExplanations?: boolean
  shuffle?: boolean
  /** Pass threshold as a percentage 0–100 (default: 70) */
  passingScore?: number
}

export interface QuizResult {
  score: number
  maxScore: number
  percentage: number
  passed: boolean
  answers: Record<string, QuizOptionId[]>
}

export interface QuizProps {
  quizData: QuizData
  onComplete?: (result: QuizResult) => void
  className?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Quiz({ quizData, onComplete, className }: QuizProps) {
  const {
    title,
    description,
    showExplanations = true,
    shuffle = false,
    passingScore = 70,
  } = quizData

  const questions = React.useMemo(
    () => (shuffle ? shuffleArray(quizData.questions) : quizData.questions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<QuizOptionId[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState<Record<string, QuizOptionId[]>>({})
  const [finished, setFinished] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)

  const question = questions[currentIndex]
  const isMultiple = question.type === "multiple"
  const progress =
    ((currentIndex + (submitted ? 1 : 0)) / questions.length) * 100

  const toggleOption = useCallback(
    (id: QuizOptionId) => {
      if (submitted) return
      if (isMultiple) {
        setSelected((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        )
      } else {
        setSelected([id])
      }
    },
    [submitted, isMultiple]
  )

  const handleSubmit = useCallback(() => {
    if (selected.length === 0) return
    setSubmitted(true)
    setAnswers((prev) => ({ ...prev, [question.id]: selected }))
  }, [selected, question.id])

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      const allAnswers = { ...answers, [question.id]: selected }
      let score = 0
      let maxScore = 0
      for (const q of questions) {
        const pts = q.points ?? 1
        maxScore += pts
        const given = allAnswers[q.id] ?? []
        if ([...q.correctIds].sort().join(",") === [...given].sort().join(",")) {
          score += pts
        }
      }
      const percentage = Math.round((score / maxScore) * 100)
      const res: QuizResult = {
        score,
        maxScore,
        percentage,
        passed: percentage >= passingScore,
        answers: allAnswers,
      }
      setResult(res)
      setFinished(true)
      onComplete?.(res)
    } else {
      setCurrentIndex((i) => i + 1)
      setSelected([])
      setSubmitted(false)
    }
  }, [currentIndex, questions, answers, question.id, selected, passingScore, onComplete])

  const isCorrect = useCallback(
    (id: QuizOptionId) => question.correctIds.includes(id),
    [question.correctIds]
  )

  const optionState = (id: QuizOptionId) => {
    if (!submitted) return selected.includes(id) ? "selected" : "idle"
    if (isCorrect(id)) return "correct"
    if (selected.includes(id)) return "wrong"
    return "idle"
  }

  // ── Results screen ────────────────────────────────────────────────────────
  if (finished && result) {
    return (
      <Card className={cn("w-full max-w-2xl mx-auto", className)}>
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <Trophy
              className={cn(
                "size-16",
                result.passed ? "text-yellow-500" : "text-muted-foreground"
              )}
            />
          </div>
          <CardTitle className="text-2xl">
            {result.passed ? "Quiz Complete!" : "Better luck next time"}
          </CardTitle>
          <CardDescription>
            {result.passed
              ? "Great job — you passed!"
              : `You needed ${passingScore}% to pass.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-5xl font-bold">{result.percentage}%</p>
          <p className="text-muted-foreground">
            {result.score} / {result.maxScore} points
          </p>
          <Badge variant={result.passed ? "default" : "destructive"}>
            {result.passed ? "Passed" : "Failed"}
          </Badge>
        </CardContent>
      </Card>
    )
  }

  // ── Question screen ───────────────────────────────────────────────────────
  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardHeader>
        <div className="flex items-center justify-between mb-1">
          <Badge variant="outline">
            {currentIndex + 1} / {questions.length}
          </Badge>
          {question.points && question.points > 1 && (
            <Badge variant="secondary">{question.points} pts</Badge>
          )}
        </div>
        <Progress value={progress} className="h-1.5 mb-3" />
        <CardTitle className="text-lg leading-snug">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="font-medium text-base">{question.question}</p>
        {question.hint && !submitted && (
          <p className="text-sm text-muted-foreground italic">
            Hint: {question.hint}
          </p>
        )}
        {isMultiple && !submitted && (
          <p className="text-xs text-muted-foreground">Select all that apply.</p>
        )}

        <ul className="space-y-2" role="listbox" aria-multiselectable={isMultiple}>
          {question.options.map((opt) => {
            const state = optionState(opt.id)
            return (
              <li key={opt.id}>
                <button
                  role="option"
                  aria-selected={selected.includes(opt.id)}
                  onClick={() => toggleOption(opt.id)}
                  className={cn(
                    "w-full flex items-start gap-3 rounded-lg border px-4 py-3 text-sm text-left transition-colors",
                    state === "idle" && "hover:bg-muted/50 border-border",
                    state === "selected" && "border-primary bg-primary/5",
                    state === "correct" && "border-green-500 bg-green-50 dark:bg-green-950/20",
                    state === "wrong" && "border-destructive bg-destructive/5"
                  )}
                >
                  <span className="mt-0.5 shrink-0">
                    {state === "correct" && <CheckCircle2 className="size-4 text-green-600" />}
                    {state === "wrong" && <XCircle className="size-4 text-destructive" />}
                    {(state === "idle" || state === "selected") && (
                      <span
                        className={cn(
                          "inline-flex size-4 items-center justify-center rounded-full border text-[10px] font-bold",
                          state === "selected"
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground"
                        )}
                      />
                    )}
                  </span>
                  <span className="flex-1">
                    {opt.label}
                    {submitted && showExplanations && opt.explanation && (
                      <span className="block mt-1 text-xs text-muted-foreground">
                        {opt.explanation}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        {!submitted ? (
          <Button onClick={handleSubmit} disabled={selected.length === 0}>
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {currentIndex + 1 >= questions.length ? "See Results" : "Next"}
            <ChevronRight className="ml-1 size-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
