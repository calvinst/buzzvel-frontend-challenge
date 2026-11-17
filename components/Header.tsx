"use client";
import { useState } from "react";
import Link from "next/link";
import { navLinks } from "@/lib/data";
import { Button } from "./ui";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-cream/90 backdrop-blur">
      {/* 1280x70 frame: 80px side padding, 1px bottom border (69 + 1 = 70) */}
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-20">
        <div className="flex h-14 items-center justify-between md:h-16 lg:h-[69px]">
          <Link href="#top" className="text-xl font-extrabold tracking-tight">
            luma.
          </Link>
          <nav aria-label="Main" className="hidden gap-9 text-xs text-ink/70 md:flex">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-ink">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-5 md:flex">
            <Link href="#contact" className="text-xs text-ink/70 hover:text-ink">
              Log in
            </Link>
            <Button href="#courses" className="py-2! text-xs!">
              Start learning
            </Button>
          </div>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="grid size-10 place-items-center rounded-md md:hidden"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-black/5 bg-cream px-5 py-4 md:hidden">
          <ul className="flex flex-col gap-1">
            {[...navLinks, { label: "Log in", href: "#contact" }].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-3 text-sm font-medium"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button href="#courses" className="mt-2 w-full">
            Start learning
          </Button>
        </nav>
      )}
    </header>
  );
}
