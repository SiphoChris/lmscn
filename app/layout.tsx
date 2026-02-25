import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "lmscn — LMS Component Registry",
  description: "A shadcn registry of type-safe LMS learning components",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
