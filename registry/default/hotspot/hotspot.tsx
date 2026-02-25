"use client"

import * as React from "react"
import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CheckCircle2, XCircle, ChevronRight } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HotspotPoint {
  id: string
  /** Percentage from left edge (0–100) */
  x: number
  /** Percentage from top edge (0–100) */
  y: number
  /** The correct label the learner must type */
  label: string
  /** Optional description shown after a correct match */
  description?: string
}

export interface HotspotQuestion {
  id: string
  imageUrl: string
  imageAlt: string
  prompt: string
  points: HotspotPoint[]
  /** Case-sensitive matching (default: false) */
  caseSensitive?: boolean
}

export interface HotspotData {
  title: string
  description?: string
  questions: HotspotQuestion[]
}

export interface HotspotAttempt {
  questionId: string
  /** Map of pointId → typed answer */
  answers: Record<string, string>
  score: number
  maxScore: number
}

export interface HotspotResult {
  attempts: HotspotAttempt[]
  totalScore: number
  maxScore: number
  percentage: number
}

export interface HotspotProps {
  hotspotData: HotspotData
  onComplete?: (result: HotspotResult) => void
  className?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isLabelCorrect(
  given: string,
  correct: string,
  caseSensitive: boolean
): boolean {
  const norm = (s: string) =>
    caseSensitive ? s.trim() : s.trim().toLowerCase()
  return norm(given) === norm(correct)
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Hotspot({ hotspotData, onComplete, className }: HotspotProps) {
  const { title, description, questions } = hotspotData

  const [index, setIndex] = useState(0)
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [attempts, setAttempts] = useState<HotspotAttempt[]>([])
  const [finished, setFinished] = useState(false)
  const [openPopover, setOpenPopover] = useState<string | null>(null)

  const question = questions[index]
  const progress = (index / questions.length) * 100

  React.useEffect(() => {
    setInputs({})
    setSubmitted(false)
    setOpenPopover(null)
  }, [index])

  const checkPoint = useCallback(
    (pointId: string): boolean => {
      const point = question.points.find((p) => p.id === pointId)
      if (!point) return false
      return isLabelCorrect(
        inputs[pointId] ?? "",
        point.label,
        question.caseSensitive ?? false
      )
    },
    [question, inputs]
  )

  const handleNext = useCallback(() => {
    const correctCount = question.points.filter((p) =>
      checkPoint(p.id)
    ).length
    const attempt: HotspotAttempt = {
      questionId: question.id,
      answers: inputs,
      score: correctCount,
      maxScore: question.points.length,
    }
    const newAttempts = [...attempts, attempt]
    setAttempts(newAttempts)

    if (index + 1 >= questions.length) {
      const totalScore = newAttempts.reduce((s, a) => s + a.score, 0)
      const maxScore = newAttempts.reduce((s, a) => s + a.maxScore, 0)
      const res: HotspotResult = {
        attempts: newAttempts,
        totalScore,
        maxScore,
        percentage: Math.round((totalScore / maxScore) * 100),
      }
      setFinished(true)
      onComplete?.(res)
    } else {
      setIndex((i) => i + 1)
    }
  }, [
    question,
    inputs,
    checkPoint,
    attempts,
    index,
    questions.length,
    onComplete,
  ])

  // ── Finished ──────────────────────────────────────────────────────────────
  if (finished) {
    const totalScore = attempts.reduce((s, a) => s + a.score, 0)
    const maxScore = attempts.reduce((s, a) => s + a.maxScore, 0)
    const pct = Math.round((totalScore / maxScore) * 100)
    return (
      <div
        className={cn(
          "w-full max-w-2xl mx-auto text-center space-y-4",
          className
        )}
      >
        <h2 className="text-2xl font-bold">Done!</h2>
        <p className="text-5xl font-bold">{pct}%</p>
        <p className="text-muted-foreground">
          {totalScore} / {maxScore} labels correct
        </p>
      </div>
    )
  }

  return (
    <div className={cn("w-full max-w-2xl mx-auto space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <Badge variant="outline">
          {index + 1} / {questions.length}
        </Badge>
      </div>

      <Progress value={progress} className="h-1.5" />

      <p className="font-medium">{question.prompt}</p>

      {/* Image with hotspot markers */}
      <div className="relative w-full rounded-xl overflow-hidden border select-none">
        <img
          src={question.imageUrl}
          alt={question.imageAlt}
          className="w-full h-auto object-cover"
          draggable={false}
        />

        {question.points.map((point) => {
          const isOpen = openPopover === point.id
          const correct = submitted ? checkPoint(point.id) : undefined

          return (
            <Popover
              key={point.id}
              open={isOpen}
              onOpenChange={(open) =>
                setOpenPopover(open ? point.id : null)
              }
            >
              <PopoverTrigger asChild>
                <button
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    position: "absolute",
                  }}
                  className={cn(
                    "-translate-x-1/2 -translate-y-1/2 size-7 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold transition-all",
                    submitted && correct && "bg-green-500",
                    submitted && !correct && "bg-destructive",
                    !submitted && "bg-primary hover:scale-110"
                  )}
                  aria-label={`Label point ${point.id}`}
                >
                  {submitted && correct && (
                    <CheckCircle2 className="size-4" />
                  )}
                  {submitted && !correct && (
                    <XCircle className="size-4" />
                  )}
                  {!submitted && "+"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-60 space-y-2" side="top">
                {!submitted ? (
                  <Input
                    placeholder="Type label…"
                    value={inputs[point.id] ?? ""}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        [point.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        setOpenPopover(null)
                    }}
                    autoFocus
                  />
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {correct ? (
                        <CheckCircle2 className="size-4 text-green-600" />
                      ) : (
                        <XCircle className="size-4 text-destructive" />
                      )}
                      {correct
                        ? "Correct!"
                        : `Answer: ${point.label}`}
                    </div>
                    {point.description && (
                      <p className="text-xs text-muted-foreground">
                        {point.description}
                      </p>
                    )}
                    {!correct && inputs[point.id] && (
                      <p className="text-xs text-muted-foreground">
                        You said: {inputs[point.id]}
                      </p>
                    )}
                  </div>
                )}
              </PopoverContent>
            </Popover>
          )
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Click each marker (+) to label it.{" "}
        {question.points.length} label
        {question.points.length > 1 ? "s" : ""} total.
      </p>

      <div className="flex justify-end">
        {!submitted ? (
          <Button onClick={() => setSubmitted(true)}>
            Check Labels
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {index + 1 >= questions.length ? "See Results" : "Next"}
            <ChevronRight className="ml-1 size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
