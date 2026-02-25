"use client"

import * as React from "react"
import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { BookOpen, ChevronRight, CheckCircle2, XCircle } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type ReadingQuestionType = "single" | "multiple" | "true-false"

export interface ReadingQuestionOption {
  id: string
  label: string
}

export interface ReadingQuestion {
  id: string
  type: ReadingQuestionType
  question: string
  options: ReadingQuestionOption[]
  correctIds: string[]
  /** Shown after the question is answered */
  explanation?: string
}

export interface ReadingPassageData {
  title: string
  introduction?: string
  /**
   * The reading content.
   * Plain text by default; set `contentIsHtml: true` to render as HTML.
   */
  content: string
  /** Render content as HTML (default: false) */
  contentIsHtml?: boolean
  questions: ReadingQuestion[]
  /** Estimated reading time in minutes */
  readingTimeMinutes?: number
  /** Hide the passage while the user answers questions (default: false) */
  hidePassageOnQuestions?: boolean
}

export interface ReadingAnswer {
  questionId: string
  selected: string[]
  correct: boolean
}

export interface ReadingResult {
  answers: ReadingAnswer[]
  score: number
  maxScore: number
  percentage: number
}

export interface ReadingPassageProps {
  readingPassageData: ReadingPassageData
  onComplete?: (result: ReadingResult) => void
  className?: string
}

// ─── Internal phase ───────────────────────────────────────────────────────────

type Phase = "reading" | "questions" | "results"

// ─── Component ────────────────────────────────────────────────────────────────

export function ReadingPassage({
  readingPassageData,
  onComplete,
  className,
}: ReadingPassageProps) {
  const {
    title,
    introduction,
    content,
    contentIsHtml = false,
    questions,
    readingTimeMinutes,
    hidePassageOnQuestions = false,
  } = readingPassageData

  const [phase, setPhase] = useState<Phase>("reading")
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState<ReadingAnswer[]>([])

  const question = questions[qIndex]

  const toggleOption = (id: string) => {
    if (submitted) return
    const isMultiple = question.type === "multiple"
    if (isMultiple) {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      )
    } else {
      setSelected([id])
    }
  }

  const isCorrectOption = (id: string) => question.correctIds.includes(id)

  const optionState = (id: string) => {
    if (!submitted) return selected.includes(id) ? "selected" : "idle"
    if (isCorrectOption(id)) return "correct"
    if (selected.includes(id)) return "wrong"
    return "idle"
  }

  const handleNext = useCallback(() => {
    const ans: ReadingAnswer = {
      questionId: question.id,
      selected,
      correct:
        [...question.correctIds].sort().join(",") ===
        [...selected].sort().join(","),
    }
    const newAnswers = [...answers, ans]
    setAnswers(newAnswers)

    if (qIndex + 1 >= questions.length) {
      const score = newAnswers.filter((a) => a.correct).length
      const res: ReadingResult = {
        answers: newAnswers,
        score,
        maxScore: questions.length,
        percentage: Math.round((score / questions.length) * 100),
      }
      setPhase("results")
      onComplete?.(res)
    } else {
      setQIndex((i) => i + 1)
      setSelected([])
      setSubmitted(false)
    }
  }, [question, selected, answers, qIndex, questions.length, onComplete])

  const PassageContent = () =>
    contentIsHtml ? (
      <div
        className="prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    ) : (
      <p className="text-sm leading-relaxed whitespace-pre-wrap">
        {content}
      </p>
    )

  // ── Reading ───────────────────────────────────────────────────────────────
  if (phase === "reading") {
    return (
      <Card className={cn("w-full max-w-3xl mx-auto", className)}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="size-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              Reading Passage
            </span>
            {readingTimeMinutes && (
              <Badge variant="secondary" className="ml-auto text-xs">
                ~{readingTimeMinutes} min read
              </Badge>
            )}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          {introduction && (
            <CardDescription>{introduction}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />
          <ScrollArea className="max-h-[400px] pr-4">
            <PassageContent />
          </ScrollArea>
          <Separator />
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {questions.length} comprehension question
              {questions.length > 1 ? "s" : ""}
            </p>
            <Button onClick={() => setPhase("questions")}>
              Start Questions
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // ── Results ───────────────────────────────────────────────────────────────
  if (phase === "results") {
    const score = answers.filter((a) => a.correct).length
    const pct = Math.round((score / questions.length) * 100)
    return (
      <Card className={cn("w-full max-w-3xl mx-auto", className)}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Comprehension Check Complete
          </CardTitle>
          <CardDescription>{title}</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-5xl font-bold">{pct}%</p>
          <p className="text-muted-foreground">
            {score} / {questions.length} correct
          </p>
          <div className="space-y-2 text-left mt-4">
            {answers.map((ans, i) => (
              <div
                key={ans.questionId}
                className="flex items-center gap-2 text-sm"
              >
                {ans.correct ? (
                  <CheckCircle2 className="size-4 text-green-600 shrink-0" />
                ) : (
                  <XCircle className="size-4 text-destructive shrink-0" />
                )}
                <span>{questions[i].question}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // ── Questions ─────────────────────────────────────────────────────────────
  return (
    <div className={cn("w-full max-w-3xl mx-auto space-y-4", className)}>
      {!hidePassageOnQuestions && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="size-4" /> {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-44 pr-2">
              <PassageContent />
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-1">
            <Badge variant="outline">
              Question {qIndex + 1} / {questions.length}
            </Badge>
            {question.type === "multiple" && (
              <Badge variant="secondary">Select all that apply</Badge>
            )}
          </div>
          <CardTitle className="text-base leading-snug">
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {question.options.map((opt) => {
            const state = optionState(opt.id)
            return (
              <button
                key={opt.id}
                onClick={() => toggleOption(opt.id)}
                className={cn(
                  "w-full flex items-start gap-3 rounded-lg border px-4 py-3 text-sm text-left transition-colors",
                  state === "idle" && "hover:bg-muted/50",
                  state === "selected" && "border-primary bg-primary/5",
                  state === "correct" &&
                    "border-green-500 bg-green-50 dark:bg-green-950/20",
                  state === "wrong" && "border-destructive bg-destructive/5"
                )}
              >
                <span className="mt-0.5 shrink-0">
                  {state === "correct" && (
                    <CheckCircle2 className="size-4 text-green-600" />
                  )}
                  {state === "wrong" && (
                    <XCircle className="size-4 text-destructive" />
                  )}
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
                {opt.label}
              </button>
            )
          })}

          {submitted && question.explanation && (
            <div className="mt-2 rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground">
              {question.explanation}
            </div>
          )}

          <div className="flex justify-end pt-2">
            {!submitted ? (
              <Button
                onClick={() => setSubmitted(true)}
                disabled={!selected.length}
              >
                Submit
              </Button>
            ) : (
              <Button onClick={handleNext}>
                {qIndex + 1 >= questions.length ? "Finish" : "Next"}
                <ChevronRight className="ml-1 size-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
