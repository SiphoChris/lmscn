"use client"

import * as React from "react"
import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/default/ui/button"
import { Badge } from "@/registry/default/ui/badge"
import { Progress } from "@/registry/default/ui/progress"
import { CheckCircle2, RotateCcw } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MatchPair {
  id: string
  left: string
  right: string
  /** Optional image for the left item */
  leftImage?: string
  /** Optional image for the right item */
  rightImage?: string
}

export interface MatchData {
  title: string
  description?: string
  pairs: MatchPair[]
  /** Randomise right-column order (default: true) */
  shuffle?: boolean
}

export interface MatchResult {
  matched: MatchPair[]
  /** Number of incorrect pair attempts */
  mistakes: number
  /** Duration in milliseconds */
  durationMs: number
}

export interface MatchProps {
  matchData: MatchData
  onComplete?: (result: MatchResult) => void
  className?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

interface ItemState {
  id: string
  side: "left" | "right"
  pairId: string
  label: string
  image?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Match({ matchData, onComplete, className }: MatchProps) {
  const { title, description, shuffle = true } = matchData

  const leftItems = React.useMemo<ItemState[]>(
    () =>
      matchData.pairs.map((p) => ({
        id: `left-${p.id}`,
        side: "left" as const,
        pairId: p.id,
        label: p.left,
        image: p.leftImage,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const rightItems = React.useMemo<ItemState[]>(() => {
    const items: ItemState[] = matchData.pairs.map((p) => ({
      id: `right-${p.id}`,
      side: "right" as const,
      pairId: p.id,
      label: p.right,
      image: p.rightImage,
    }))
    return shuffle ? shuffleArray(items) : items
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [selectedLeft, setSelectedLeft] = useState<ItemState | null>(null)
  const [selectedRight, setSelectedRight] = useState<ItemState | null>(null)
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [wrong, setWrong] = useState<Set<string>>(new Set())
  const [mistakes, setMistakes] = useState(0)
  const [startTime] = useState(() => Date.now())
  const [finished, setFinished] = useState(false)

  const isMatched = (item: ItemState) => matched.has(item.pairId)
  const isWrong = (item: ItemState) => wrong.has(item.id)

  const progress = (matched.size / matchData.pairs.length) * 100

  const checkMatch = useCallback(
    (left: ItemState, right: ItemState) => {
      if (left.pairId === right.pairId) {
        const newMatched = new Set(matched).add(left.pairId)
        setMatched(newMatched)
        setSelectedLeft(null)
        setSelectedRight(null)

        if (newMatched.size === matchData.pairs.length) {
          const res: MatchResult = {
            matched: matchData.pairs,
            mistakes,
            durationMs: Date.now() - startTime,
          }
          setFinished(true)
          onComplete?.(res)
        }
      } else {
        setMistakes((m) => m + 1)
        setWrong(new Set([left.id, right.id]))
        setTimeout(() => {
          setWrong(new Set())
          setSelectedLeft(null)
          setSelectedRight(null)
        }, 600)
      }
    },
    [matched, matchData.pairs, mistakes, startTime, onComplete]
  )

  const handleLeft = useCallback(
    (item: ItemState) => {
      if (isMatched(item) || wrong.size > 0) return
      const next = selectedLeft?.id === item.id ? null : item
      setSelectedLeft(next)
      if (next && selectedRight) checkMatch(next, selectedRight)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedLeft, selectedRight, matched, wrong, checkMatch]
  )

  const handleRight = useCallback(
    (item: ItemState) => {
      if (isMatched(item) || wrong.size > 0) return
      const next = selectedRight?.id === item.id ? null : item
      setSelectedRight(next)
      if (selectedLeft && next) checkMatch(selectedLeft, next)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedLeft, selectedRight, matched, wrong, checkMatch]
  )

  const itemClass = (item: ItemState, isLeft: boolean) => {
    const sel = isLeft
      ? selectedLeft?.id === item.id
      : selectedRight?.id === item.id

    return cn(
      "w-full rounded-lg border px-4 py-3 text-sm text-center transition-all duration-200 cursor-pointer",
      isMatched(item) &&
        "border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 cursor-default",
      isWrong(item) && "border-destructive bg-destructive/10 animate-shake",
      !isMatched(item) && !isWrong(item) && sel &&
        "border-primary bg-primary/10 shadow-sm",
      !isMatched(item) && !isWrong(item) && !sel &&
        "hover:border-muted-foreground/40 hover:bg-muted/40"
    )
  }

  // ── Finished ──────────────────────────────────────────────────────────────
  if (finished) {
    const seconds = Math.round((Date.now() - startTime) / 1000)
    return (
      <div
        className={cn(
          "w-full max-w-2xl mx-auto space-y-6 text-center",
          className
        )}
      >
        <CheckCircle2 className="mx-auto size-16 text-green-500" />
        <div>
          <h2 className="text-2xl font-bold">All matched!</h2>
          <p className="text-muted-foreground">
            {mistakes === 0
              ? "Perfect — no mistakes!"
              : `${mistakes} mistake${mistakes > 1 ? "s" : ""}`}{" "}
            · {seconds}s
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setMatched(new Set())
            setWrong(new Set())
            setMistakes(0)
            setSelectedLeft(null)
            setSelectedRight(null)
            setFinished(false)
          }}
        >
          <RotateCcw className="mr-2 size-4" />
          Play Again
        </Button>
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
          {matched.size} / {matchData.pairs.length}
        </Badge>
      </div>

      <Progress value={progress} className="h-1.5" />

      <div className="grid grid-cols-2 gap-3">
        {/* Left column */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide text-center">
            Term
          </p>
          {leftItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLeft(item)}
              disabled={isMatched(item)}
              className={itemClass(item, true)}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt=""
                  className="mx-auto mb-2 max-h-12 object-contain"
                />
              )}
              {isMatched(item) && (
                <CheckCircle2 className="inline mr-1.5 size-3.5 text-green-600" />
              )}
              {item.label}
            </button>
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide text-center">
            Definition
          </p>
          {rightItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleRight(item)}
              disabled={isMatched(item)}
              className={itemClass(item, false)}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt=""
                  className="mx-auto mb-2 max-h-12 object-contain"
                />
              )}
              {isMatched(item) && (
                <CheckCircle2 className="inline mr-1.5 size-3.5 text-green-600" />
              )}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {mistakes > 0 && (
        <p className="text-xs text-center text-muted-foreground">
          Mistakes: {mistakes}
        </p>
      )}
    </div>
  )
}
