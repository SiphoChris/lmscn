export default function Home() {
  const components = [
    { name: "quiz",               description: "Multi-type quiz with scoring, explanations and pass/fail" },
    { name: "flashcards",         description: "3-D flip-cards with self-rating (Again / Hard / Good / Easy)" },
    { name: "match",              description: "Click-to-match term/definition pairs" },
    { name: "fill-blank",         description: "Inline fill-in-the-blank with multi-blank support" },
    { name: "scramble",           description: "Letter-tile word unscrambling" },
    { name: "order",              description: "Drag-and-drop / keyboard item sequencing" },
    { name: "reading-passage",    description: "Reading comprehension with inline questions" },
    { name: "progress-tracker",   description: "Gamified XP lesson map with streak + levels" },
    { name: "spaced-repetition",  description: "SM-2 algorithm review session" },
    { name: "hotspot",            description: "Click markers on diagrams and type labels" },
  ]

  return (
    <main className="max-w-3xl mx-auto px-6 py-16 space-y-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">lmscn</h1>
        <p className="mt-2 text-muted-foreground text-lg">
          A shadcn component registry for interactive LMS learning experiences.
          Built with Tailwind v4 + React 19.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {components.map((c) => (
          <div key={c.name} className="rounded-lg border p-4 space-y-1">
            <p className="font-mono font-semibold text-sm">{c.name}</p>
            <p className="text-sm text-muted-foreground">{c.description}</p>
            <code className="text-xs text-muted-foreground block pt-1">
              npx shadcn@latest add https://lmscn.vercel.app/r/{c.name}.json
            </code>
          </div>
        ))}
      </div>
    </main>
  )
}
