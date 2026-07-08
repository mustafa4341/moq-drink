# Technology & Design System Bible
## MOQ Drink Website — Frontend Architecture, Motion Language & Design Tokens

This document serves as the absolute creative and technical checklist for the MOQ Drink digital experience. It ensures that every component is visually consistent, premium, and performant, matching the standards of Apple product launch pages.

---

## Library Division of Labor & Responsibilities

| Technology | Responsibility |
| :--- | :--- |
| **Next.js 15 + React 19** | Application architecture, routing, component structure, server-side/client-side separation. |
| **Tailwind CSS** | Design system, token variables, utility classes, and responsive layouts. |
| **GSAP + ScrollTrigger** | Scroll-based cinematic transitions, text reveal animations, timeline animations, and complex multi-layered scene changes. |
| **Lenis** | Smooth scrolling, scroll momentum management, and synchronizing ScrollTrigger. |
| **Framer Motion** | Simple UI micro-animations, buttons, card hover effects, and modal entrance/exit transitions. |
| **Next/Image** | Visual asset loading optimization, lazy loading, responsive scaling, and format conversions. |

---

## Design Tokens

### Radius
- `--radius-xs`: `8px`
- `--radius-sm`: `16px`
- `--radius-md`: `24px`
- `--radius-lg`: `32px`
- `--radius-xl`: `48px`

### Glass Blur
- `--glass-blur-sm`: `8px`
- `--glass-blur-md`: `14px`
- `--glass-blur-lg`: `24px`

### Shadows
- **Soft Shadow**: `rgba(0, 0, 0, 0.04) 0px 4px 20px`
- **Medium Shadow**: `rgba(0, 0, 0, 0.08) 0px 8px 30px`
- **Floating Shadow**: `rgba(0, 0, 0, 0.12) 0px 20px 40px -10px`
- **Glass Shadow**: `rgba(255, 255, 255, 0.1) 0px 4px 15px inset`

### Transition Durations
- **Fast**: `180ms` (Hover feedback)
- **Normal**: `300ms` (Standard UI animations)
- **Slow**: `600ms` (Enter/exit overlays)
- **Cinematic**: `1200ms` (Scene/story transitions)

### Easing Functions
- `easeOutExpo`: `cubic-bezier(0.16, 1, 0.3, 1)`
- `easeOutQuart`: `cubic-bezier(0.25, 1, 0.5, 1)`
- `easeInOutCubic`: `cubic-bezier(0.65, 0, 0.35, 1)`

---

## Motion Language

- **Organic & Non-Linear**: Every animation must use proper easing. Never animate linearly.
- **Controlled Complexity**: Never animate more than two properties simultaneously unless coordinate-aligned inside a GSAP timeline.
- **Physical Weight**: Movement should feel weighty. Objects accelerate slowly and decelerate naturally.
- **No Snapping**: Nothing should snap into place or suddenly flash onto the screen. Every enter/exit is eased.

---

## Scroll Rules

- **Viewport Bound**: Every section occupies exactly one viewport (`100vh`).
- **No Scroll Jumps**: Pinned sections must never cause scroll layout offsets or page jumps.
- **No Nested Scrollbars**: Ensure `overflow-y-hidden` is enforced on sub-containers.
- **Dynamic Refresh**: ScrollTrigger must refresh after all image assets have completed loading.
- **Momentum Sync**: Lenis momentum scrolling remains active globally.
- **Proportional Transitions**: Section transitions last approximately one viewport scroll distance.

---

## Component Architecture

```text
src/
  app/                     # Pages and root layout
  components/              # Reusable page components
    Hero/                  # Scene 1: Hero component
    ProductWorld/          # Scene 3: World components
    Story/                 # Scene 4: Short film component
    MoodFinder/            # Scene 6: Mood selector component
    Footer/                # Scene 9: Cinematic footer
    Navbar/                # Fixed editorial header
    shared/                # Common building blocks
      animations/          # Reusable GSAP/Framer animation curves
        fade.ts
        slide.ts
        reveal.ts
        parallax.ts
        floating.ts
        magnetic.ts
        textReveal.ts
        glass.ts
      hooks/               # Reusable state & scroll hooks
      lib/                 # Utility files & GSAP setup
      styles/              # Tailwind and CSS overrides
      constants/           # Page configurations
      tokens/              # Tailwind design variables
```

---

## Image & Asset Rules

- **No Upscaling**: Never stretch or upscale raster images.
- **Asset Formats**: Use transparent WebP or PNG format for product drink cups.
- **No Cropping**: Never crop the product straw, lids, or the edges of the cups.
- **Scaling**: Use `object-fit: contain` to preserve full product shapes.
- **Readability**: Ensure MOQ logo and typography readability are prioritized. Glass reflections/spotlights should never overlap or obscure the MOQ logo.

### Asset Pipeline
```text
public/
  assets/
    images/
      products/            # High-res transparent cup packs
      backgrounds/         # Scene backgrounds
      icons/               # Brand & UI SVGs
      textures/
        noise/             # Cinematic grain overlay
```

---

## Typography Scale

- **Hero Title**: `80px`
- **Section Title**: `56px`
- **Heading**: `42px`
- **Body**: `18px`
- **Small**: `14px`
- **Caption**: `12px`

---

## Accessibility

- **Reduced Motion**: Respect CSS `prefers-reduced-motion` media queries by disabling complex GSAP scrolls for sensitive users.
- **Contrast**: Maintain WCAG AA standard contrast levels.
- **Navigation**: Support full keyboard tab navigation with visible outline focus states.
- **Semantics**: Use HTML5 tags (`<main>`, `<header>`, `<section>`, `<footer>`) with meaningful `alt` text on images.

---

## Performance Budgets

- **Initial Javascript Bundle**: `<250KB`
- **Image optimization**: Use next/image WebP/AVIF output.
- **Web Fonts**: Use variable web fonts.
- **LCP (Largest Contentful Paint)**: `<2.0s`
- **CLS (Cumulative Layout Shift)**: `<0.05`
- **INP (Interaction to Next Paint)**: `<200ms`

---

## Design Philosophy

> [!NOTE]
> The user should never feel like scrolling through isolated layout blocks. 
> The user should feel like traveling through a single, continuous, breathing environment.
> Every scene is connected, every transition has a purpose, and every animation supports the brand's premium identity.

---

## Definition of Done (DoD)

The implementation of any scene is complete only if:
- [ ] **Lighthouse Speed Score**: `>95` on mobile and desktop.
- [ ] **Smoothness**: Stable `60 FPS` throughout all scroll stages.
- [ ] **No Layout Shifts**: Cumulative Layout Shift (CLS) is exactly `0`.
- [ ] **Visual Clarity**: Images remain crisp and properly sized without cropping.
- [ ] **Transitions**: All scene entries and exits feel cinematic and handcrafted.
- [ ] **Branding**: Every micro-interaction feels custom and reinforces MOQ Drink's premium identity.
- [ ] **Comparison**: The final experience feels closer to Apple's official product launch site than to a standard landing page.
