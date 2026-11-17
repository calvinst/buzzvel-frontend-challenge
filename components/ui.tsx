import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function ArrowIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  // 1280px design frame with 80px side padding => 1120px of content.
  return <div className={`mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-20 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, className = "text-brand" }: { children: ReactNode; className?: string }) {
  return <p className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${className}`}>{children}</p>;
}

type ButtonProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "light" | "yellow";
  className?: string;
};
const variants = {
  primary: "bg-brand text-white hover:bg-[#2340d8]",
  light: "bg-white text-ink shadow-sm ring-1 ring-black/5 hover:bg-neutral-50",
  yellow: "bg-lemon text-ink hover:bg-[#ffe04d]",
};
export function Button({ children, href, variant = "primary", className = "" }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

type Avatar = { src?: string; alt?: string; initials: string; color: string };

export function Avatars({ items, size = "size-6" }: { items: Avatar[]; size?: string }) {
  return (
    <div className="flex -space-x-2" aria-hidden>
      {items.map((a) =>
        a.src ? (
          <Image
            key={a.src}
            src={a.src}
            alt={a.alt ?? ""}
            width={80}
            height={80}
            className={`${size} rounded-full object-cover ring-2 ring-cream`}
          />
        ) : (
          <span
            key={a.initials}
            className={`${size} ${a.color} grid place-items-center rounded-full text-[9px] font-bold text-ink ring-2 ring-cream`}
          >
            {a.initials}
          </span>
        ),
      )}
    </div>
  );
}
