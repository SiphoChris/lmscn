"use client"

import * as React from "react"
import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/default/ui/button"
import { Badge } from "@/registry/default/ui/badge"
import { Card, CardContent } from "@/registry/default/ui/card"
import { Progress } from "@/registry/default/ui/progress"
import { Brain, RotateCcw, CheckCircle2 } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * SM-2 response quality:
 * 0 = complete blackout
 * 1 = incorrect; correct answer recalled
 * 2 = incorrect; easy recall after seeing answer
 * 3 = correct with serious difficulty
 * 4 = correct after hesitation
 * 5 = perfect response
 */
export type ReviewGrade = 0 | 1 | 2 | 3 | 4 | 5

export interface ReviewCard {
  id: string
  front: string
  back: string
  tags?: string[]
  /** ISO date string — next scheduled review */
  nextReviewDate?: string
  /** Current review interval in days */
  interval?: number
  /** SM-2 ease factor (default: 2.5) */
  easeFactor?: number
}

export interface SpacedRepetitionData {
  title: string
  description?: string
  /** Cards due for review in this session */
  dueCards: ReviewCard[]
  /** Total cards in the deck (for display) */
  totalCards?: number
}

export interface ReviewSession {
  cardId: string
  grade: ReviewGrade
  /** Computed next interval in days */
  nextInterval: number
  /** Updated ease factor */
  nextEaseFactor: number
}

export interface SpacedRepetitionResult {
  sessions: ReviewSession[]
  /** IDs of cards graded < 3 (need re-study) */
  hardCardIds: string[]
}

export interface SpacedRepetitionProps {
  spacedRepetitionData: SpacedRepetitionData
  onComplete?: (result: SpacedRepetitionResult) => void
  className?: string
}

// ─── SM-2 Algorithm ───────────────────────────────────────────────────────────

function sm2(
  grade: ReviewGrade,
  prevInterval: number,
  easeFactor: number
): { interval: number; easeFactor: number } {
  if (grade < 3) {
    return { interval: 1, easeFactor: Math.max(1.3, easeFactor - 0.2) }
  }
  let interval: number
  if (prevInterval === 0) interval = 1
  else if (prevInterval === 1) interval = 6
  else interval = Math.round(prevInterval * easeFactor)

  const newEase = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)
  )
  return { interval, easeFactor: newEase }
}

// ─── Grade buttons ────────────────────────────────────────────────────────────

interface GradeButton {
  grade: ReviewGrade
  label: string
  description: string
  variant: "destructive" | "outline" | "secondary" | "default"
}

