"use client"

import * as React from "react"
import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/default/ui/button"
import { Badge } from "@/registry/default/ui/badge"
import { Progress } from "@/registry/default/ui/progress"
import { CheckCircle2, XCircle, ChevronRight, RotateCcw } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScrambleQuestion {
  id: string
  /** The correct word or phrase (spaces are stripped for the tile pool) */
  answer: string
  /** Clue / context shown above the tile area */
  clue?: string
  /** Optional image clue */
  clueImage?: string
}

export interface ScrambleData {
  title: string
  description?: string
  questions: ScrambleQuestion[]
}

export interface ScrambleAttempt {
  questionId: string
  given: string
  correct: boolean
}

export interface ScrambleResult {
  attempts: ScrambleAttempt[]
  score: number
  maxScore: number
  percentage: number
}

export interface ScrambleProps {
  scrambleData: ScrambleData
  onComplete?: (result: ScrambleResult) => void
  className?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface LetterTile {
  /** Unique key for React */
  id: string
  char: string
}

function buildScrambled(word: string): LetterTile[] {
  const tiles: LetterTile[] = word.split("").map((char, i) => ({
    id: `${i}-${char}-${Math.random()}`,
    char,
  }))
  let shuffled = [...tiles]
  do {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
  } while (
    shuffled.map((t) => t.char).join("") === word &&
    word.length > 1
  )
  return shuffled
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Scramble({
  scrambleData,
  onComplete,
  className,
}: ScrambleProps) {
  const { title, description, questions } = scrambleData

  const [index, setIndex] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [attempts, setAttempts] = useState<ScrambleAttempt[]>([])
  const [finished, setFinished] = useState(false)

  const question = questions[index]
  const answerLetters = question.answer.replace(/\s/g, "")

  const [pool, setPool] = useState<LetterTile[]>(() =>
    buildScrambled(answerLetters)
  )
  const [selected, setSelected] = useState<LetterTile[]>([])

  const progress = (index / questions.length) * 100
  const userWord = selected.map((t) => t.char).join("")
  const correct =
    userWord.toLowerCase() === answerLetters.toLowerCase()

  React.useEffect(() => {
    setPool(buildScrambled(question.answer.replace(/\s/g, "")))
    setSelected([])
    setSubmitted(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const pickTile = useCallback(
    (tile: LetterTile) => {
      if (submitted) return
      setPool((p) => p.filter((t) => t.id !== tile.id))
      setSelected((s) => [...s, tile])
    },
    [submitted]
  )

  const returnTile = useCallback(
    (tile: LetterTile) => {
      if (submitted) return
      setSelected((s) => s.filter((t) => t.id !== tile.id))
      setPool((p) => [...p, tile])
    },
    [submitted]
  )

  const handleReset = useCallback(() => {
    setPool((p) => [...p, ...selected])
    setSelected([])
  }, [selected])

  const handleSubmit = useCallback(() => {
    if (selected.length === 0) return
    setSubmitted(true)
  }, [selected.length])

  const handleNext = useCallback(() => {
    const attempt: ScrambleAttempt = {
      questionId: question.id,
      given: userWord,
      correct,
    }
    const newAttempts = [...attempts, attempt]
    setAttempts(newAttempts)

    if (index + 1 >= questions.length) {
      const score = newAttempts.filter((a) => a.correct).length
      const res: ScrambleResult = {
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
    userWord,
    correct,
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
    <div className={cn("w-full max-w-xl mx-auto space-y-6", className)}>
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

      <div className="rounded-xl border bg-card p-6 space-y-6">
        {question.clueImage && (
          <img
            src={question.clueImage}
            alt="clue"
            className="mx-auto max-h-32 object-contain rounded"
          />
        )}
        {question.clue && (
          <p className="text-center text-muted-foreground text-sm italic">
            {question.clue}
          </p>
        )}

        {/* Answer tray */}
        <div className="flex flex-wrap gap-2 justify-center min-h-12">
          {selected.map((tile) => (
            <button
              key={tile.id}
              onClick={() => returnTile(tile)}
              disabled={submitted}
              className={cn(
                "h-10 min-w-[2.5rem] px-3 rounded-lg border-2 font-mono font-bold text-lg uppercase transition-all",
                submitted &&
                  correct &&
                  "border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700",
                submitted &&
                  !correct &&
                  "border-destructive bg-destructive/5 text-destructive",
                !submitted &&
                  "border-primary bg-primary/5 hover:bg-primary/10"
              )}
            >
              {tile.char}
            </button>
          ))}
          {selected.length === 0 && (
            <span className="text-sm text-muted-foreground self-center">
              Pick letters below
            </span>
          )}
        </div>

        {/* Validation feedback */}
        {submitted && (
          <div className="flex items-center justify-center gap-2">
            {correct ? (
              <>
                <CheckCircle2 className="size-5 text-green-600" />
                <span className="text-green-600 font-medium">Correct!</span>
              </>
            ) : (
              <>
                <XCircle className="size-5 text-destructive" />
                <span className="text-destructive font-medium">
                  Correct answer: {question.answer}
                </span>
              </>
            )}
          </div>
        )}

        {/* Tile pool */}
        {!submitted && (
          <div className="flex flex-wrap gap-2 justify-center">
            {pool.map((tile) => (
              <button
                key={tile.id}
                onClick={() => pickTile(tile)}
                className="h-10 min-w-[2.5rem] px-3 rounded-lg border font-mono font-bold text-lg uppercase hover:bg-muted transition-colors"
              >
                {tile.char}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={submitted || selected.length === 0}
        >
          <RotateCcw className="mr-1.5 size-3.5" />
          Reset
        </Button>
        {!submitted ? (
          <Button
            onClick={handleSubmit}
            disabled={selected.length === 0}
          >
            Submit
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
