# Luma — online learning landing page

A responsive marketing page for **Luma**, a fictional online-course platform, built from the Buzzvel FE Test 2026 design. It includes the sticky header, hero, course categories, featured course, how-it-works, testimonial and stats, people collage, contact form and closing CTA.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · `next/image` · `next/font`

## Requirements

- Node.js 20 or newer (developed and tested with Node 22.14 / npm 10)
- npm
- Internet access on the first install and build; `next/font` downloads Plus Jakarta Sans from Google Fonts at build time

## Install

From the repository root:

```bash
npm install
```

## Run in development

```bash
npm run dev
```

Open <http://localhost:3000>.

## Build and run in production

```bash
npm run build
npm run start
```

`npm run build` creates an optimized build with `/` prerendered as static content. `npm run start` serves it on port 3000; set `PORT` to use another port (e.g. `PORT=3100 npm run start`).

## Scripts

| Script          | What it does                                                                |
| --------------- | --------------------------------------------------------------------------- |
| `npm run dev`   | Starts the Next.js dev server with hot reload.                              |
| `npm run build` | Creates the optimized production build.                                     |
| `npm run start` | Serves the production build (run `build` first).                            |
| `npm run lint`  | Type-checks with `tsc --noEmit`. There is no ESLint config in this project. |

## Structure

```text
app/
  layout.tsx       Root layout: font, metadata, skip link
  page.tsx         Page composition (section order)
  globals.css      Tailwind v4 import, design tokens, focus and reduced-motion rules
components/
  Header.tsx       Sticky header and mobile disclosure menu (client component)
  Sections.tsx     Hero, Categories, Featured, HowItWorks, Testimonial,
                   People, Contact, FinalCta, Footer
  ContactForm.tsx  Client-validated form with a mocked submit (client component)
  PeopleMosaic.tsx Percentage-based photo collage
  ui.tsx           Container, Button, Eyebrow, Avatars, ArrowIcon
lib/data.ts        Typed mock content: nav, categories, steps, stats, footer, photos
public/images/     Hero, featured, avatar and people photos
.preview/          Ad-hoc headless-Chrome screenshot and measurement scripts used
                   during development; not part of the app or an automated test suite
```

## Key decisions

- **Desktop frame first, then fluid breakpoints.** The layout starts from the 1280 px design frame with 80 px side padding (`Container` max width 1280, `lg:px-20`) and adapts at the 640/768/1024/1280 breakpoints. A few elements (hero cards, collage) keep the exact measured geometry only at `xl` and above, where there is room for it.
- **Measured Figma geometry where available.** Section padding, the hero floating cards and the people collage use values taken from the design frame. The collage is defined in px inside a 530 × 522.44 frame in `lib/data.ts` and converted to percentages, so it scales without extra breakpoints.
- **Server components by default.** Only `Header` (menu state) and `ContactForm` (form state) are client components; the rest ships no JavaScript.
- **Design tokens in CSS.** Tailwind v4's `@theme` defines the palette (`brand`, `cream`, `ink`, `sun`, `peach`, `lemon`), used as normal utilities (`bg-brand`, `text-ink/60`).
- **Content is data.** Repeated content lives in `lib/data.ts`; section components stay presentational.
- **Images through `next/image`.** AVIF/WebP output is enabled, the hero is `priority`, responsive images declare `sizes`, and the collage uses `fill` with `object-cover`.
- **Accessibility:** skip link, a single `h1`, labeled landmarks, a visible focus ring, `aria-expanded`/`aria-controls` on the menu button, `aria-invalid` + `aria-describedby` on form fields, an `aria-live` status message, decorative images hidden from assistive technology, and transitions disabled under `prefers-reduced-motion`.
- **Contact form:** validates name, email and question on the client, shows inline errors, simulates a 700 ms request and resets on success. It has no backend.
- **Copy:** English throughout, including the contact form (the mobile mock showed Portuguese labels; English keeps the page consistent).

## Checks performed

- `npm run lint` (TypeScript) — passes.
- `npm run build` — passes with Next.js 15.5.29; `/` is prerendered as static content, 114 kB First Load JS.
- The production build was served with `npm start` and checked in headless Chrome 157 at **1440×900, 1280×800**, and **390×844 / 360×800** (mobile emulation): no horizontal overflow, all images loaded, and the expected navigation mode at each width (desktop nav at 1280/1440; menu button at 390/360).
- The mobile menu opens and closes and updates `aria-expanded`; the contact form shows three errors when submitted empty, shows the success message with valid input, and resets the fields.
- Full-page desktop and mobile screenshots were reviewed visually.
- **Not run:** Lighthouse, an automated accessibility audit, cross-browser testing (Chromium only), unit/E2E tests and visual-regression tests.

## AI tools used

- **DeepSeek Harness** (agentic coding assistant) — used as a supporting tool throughout development for design interpretation, implementation guidance, reviewing responsive layouts, refining spacing and geometry through headless-Chrome screenshots, and assisting with README documentation.
- **How the result was checked:** all generated files were reviewed, the project was type-checked and built for production, and the built page was exercised at desktop and mobile widths with real screenshots plus scripted checks of the mobile menu and contact form. The components are intentionally small and typed so the code can be explained line by line.

## Time spent

Approximately **10 hours** in total, spread across four half-day blocks: Friday afternoon, Monday morning, Monday afternoon and Tuesday afternoon. The last block covered final polish, the checks above and this README.
