# lmscn — Install Guide

## What stack this uses

| Tool | Version |
|---|---|
| Tailwind CSS | **v4** |
| shadcn/ui | latest (new-york style) |
| React | 19 |
| Next.js | 16 |

---

## Step 1 — Install shadcn/ui primitives

lmscn does not ship its own shadcn primitives. It reuses the ones in your project.

**Install everything at once (recommended):**

```bash
npx shadcn@latest add button card progress badge input scroll-area separator tooltip popover
```

**Or per-component:**

| lmscn component | Required primitives | Command |
|---|---|---|
| `quiz` | button, card, progress, badge | `npx shadcn@latest add button card progress badge` |
| `flashcards` | button, card, progress, badge | `npx shadcn@latest add button card progress badge` |
| `match` | button, progress, badge | `npx shadcn@latest add button progress badge` |
| `fill-blank` | button, input, progress, badge | `npx shadcn@latest add button input progress badge` |
| `scramble` | button, progress, badge | `npx shadcn@latest add button progress badge` |
| `order` | button, progress, badge | `npx shadcn@latest add button progress badge` |
| `reading-passage` | button, card, badge, progress, scroll-area, separator | `npx shadcn@latest add button card badge progress scroll-area separator` |
| `progress-tracker` | badge, card, progress, tooltip | `npx shadcn@latest add badge card progress tooltip` |
| `spaced-repetition` | button, badge, card, progress | `npx shadcn@latest add button badge card progress` |
| `hotspot` | button, badge, input, progress, popover | `npx shadcn@latest add button badge input progress popover` |

---

## Step 2 — Install lmscn components

### Option A — Direct URL

```bash
npx shadcn@latest add https://lmscn.vercel.app/r/quiz.json
npx shadcn@latest add https://lmscn.vercel.app/r/flashcards.json
npx shadcn@latest add https://lmscn.vercel.app/r/match.json
npx shadcn@latest add https://lmscn.vercel.app/r/fill-blank.json
npx shadcn@latest add https://lmscn.vercel.app/r/scramble.json
npx shadcn@latest add https://lmscn.vercel.app/r/order.json
npx shadcn@latest add https://lmscn.vercel.app/r/reading-passage.json
npx shadcn@latest add https://lmscn.vercel.app/r/progress-tracker.json
npx shadcn@latest add https://lmscn.vercel.app/r/spaced-repetition.json
npx shadcn@latest add https://lmscn.vercel.app/r/hotspot.json
```

### Option B — Namespace (add once to components.json, then use short names)

```json
{
  "registries": {
    "@lmscn": "https://lmscn.vercel.app/r/{name}.json"
  }
}
```

```bash
npx shadcn@latest add @lmscn/quiz
npx shadcn@latest add @lmscn/flashcards
# etc.
```

---

## Tailwind v4 — what's different in this project

| v3 | v4 (this project) |
|---|---|
| `tailwind.config.ts` | **Deleted** — config lives in CSS |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| `tailwindcss-animate` | `tw-animate-css` (import, not plugin) |
| `autoprefixer` in postcss | **Removed** — not needed in v4 |
| HSL color values | **OKLCH** color values |
| `postcss: { tailwindcss: {}, autoprefixer: {} }` | `postcss: { "@tailwindcss/postcss": {} }` |
| `hsl(var(--primary))` in config | `var(--primary)` directly in `@theme inline` |

**The key pattern — `globals.css`:**

```css
@import "tailwindcss";
@import "tw-animate-css";

@theme inline {
  --color-primary: var(--primary);
  /* ... maps CSS vars → Tailwind color tokens */
}

:root {
  --primary: oklch(0.21 0.006 285.885);
  /* ... actual OKLCH values */
}
```

`@theme inline` is what makes `bg-primary/50` opacity modifiers work with CSS variables.

---

## Radix UI packages (installed by shadcn automatically)

| Primitive | Radix package | Notes |
|---|---|---|
| `button` | `@radix-ui/react-slot` | |
| `card` | none | Pure Tailwind |
| `progress` | `@radix-ui/react-progress` | |
| `badge` | none | Pure Tailwind |
| `input` | none | Pure Tailwind |
| `scroll-area` | `@radix-ui/react-scroll-area` | |
| `separator` | `@radix-ui/react-separator` | |
| `tooltip` | `@radix-ui/react-tooltip` | |
| `popover` | `@radix-ui/react-popover` | |

