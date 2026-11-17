import Image from "next/image";
import Link from "next/link";
import { categories, finalCtaAvatars, footerColumns, heroAvatars, stats, steps } from "@/lib/data";
import { ContactForm } from "./ContactForm";
import { PeopleMosaic } from "./PeopleMosaic";
import { ArrowIcon, Avatars, Button, Container, Eyebrow } from "./ui";

const h2 = "text-[32px] font-extrabold leading-[1.05] tracking-tight md:text-[40px]";

export function Hero() {
  return (
    <section id="top" className="overflow-x-clip bg-cream py-10 md:py-16 lg:py-25">
      {/* 1280x720 frame: 80px side padding (Container) and 100px top/bottom */}
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div className="relative order-1 mx-auto w-full max-w-125 lg:order-2 lg:mr-0 lg:ml-auto">
          {/* square peeking out on the right: 89x468 at (450, 24) of the 500x520 frame */}
          <div aria-hidden className="absolute left-[90%] top-[4.62%] h-[90%] w-[17.8%] rounded-2xl bg-[#FFCB9F]" />
          {/* circle at the bottom left: 106x106 at (-44.8, 403) */}
          <div
            aria-hidden
            className="absolute left-[-8.96%] top-[77.5%] aspect-square w-[21.2%] rounded-full bg-[#E2E8FF]"
          />
          <Image
            src="/images/hero.jpg"
            alt="A smiling learner with glasses working on a laptop in front of colorful sticky notes"
            width={500}
            height={520}
            priority
            sizes="(min-width:1024px) 500px, 90vw"
            className="relative aspect-500/520 w-full rounded-3xl object-cover"
          />
          {/* cards: from xl (the 1280 design width) they use the Figma geometry */}
          <p className="absolute -left-3 top-5 flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs shadow-md xl:-left-5.5 xl:top-4 xl:h-14 xl:w-53.25 xl:gap-3 xl:px-4 xl:py-3">
            <b className="shrink-0 rounded bg-indigo-100 px-1.5 py-0.5 text-brand">120+</b>
            <span>expert-led courses</span>
          </p>
          <p className="absolute -bottom-4 right-0 flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs shadow-md xl:bottom-auto xl:left-[348.2px] xl:right-auto xl:top-[436.5px] xl:h-12 xl:w-52.25 xl:px-4 xl:py-3">
            <span aria-hidden className="shrink-0 text-yellow-400">
              ★★★★★
            </span>
            <span>4.9 avg rating</span>
          </p>
        </div>
        <div className="order-2 lg:order-1">
          <Eyebrow>Learn at your own pace</Eyebrow>
          <h1 className="mt-5 text-[44px] font-extrabold leading-[1.02] tracking-tight md:text-[56px]">
            Build skills that actually move you forward.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/70 md:text-base">
            Practical courses taught by people who do the work every day. Learn design, technology, business and more —
            one focused lesson at a time.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="#courses">Explore courses</Button>
            <Button href="#how" variant="light">
              See how it works
            </Button>
          </div>
          <div className="mt-7 flex items-center gap-3 text-xs text-ink/60">
            <Avatars items={heroAvatars} />{" "}
            <span>
              <b className="text-ink">Trusted by 24,000+</b> learners
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function Categories() {
  return (
    <section id="courses" className="bg-white py-14 md:py-20 lg:py-25">
      <Container>
        <Eyebrow>Find your next skill</Eyebrow>
        <h2 className={`${h2} mt-4 max-w-md`}>Learn something worth knowing.</h2>
        <p className="mt-4 max-w-sm text-sm text-ink/60">
          Short, practical courses designed around skills you can put to work immediately.
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <li key={c.title}>
              <Link
                href="#featured"
                className="group flex h-full flex-col rounded-xl border border-black/10 p-6 transition-shadow hover:shadow-md"
              >
                <span className="w-fit rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-brand">
                  0{i + 1}
                </span>
                <h3 className="mt-6 text-lg font-bold">{c.title}</h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-ink/60">{c.text}</p>
                <span className="mt-8 flex items-center gap-2 text-xs font-bold">
                  Explore <ArrowIcon className="size-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function Featured() {
  return (
    <section id="featured" className="bg-brand py-14 text-white md:py-20 lg:py-25">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div className="relative">
          <span className="absolute -top-3 left-0 z-10 bg-lemon px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
            Featured course
          </span>
          <Image
            src="/images/featured.jpg"
            alt="Hands sketching product prototypes on a desk covered with design materials"
            width={640}
            height={480}
            sizes="(min-width:1024px) 600px, 90vw"
            className="aspect-4/3 w-full rounded-2xl object-cover"
          />
        </div>
        <div>
          <Eyebrow className="text-white/70">Most popular this month</Eyebrow>
          <h2 className={`${h2} mt-4 max-w-md`}>Designing products people understand.</h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/85">
            Learn how to turn complex workflows into simple, intentional product experiences through research, structure
            and thoughtful interaction design.
          </p>
          <p className="mt-5 text-xs text-white/85">with Maya Chen · Senior Product Designer</p>
          <ul className="mt-4 flex flex-wrap gap-2 text-xs">
            {["8 lessons", "2h 40min", "Intermediate"].map((t) => (
              <li key={t} className="rounded-md border border-white/40 px-3 py-1.5">
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Button href="#contact" variant="yellow">
              View course
            </Button>
            <Link href="#courses" className="flex items-center justify-center gap-2 text-xs font-semibold">
              Browse all courses <ArrowIcon />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className="py-14 md:py-20 lg:py-25">
      <Container>
        <Eyebrow className="text-center text-brand">How Luma works</Eyebrow>
        <h2 className={`${h2} mt-3 text-center`}>Less browsing. More learning.</h2>
        <ol className="relative mt-14 grid gap-10 md:grid-cols-3">
          <div aria-hidden className="absolute left-0 right-0 top-7 hidden h-px bg-black/10 md:block" />
          {steps.map((s, i) => (
            <li key={s.title} className="relative">
              <span aria-hidden className="relative mb-8 block size-14">
                <span className={s.bg} />
                <span className={s.dot} />
              </span>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink/50">Step 0{i + 1}</p>
              <h3 className="mt-2 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 max-w-xs text-xs leading-relaxed text-ink/60">{s.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

export function Testimonial() {
  return (
    <section className="bg-white py-14 md:py-20 lg:py-25">
      <Container className="grid gap-12 lg:grid-cols-2 lg:gap-24">
        <figure>
          <span aria-hidden className="text-5xl font-black leading-none text-brand">
            ”
          </span>
          <blockquote className="mt-2 max-w-lg text-2xl font-medium leading-snug tracking-tight">
            The lessons are short enough to fit into my week, but detailed enough that I actually leave with something I
            can use.
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3">
            <Avatars
              items={[{ src: "/images/avatars/avatar4.jpg", alt: "", initials: "AM", color: "bg-rose-300" }]}
              size="size-9"
            />
            <span className="text-xs">
              <b className="block text-sm">Alex Morgan</b>
              <span className="text-ink/60">Product Manager</span>
            </span>
          </figcaption>
        </figure>
        <dl className="grid gap-8 border-black/10 lg:border-l lg:pl-12">
          {stats.map((s) => (
            <div key={s.label}>
              <dd className="order-2 text-5xl font-extrabold tracking-tight text-brand md:text-6xl">{s.value}</dd>
              <dt className="mt-1 text-xs text-ink/60">{s.label}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

export function People() {
  return (
    <section id="people" className="py-14 md:py-20 lg:py-25">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-15">
        <div>
          <Eyebrow>The people</Eyebrow>
          <h2 className={`${h2} mt-4 max-w-sm`}>Meet international students &amp; teachers</h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/60">
            Morbi et egestas dignissim pharetra, sed amet. Tempus justo senectus risus ac vel, velit, nunc. Eget commodo
            eget in aliquam felis facilisi nec magna hendrerit. Placerat ipsum sit tellus urna, faucibus aenean lorem
            faucibus integer.
          </p>
          <Button href="#contact" variant="light" className="mt-6 w-full sm:w-auto">
            Explore teachers and students
          </Button>
        </div>
        <PeopleMosaic />
      </Container>
    </section>
  );
}

export function Contact() {
  const info = [
    { label: "Email", value: "contact@luma.com", href: "mailto:contact@luma.com", d: "M3 6h18v12H3zM3 7l9 6 9-6" },
    {
      label: "Response Time",
      value: "Up to 24 hours on business days",
      d: "M12 7v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18z",
    },
  ];
  return (
    <section id="contact" className="border-y border-black/10 bg-white py-14 md:py-20 lg:py-25">
      <Container className="grid gap-10 lg:grid-cols-2 lg:gap-24">
        <div>
          <Eyebrow>Contact</Eyebrow>
          <h2 className={`${h2} mt-4`}>Get in touch</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/60">
            Have a question? We’re here to help. Whether you’re looking for the right course, learning with your team or
            interested in teaching with Luma, we’d love to hear from you.
          </p>
          <ul className="mt-8 grid gap-3">
            {info.map((i) => (
              <li key={i.label} className="flex items-center gap-4 rounded-xl bg-cream p-4">
                <span className="grid size-9 place-items-center rounded-md bg-indigo-50 text-brand">
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={i.d} />
                  </svg>
                </span>
                <span className="text-xs">
                  <b className="block">{i.label}</b>
                  {i.href ? (
                    <a href={i.href} className="text-brand">
                      {i.value}
                    </a>
                  ) : (
                    <span className="text-ink/60">{i.value}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <ContactForm />
      </Container>
    </section>
  );
}

export function FinalCta() {
  // simple shapes (CSS only)
  const shapes = [
    // large outlined circle (top left)
    "left-6 top-6 size-[108px] rounded-full border-2 border-peach",
    // tilted outlined square
    "left-[25%] top-[9%] size-14 rotate-12 rounded-lg border-2 border-peach",
    // small outlined circle (top, right side)
    "left-[69%] top-[9%] size-8 rounded-full border-2 border-peach",
    // large square, cut off at the top right corner
    "-right-3 -top-4 size-[115px] rotate-12 rounded-lg bg-peach",
    // square cut off at the left edge
    "-left-6 top-1/2 size-14 rotate-12 rounded-lg bg-peach",
    // large circle, cut off at the bottom
    "-bottom-5 left-[4%] size-[120px] rounded-full bg-peach",
    // small outlined circle (bottom right) — 32x32, 2px border
    "bottom-2 right-[3%] size-8 rounded-full border-2 border-peach",
  ];

  // SVG icons (they inherit the color via currentColor)
  const svg = "pointer-events-none absolute hidden text-peach md:block";
  const outline = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const;

  return (
    <section className="relative overflow-hidden bg-sun py-16 text-center md:py-24 lg:py-25">
      {shapes.map((s) => (
        <span key={s} aria-hidden className={`absolute hidden md:block ${s}`} />
      ))}

      {/* droplet with rays */}
      <svg
        aria-hidden
        width="62"
        height="62"
        viewBox="0 0 62 62"
        fill="none"
        className={`${svg} left-[82%] top-[24%] w-15.5 -translate-x-1/2 -translate-y-1/2`}
      >
        <path
          d="M38.3601 40.4061C38.3601 35.8865 30.6881 28.1309 30.6881 28.1309C30.6881 28.1309 23.0161 35.8865 23.0161 40.4061C23.0161 44.9256 26.4509 48.5895 30.6881 48.5895C34.9254 48.5895 38.3601 44.9256 38.3601 40.4061Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M30.688 10.2295V20.4588" />
          <path d="M8.95068 19.1802L16.6227 26.8522" />
          <path d="M44.7534 26.8522L52.4254 19.1802" />
          <path d="M5.11475 43.4746H15.3441" />
          <path d="M46.032 43.4746H56.2613" />
        </g>
      </svg>

      {/* speech bubble */}
      <svg
        aria-hidden
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        className={`${svg} left-[12%] top-[49%] w-8 -translate-x-1/2 -translate-y-1/2`}
      >
        <path
          d="M16 29.3332C23.3637 29.3332 29.3333 23.3636 29.3333 15.9998C29.3333 8.63604 23.3637 2.6665 16 2.6665C8.63616 2.6665 2.66663 8.63604 2.66663 15.9998C2.66663 18.4284 3.31592 20.7053 4.45039 22.6665L3.33329 28.6665L9.33329 27.5494C11.2945 28.6838 13.5714 29.3332 16 29.3332Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* filled "B" */}
      <svg
        aria-hidden
        width="36"
        height="52"
        viewBox="0 0 36 52"
        fill="none"
        className={`${svg} bottom-[7%] left-[24%] w-9`}
      >
        <path
          d="M20.1069 25.9998L6.81589 22.4385L20.1069 25.9998ZM20.1069 25.9998C20.1069 25.9998 31.1827 28.9676 34.1505 17.8916C37.1183 6.81576 26.0425 3.84795 26.0425 3.84795L14.7451 0.820821C13.6441 0.525791 12.5123 1.17922 12.2173 2.28028L6.81589 22.4385L20.1069 25.9998ZM20.1069 25.9998C20.1069 25.9998 33.398 29.5612 30.1335 41.7444C26.8689 53.928 13.5779 50.3667 13.5779 50.3667L2.28047 47.3395C1.17941 47.0445 0.525956 45.9128 0.821012 44.8117L6.81589 22.4385"
          fill="currentColor"
        />
        <path
          d="M20.1069 25.9998C20.1069 25.9998 33.398 29.5612 30.1335 41.7444C26.8689 53.928 13.5779 50.3667 13.5779 50.3667L2.28047 47.3395C1.17941 47.0445 0.525956 45.9128 0.821012 44.8117L6.81589 22.4385M20.1069 25.9998L6.81589 22.4385L20.1069 25.9998ZM20.1069 25.9998C20.1069 25.9998 31.1827 28.9676 34.1505 17.8916C37.1183 6.81576 26.0425 3.84795 26.0425 3.84795L14.7451 0.820821C13.6441 0.525791 12.5123 1.17922 12.2173 2.28028L6.81589 22.4385L20.1069 25.9998Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>

      {/* wireframe cube */}
      <svg
        aria-hidden
        width="64"
        height="64"
        viewBox="48 48 64 64"
        fill="none"
        className={`${svg} left-[90%] top-[55%] w-16 -translate-x-1/2 -translate-y-1/2`}
      >
        <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M110 70V90" />
          <path d="M50 90V70" />
          <path d="M80 110V90" />
          <path d="M80 50V70" />
          <path d="M80 90L50 70L80 50L110 70L80 90Z" />
          <path d="M80 110L50 90L80 70L110 90L80 110Z" />
        </g>
      </svg>

      {/* double door icon */}
      <svg
        aria-hidden
        width="44"
        height="32"
        viewBox="2 8 44 32"
        fill="none"
        className={`${svg} left-[77%] top-[86%] w-11 -translate-x-1/2 -translate-y-1/2`}
      >
        <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="10" width="40" height="28" rx="1.2" />
          <path d="M20 10V38M28 10V38" />
        </g>
        <path
          d="M14 19.6976C14 18.8694 13.1736 18.3007 12.5012 18.7842C10.9865 19.8733 10 21.651 10 23.659C10 25.667 10.9865 27.4448 12.5012 28.5338C13.1736 29.0172 14 28.4488 14 27.6206C14 25.1126 14 22.7538 14 19.6976Z"
          fill="currentColor"
        />
        <path
          d="M34 19.6976C34 18.8694 34.8264 18.3007 35.4988 18.7842C37.0136 19.8733 38 21.651 38 23.659C38 25.667 37.0136 27.4448 35.4988 28.5338C34.8264 29.0172 34 28.4488 34 27.6206C34 25.1126 34 22.7538 34 19.6976Z"
          fill="currentColor"
        />
      </svg>

      <Container className="relative flex flex-col items-center">
        <Avatars items={finalCtaAvatars} size="size-8" />
        <h2 className="mt-6 max-w-xs text-4xl font-extrabold leading-tight tracking-tight md:max-w-none md:text-5xl">
          What will you learn next?
        </h2>
        <p className="mt-4 text-sm text-ink/70">Start with one course. Build from there.</p>
        <div className="mt-7 flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
          <Button href="#courses">Explore all courses</Button>
          <Button href="#contact" variant="light">
            Join Luma
          </Button>
        </div>
      </Container>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink py-12 pb-10 text-white md:py-16 lg:pt-20 lg:pb-10">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.2fr_repeat(3,1fr)] md:gap-6">
          <div className="max-md:col-span-full">
            <p className="text-xl font-extrabold">luma.</p>
            <p className="mt-2 max-w-45 text-xs text-white/60">Practical learning for curious people.</p>
          </div>
          {footerColumns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-[11px] font-semibold uppercase tracking-widest">{col.title}</p>
              <ul className="mt-4 grid gap-3 text-xs text-white/60">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link href="#top" className="hover:text-white">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="mt-12 border-t border-white/10 pt-6 text-[11px] text-white/60">© 2026 Luma Learning</p>
      </Container>
    </footer>
  );
}
