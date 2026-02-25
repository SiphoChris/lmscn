# lmscn

A collection of plug-and-play React LMS (Learning Management System) components built on top of shadcn/ui and Tailwind CSS v4. Drop interactive quizzes, flashcards, matching games, and more into your Next.js app in minutes.

---

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Components](#components)
  - [Quiz](#quiz)
  - [Flashcards](#flashcards)
  - [Match](#match)
  - [Fill in the Blank](#fill-in-the-blank)
  - [Word Scramble](#word-scramble)
  - [Order / Sequence](#order--sequence)
  - [Reading Passage](#reading-passage)
  - [Progress Tracker](#progress-tracker)
  - [Spaced Repetition](#spaced-repetition)
  - [Image Hotspot](#image-hotspot)
- [TypeScript Types Reference](#typescript-types-reference)

---

## Requirements

| Tool | Version |
|---|---|
| Next.js | 16 |
| React | 19 |
| Tailwind CSS | v4 |
| shadcn/ui | latest (new-york style) |

---

## Installation

### Step 1 — Install shadcn/ui primitives

lmscn reuses the shadcn/ui primitives already in your project. Install everything at once:

```bash
npx shadcn@latest add button card progress badge input scroll-area separator tooltip popover
```

Or install only what you need per component:

| Component | Required primitives |
|---|---|
| `quiz` | button, card, progress, badge |
| `flashcards` | button, card, progress, badge |
| `match` | button, progress, badge |
| `fill-blank` | button, input, progress, badge |
| `scramble` | button, progress, badge |
| `order` | button, progress, badge |
| `reading-passage` | button, card, badge, progress, scroll-area, separator |
| `progress-tracker` | badge, card, progress, tooltip |
| `spaced-repetition` | button, badge, card, progress |
| `hotspot` | button, badge, input, progress, popover |

### Step 2 — Install lmscn components

**Option A — Direct URL**

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

**Option B — Namespace (recommended for multiple components)**

Add this to your `components.json`:

```json
{
  "registries": {
    "@lmscn": "https://lmscn.vercel.app/r/{name}.json"
  }
}
```

Then install with short names:

```bash
npx shadcn@latest add @lmscn/quiz
npx shadcn@latest add @lmscn/flashcards
```

---

## Components

### Quiz

A multi-question quiz supporting `single`, `multiple`, and `true-false` question types. Features per-answer explanations, optional hints, per-question point weighting, a configurable passing score, optional question shuffle, and a completion callback with full results.

```tsx
import { Quiz } from "@/components/lms/quiz"
import type { QuizData, QuizResult } from "@/components/lms/quiz"

const data: QuizData = {
  title: "JavaScript Basics",
  description: "Test your JS fundamentals.", // optional
  passingScore: 80,       // percentage (0–100), default: 70
  showExplanations: true, // show per-option explanations after submit, default: true
  shuffle: true,          // randomise question order on mount, default: false
  questions: [
    {
      id: "q1",
      type: "single",           // "single" | "multiple" | "true-false"
      question: "What does `typeof null` return?",
      hint: "Think about legacy JS quirks.", // optional — shown before submit
      points: 2,                             // optional — default: 1
      options: [
        { id: "a", label: "null" },
        { id: "b", label: "object", explanation: "A historical quirk in the JS spec." },
        { id: "c", label: "undefined" },
      ],
      correctIds: ["b"],
    },
    {
      id: "q2",
      type: "multiple", // learner must select ALL correct options
      question: "Which are falsy values in JavaScript?",
      options: [
        { id: "a", label: "0" },
        { id: "b", label: "1" },
        { id: "c", label: '""' },
        { id: "d", label: "null" },
      ],
      correctIds: ["a", "c", "d"],
    },
  ],
}

<Quiz
  quizData={data}
  onComplete={(result: QuizResult) => console.log(result.percentage + "%")}
/>
```

#### `QuizProps`

| Prop | Type | Required | Description |
|---|---|---|---|
| `quizData` | `QuizData` | ✓ | Full quiz configuration |
| `onComplete` | `(result: QuizResult) => void` | — | Called when the learner finishes the last question |
| `className` | `string` | — | Extra CSS classes applied to the root `<Card>` |

#### `QuizData`

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `title` | `string` | ✓ | — | Displayed in the card header |
| `description` | `string` | — | — | Subtitle shown beneath the title |
| `questions` | `QuizQuestion[]` | ✓ | — | Array of question objects |
| `passingScore` | `number` | — | `70` | Percentage (0–100) required to pass |
| `showExplanations` | `boolean` | — | `true` | Show per-option explanations after submission |
| `shuffle` | `boolean` | — | `false` | Randomise question order on mount |

#### `QuizQuestion`

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | `string` | ✓ | — | Unique identifier |
| `type` | `"single" \| "multiple" \| "true-false"` | ✓ | — | Answer selection mode |
| `question` | `string` | ✓ | — | The question text |
| `options` | `QuizOption[]` | ✓ | — | Answer choices |
| `correctIds` | `string[]` | ✓ | — | IDs of the correct option(s) — must match the `id` fields in `options` |
| `hint` | `string` | — | — | Shown before submission as a contextual hint |
| `points` | `number` | — | `1` | Point value for this question — used to calculate `maxScore` |

#### `QuizOption`

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✓ | Unique identifier — referenced by `correctIds` |
| `label` | `string` | ✓ | Displayed answer text |
| `explanation` | `string` | — | Shown after submission when `showExplanations` is `true` |

#### `QuizResult` (returned via `onComplete`)

| Field | Type | Description |
|---|---|---|
| `score` | `number` | Points earned |
| `maxScore` | `number` | Total possible points — sum of all `question.points` values |
| `percentage` | `number` | `Math.round((score / maxScore) * 100)` |
| `passed` | `boolean` | `percentage >= passingScore` |
| `answers` | `Record<string, QuizOptionId[]>` | Map of question `id` → array of selected option IDs |

---

### Flashcards

A flip-card study set with optional shuffle, self-rated difficulty (easy / medium / hard), and a completion callback with per-difficulty tallies.

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

<Flashcards
  flashcardsData={data}
  onComplete={(result) => console.log(result.counts)}
/>
```

#### `FlashcardsData`

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | ✓ | Deck title |
| `shuffle` | `boolean` | — | Randomise card order on start |
| `cards` | `Flashcard[]` | ✓ | Array of card objects |

#### `Flashcard`

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✓ | Unique identifier |
| `front` | `string` | ✓ | Front face content |
| `back` | `string` | ✓ | Back face content |
| `tag` | `string` | — | Optional category label shown as a badge |

#### `FlashcardsResult` (returned via `onComplete`)

| Field | Type | Description |
|---|---|---|
| `counts` | `Record<FlashcardDifficulty, number>` | Tallies per difficulty rating |
| `ratings` | `FlashcardRating[]` | Per-card rating history |

> `FlashcardDifficulty` values: `"easy" | "medium" | "hard"`

---

### Match

A drag-and-drop (or click-to-match) pairing game. Users connect left-column terms to right-column definitions.

```tsx
import { Match } from "@/components/lms/match"

<Match
  matchData={{
    title: "Capital Cities",
    pairs: [
      { id: "1", left: "France", right: "Paris" },
      { id: "2", left: "Japan",  right: "Tokyo" },
      { id: "3", left: "Egypt",  right: "Cairo" },
    ],
  }}
  onComplete={(result) => alert(`${result.mistakes} mistakes`)}
/>
```

#### `MatchData`

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | ✓ | Activity title |
| `pairs` | `MatchPair[]` | ✓ | Left/right term pairs |

#### `MatchPair`

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✓ | Unique identifier |
| `left` | `string` | ✓ | Left-column term |
| `right` | `string` | ✓ | Right-column definition |

#### `MatchResult` (returned via `onComplete`)

| Field | Type | Description |
|---|---|---|
| `mistakes` | `number` | Number of incorrect pairings made |
| `time` | `number` | Time taken in seconds |

---

### Fill in the Blank

Sentence-completion exercises with typed answers. Supports multiple blanks per sentence and alternative accepted spellings.

```tsx
import { FillBlank } from "@/components/lms/fill-blank"

<FillBlank
  fillBlankData={{
    title: "Biology",
    questions: [
      {
        id: "q1",
        sentence: "The powerhouse of the cell is the ___.",
        answers: ["mitochondria"],
        alternatives: [["mitochondrion"]], // per-blank list of accepted alternatives
      },
    ],
  }}
  onComplete={(result) => console.log(result.percentage + "%")}
/>
```

#### `FillBlankData`

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | ✓ | Activity title |
| `questions` | `FillBlankQuestion[]` | ✓ | Array of questions |

#### `FillBlankQuestion`

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✓ | Unique identifier |
| `sentence` | `string` | ✓ | Sentence with `___` marking each blank |
| `answers` | `string[]` | ✓ | Primary correct answer for each blank — one entry per `___` |
| `alternatives` | `string[][]` | — | Additional accepted answers per blank — outer array maps to each `___` position |

#### `FillBlankResult` (returned via `onComplete`)

| Field | Type | Description |
|---|---|---|
| `score` | `number` | Number of correct blanks |
| `total` | `number` | Total number of blanks |
| `percentage` | `number` | Score as a percentage |
| `attempts` | `FillBlankAttempt[]` | Per-question attempt details |

---

### Word Scramble

Learners unscramble a jumbled word, optionally guided by a clue.

```tsx
import { Scramble } from "@/components/lms/scramble"

<Scramble
  scrambleData={{
    title: "Science Terms",
    questions: [
      { id: "1", answer: "photosynthesis", clue: "How plants make food" },
      { id: "2", answer: "mitochondria",   clue: "Powerhouse of the cell" },
    ],
  }}
/>
```

#### `ScrambleData`

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | ✓ | Activity title |
| `questions` | `ScrambleQuestion[]` | ✓ | Array of words to unscramble |

#### `ScrambleQuestion`

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✓ | Unique identifier |
| `answer` | `string` | ✓ | The correct word — scrambled automatically for display |
| `clue` | `string` | — | Optional hint shown to the learner |

#### `ScrambleResult` (returned via `onComplete`)

| Field | Type | Description |
|---|---|---|
| `score` | `number` | Correct answers |
| `total` | `number` | Total questions |
| `percentage` | `number` | Score as a percentage |
| `attempts` | `ScrambleAttempt[]` | Per-question attempt details |

---

### Order / Sequence

Learners drag items into the correct order. Great for timelines, processes, and step-by-step procedures.

```tsx
import { Order } from "@/components/lms/order"

<Order
  orderData={{
    title: "Star Lifecycle",
    questions: [
      {
        id: "q1",
        prompt: "Order the stages of a star's life:",
        items: [
          { id: "1", label: "Nebula" },
          { id: "2", label: "Protostar" },
          { id: "3", label: "Main Sequence" },
          { id: "4", label: "Red Giant" },
          { id: "5", label: "White Dwarf" },
        ],
      },
    ],
  }}
/>
```

#### `OrderData`

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | ✓ | Activity title |
| `questions` | `OrderQuestion[]` | ✓ | Array of ordering questions |

#### `OrderQuestion`

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✓ | Unique identifier |
| `prompt` | `string` | ✓ | Instruction shown to the learner |
| `items` | `OrderItem[]` | ✓ | Items to sort — **correct order is their array index position** |

#### `OrderItem`

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✓ | Unique identifier |
| `label` | `string` | ✓ | Display text |

#### `OrderResult` (returned via `onComplete`)

| Field | Type | Description |
|---|---|---|
| `score` | `number` | Correctly ordered questions |
| `total` | `number` | Total questions |
| `percentage` | `number` | Score as a percentage |
| `attempts` | `OrderAttempt[]` | Per-question attempt details |

---

### Reading Passage

A combined reading + comprehension component: displays a passage in a scroll area, then presents questions about it. Questions share the same shape as `QuizQuestion`.

```tsx
import { ReadingPassage } from "@/components/lms/reading-passage"

<ReadingPassage
  readingPassageData={{
    title: "The Water Cycle",
    content: `Solar energy drives evaporation, turning liquid water into vapour.
This rises, cools and condenses into clouds, falling as precipitation.`,
    questions: [
      {
        id: "q1",
        type: "single",
        question: "What drives the water cycle?",
        options: [
          { id: "a", label: "Moon" },
          { id: "b", label: "Solar energy" },
        ],
        correctIds: ["b"],
        explanation: "The sun provides energy to evaporate water.",
      },
    ],
  }}
/>
```

#### `ReadingPassageData`

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | ✓ | Passage title |
| `content` | `string` | ✓ | The reading text — `\n` newlines are rendered as line breaks |
| `questions` | `ReadingQuestion[]` | ✓ | Comprehension questions |

> `ReadingQuestion` has the same shape as `QuizQuestion` — see the [Quiz](#quiz) section for the full field list.

#### `ReadingResult` (returned via `onComplete`)

| Field | Type | Description |
|---|---|---|
| `score` | `number` | Correct answers |
| `total` | `number` | Total questions |
| `percentage` | `number` | Score as a percentage |
| `answers` | `ReadingAnswer[]` | Per-question answer details |

---

### Progress Tracker

A visual course-map showing units and lessons with status, XP, streaks, and level progression.

```tsx
import { ProgressTracker } from "@/components/lms/progress-tracker"
import type { LessonNode } from "@/components/lms/progress-tracker"

<ProgressTracker
  progressTrackerData={{
    learnerName: "Alex",
    totalXp: 340,
    xpToNextLevel: 500,
    level: 4,
    streak: 7,
    units: [
      {
        id: "u1",
        title: "Biology Unit 1",
        lessons: [
          { id: "l1", title: "The Cell",        status: "completed", xp: 50,  type: "reading", score: 92 },
          { id: "l2", title: "Cell Organelles", status: "current",   xp: 100, type: "quiz" },
          { id: "l3", title: "Match Functions", status: "locked",    xp: 75,  type: "match" },
        ],
      },
    ],
  }}
  onLessonSelect={(lesson: LessonNode) => console.log("Opening:", lesson.id)}
/>
```

#### `ProgressTrackerData`

| Field | Type | Required | Description |
|---|---|---|---|
| `learnerName` | `string` | ✓ | Displayed in the header |
| `totalXp` | `number` | ✓ | Learner's current XP total |
| `xpToNextLevel` | `number` | ✓ | XP required to reach the next level |
| `level` | `number` | ✓ | Current level |
| `streak` | `number` | ✓ | Current daily streak count |
| `units` | `LearningUnit[]` | ✓ | Course units |

#### `LearningUnit`

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✓ | Unique identifier |
| `title` | `string` | ✓ | Unit display name |
| `lessons` | `LessonNode[]` | ✓ | Lessons within this unit |

#### `LessonNode`

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✓ | Unique identifier |
| `title` | `string` | ✓ | Lesson display name |
| `status` | `LessonStatus` | ✓ | `"completed"`, `"current"`, or `"locked"` |
| `xp` | `number` | ✓ | XP awarded on completion |
| `type` | `LessonType` | ✓ | `"quiz"`, `"reading"`, `"match"`, etc. |
| `score` | `number` | — | Score percentage (for completed lessons) |

---

### Spaced Repetition

An SM-2-style flashcard review queue. Cards are shown based on their due interval and ease factor; learners rate recall quality (0–5) to schedule the next review.

```tsx
import { SpacedRepetition } from "@/components/lms/spaced-repetition"

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
  onComplete={(result) => console.log("Sessions:", result.sessions)}
/>
```

#### `SpacedRepetitionData`

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | ✓ | Deck title |
| `totalCards` | `number` | ✓ | Total cards in the deck (used for progress display) |
| `dueCards` | `ReviewCard[]` | ✓ | Cards due for review today |

#### `ReviewCard`

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✓ | Unique identifier |
| `front` | `string` | ✓ | Front face content |
| `back` | `string` | ✓ | Back face content |
| `interval` | `number` | ✓ | Current review interval in days |
| `easeFactor` | `number` | ✓ | SM-2 ease factor — typically `1.3`–`2.5+` |

#### `SpacedRepetitionResult` (returned via `onComplete`)

| Field | Type | Description |
|---|---|---|
| `sessions` | `ReviewSession[]` | Per-card session data including updated intervals |

> `ReviewGrade` is a number `0`–`5` following the SM-2 quality scale.

---

### Image Hotspot

Interactive image-based questions where learners identify and label points on a diagram or photograph.

```tsx
import { Hotspot } from "@/components/lms/hotspot"

<Hotspot
  hotspotData={{
    title: "Heart Anatomy",
    questions: [
      {
        id: "q1",
        imageUrl: "/heart-diagram.png",
        imageAlt: "Diagram of the human heart",
        prompt: "Label the four chambers:",
        points: [
          { id: "p1", x: 30, y: 40, label: "Left Ventricle",  description: "Pumps blood to the body." },
          { id: "p2", x: 60, y: 40, label: "Right Ventricle", description: "Pumps blood to the lungs." },
          { id: "p3", x: 30, y: 20, label: "Left Atrium" },
          { id: "p4", x: 60, y: 20, label: "Right Atrium" },
        ],
      },
    ],
  }}
  onComplete={(result) => console.log(result.percentage + "% correct")}
/>
```

#### `HotspotData`

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | ✓ | Activity title |
| `questions` | `HotspotQuestion[]` | ✓ | Array of image questions |

#### `HotspotQuestion`

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✓ | Unique identifier |
| `imageUrl` | `string` | ✓ | Path or URL to the image |
| `imageAlt` | `string` | ✓ | Accessible alt text |
| `prompt` | `string` | ✓ | Instruction shown to the learner |
| `points` | `HotspotPoint[]` | ✓ | Labelled regions on the image |

#### `HotspotPoint`

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✓ | Unique identifier |
| `x` | `number` | ✓ | Horizontal position as a percentage (`0`–`100`) |
| `y` | `number` | ✓ | Vertical position as a percentage (`0`–`100`) |
| `label` | `string` | ✓ | The correct label for this point |
| `description` | `string` | — | Extra info shown after the learner identifies the point |

#### `HotspotResult` (returned via `onComplete`)

| Field | Type | Description |
|---|---|---|
| `score` | `number` | Correctly identified points |
| `total` | `number` | Total points |
| `percentage` | `number` | Score as a percentage |
| `attempts` | `HotspotAttempt[]` | Per-point attempt details |

---

## TypeScript Types Reference

All types are exported directly from their component file:

```ts
// Quiz
import type {
  QuizData,
  QuizQuestion,
  QuizOption,
  QuizOptionId,
  QuizQuestionType,  // "single" | "multiple" | "true-false"
  QuizResult,
  QuizProps,
} from "@/components/lms/quiz"

// Flashcards
import type {
  FlashcardsData,
  Flashcard,
  FlashcardDifficulty, // "easy" | "medium" | "hard"
  FlashcardRating,
  FlashcardsResult,
  FlashcardsProps,
} from "@/components/lms/flashcards"

// Match
import type { MatchData, MatchPair, MatchResult, MatchProps } from "@/components/lms/match"

// Fill in the Blank
import type {
  FillBlankData,
  FillBlankQuestion,
  FillBlankAttempt,
  FillBlankResult,
  FillBlankProps,
} from "@/components/lms/fill-blank"

// Word Scramble
import type {
  ScrambleData,
  ScrambleQuestion,
  ScrambleAttempt,
  ScrambleResult,
  ScrambleProps,
} from "@/components/lms/scramble"

// Order / Sequence
import type {
  OrderData,
  OrderQuestion,
  OrderItem,
  OrderAttempt,
  OrderResult,
  OrderProps,
} from "@/components/lms/order"

// Reading Passage
import type {
  ReadingPassageData,
  ReadingQuestion,
  ReadingAnswer,
  ReadingResult,
  ReadingPassageProps,
} from "@/components/lms/reading-passage"

// Progress Tracker
import type {
  ProgressTrackerData,
  LearningUnit,
  LessonNode,
  LessonStatus,  // "completed" | "current" | "locked"
  LessonType,
  ProgressTrackerProps,
} from "@/components/lms/progress-tracker"

// Spaced Repetition
import type {
  SpacedRepetitionData,
  ReviewCard,
  ReviewGrade,   // 0 | 1 | 2 | 3 | 4 | 5
  ReviewSession,
  SpacedRepetitionResult,
  SpacedRepetitionProps,
} from "@/components/lms/spaced-repetition"

// Image Hotspot
import type {
  HotspotData,
  HotspotQuestion,
  HotspotPoint,
  HotspotAttempt,
  HotspotResult,
  HotspotProps,
} from "@/components/lms/hotspot"
```