const GRADE_BUTTONS: GradeButton[] = [
  {
    grade: 1,
    label: "Again",
    description: "Complete blackout",
    variant: "destructive",
  },
  {
    grade: 2,
    label: "Hard",
    description: "Difficult recall",
    variant: "outline",
  },
  {
    grade: 3,
    label: "Good",
    description: "Correct with effort",
    variant: "secondary",
  },
  {
    grade: 4,
    label: "Easy",
    description: "Recalled easily",
    variant: "default",
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function SpacedRepetition({
  spacedRepetitionData,
  onComplete,
  className,
}: SpacedRepetitionProps) {
  const { title, description, dueCards, totalCards } =
    spacedRepetitionData

  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [sessions, setSessions] = useState<ReviewSession[]>([])
  const [finished, setFinished] = useState(false)

  const card = dueCards[index]
  const progress = (index / dueCards.length) * 100

  const handleGrade = useCallback(
    (grade: ReviewGrade) => {
      const prev = card.interval ?? 0
      const ease = card.easeFactor ?? 2.5
      const { interval, easeFactor } = sm2(grade, prev, ease)

      const newSessions: ReviewSession[] = [
        ...sessions,
        {
          cardId: card.id,
          grade,
          nextInterval: interval,
          nextEaseFactor: easeFactor,
        },
      ]
      setSessions(newSessions)

      if (index + 1 >= dueCards.length) {
        const hardCardIds = newSessions
          .filter((s) => s.grade < 3)
          .map((s) => s.cardId)
        setFinished(true)
        onComplete?.({ sessions: newSessions, hardCardIds })
      } else {
        setIndex((i) => i + 1)
        setFlipped(false)
      }
    },
    [card, sessions, index, dueCards.length, onComplete]
  )

  // ── Finished ──────────────────────────────────────────────────────────────
  if (finished) {
    const hardCount = sessions.filter((s) => s.grade < 3).length
    const easyCount = sessions.filter((s) => s.grade >= 4).length
    const goodCount = sessions.length - hardCount - easyCount

    return (
      <div
        className={cn(
          "w-full max-w-md mx-auto space-y-4",
          className
        )}
      >
        <div className="text-center space-y-2">
          <Brain className="mx-auto size-12 text-primary" />
          <h2 className="text-2xl font-bold">Review Complete!</h2>
          <p className="text-muted-foreground">
            {dueCards.length} card
            {dueCards.length > 1 ? "s" : ""} reviewed.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold text-destructive">
                {hardCount}
              </p>
              <p className="text-xs text-muted-foreground">Again / Hard</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">{goodCount}</p>
              <p className="text-xs text-muted-foreground">Good</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold text-green-600">
                {easyCount}
              </p>
              <p className="text-xs text-muted-foreground">Easy</p>
            </CardContent>
          </Card>
        </div>
        {totalCards !== undefined && (
          <p className="text-center text-xs text-muted-foreground">
            {totalCards - dueCards.length} more cards not due today.
          </p>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn("w-full max-w-md mx-auto space-y-4", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {totalCards && (
            <Badge variant="outline" className="text-xs">
              {totalCards} total
            </Badge>
          )}
          <Badge variant="secondary">
            {dueCards.length - index} remaining
          </Badge>
        </div>
      </div>

      <Progress value={progress} className="h-1.5" />

      {/* 3-D flip card */}
      <div
        className="relative h-52 cursor-pointer select-none"
        style={{ perspective: "1200px" }}
        onClick={() => setFlipped((f) => !f)}
        role="button"
        aria-label={
          flipped
            ? "Card answer — click to flip"
            : "Card question — click to reveal"
        }
        tabIndex={0}
        onKeyDown={(e) =>
          e.key === "Enter" && setFlipped((f) => !f)
        }
      >
        <div
          className="relative w-full h-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-xl border bg-card shadow flex flex-col items-center justify-center p-8 text-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex items-center gap-1.5 mb-3 text-xs text-muted-foreground">
              <Brain className="size-3.5" />
              <span>Question</span>
              {card.tags?.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-[10px] py-0"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-lg font-medium">{card.front}</p>
            <p className="mt-4 text-xs text-muted-foreground">
              Click to reveal
            </p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-xl border bg-primary/5 shadow flex flex-col items-center justify-center p-8 text-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-3 text-xs text-muted-foreground">
              <CheckCircle2 className="size-3.5 text-green-600" />
              <span>Answer</span>
            </div>
            <p className="text-lg">{card.back}</p>
            {card.interval !== undefined && (
              <p className="mt-3 text-xs text-muted-foreground">
                Previous interval: {card.interval}d
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Grade buttons (only shown after flip) */}
      {flipped ? (
        <div className="space-y-1">
          <p className="text-xs text-center text-muted-foreground mb-2">
            How well did you remember?
          </p>
          <div className="grid grid-cols-4 gap-2">
            {GRADE_BUTTONS.map((gb) => (
              <div key={gb.grade} className="flex flex-col gap-1">
                <Button
                  variant={gb.variant}
                  size="sm"
                  className="w-full"
                  onClick={() => handleGrade(gb.grade)}
                >
                  {gb.label}
                </Button>
                <p className="text-[10px] text-center text-muted-foreground leading-tight">
                  {gb.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setFlipped(true)}
          >
            <RotateCcw className="mr-2 size-4" />
            Show Answer
          </Button>
        </div>
      )}
    </div>
  )
}
