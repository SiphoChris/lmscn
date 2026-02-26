# lmscn — Component Reference

A collection of plug-and-play React learning components built on shadcn/ui and Tailwind CSS v4. Drop any component into your Next.js project and wire up an `onComplete` callback to integrate with your LMS backend.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Components](#components)
  - [Quiz](#quiz)
  - [Flashcards](#flashcards)
  - [Match](#match)
  - [Fill in the Blank](#fill-in-the-blank)
  - [Scramble](#scramble)
  - [Order](#order)
  - [Reading Passage](#reading-passage)
  - [Progress Tracker](#progress-tracker)
  - [Spaced Repetition](#spaced-repetition)
  - [Hotspot](#hotspot)
- [TypeScript Types Reference](#typescript-types-reference)

---

## Quick Start

Install the shadcn/ui primitives and the lmscn components you need:

```bash
# Install all required primitives at once
npx shadcn@latest add button card progress badge input scroll-area separator tooltip popover

# Add components via direct URL
npx shadcn@latest add https://lmscn.vercel.app/r/quiz.json
```

See the [Install Guide](./INSTALL.md) for per-component installation and Tailwind v4 configuration details.

---

## Components

### Quiz

A multi-question quiz supporting single-choice, multiple-choice, and true/false question types. Shows per-option explanations after answering, tracks score against a configurable passing threshold, and renders a results screen on completion.

```tsx
import { Quiz } from "@/components/lms/quiz"
import type { QuizData, QuizResult } from "@/components/lms/quiz"

const data: QuizData = {
  title: "JavaScript Basics",
  description: "Test your knowledge of JS fundamentals.",
  passingScore: 80,
  showExplanations: true,
  shuffle: false,
  questions: [
    {
      id: "q1",
      type: "single",
      question: "What does `typeof null` return?",
      options: [
        { id: "a", label: "null" },
        { id: "b", label: "object", explanation: "A historical quirk in the JS spec." },
        { id: "c", label: "undefined" },
      ],
      correctIds: ["b"],
      hint: "It's a well-known JavaScript oddity.",
    },
    {
      id: "q2",
      type: "multiple",
      question: "Which are falsy values in JavaScript?",
      options: [
        { id: "a", label: "0" },
        { id: "b", label: '""' },
        { id: "c", label: '"false"' },
        { id: "d", label: "null" },
      ],
      correctIds: ["a", "b", "d"],
      points: 2,
    },
  ],
}

export function MyQuiz() {
  return (
    <Quiz
      quizData={data}
      onComplete={(result: QuizResult) => {
        console.log(`${result.percentage}% — ${result.passed ? "Passed" : "Failed"}`)
      }}
    />
  )
}
```

#### Props — `QuizProps`

| Prop | Type | Required | Description |
|---|---|---|---|
| `quizData` | `QuizData` | ✓ | Quiz configuration and questions |
| `onComplete` | `(result: QuizResult) => void` | — | Called when the last question is answered |
| `className` | `string` | — | Additional CSS classes |

#### `QuizData`

| Field | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Displayed in the card header |
| `description` | `string` | — | Subtitle below the title |
| `questions` | `QuizQuestion[]` | — | List of questions |
| `showExplanations` | `boolean` | `true` | Show per-option explanations after answering |
| `shuffle` | `boolean` | `false` | Randomise question order |
| `passingScore` | `number` | `70` | Minimum percentage (0–100) to pass |

#### `QuizQuestion`

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier |
| `type` | `"single" \| "multiple" \| "true-false"` | Selection mode |
| `question` | `string` | The question text |
| `options` | `QuizOption[]` | Answer options |
| `correctIds` | `string[]` | IDs of the correct option(s) |
| `hint` | `string` | Optional hint shown before submitting |
| `points` | `number` | Point value (default: `1`) |

#### `QuizOption`

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier |
| `label` | `string` | Displayed text |
| `explanation` | `string` | Shown beneath the option after revealing the answer |

#### `QuizResult`

| Field | Type | Description |
|---|---|---|
| `score` | `number` | Total points earned |
| `maxScore` | `number` | Total points available |
| `percentage` | `number` | Score as a rounded percentage |
| `passed` | `boolean` | Whether `percentage >= passingScore` |
| `answers` | `Record<string, string[]>` | Map of question ID → selected option IDs |

---

### Flashcards

A flippable flashcard deck with optional spaced-repetition-style self-rating (Again / Hard / Good / Easy). Supports card tags, images on either face, shuffling, and shows a summary breakdown on completion.

```tsx
import { Flashcards } from "@/components/lms/flashcards"
import type { FlashcardsData, FlashcardsResult } from "@/components/lms/flashcards"

const data: FlashcardsData = {
  title: "Spanish Vocabulary",
  description: "Core greetings",
  shuffle: true,
  showRatings: true,
  cards: [
    { id: "1", front: "Hola",      back: "Hello",     tag: "Greetings" },
    { id: "2", front: "Gracias",   back: "Thank you", tag: "Greetings" },
    { id: "3", front: "Por favor", back: "Please",    tag: "Greetings" },
  ],
}

export function MyFlashcards() {
  return (
    <Flashcards
      flashcardsData={data}
      onComplete={(result: FlashcardsResult) => console.log(result.counts)}
    />
  )
}
```

#### Props — `FlashcardsProps`

| Prop | Type | Required | Description |
|---|---|---|---|
| `flashcardsData` | `FlashcardsData` | ✓ | Deck configuration |
| `onComplete` | `(result: FlashcardsResult) => void` | — | Called after the last card is rated |
| `className` | `string` | — | Additional CSS classes |

#### `FlashcardsData`

| Field | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Deck title |
| `description` | `string` | — | Subtitle |
| `cards` | `Flashcard[]` | — | The cards in the deck |
| `showRatings` | `boolean` | `true` | Show Again/Hard/Good/Easy buttons after flipping |
| `shuffle` | `boolean` | `false` | Randomise card order |

#### `Flashcard`

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier |
| `front` | `string` | Front face text |
| `back` | `string` | Back face text |
| `frontImage` | `string` | URL for an image on the front face |
| `backImage` | `string` | URL for an image on the back face |
| `tag` | `string` | Category badge shown on the front |

#### `FlashcardsResult`

| Field | Type | Description |
|---|---|---|
| `ratings` | `FlashcardRating[]` | Per-card difficulty ratings |
| `counts` | `Record<FlashcardDifficulty, number>` | Tally of Again / Hard / Good / Easy |

`FlashcardDifficulty` is `"again" | "hard" | "good" | "easy"`.

---

### Match

A two-column matching exercise. The learner clicks a term on the left, then its definition on the right. Correct pairs lock with a green highlight; incorrect pairs briefly flash red. Tracks mistakes and elapsed time.

```tsx
import { Match } from "@/components/lms/match"

export function MyMatch() {
  return (
    <Match
      matchData={{
        title: "Capital Cities",
        shuffle: true,
        pairs: [
          { id: "1", left: "France", right: "Paris" },
          { id: "2", left: "Japan",  right: "Tokyo" },
          { id: "3", left: "Egypt",  right: "Cairo" },
        ],
      }}
      onComplete={(result) => alert(`${result.mistakes} mistakes in ${result.durationMs}ms`)}
    />
  )
}
```

#### Props — `MatchProps`

| Prop | Type | Required | Description |
|---|---|---|---|
| `matchData` | `MatchData` | ✓ | Pairs configuration |
| `onComplete` | `(result: MatchResult) => void` | — | Called when all pairs are matched |
| `className` | `string` | — | Additional CSS classes |

#### `MatchData`

| Field | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Activity title |
| `description` | `string` | — | Subtitle |
| `pairs` | `MatchPair[]` | — | Term/definition pairs |
| `shuffle` | `boolean` | `true` | Randomise the right column |

#### `MatchPair`

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier |
| `left` | `string` | Term (left column) |
| `right` | `string` | Definition (right column) |
| `leftImage` | `string` | Optional image URL for the term |
| `rightImage` | `string` | Optional image URL for the definition |

#### `MatchResult`

| Field | Type | Description |
|---|---|---|
| `matched` | `MatchPair[]` | All pairs, in original order |
| `mistakes` | `number` | Count of incorrect pair attempts |
| `durationMs` | `number` | Time taken in milliseconds |

---

### Fill in the Blank

Sentence-based cloze exercises. Blanks are marked with `___` in the sentence string and rendered as inline text inputs. Supports multiple blanks per sentence, accepted alternatives, and shows corrections on wrong answers.

```tsx
import { FillBlank } from "@/components/lms/fill-blank"

export function MyFillBlank() {
  return (
    <FillBlank
      fillBlankData={{
        title: "Biology",
        showCorrection: true,
        questions: [
          {
            id: "q1",
            sentence: "The powerhouse of the cell is the ___.",
            answers: ["mitochondria"],
            alternatives: [["mitochondrion"]],
            hint: "It produces ATP.",
          },
          {
            id: "q2",
            sentence: "Water is made of ___ and ___.",
            answers: ["hydrogen", "oxygen"],
          },
        ],
      }}
      onComplete={(result) => console.log(result.percentage + "%")}
    />
  )
}
```

#### Props — `FillBlankProps`

| Prop | Type | Required | Description |
|---|---|---|---|
| `fillBlankData` | `FillBlankData` | ✓ | Questions configuration |
| `onComplete` | `(result: FillBlankResult) => void` | — | Called after the last question |
| `className` | `string` | — | Additional CSS classes |

#### `FillBlankData`

| Field | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Activity title |
| `description` | `string` | — | Subtitle |
| `questions` | `FillBlankQuestion[]` | — | List of cloze questions |
| `showCorrection` | `boolean` | `true` | Show correct answers on wrong submission |

#### `FillBlankQuestion`

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier |
| `sentence` | `string` | Sentence with blanks marked as `___` |
| `answers` | `string[]` | Correct answer for each blank, in order |
| `caseSensitive` | `boolean` | Case-sensitive matching (default: `false`) |
| `alternatives` | `Array<string[]>` | Per-blank list of accepted alternative answers |
| `hint` | `string` | Optional hint shown before submitting |

#### `FillBlankResult`

| Field | Type | Description |
|---|---|---|
| `attempts` | `FillBlankAttempt[]` | Per-question attempt records |
| `score` | `number` | Number of fully correct questions |
| `maxScore` | `number` | Total number of questions |
| `percentage` | `number` | Rounded score percentage |

---

### Scramble

Letter-unscrambling activity. A pool of shuffled letter tiles is presented; the learner taps tiles to build the answer. Supports image and text clues. Tiles can be reset and re-ordered.

```tsx
import { Scramble } from "@/components/lms/scramble"

export function MyScramble() {
  return (
    <Scramble
      scrambleData={{
        title: "Science Terms",
        questions: [
          { id: "1", answer: "photosynthesis", clue: "How plants make food" },
          { id: "2", answer: "mitochondria",   clue: "Powerhouse of the cell", clueImage: "/cell.png" },
        ],
      }}
      onComplete={(result) => console.log(result.percentage + "%")}
    />
  )
}
```

#### Props — `ScrambleProps`

| Prop | Type | Required | Description |
|---|---|---|---|
| `scrambleData` | `ScrambleData` | ✓ | Questions configuration |
| `onComplete` | `(result: ScrambleResult) => void` | — | Called after the last question |
| `className` | `string` | — | Additional CSS classes |

#### `ScrambleData`

| Field | Type | Description |
|---|---|---|
| `title` | `string` | Activity title |
| `description` | `string` | Subtitle |
| `questions` | `ScrambleQuestion[]` | List of scramble questions |

#### `ScrambleQuestion`

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier |
| `answer` | `string` | The correct word or phrase (spaces are stripped for tile generation) |
| `clue` | `string` | Context text shown above the tiles |
| `clueImage` | `string` | URL of an optional image clue |

#### `ScrambleResult`

| Field | Type | Description |
|---|---|---|
| `attempts` | `ScrambleAttempt[]` | Per-question attempt records |
| `score` | `number` | Number of correct answers |
| `maxScore` | `number` | Total number of questions |
| `percentage` | `number` | Rounded score percentage |

---

### Order

Drag-and-drop (or keyboard ↑↓) sequencing activity. Items are shuffled and the learner arranges them into the correct order. Shows the correct sequence after an incorrect submission.

```tsx
import { Order } from "@/components/lms/order"

export function MyOrder() {
  return (
    <Order
      orderData={{
        title: "Star Lifecycle",
        questions: [
          {
            id: "q1",
            prompt: "Order the stages of a star's life:",
            hint: "Starts with a cloud of gas and dust.",
            items: [
              { id: "1", label: "Nebula",        description: "A cloud of gas and dust" },
              { id: "2", label: "Protostar" },
              { id: "3", label: "Main Sequence" },
              { id: "4", label: "Red Giant" },
              { id: "5", label: "White Dwarf" },
            ],
          },
        ],
      }}
      onComplete={(result) => console.log(result.percentage + "%")}
    />
  )
}
```

#### Props — `OrderProps`

| Prop | Type | Required | Description |
|---|---|---|---|
| `orderData` | `OrderData` | ✓ | Questions configuration |
| `onComplete` | `(result: OrderResult) => void` | — | Called after the last question |
| `className` | `string` | — | Additional CSS classes |

#### `OrderData`

| Field | Type | Description |
|---|---|---|
| `title` | `string` | Activity title |
| `description` | `string` | Subtitle |
| `questions` | `OrderQuestion[]` | List of sequencing questions |

#### `OrderQuestion`

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier |
| `prompt` | `string` | Instruction shown above the list |
| `items` | `OrderItem[]` | Items listed **in the correct order** |
| `hint` | `string` | Optional hint shown before submitting |

#### `OrderItem`

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier |
| `label` | `string` | Primary label text |
| `description` | `string` | Optional sub-label shown below the main label |

#### `OrderResult`

| Field | Type | Description |
|---|---|---|
| `attempts` | `OrderAttempt[]` | Per-question attempt records |
| `score` | `number` | Number of correctly ordered questions |
| `maxScore` | `number` | Total number of questions |
| `percentage` | `number` | Rounded score percentage |

---

### Reading Passage

A three-phase reading comprehension component: the learner first reads the passage, then answers comprehension questions (with the passage optionally visible alongside), and finally sees a results summary. Supports plain text and HTML content.

```tsx
import { ReadingPassage } from "@/components/lms/reading-passage"

export function MyReading() {
  return (
    <ReadingPassage
      readingPassageData={{
        title: "The Water Cycle",
        introduction: "Learn how water moves through Earth's systems.",
        readingTimeMinutes: 3,
        hidePassageOnQuestions: false,
        content: `Solar energy drives evaporation, turning liquid water into vapour.
This rises, cools and condenses into clouds, falling as precipitation.`,
        questions: [
          {
            id: "q1",
            type: "single",
            question: "What drives the water cycle?",
            options: [
              { id: "a", label: "The Moon" },
              { id: "b", label: "Solar energy" },
            ],
            correctIds: ["b"],
            explanation: "The sun provides energy to evaporate water.",
          },
        ],
      }}
      onComplete={(result) => console.log(result.percentage + "%")}
    />
  )
}
```

#### Props — `ReadingPassageProps`

| Prop | Type | Required | Description |
|---|---|---|---|
| `readingPassageData` | `ReadingPassageData` | ✓ | Passage and questions configuration |
| `onComplete` | `(result: ReadingResult) => void` | — | Called after the last question |
| `className` | `string` | — | Additional CSS classes |

#### `ReadingPassageData`

| Field | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Passage title |
| `introduction` | `string` | — | Subtitle / introductory note |
| `content` | `string` | — | The reading text |
| `contentIsHtml` | `boolean` | `false` | Render content as HTML via `dangerouslySetInnerHTML` |
| `questions` | `ReadingQuestion[]` | — | Comprehension questions |
| `readingTimeMinutes` | `number` | — | Estimated read time shown as a badge |
| `hidePassageOnQuestions` | `boolean` | `false` | Hide the passage while answering questions |

#### `ReadingQuestion`

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier |
| `type` | `"single" \| "multiple" \| "true-false"` | Selection mode |
| `question` | `string` | The question text |
| `options` | `ReadingQuestionOption[]` | Answer options (`{ id, label }`) |
| `correctIds` | `string[]` | IDs of the correct option(s) |
| `explanation` | `string` | Shown after the question is answered |

#### `ReadingResult`

| Field | Type | Description |
|---|---|---|
| `answers` | `ReadingAnswer[]` | Per-question answer records |
| `score` | `number` | Number of correct answers |
| `maxScore` | `number` | Total number of questions |
| `percentage` | `number` | Rounded score percentage |

---

### Progress Tracker

A visual Duolingo-style learning path. Renders a zigzag sequence of lesson nodes with status indicators (completed, current, available, locked), XP progress, level, and streak. Hovering a node shows a tooltip with score and XP details.

```tsx
import { ProgressTracker } from "@/components/lms/progress-tracker"
import type { LessonNode } from "@/components/lms/progress-tracker"

export function MyProgress() {
  return (
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
              { id: "l2", title: "Cell Organelles",  status: "current",   xp: 100, type: "quiz" },
              { id: "l3", title: "Match Functions",  status: "locked",    xp: 75,  type: "match" },
            ],
          },
        ],
      }}
      onLessonSelect={(lesson: LessonNode) => console.log("Opening:", lesson.id)}
    />
  )
}
```

#### Props — `ProgressTrackerProps`

| Prop | Type | Required | Description |
|---|---|---|---|
| `progressTrackerData` | `ProgressTrackerData` | ✓ | Learner state and curriculum |
| `onLessonSelect` | `(lesson: LessonNode) => void` | — | Called when an available/current lesson is clicked |
| `className` | `string` | — | Additional CSS classes |

#### `ProgressTrackerData`

| Field | Type | Description |
|---|---|---|
| `learnerName` | `string` | Displayed in the header greeting |
| `totalXp` | `number` | Current XP total |
| `xpToNextLevel` | `number` | XP threshold for the next level |
| `level` | `number` | Current level |
| `streak` | `number` | Daily streak in days |
| `units` | `LearningUnit[]` | Curriculum units containing lessons |

#### `LessonNode`

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier |
| `title` | `string` | Displayed next to the node |
| `status` | `LessonStatus` | `"completed" \| "current" \| "available" \| "locked"` |
| `xp` | `number` | XP earned (completed) or on offer (future) |
| `type` | `LessonType` | Icon abbreviation shown inside the node |
| `score` | `number` | Score 0–100 if completed |

`LessonType` options: `"quiz" | "flashcards" | "match" | "reading" | "video" | "exercise" | "scramble" | "order" | "hotspot" | "spaced-repetition"`.

---

### Spaced Repetition

An SM-2 spaced-repetition review session. Cards flip on click; after revealing the answer the learner self-grades on a 4-point scale (Again / Hard / Good / Easy). The component computes the next review interval and ease factor and returns them in `onComplete`.

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
      onComplete={(result) => console.log("Hard cards:", result.hardCardIds)}
    />
  )
}
```

#### Props — `SpacedRepetitionProps`

| Prop | Type | Required | Description |
|---|---|---|---|
| `spacedRepetitionData` | `SpacedRepetitionData` | ✓ | Deck and due-card configuration |
| `onComplete` | `(result: SpacedRepetitionResult) => void` | — | Called after all due cards are graded |
| `className` | `string` | — | Additional CSS classes |

#### `SpacedRepetitionData`

| Field | Type | Description |
|---|---|---|
| `title` | `string` | Session title |
| `description` | `string` | Subtitle |
| `dueCards` | `ReviewCard[]` | Cards due for review in this session |
| `totalCards` | `number` | Total deck size (shown as context) |

#### `ReviewCard`

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier |
| `front` | `string` | Question side |
| `back` | `string` | Answer side |
| `tags` | `string[]` | Category badges shown on the front |
| `nextReviewDate` | `string` | ISO date string of the scheduled review |
| `interval` | `number` | Current interval in days |
| `easeFactor` | `number` | SM-2 ease factor (default: `2.5`) |

#### `SpacedRepetitionResult`

| Field | Type | Description |
|---|---|---|
| `sessions` | `ReviewSession[]` | Per-card review records with computed next interval and ease factor |
| `hardCardIds` | `string[]` | IDs of cards graded below 3 (need re-study) |

`ReviewGrade` is `0 | 1 | 2 | 3 | 4 | 5` (SM-2 quality scale). Grades below 3 reset the interval.

---

### Hotspot

Image-labelling activity. Hotspot markers are overlaid on an image at percentage-based coordinates; the learner clicks each marker and types the correct label into a popover input. Supports optional descriptions revealed after checking.

```tsx
import { Hotspot } from "@/components/lms/hotspot"

export function MyHotspot() {
  return (
    <Hotspot
      hotspotData={{
        title: "Heart Anatomy",
        questions: [
          {
            id: "q1",
            imageUrl: "/heart-diagram.png",
            imageAlt: "Diagram of the human heart",
            prompt: "Label the four chambers:",
            caseSensitive: false,
            points: [
              { id: "p1", x: 30, y: 40, label: "Left Ventricle",  description: "Pumps oxygenated blood to the body." },
              { id: "p2", x: 60, y: 40, label: "Right Ventricle", description: "Pumps blood to the lungs." },
              { id: "p3", x: 30, y: 20, label: "Left Atrium" },
              { id: "p4", x: 60, y: 20, label: "Right Atrium" },
            ],
          },
        ],
      }}
      onComplete={(result) => console.log(result.percentage + "% correct")}
    />
  )
}
```

#### Props — `HotspotProps`

| Prop | Type | Required | Description |
|---|---|---|---|
| `hotspotData` | `HotspotData` | ✓ | Questions and image configuration |
| `onComplete` | `(result: HotspotResult) => void` | — | Called after the last question |
| `className` | `string` | — | Additional CSS classes |

#### `HotspotData`

| Field | Type | Description |
|---|---|---|
| `title` | `string` | Activity title |
| `description` | `string` | Subtitle |
| `questions` | `HotspotQuestion[]` | List of hotspot questions |

#### `HotspotQuestion`

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier |
| `imageUrl` | `string` | URL of the background image |
| `imageAlt` | `string` | Alt text for the image |
| `prompt` | `string` | Instruction shown above the image |
| `points` | `HotspotPoint[]` | Marker definitions |
| `caseSensitive` | `boolean` | Case-sensitive label matching (default: `false`) |

#### `HotspotPoint`

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier |
| `x` | `number` | Horizontal position as a percentage from the left edge (0–100) |
| `y` | `number` | Vertical position as a percentage from the top edge (0–100) |
| `label` | `string` | The correct label the learner must type |
| `description` | `string` | Optional detail shown in the popover after a correct answer |

#### `HotspotResult`

| Field | Type | Description |
|---|---|---|
| `attempts` | `HotspotAttempt[]` | Per-question records with per-point answers and scores |
| `totalScore` | `number` | Total correct labels across all questions |
| `maxScore` | `number` | Total labels across all questions |
| `percentage` | `number` | Rounded score percentage |

---

## TypeScript Types Reference

All types are exported from their respective component files.

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