`npx shadcn@latest add <primitive>` handles all Radix installs automatically.

---

## Usage examples

### Quiz
```tsx
import { Quiz } from "@/components/lms/quiz"
import type { QuizData, QuizResult } from "@/components/lms/quiz"

const data: QuizData = {
  title: "JavaScript Basics",
  passingScore: 80,
  questions: [{
    id: "q1",
    type: "single",
    question: "What does `typeof null` return?",
    options: [
      { id: "a", label: "null" },
      { id: "b", label: "object", explanation: "A historical quirk in the JS spec." },
      { id: "c", label: "undefined" },
    ],
    correctIds: ["b"],
  }],
}

export function MyLesson() {
  return <Quiz quizData={data} onComplete={(r: QuizResult) => console.log(r.percentage + "%")} />
}
```

### Flashcards
```tsx
import { Flashcards } from "@/components/lms/flashcards"
import type { FlashcardsData } from "@/components/lms/flashcards"

const data: FlashcardsData = {
  title: "Spanish Vocabulary",
  shuffle: true,
  cards: [
    { id: "1", front: "Hola",      back: "Hello",     tag: "Greetings" },
    { id: "2", front: "Gracias",   back: "Thank you", tag: "Greetings" },
    { id: "3", front: "Por favor", back: "Please",    tag: "Greetings" },
  ],
}
export function MyFlashcards() {
  return <Flashcards flashcardsData={data} onComplete={(r) => console.log(r.counts)} />
}
```

### Match
```tsx
import { Match } from "@/components/lms/match"

export function MyMatch() {
  return (
    <Match
      matchData={{
        title: "Capital Cities",
        pairs: [
          { id: "1", left: "France", right: "Paris"    },
          { id: "2", left: "Japan",  right: "Tokyo"    },
          { id: "3", left: "Egypt",  right: "Cairo"    },
        ],
      }}
      onComplete={(r) => alert(`${r.mistakes} mistakes`)}
    />
  )
}
```

### Fill in the Blank
```tsx
import { FillBlank } from "@/components/lms/fill-blank"

export function MyFillBlank() {
  return (
    <FillBlank
      fillBlankData={{
        title: "Biology",
        questions: [{
          id: "q1",
          sentence: "The powerhouse of the cell is the ___.",
          answers: ["mitochondria"],
          alternatives: [["mitochondrion"]],
        }],
      }}
      onComplete={(r) => console.log(r.percentage + "%")}
    />
  )
}
```

### Word Scramble
```tsx
import { Scramble } from "@/components/lms/scramble"

export function MyScramble() {
  return (
    <Scramble
      scrambleData={{
        title: "Science Terms",
        questions: [
          { id: "1", answer: "photosynthesis", clue: "How plants make food" },
          { id: "2", answer: "mitochondria",   clue: "Powerhouse of the cell" },
        ],
      }}
    />
  )
}
```

### Order / Sequence
```tsx
import { Order } from "@/components/lms/order"

export function MyOrder() {
  return (
    <Order
      orderData={{
        title: "Star Lifecycle",
        questions: [{
          id: "q1",
          prompt: "Order the stages of a star's life:",
          items: [
            { id: "1", label: "Nebula" },
            { id: "2", label: "Protostar" },
            { id: "3", label: "Main Sequence" },
            { id: "4", label: "Red Giant" },
            { id: "5", label: "White Dwarf" },
          ],
        }],
      }}
    />
  )
}
```

### Reading Passage
```tsx
import { ReadingPassage } from "@/components/lms/reading-passage"

export function MyReading() {
  return (
    <ReadingPassage
      readingPassageData={{
        title: "The Water Cycle",
        content: `Solar energy drives evaporation, turning liquid water into vapour.
This rises, cools and condenses into clouds, falling as precipitation.`,
        questions: [{
          id: "q1", type: "single",
          question: "What drives the water cycle?",
          options: [{ id: "a", label: "Moon" }, { id: "b", label: "Solar energy" }],
          correctIds: ["b"],
          explanation: "The sun provides energy to evaporate water.",
        }],
      }}
    />
  )
}
```

