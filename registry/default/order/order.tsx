"use client"

import * as React from "react"
import { useState, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  GripVertical,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderItem {
  id: string
  label: string
  /** Optional sub-label shown below the main label */
  description?: string
}

export interface OrderQuestion {
  id: string
  prompt: string
  /** Items listed in CORRECT order */
  items: OrderItem[]
  hint?: string
}

export interface OrderData {
  title: string
  description?: string
  questions: OrderQuestion[]
}

export interface OrderAttempt {
  questionId: string
  givenOrder: string[]
  correctOrder: string[]
  correct: boolean
}

export interface OrderResult {
  attempts: OrderAttempt[]
  score: number
  maxScore: number
  percentage: number
}

export interface OrderProps {
  orderData: OrderData
  onComplete?: (result: OrderResult) => void
  className?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Order({ orderData, onComplete, className }: OrderProps) {
  const { title, description, questions } = orderData

  const [index, setIndex] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [attempts, setAttempts] = useState<OrderAttempt[]>([])
  const [finished, setFinished] = useState(false)

  const question = questions[index]

  const [items, setItems] = useState<OrderItem[]>(() =>
    shuffleArray(question.items)
  )

  const progress = (index / questions.length) * 100

  React.useEffect(() => {
    setItems(shuffleArray(question.items))
    setSubmitted(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  // ── Drag state ───────────────────────────────────────────────────────────
  const dragIdx = useRef<number | null>(null)
  const [dragOver, setDragOver] = useState<number | null>(null)

  const handleDragStart = useCallback((i: number) => {
    dragIdx.current = i
  }, [])

  const handleDrop = useCallback((targetIdx: number) => {
    if (dragIdx.current === null || dragIdx.current === targetIdx) return
    setItems((prev) => {
      const next = [...prev]
      const [moved] = next.splice(dragIdx.current!, 1)
      next.splice(targetIdx, 0, moved)
      return next
    })
    dragIdx.current = null
    setDragOver(null)
  }, [])

  // Keyboard reorder (↑ / ↓)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, i: number) => {
      if (submitted) return
      if (e.key === "ArrowUp" && i > 0) {
        e.preventDefault()
        setItems((prev) => {
          const next = [...prev]
          ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
          return next
        })
      }
      if (e.key === "ArrowDown" && i < items.length - 1) {
        e.preventDefault()
        setItems((prev) => {
          const next = [...prev]
          ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
          return next
        })
      }
    },
    [submitted, items.length]
  )

  const correctOrder = question.items.map((x) => x.id)
  const givenOrder = items.map((x) => x.id)
  const isCorrect = givenOrder.join(",") === correctOrder.join(",")

  const handleSubmit = useCallback(() => setSubmitted(true), [])

  const handleNext = useCallback(() => {
    const attempt: OrderAttempt = {
      questionId: question.id,
      givenOrder,
      correctOrder,
      correct: isCorrect,
    }
    const newAttempts = [...attempts, attempt]
    setAttempts(newAttempts)

    if (index + 1 >= questions.length) {
      const score = newAttempts.filter((a) => a.correct).length
      const res: OrderResult = {
        attempts: newAttempts,
        score,
        maxScore: questions.length,
        percentage: Math.round((score / questions.length) * 100),
      }
      setFinished(true)
      onComplete?.(res)
    } else {
      setIndex((i) => i + 1)
    }
  }, [
    question.id,
    givenOrder,
    correctOrder,
    isCorrect,
    attempts,
    index,
    questions.length,
    onComplete,
  ])

  // ── Finished ──────────────────────────────────────────────────────────────
  if (finished) {
    const score = attempts.filter((a) => a.correct).length
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div
        className={cn(
          "w-full max-w-xl mx-auto text-center space-y-4",
          className
        )}
      >
        <h2 className="text-2xl font-bold">Done!</h2>
        <p className="text-5xl font-bold">{pct}%</p>
        <p className="text-muted-foreground">
          {score} / {questions.length} correct
        </p>
      </div>
    )
  }

  return (
    <div className={cn("w-full max-w-xl mx-auto space-y-5", className)}>
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

      <div className="space-y-3">
        <p className="font-medium">{question.prompt}</p>
        {question.hint && !submitted && (
          <p className="text-sm text-muted-foreground italic">
            Hint: {question.hint}
          </p>
        )}
        {!submitted && (
          <p className="text-xs text-muted-foreground">
            Drag items or use ↑↓ keys to reorder.
          </p>
        )}

        <ul className="space-y-2" aria-label="Sortable list">
          {items.map((item, i) => {
            const posInCorrect = correctOrder.indexOf(item.id)
            const itemCorrect = submitted && posInCorrect === i
            const itemWrong = submitted && posInCorrect !== i

            return (
              <li
                key={item.id}
                draggable={!submitted}
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(i)
                }}
                onDrop={() => handleDrop(i)}
                onDragLeave={() => setDragOver(null)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                tabIndex={submitted ? -1 : 0}
                role="listitem"
                aria-label={`Position ${i + 1}: ${item.label}`}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-all",
                  !submitted &&
                    "cursor-grab active:cursor-grabbing hover:bg-muted/50",
                  dragOver === i &&
                    !submitted &&
                    "border-primary bg-primary/5",
                  itemCorrect &&
                    "border-green-500 bg-green-50 dark:bg-green-950/20",
                  itemWrong && "border-destructive bg-destructive/5"
                )}
              >
                {!submitted && (
                  <GripVertical className="size-4 text-muted-foreground shrink-0" />
                )}
                <span className="shrink-0 text-xs font-mono text-muted-foreground w-5">
                  {i + 1}.
                </span>
                <span className="flex-1">
                  <span className="font-medium">{item.label}</span>
                  {item.description && (
                    <span className="block text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  )}
                </span>
                {itemCorrect && (
                  <CheckCircle2 className="size-4 text-green-600 shrink-0" />
                )}
                {itemWrong && (
                  <XCircle className="size-4 text-destructive shrink-0" />
                )}
              </li>
            )
          })}
        </ul>

        {submitted && !isCorrect && (
          <div className="rounded-md bg-muted px-4 py-3 text-sm space-y-1">
            <p className="font-medium">Correct order:</p>
            {correctOrder.map((id, i) => {
              const itm = question.items.find((x) => x.id === id)!
              return (
                <p key={id} className="text-muted-foreground">
                  {i + 1}. {itm.label}
                </p>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setItems(shuffleArray(question.items))
            setSubmitted(false)
          }}
          disabled={submitted}
        >
          <RotateCcw className="mr-1.5 size-3.5" />
          Shuffle
        </Button>
        {!submitted ? (
          <Button onClick={handleSubmit}>Check Order</Button>
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
