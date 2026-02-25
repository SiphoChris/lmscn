"use client"

import * as React from "react"
import { useState, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/default/ui/button"
import { Input } from "@/registry/default/ui/input"
import { Progress } from "@/registry/default/ui/progress"
import { Badge } from "@/registry/default/ui/badge"
import { CheckCircle2, XCircle, ChevronRight } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FillBlankQuestion {
  id: string
  /**
   * Sentence with blanks marked as `___`.
   * e.g. "The capital of France is ___ and it sits on the ___ river."
   */
  sentence: string
  /** Correct answer for each blank, in order */
  answers: string[]
  /** Case-sensitive matching (default: false) */
  caseSensitive?: boolean
  /**
   * Per-blank list of accepted alternatives (same index as answers).
   * e.g. [["mitochondrion"], ["cell"]]
   */
  alternatives?: Array<string[]>
  hint?: string
}

export interface FillBlankData {
  title: string
  description?: string
  questions: FillBlankQuestion[]
  /** Show the correct answer when the user is wrong (default: true) */
  showCorrection?: boolean
}

export interface FillBlankAttempt {
  questionId: string
  given: string[]
  correct: boolean
}

export interface FillBlankResult {
  attempts: FillBlankAttempt[]
  score: number
  maxScore: number
  percentage: number
}

export interface FillBlankProps {
  fillBlankData: FillBlankData
  onComplete?: (result: FillBlankResult) => void
  className?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BLANK_TOKEN = "___"

type SentencePart =
  | { type: "text"; content: string }
  | { type: "blank" }

function parseSentence(sentence: string): SentencePart[] {
  const parts = sentence.split(BLANK_TOKEN)
  const result: SentencePart[] = []
  for (let i = 0; i < parts.length; i++) {
    if (parts[i]) result.push({ type: "text", content: parts[i] })
    if (i < parts.length - 1) result.push({ type: "blank" })
  }
  return result
}

function checkAnswer(
  given: string,
  correct: string,
  alts: string[] | undefined,
  caseSensitive: boolean
): boolean {
  const norm = (s: string) =>
    caseSensitive ? s.trim() : s.trim().toLowerCase()
  return [correct, ...(alts ?? [])].map(norm).includes(norm(given))
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FillBlank({
  fillBlankData,
  onComplete,
  className,
}: FillBlankProps) {
  const {
    title,
    description,
    questions,
    showCorrection = true,
  } = fillBlankData

  const [index, setIndex] = useState(0)
  const [inputs, setInputs] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [attempts, setAttempts] = useState<FillBlankAttempt[]>([])
  const [finished, setFinished] = useState(false)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const question = questions[index]
  const parts = React.useMemo(
    () => parseSentence(question.sentence),
    [question.sentence]
  )
  const blankCount = parts.filter((p) => p.type === "blank").length

  const progress = (index / questions.length) * 100

  React.useEffect(() => {
    setInputs(Array(blankCount).fill(""))
    setTimeout(() => inputRefs.current[0]?.focus(), 50)
  }, [index, blankCount])

  const handleInput = useCallback((bi: number, value: string) => {
    setInputs((prev) => {
      const next = [...prev]
      next[bi] = value
      return next
    })
  }, [])

  const results = React.useMemo(() => {
    if (!submitted) return []
    return inputs.map((given, i) =>
      checkAnswer(
        given,
        question.answers[i] ?? "",
        question.alternatives?.[i],
        question.caseSensitive ?? false
      )
    )
  }, [submitted, inputs, question])

  const handleSubmit = useCallback(() => {
    if (inputs.some((v) => !v.trim())) return
    setSubmitted(true)
  }, [inputs])

  const handleNext = useCallback(() => {
    const attempt: FillBlankAttempt = {
      questionId: question.id,
      given: inputs,
      correct: results.every(Boolean),
    }
    const newAttempts = [...attempts, attempt]
    setAttempts(newAttempts)

    if (index + 1 >= questions.length) {
      const score = newAttempts.filter((a) => a.correct).length
      const res: FillBlankResult = {
        attempts: newAttempts,
        score,
        maxScore: questions.length,
        percentage: Math.round((score / questions.length) * 100),
      }
      setFinished(true)
      onComplete?.(res)
    } else {
      setIndex((i) => i + 1)
      setSubmitted(false)
    }
  }, [
    question.id,
    inputs,
    results,
    attempts,
    index,
    questions.length,
    onComplete,
  ])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, bi: number) => {
      if (e.key === "Enter") {
        if (bi + 1 < blankCount) {
          inputRefs.current[bi + 1]?.focus()
        } else {
          handleSubmit()
        }
      }
    },
    [blankCount, handleSubmit]
  )

  // ── Finished ──────────────────────────────────────────────────────────────
  if (finished) {
    const score = attempts.filter((a) => a.correct).length
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div
        className={cn(
          "w-full max-w-2xl mx-auto text-center space-y-4",
          className
        )}
      >
        <h2 className="text-2xl font-bold">Complete!</h2>
        <p className="text-5xl font-bold">{pct}%</p>
        <p className="text-muted-foreground">
          {score} / {questions.length} correct
        </p>
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────
  let blankIdx = 0

  return (
    <div className={cn("w-full max-w-2xl mx-auto space-y-6", className)}>
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

      <div className="rounded-xl border bg-card p-6 space-y-4">
        {question.hint && !submitted && (
          <p className="text-sm text-muted-foreground italic">
            Hint: {question.hint}
          </p>
        )}

        {/* Sentence with inline inputs */}
        <p className="text-base leading-relaxed flex flex-wrap items-center gap-1">
          {parts.map((part, i) => {
            if (part.type === "text") {
              return <span key={i}>{part.content}</span>
            }
            const bi = blankIdx++
            const isCorrectBlank = submitted ? results[bi] : undefined
            return (
              <span key={i} className="inline-flex items-center gap-1">
                <Input
                  ref={(el) => {
                    inputRefs.current[bi] = el
                  }}
                  value={inputs[bi] ?? ""}
                  onChange={(e) => handleInput(bi, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, bi)}
                  disabled={submitted}
                  className={cn(
                    "h-8 min-w-[6rem] max-w-[12rem] text-center text-sm",
                    submitted &&
                      isCorrectBlank &&
                      "border-green-500 bg-green-50 dark:bg-green-950/20",
                    submitted &&
                      !isCorrectBlank &&
                      "border-destructive bg-destructive/5"
                  )}
                  aria-label={`Blank ${bi + 1}`}
                />
                {submitted && isCorrectBlank && (
                  <CheckCircle2 className="size-4 text-green-600 shrink-0" />
                )}
                {submitted && !isCorrectBlank && (
                  <XCircle className="size-4 text-destructive shrink-0" />
                )}
              </span>
            )
          })}
        </p>

        {/* Corrections */}
        {submitted && showCorrection && !results.every(Boolean) && (
          <div className="mt-2 rounded-md bg-muted px-4 py-3 text-sm space-y-1">
            <p className="font-medium">Correct answers:</p>
            {question.answers.map((ans, i) => (
              <p key={i} className="text-muted-foreground">
                Blank {i + 1}:{" "}
                <span className="text-foreground font-medium">{ans}</span>
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        {!submitted ? (
          <Button
            onClick={handleSubmit}
            disabled={inputs.some((v) => !v.trim())}
          >
            Check
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