### Progress Tracker
```tsx
import { ProgressTracker } from "@/components/lms/progress-tracker"
import type { LessonNode } from "@/components/lms/progress-tracker"

export function MyProgress() {
  return (
    <ProgressTracker
      progressTrackerData={{
        learnerName: "Alex",
        totalXp: 340, xpToNextLevel: 500, level: 4, streak: 7,
        units: [{
          id: "u1", title: "Biology Unit 1",
          lessons: [
            { id: "l1", title: "The Cell",         status: "completed", xp: 50,  type: "reading", score: 92 },
            { id: "l2", title: "Cell Organelles",  status: "current",   xp: 100, type: "quiz" },
            { id: "l3", title: "Match Functions",  status: "locked",    xp: 75,  type: "match" },
          ],
        }],
      }}
      onLessonSelect={(l: LessonNode) => console.log("Opening:", l.id)}
    />
  )
}
```

### Spaced Repetition
```tsx
import { SpacedRepetition } from "@/components/lms/spaced-repetition"

export function MySR() {
  return (
    <SpacedRepetition
      spacedRepetitionData={{
        title: "French Review",
        totalCards: 120,
        dueCards: [
          { id: "1", front: "bonjour",   back: "hello",     interval: 3, easeFactor: 2.5 },
          { id: "2", front: "merci",     back: "thank you", interval: 7, easeFactor: 2.8 },
          { id: "3", front: "au revoir", back: "goodbye",   interval: 1, easeFactor: 2.1 },
        ],
      }}
      onComplete={(r) => console.log("Sessions:", r.sessions)}
    />
  )
}
```

### Image Hotspot
```tsx
import { Hotspot } from "@/components/lms/hotspot"

export function MyHotspot() {
  return (
    <Hotspot
      hotspotData={{
        title: "Heart Anatomy",
        questions: [{
          id: "q1",
          imageUrl: "/heart-diagram.png",
          imageAlt: "Diagram of the human heart",
          prompt: "Label the four chambers:",
          points: [
            { id: "p1", x: 30, y: 40, label: "Left Ventricle",  description: "Pumps blood to body." },
            { id: "p2", x: 60, y: 40, label: "Right Ventricle", description: "Pumps blood to lungs." },
            { id: "p3", x: 30, y: 20, label: "Left Atrium" },
            { id: "p4", x: 60, y: 20, label: "Right Atrium" },
          ],
        }],
      }}
      onComplete={(r) => console.log(r.percentage + "% correct")}
    />
  )
}
```

---

## All exported TypeScript types

```ts
// quiz
import type { QuizData, QuizQuestion, QuizOption, QuizQuestionType, QuizResult, QuizProps } from "@/components/lms/quiz"

// flashcards
import type { FlashcardsData, Flashcard, FlashcardDifficulty, FlashcardRating, FlashcardsResult, FlashcardsProps } from "@/components/lms/flashcards"

// match
import type { MatchData, MatchPair, MatchResult, MatchProps } from "@/components/lms/match"

// fill-blank
import type { FillBlankData, FillBlankQuestion, FillBlankAttempt, FillBlankResult, FillBlankProps } from "@/components/lms/fill-blank"

// scramble
import type { ScrambleData, ScrambleQuestion, ScrambleAttempt, ScrambleResult, ScrambleProps } from "@/components/lms/scramble"

// order
import type { OrderData, OrderQuestion, OrderItem, OrderAttempt, OrderResult, OrderProps } from "@/components/lms/order"

// reading-passage
import type { ReadingPassageData, ReadingQuestion, ReadingAnswer, ReadingResult, ReadingPassageProps } from "@/components/lms/reading-passage"

// progress-tracker
import type { ProgressTrackerData, LearningUnit, LessonNode, LessonStatus, LessonType, ProgressTrackerProps } from "@/components/lms/progress-tracker"

// spaced-repetition
import type { SpacedRepetitionData, ReviewCard, ReviewGrade, ReviewSession, SpacedRepetitionResult, SpacedRepetitionProps } from "@/components/lms/spaced-repetition"

// hotspot
import type { HotspotData, HotspotQuestion, HotspotPoint, HotspotAttempt, HotspotResult, HotspotProps } from "@/components/lms/hotspot"
```
