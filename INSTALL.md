# lmscn — Install Guide

## Stack

| Tool | Version |
|---|---|
| Next.js | 16 |
| React | 19 |
| Tailwind CSS | **v4** |
| shadcn/ui | latest (new-york style) |

---

## Step 1 — Set up shadcn/ui

```bash
npx shadcn@latest
```

## Step 2 — Install shadcn/ui primitives

lmscn reuses the shadcn/ui primitives already in your project — it does not ship its own copies.

**Install everything at once (recommended):**

```bash
npx shadcn@latest add button card progress badge input scroll-area separator tooltip popover
```

**Or install only what each component needs:**

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

### Radix UI packages (installed automatically by shadcn)

| Primitive | Radix package |
|---|---|
| `button` | `@radix-ui/react-slot` |
| `progress` | `@radix-ui/react-progress` |
| `scroll-area` | `@radix-ui/react-scroll-area` |
| `separator` | `@radix-ui/react-separator` |
| `tooltip` | `@radix-ui/react-tooltip` |
| `popover` | `@radix-ui/react-popover` |
| `card`, `badge`, `input` | none (pure Tailwind) |

---

## Step 3 — Install lmscn components

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

### Option B — Registry namespace

Add the registry to `components.json` once:

```json
{
  "registries": {
    "@lmscn": "https://lmscn.vercel.app/r/{name}.json"
  }
}
```

Then install using the short namespace:

```bash
npx shadcn@latest add @lmscn/quiz
npx shadcn@latest add @lmscn/flashcards
npx shadcn@latest add @lmscn/match
npx shadcn@latest add @lmscn/fill-blank
npx shadcn@latest add @lmscn/scramble
npx shadcn@latest add @lmscn/order
npx shadcn@latest add @lmscn/reading-passage
npx shadcn@latest add @lmscn/progress-tracker
npx shadcn@latest add @lmscn/spaced-repetition
npx shadcn@latest add @lmscn/hotspot
```

---

## Usage examples

For full prop documentation and all available types, see the [README](./README.md).

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
          { id: "1", left: "France", right: "Paris"  },
          { id: "2", left: "Japan",  right: "Tokyo"  },
          { id: "3", left: "Egypt",  right: "Cairo"  },
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
            { id: "l1", title: "The Cell",        status: "completed", xp: 50,  type: "reading", score: 92 },
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