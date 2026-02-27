"use client";

import { LmscnLogo } from "@/components/logo";
import Link from "next/link";
import { components } from "./data";
import { TAG_COLOR_MAP } from "./colours";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e8e8] font-mono antialiased">
      {/* Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap');
        body { font-family: 'DM Mono', monospace; }
        .font-serif-display { font-family: 'Instrument Serif', serif; }
      `}</style>

      <div className="max-w-[960px] mx-auto px-8 max-sm:px-5">
        {/* ── NAV ── */}
        <nav className="border-b border-[#1f1f1f] py-[18px]">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="font-serif-display text-[1.25rem] text-[#e8e8e8] no-underline tracking-[-0.01em]"
            >
              <LmscnLogo />
            </Link>
            <ul className="flex gap-6 list-none max-sm:gap-4">
              <li className="max-sm:hidden">
                <a
                  href="/docs"
                  className="text-[0.75rem] text-[#666] no-underline tracking-[0.04em] uppercase transition-colors hover:text-[#e8e8e8]"
                >
                  Docs
                </a>
              </li>
              <li className="max-sm:hidden">
                <a
                  href="/docs/installation"
                  className="text-[0.75rem] text-[#666] no-underline tracking-[0.04em] uppercase transition-colors hover:text-[#e8e8e8]"
                >
                  Install
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/SiphoChris/lmscn.git"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.75rem] text-[#666] no-underline tracking-[0.04em] uppercase transition-colors hover:text-[#e8e8e8]"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="py-24 border-b border-[#1f1f1f] max-sm:py-14">
          {/* Eyebrow */}
          <p className="flex items-center gap-[10px] text-[0.7rem] tracking-[0.12em] uppercase text-[#666] mb-6 before:content-[''] before:block before:w-6 before:h-px before:bg-[#666] before:shrink-0">
            shadcn/ui registry
          </p>

          <h1 className="font-serif-display text-[clamp(2.4rem,7vw,5.5rem)] leading-none tracking-[-0.02em] text-[#e8e8e8] max-w-[700px] max-sm:text-[clamp(2.2rem,11vw,3.2rem)]">
            Learning components,
            <br />
            <em className="not-italic text-[#888]">ready to ship.</em>
          </h1>

          <p className="mt-7 max-w-[480px] text-[0.82rem] leading-[1.8] text-[#666] max-sm:text-[0.78rem]">
            Interactive LMS components built on shadcn/ui and Tailwind v4. Fully
            typed, accessible, and wired up with{" "}
            <code className="text-[#aaa]">onComplete</code> callbacks. Drop them
            into your app and own the code.
          </p>

          <div className="mt-10 flex gap-3 flex-wrap max-sm:flex-col max-sm:items-stretch">
            <a
              href="/docs"
              className="inline-flex items-center gap-2 px-5 py-[10px] bg-[#e8e8e8] text-[#0a0a0a] text-[0.75rem] font-medium tracking-[0.04em] no-underline border-none cursor-pointer transition-opacity hover:opacity-85 whitespace-nowrap max-sm:justify-center max-sm:w-full"
            >
              Read the docs →
            </a>
            <a
              href="/docs/installation"
              className="inline-flex items-center gap-2 px-5 py-[10px] bg-transparent text-[#666] text-[0.75rem] tracking-[0.04em] no-underline border border-[#2e2e2e] transition-colors hover:text-[#e8e8e8] hover:border-[#444] whitespace-nowrap max-sm:justify-center max-sm:w-full"
            >
              Installation guide
            </a>
          </div>
        </section>

        {/* ── STATS ── */}
        <div className="flex border-t border-b border-[#1f1f1f] my-14 max-sm:flex-wrap max-sm:my-10 max-sm:border-b-0 max-md:flex-wrap">
          {[
            { num: "10", label: "Components" },
            { num: "v4", label: "Tailwind" },
            { num: "SM-2", label: "Spaced repetition" },
            { num: "MIT", label: "License" },
          ].map((s, i) => (
            <div
              key={s.label}
              className={[
                "flex-1 px-3 py-7",
                "border-r border-[#1f1f1f] last:border-r-0",
                // Mobile: 2-col grid
                "max-sm:basis-1/2 max-sm:shrink-0 max-sm:grow-0 max-sm:border-b max-sm:border-[#1f1f1f] max-sm:py-5 max-sm:px-2",
                i % 2 === 1 ? "max-sm:border-r-0" : "",
                // Tablet
                "max-md:basis-1/2 max-md:shrink-0 max-md:grow-0",
                i % 2 === 1 ? "max-md:border-r-0" : "",
                i >= 2 ? "max-md:border-t max-md:border-[#1f1f1f]" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="font-serif-display text-[2.4rem] leading-none text-[#e8e8e8] max-sm:text-[2rem]">
                {s.num}
              </div>
              <div className="text-[0.68rem] tracking-[0.08em] uppercase text-[#666] mt-1.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── SECTION HEADER ── */}
        <div className="flex items-baseline justify-between mb-5 pb-4 border-b border-[#1f1f1f]">
          <span className="text-[0.7rem] tracking-[0.1em] uppercase text-[#666]">
            Components
          </span>
          <span className="text-[0.7rem] text-[#2e2e2e]">
            {components.length} total
          </span>
        </div>

        {/* ── GRID ── */}
        <div className="grid grid-cols-2 gap-px bg-[#1f1f1f] border border-[#1f1f1f] max-sm:grid-cols-1">
          {components.map((c) => {
            const tagColors = TAG_COLOR_MAP[c.tag] || {
              bg: "transparent",
              color: "#666",
              border: "#333",
            };
            return (
              <a
                key={c.slug}
                href={`/docs/${c.slug}`}
                className="group bg-[#0a0a0a] p-7 flex flex-col gap-3 no-underline transition-colors hover:bg-[#111111] relative overflow-hidden max-sm:p-5"
              >
                {/* Arrow */}
                <span className="absolute right-6 top-7 text-[#2e2e2e] text-[0.9rem] transition-all group-hover:translate-x-1 group-hover:text-[#666] max-sm:right-5 max-sm:top-5">
                  →
                </span>

                <div className="text-[0.8rem] font-medium text-[#e8e8e8] tracking-[0.02em] pr-6">
                  {c.name}
                </div>
                <div className="text-[0.72rem] text-[#666] leading-[1.7]">
                  {c.description}
                </div>
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span
                    className="text-[0.62rem] tracking-[0.06em] uppercase px-2 py-[3px] border"
                    style={{
                      background: tagColors.bg,
                      color: tagColors.color,
                      borderColor: tagColors.border,
                    }}
                  >
                    {c.tag}
                  </span>
                  <span className="text-[0.62rem] text-[#2e2e2e]">
                    /{c.slug}
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        {/* ── INSTALL STRIP ── */}
        <div className="my-14 border border-[#1f1f1f] p-8 flex items-center justify-between gap-6 flex-wrap max-sm:flex-col max-sm:items-stretch max-sm:p-6 max-sm:my-10">
          <div>
            <div className="text-[0.7rem] tracking-[0.1em] uppercase text-[#666] mb-2.5">
              Get started
            </div>
            <div className="text-[0.8rem] text-[#e8e8e8] tracking-[0.01em] break-all max-sm:text-[0.72rem]">
              <span className="text-[#666]">npx shadcn@latest add </span>
              https://lmscn.vercel.app/r/quiz.json
            </div>
          </div>
          <a
            href="/docs/installation"
            className="inline-flex items-center gap-2 px-5 py-[10px] bg-transparent text-[#666] text-[0.75rem] tracking-[0.04em] no-underline border border-[#2e2e2e] transition-colors hover:text-[#e8e8e8] hover:border-[#444] whitespace-nowrap max-sm:justify-center"
          >
            All install commands →
          </a>
        </div>

        {/* ── FOOTER ── */}
        <footer className="border-t border-[#1f1f1f] py-7 mt-20 flex items-center justify-between flex-wrap gap-3 max-sm:flex-col max-sm:items-start max-sm:mt-12">
          <span className="text-[0.7rem] text-[#666]">
            © {new Date().getFullYear()} lmscn. Built with shadcn/ui.
          </span>
          <ul className="flex gap-5 list-none">
            <li>
              <a
                href="/docs"
                className="text-[0.7rem] text-[#666] no-underline transition-colors hover:text-[#e8e8e8]"
              >
                Docs
              </a>
            </li>
            <li>
              <a
                href="https://github.com/SiphoChris/lmscn.git"
                target="_blank"
                rel="noreferrer"
                className="text-[0.7rem] text-[#666] no-underline transition-colors hover:text-[#e8e8e8]"
              >
                GitHub
              </a>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  );
}
