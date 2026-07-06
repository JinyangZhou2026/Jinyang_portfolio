# shadcn Component Integration Notes

This workspace is currently a static HTML/CSS portfolio. It does not include a React framework, a shadcn project structure, Tailwind CSS, TypeScript, `components.json`, or npm dependencies.

## Current Project Status

- React / Next.js: not configured
- TypeScript: not configured
- Tailwind CSS: not configured
- shadcn/ui: not configured
- Default component path created: `/components/ui`
- Default style path in the current site: `/styles.css`
- Tailwind theme tokens added in `/tailwind.config.ts`: `background`, `foreground`, `muted`, `muted-foreground`, and `border`

The `/components/ui` folder is important because shadcn conventions and the `@/components/ui/...` import path expect reusable UI components to live there. Keeping this path avoids import churn when the static site is later migrated into a Next.js or shadcn app.

## Component Added

The provided component was copied to:

- `/components/ui/tubelight-navbar.tsx`
- `/components/ui/demo.tsx`
- `/components/ui/display-cards.tsx`
- `/components/ui/digital-serenity-animated-landing-page.tsx`
- `/components/ui/magic-text.tsx`
- `/components/ui/card-fan-carousel.tsx`

## Required Dependencies For A React/shadcn App

Install these after creating or migrating into a React/Next project:

```bash
npm install lucide-react framer-motion motion gsap clsx tailwind-merge
```

The component also requires:

- `next/link`, so it expects a Next.js app.
- `@/lib/utils` with a `cn` helper.
- Tailwind utility classes and shadcn theme tokens such as `bg-background`, `border-border`, `text-foreground`, `text-primary`, and `bg-muted`.

The reveal project category component uses `bg-background`, `text-foreground`, `text-muted-foreground`, and `border-foreground/10`. The included `tailwind.config.ts` maps those tokens to shadcn-style CSS variables.

The display cards component uses `lucide-react`, `@/lib/utils`, Tailwind utilities, and shadcn-style tokens including `bg-background`, `bg-muted`, `border-border`, `text-foreground`, and `text-muted-foreground`.

The digital serenity landing component uses React hooks only and Tailwind utility classes. It does not require external npm packages beyond React/Next/Tailwind.

The magic text component uses `motion/react`, so install the `motion` package before using `/components/ui/magic-text.tsx`.

The card fan carousel component uses React state/effects/refs and GSAP animation, so install `gsap` before using `/components/ui/card-fan-carousel.tsx`.

Add these variables to your global Tailwind CSS file in a real app:

```css
@layer base {
  :root {
    --background: 0 0% 98%;
    --foreground: 0 0% 2%;
    --muted: 0 0% 92%;
    --muted-foreground: 0 0% 45%;
    --border: 0 0% 85%;
  }

  .dark {
    --background: 0 0% 2%;
    --foreground: 0 0% 98%;
    --muted: 0 0% 12%;
    --muted-foreground: 0 0% 65%;
    --border: 0 0% 18%;
  }
}
```

## Setup Path If Starting From Scratch

```bash
npx create-next-app@latest portfolio --typescript --tailwind --eslint --app
cd portfolio
npx shadcn@latest init
npm install lucide-react framer-motion motion gsap clsx tailwind-merge
```

Then copy:

```text
components/ui/tubelight-navbar.tsx
components/ui/demo.tsx
components/ui/card-fan-carousel.tsx
```

into the same paths in the new app.

## Data / Props

The component expects an `items` array:

```tsx
[
  { name: "Home", url: "/", icon: Home },
  { name: "About", url: "/about", icon: User },
  { name: "Projects", url: "/work", icon: Briefcase },
  { name: "Resume", url: "/resume", icon: FileText },
]
```

The card fan carousel component expects a `cards` array:

```tsx
[
  {
    imgUrl: "/path-or-url/image.jpg",
    alt: "Descriptive image text",
    linkUrl: "https://example.com",
  },
]
```

`imgUrl` is required. `alt` and `linkUrl` are optional. When `linkUrl` is present, the card renders as a link and opens external URLs in a new tab.

## Responsive Behavior

- Desktop: fixed at top center, text labels visible.
- Mobile: fixed at bottom center, icon-only labels.
- Active tab is local component state and changes on click.

Card fan carousel responsive behavior:

- Up to 7 cards are visible in the fan at once.
- More than 7 cards enables previous/next controls and center-card pagination.
- Card spread scales down across mobile/tablet breakpoints.
- Vertical offsets also scale down when viewport height is constrained.
- Hovering a visible card lifts it and gently pushes neighboring cards aside.

## Current Static-Site Adaptation

Because this portfolio is not a React app yet, the visible website header has been updated with a CSS-only tubelight-inspired navigation treatment. It keeps the site working today while preserving the React component files for a future shadcn/Next migration.
