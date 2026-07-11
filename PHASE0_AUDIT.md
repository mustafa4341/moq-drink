# Phase 0: Discovery & Audit Report

## DISC-1: File/Component Inventory for 9 Target Sections

| Section | Component | Path |
|---------|-----------|------|
| Hero | Hero.tsx | `src/components/Hero.tsx` |
| Transition Sections | TransitionText.tsx | `src/components/TransitionText.tsx` |
| Product Section | InfiniteCarousel.tsx | `src/components/InfiniteCarousel.tsx` |
| Product Worlds | ProductWorlds.tsx | `src/components/ProductWorlds.tsx` |
| Story | Story.tsx | `src/components/Story.tsx` |
| Vision | Vision.tsx | `src/components/Vision.tsx` |
| Philosophy | Philosophy.tsx | `src/components/Philosophy.tsx` |
| Community | InstagramFeed.tsx | `src/components/InstagramFeed.tsx` |
| Footer | Footer.tsx | `src/components/Footer.tsx` |
| Page Assembly | page.tsx | `src/app/page.tsx` |
| Nav | Navbar.tsx | `src/components/Navbar.tsx` |
| Mood Finder | MoodFinderSection.tsx | `src/components/MoodFinderSection.tsx` (OUT OF SCOPE per spec §2) |
| Background | WorldBackground.tsx | `src/components/WorldBackground.tsx` (SHARED) |
| Loading | CinematicLoading.tsx | `src/components/CinematicLoading.tsx` (SHARED) |
| Scroll | SmoothScroll.tsx | `src/components/SmoothScroll.tsx` (SHARED) |

## DISC-2: File Manifest

| Path | Classification | Action | Spec ID(s) | Justification |
|------|---------------|--------|------------|---------------|
| `src/components/Hero.tsx` | Shared | Modified | HERO-1..5, PERF-3, PERF-7 | Remove mouse parallax on mobile, vh→dvh, clamp sizes |
| `src/components/TransitionText.tsx` | Shared | Modified | TRANS-1..3, PERF-9 | Reduce section height on mobile |
| `src/components/InfiniteCarousel.tsx` | Shared | Modified | PROD-1..4, GSAP-1 | Mobile renders grid instead of GSAP carousel |
| `src/components/ProductWorlds.tsx` | Shared | Modified | PWS-1..17 | Mobile renders bottom sheet instead of fullscreen worlds |
| `src/components/Story.tsx` | Shared | Modified | STORY-1..3, GSAP-2, GSAP-6 | Shorten sticky-scroll distance on mobile |
| `src/components/Vision.tsx` | Shared | Modified | PERF-7 | Ensure no layout animation props used |
| `src/components/Philosophy.tsx` | Shared | Modified | PHIL-1..4, GSAP-3 | Compact alternating cards on mobile |
| `src/components/InstagramFeed.tsx` | Shared | Modified | COMM-1..6 | Staggered masonry, reduce section height |
| `src/components/Footer.tsx` | Shared | Modified | FOOT-1..3 | Simplify decorative elements, ensure 44px tap targets |
| `src/components/Navbar.tsx` | Shared | Modified | PERF-10 | Add passive:true to scroll listener |
| `src/app/globals.css` | Shared | Modified | PERF-1, PERF-6, PERF-7, GSAP-6 | vh→dvh, will-change policy, prefers-reduced-motion |
| `src/app/layout.tsx` | Shared | Modified | PERF-2 | Verify font-display:swap, add preload |
| `src/app/page.tsx` | Shared | No change | — | Section assembly unchanged |
| `src/hooks/useIsMobile.ts` | Shared | No change | DISC-4 | Already uses matchMedia(767px) — correct |
| `src/lib/drinks.ts` | Mobile-only | No change | — | MoodFinder data, out of scope |
| `src/lib/mood-algorithm.ts` | Mobile-only | No change | — | MoodFinder algorithm, out of scope |
| `src/lib/animation/MotionConfig.ts` | Shared | Optional | GSAP-1 | May reference for quality profiles |
| `src/lib/animation/TimelineRegistry.ts` | Shared | Modified | GSAP-2 | Add gsap.context() wrapper guidance |
| `src/components/WorldBackground.tsx` | Shared | No change | — | Already mobile-aware, skips canvas on mobile |
| `src/components/CinematicLoading.tsx` | Shared | No change | — | Loading gate, out of scope |
| `src/components/MoodFinderSection.tsx` | Mobile-only | No change | — | Explicitly out of scope per spec §2 |
| `src/components/BottomSheet.tsx` | New | Created | PWS-2..10, ARCH-3, ARCH-7 | Shared bottom sheet component |
| `src/components/ui/Magnetic.tsx` | Shared | No change | — | Already responsive |
| `src/components/ui/CustomCursor.tsx` | Desktop-only | No change | — | Already hidden on mobile via CSS |

## DISC-3: GSAP Timeline / ScrollTrigger Inventory

| Instance | Component | File | Type | gsap.context()? | Cleanup? |
|----------|-----------|------|------|-----------------|---------|
| Infinite carousel autoplay tween | InfiniteCarousel | `src/components/InfiniteCarousel.tsx:236` | `gsap.to()` tween | ❌ No | ✅ Yes (kill on unmount) |
| Drag momentum glide | InfiniteCarousel | `src/components/InfiniteCarousel.tsx:307` | `gsap.to()` tween | ❌ No | ❌ No (fire-and-forget) |
| Drag reposition | InfiniteCarousel | `src/components/InfiniteCarousel.tsx:289,316` | `gsap.set()` | ❌ No | ❌ No (fire-and-forget) |
| Story main timeline | Story | `src/components/Story.tsx:92` | `gsap.timeline()` + ScrollTrigger | ❌ No | ✅ Partial (kill via TimelineRegistry, but no context revert) |
| Story initial states | Story | `src/components/Story.tsx:73-88` | `gsap.set()` × 8 | ❌ No | ❌ No (inline styles persist after unmount) |

**Baseline ScrollTrigger count: 1** (Story.tsx only)
**Baseline gsap.timeline count: 1** (Story.tsx only)

## DISC-4: Breakpoint Convention

**Confirmed:** `@media (max-width: 767px)` — used consistently via:
- `src/hooks/useIsMobile.ts`: `window.matchMedia("(max-width: 767px)")`
- `src/app/globals.css`: `@media (max-width: 767px)` mobile overrides
- No second breakpoint convention found — **reuse existing system** ✅

## DISC-5: Font Loading Setup

- Uses `next/font/google` in `src/app/layout.tsx`
- **Manrope** (variable `--font-manrope`): weights 400-800, subsets latin
- **Inter** (variable `--font-inter`): weights 400-900, subsets latin
- `next/font` defaults to `display: "swap"` — **implicitly active** but not explicit
- **No explicit preload config** on either font
- **Action needed (PERF-2):** Add explicit `display: "swap"` and `preload: true` to both font calls

## DISC-6: Baseline Lighthouse

Skipped — requires running browser. Noted for Phase 6 verification.
