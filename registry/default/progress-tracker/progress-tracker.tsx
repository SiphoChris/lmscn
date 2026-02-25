"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { CheckCircle2, Lock, Zap, Star, Trophy } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type LessonStatus =
  | "completed"
  | "current"
  | "locked"
  | "available"

export type LessonType =
  | "quiz"
  | "flashcards"
  | "match"
  | "reading"
  | "video"
  | "exercise"
  | "scramble"
  | "order"
  | "hotspot"
  | "spaced-repetition"

export interface LessonNode {
  id: string
  title: string
  status: LessonStatus
  /** XP earned (completed) or awarded (future) */
  xp?: number
  type?: LessonType
  /** Score 0-100 if completed */
  score?: number
}

export interface LearningUnit {
  id: string
  title: string
  lessons: LessonNode[]
}

export interface ProgressTrackerData {
  learnerName?: string
  totalXp: number
  /** XP threshold to reach the next level */
  xpToNextLevel: number
  level: number
  /** Daily streak in days */
  streak?: number
  units: LearningUnit[]
}

export interface ProgressTrackerProps {
  progressTrackerData: ProgressTrackerData
  onLessonSelect?: (lesson: LessonNode) => void
  className?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_LABEL: Record<LessonType, string> = {
  quiz: "Q",
  flashcards: "F",
  match: "M",
  reading: "R",
  video: "▶",
  exercise: "✎",
  scramble: "S",
  order: "O",
  hotspot: "H",
  "spaced-repetition": "SR",
}

interface StatusConfig {
  nodeClass: string
  icon?: React.ReactNode
}

const STATUS_CONFIG: Record<LessonStatus, StatusConfig> = {
  completed: {
    nodeClass:
      "bg-green-500 border-green-600 shadow-md shadow-green-200 dark:shadow-green-900",
    icon: <CheckCircle2 className="size-5 text-white" />,
  },
  current: {
    nodeClass:
      "bg-primary border-primary/80 shadow-md shadow-primary/30 ring-4 ring-primary/20 animate-pulse",
    icon: <Zap className="size-5 text-white" />,
  },
  available: {
    nodeClass:
      "bg-background border-primary/50 hover:border-primary hover:bg-primary/5",
  },
  locked: {
    nodeClass: "bg-muted border-muted-foreground/20 opacity-60 cursor-not-allowed",
    icon: <Lock className="size-4 text-muted-foreground" />,
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProgressTracker({
  progressTrackerData,
  onLessonSelect,
  className,
}: ProgressTrackerProps) {
  const { learnerName, totalXp, xpToNextLevel, level, streak, units } =
    progressTrackerData

  const xpProgress = Math.min((totalXp / xpToNextLevel) * 100, 100)

  return (
    <TooltipProvider>
      <div
        className={cn("w-full max-w-md mx-auto space-y-6", className)}
      >
        {/* XP / Level header */}
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              {learnerName && (
                <p className="text-xs text-muted-foreground">
                  Welcome back,
                </p>
              )}
              <p className="font-semibold">
                {learnerName ?? "Your Progress"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {streak !== undefined && streak > 0 && (
                <Badge variant="secondary" className="gap-1">
                  🔥 {streak} day{streak > 1 ? "s" : ""}
                </Badge>
              )}
              <Badge className="gap-1">
                <Trophy className="size-3" />
                Lvl {level}
              </Badge>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="size-3 text-yellow-500" />
                {totalXp} XP
              </span>
              <span>
                {xpToNextLevel} XP to Level {level + 1}
              </span>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>
        </div>

        {/* Units */}
        {units.map((unit) => {
          const completed = unit.lessons.filter(
            (l) => l.status === "completed"
          ).length
          const unitProgress = (completed / unit.lessons.length) * 100

          return (
            <div key={unit.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">{unit.title}</h3>
                <span className="text-xs text-muted-foreground">
                  {completed}/{unit.lessons.length}
                </span>
              </div>
              <Progress value={unitProgress} className="h-1" />

              {/* Zigzag lesson path */}
              <div className="flex flex-col items-center gap-3">
                {unit.lessons.map((lesson, i) => {
                  const config = STATUS_CONFIG[lesson.status]
                  const isClickable =
                    lesson.status === "available" ||
                    lesson.status === "current"

                  return (
                    <div
                      key={lesson.id}
                      className={cn(
                        "flex items-center gap-3 w-full",
                        i % 2 === 0
                          ? "flex-row"
                          : "flex-row-reverse"
                      )}
                    >
                      <div className="flex-1" />

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            disabled={!isClickable}
                            onClick={() =>
                              isClickable && onLessonSelect?.(lesson)
                            }
                            className={cn(
                              "flex size-14 shrink-0 flex-col items-center justify-center rounded-full border-2 transition-transform duration-150 text-sm font-bold",
                              isClickable &&
                                "hover:scale-110 active:scale-95",
                              config.nodeClass
                            )}
                            aria-label={lesson.title}
                          >
                            {config.icon ??
                              (lesson.type ? (
                                <span
                                  className={cn(
                                    "text-xs font-bold",
                                    lesson.status === "available"
                                      ? "text-primary"
                                      : "text-muted-foreground"
                                  )}
                                >
                                  {TYPE_LABEL[lesson.type]}
                                </span>
                              ) : null)}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-0.5">
                            <p className="font-medium text-sm">
                              {lesson.title}
                            </p>
                            {lesson.xp && (
                              <p className="text-xs text-muted-foreground">
                                {lesson.status === "completed"
                                  ? `✓ +${lesson.xp} XP`
                                  : `+${lesson.xp} XP`}
                              </p>
                            )}
                            {lesson.score !== undefined && (
                              <p className="text-xs text-muted-foreground">
                                Score: {lesson.score}%
                              </p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>

                      <div className="flex-1">
                        <p className="text-xs font-medium">
                          {lesson.title}
                        </p>
                        {lesson.status === "completed" &&
                          lesson.score !== undefined && (
                            <p className="text-[10px] text-muted-foreground">
                              {lesson.score}%
                            </p>
                          )}
                        {lesson.xp &&
                          lesson.status !== "completed" && (
                            <p className="text-[10px] text-muted-foreground">
                              +{lesson.xp} XP
                            </p>
                          )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
