# MOQ Drink — Interactive Digital Experience

> This is NOT a website. This is a cinematic world the user enters after scanning a QR code.
> Every scroll reveals a new **scene** of the same world — not a new section of a page.

---

## Philosophy

The user scans a QR code → a white portal opens → clouds form → they enter the MOQ universe.
From that moment, they never leave this world. They simply travel deeper into it.

**Sections → Scenes**
**Navigation → Journey**
**Scrolling → Traveling**

---

## Architecture Overview

```
Scene 0: Cinematic Loading (Cloud → Island → Hero)
Scene 1: Hero (The Arrival)
  ↓ Transition: "Every flavor has its own world."
Scene 2: Flavor Collection (The Gallery)
  ↓ Transition: "Enter the worlds."
Scene 3: Drink Worlds (The Journey — 4 immersive worlds)
  ↓ Transition: "How it all began..."
Scene 4: Story (The Origin — full-screen scroll narrative)
  ↓ Transition: "We don't make drinks. We create moods."
Scene 5: Vision (The Statement)
  ↓ Transition: "What do you feel today?"
Scene 6: Mood Finder (The Heart — cloud gateway)
Scene 7: Philosophy (The Soul)
  ↓ Transition: "Join the world."
Scene 8: Instagram (The Community)
Scene 9: Footer (The Sunset — cinematic ending)
```

**Persistent layers beneath all scenes:**
- 11-layer animated background system
- Custom MOQ cursor
- Optional ambient sound
- Smooth scroll (Lenis)

---

## 1. Background System — 11 Layers

The entire experience sits on top of a living, breathing background. These layers are **always present** and shift as the user scrolls through scenes.

| Layer | Element | Animation | Scroll Behavior |
|-------|---------|-----------|----------------|
| 0 | Base sky gradient | Linear interpolation | Morning → Midday → Afternoon → Golden Hour → Sunset |
| 1 | Cloud Layer 1 (far) | `translateX`, 55s linear loop | Opacity fades during Drink Worlds |
| 2 | Cloud Layer 2 (mid) | `translateX`, 40s linear loop | Slight parallax on scroll |
| 3 | Cloud Layer 3 (near) | `translateX`, 28s linear loop | Stronger parallax on scroll |
| 4 | Sun Rays | Radial gradient, subtle pulse | Moves from top-center to top-right as scroll progresses |
| 5 | Noise texture | CSS `background-image` grain overlay | Static, `opacity: 0.03` |
| 6 | Particles | Canvas — 40 rising dots | Continuous upward float |
| 7 | Light Bloom | Radial `mix-blend-screen` | Shifts warm/cool with scroll progress |
| 8 | Water Reflection | Bottom gradient + ripple animation | Visible mainly in Hero and Footer scenes |
| 9 | Leaves | SVG leaves with `drift-leaves` animation | 6–8 leaves, 18s cycle, random positions |
| 10 | Mist/Fog | Horizontal gradient bands, `blur-3xl` | Fades in during transitions, out during scenes |
| 11 | Ambient Glow | Soft radial glow following scroll position | Color shifts to match current scene |

#### [MODIFY] [FloatingBackground.tsx](file:///c:/Users/mmust/Desktop/Moq%20Drink/src/components/FloatingBackground.tsx)
- Rebuild as `WorldBackground.tsx` with all 11 layers
- Each layer is a separate `<div>` or `<canvas>` with its own z-index
- Scroll-linked color interpolation drives layers 0, 4, 7, 11
- Cloud layers use CSS `@keyframes` for performance
- Leaves use SVG `<path>` elements with CSS animation
- Noise uses a tiny repeating PNG or CSS `filter: url(#noise)`
- Mist layers pulse opacity during scene transitions

#### [NEW] `public/images/noise.png`
- 200×200 repeating noise texture for grain overlay

---

## 2. Typography System

Strict typographic scale — no ad-hoc sizes anywhere.

| Role | Desktop | Tablet | Mobile | Weight | Tracking | Line Height |
|------|---------|--------|--------|--------|----------|-------------|
| Scene Title (Hero) | 96px (6rem) | 64px (4rem) | 42px (2.625rem) | 900 (Black) | -0.04em | 0.85 |
| Scene Title (Other) | 72px (4.5rem) | 56px (3.5rem) | 36px (2.25rem) | 900 | -0.03em | 0.90 |
| Scene Subtitle | 18px | 16px | 14px | 700 | 0.01em | 1.6 |
| Label/Tag | 10px | 10px | 9px | 900 | 0.25em | 1.0 |
| Body | 16px | 15px | 14px | 600 | 0.005em | 1.7 |
| Button | 11px | 11px | 10px | 900 | 0.2em | 1.0 |
| Card Title | 16px | 15px | 14px | 900 | 0.1em | 1.1 |
| Card Body | 12px | 12px | 11px | 600 | 0.01em | 1.5 |

#### [MODIFY] [globals.css](file:///c:/Users/mmust/Desktop/Moq%20Drink/src/app/globals.css)
- Add `@theme` tokens for all type sizes
- Define responsive utility classes: `.type-hero`, `.type-scene-title`, `.type-label`, etc.
- Each class includes `font-size`, `font-weight`, `letter-spacing`, `line-height` with responsive breakpoints

---

## 3. Animation Timing Rules

Every animation in the experience follows strict timing rules:

| Type | Duration | Easing | Notes |
|------|----------|--------|-------|
| Hover (lift, glow) | 250ms | `cubic-bezier(.22,.61,.36,1)` | Snappy, responsive |
| Scroll reveal | 800ms | `cubic-bezier(.16,1,.3,1)` | Smooth entrance |
| Content reveal (text/images) | 1000ms | `cubic-bezier(.16,1,.3,1)` | Staggered, dramatic |
| Parallax | Continuous | Spring `stiffness: 60, damping: 18` | Never stops |
| Float (products) | 6s | `ease-in-out` | Infinite, gentle |
| Cloud drift | 35s | `linear` | Infinite loop |
| Leaf drift | 18s | `ease-in-out` | Random delay per leaf |
| Reflection sweep | 3s | `ease-in-out` | On hover only |
| Scene transition text | 1200ms | `cubic-bezier(.76,0,.24,1)` | Dramatic in/out |
| Loading sequence | 3000ms total | Staged | 5 stages, each 600ms |
| Mood Finder loading | 2500ms | Staged | Liquid → particles → glow → reveal |

#### [MODIFY] [globals.css](file:///c:/Users/mmust/Desktop/Moq%20Drink/src/app/globals.css)
- Define all timing tokens as CSS custom properties
- `--duration-hover: 250ms`, `--duration-reveal: 1000ms`, etc.
- All components reference these tokens — no hardcoded durations

---

## 4. Scene 0 — Cinematic Loading Sequence

> QR → White → Clouds → Logo → Camera enters clouds → Island appears → Drink floats down → Hero

This replaces the current `EntranceAnimation` with a 5-stage cinematic sequence:

| Stage | Duration | Visual |
|-------|----------|--------|
| 0 (0–600ms) | White screen, soft noise grain | Blank canvas |
| 1 (600–1200ms) | Cloud layers fade in from edges | Atmosphere building |
| 2 (1200–2000ms) | MOQ logo materializes in center | Brand reveal |
| 3 (2000–2600ms) | Camera "zooms" forward — clouds rush outward, logo scales up and fades | Entering the world |
| 4 (2600–3200ms) | Island + drink fade in from below, clouds settle | The arrival |

#### [MODIFY] [EntranceAnimation.tsx](file:///c:/Users/mmust/Desktop/Moq%20Drink/src/components/EntranceAnimation.tsx)
- Rewrite as `CinematicLoading.tsx`
- 5-stage state machine with Framer Motion `AnimatePresence`
- Cloud layers: 3 blurred gradient divs that animate `scale`, `opacity`, `x`, `y`
- Logo: Framer Motion `spring` entrance → scale exit
- Camera forward: All cloud layers `scale(3)` + `opacity(0)` simultaneously
- Final: Cross-dissolve into Hero scene
- No skip button — this IS the experience

---

## 5. Scene 1 — Hero (The Arrival)

> The user has just entered the MOQ world. Everything is calm, vast, and breathtaking.

#### [MODIFY] [Hero.tsx](file:///c:/Users/mmust/Desktop/Moq%20Drink/src/components/Hero.tsx)

**Left side — Editorial typography:**
```
MORE THAN
A DRINK.
```
- `DRINK` highlighted in brand blue (`#388be6`)
- Subtitle: "Every sip is a new feeling. Welcome to the MOQ universe."
- Two CTAs:
  - **Primary**: "Discover Your Mood" → scrolls to Mood Finder
  - **Secondary**: "Explore Flavors" → scrolls to Carousel
- Text enters with staggered reveal (800ms per line, 200ms stagger)

**Right side — Floating Island Portal:**
- Arch-shaped glass portal (existing design — refined)
- Inside: Generated floating island illustration (moss, rocks, small waterfall)
- MOQ drink cup floats gently on the island (`float-slow`, 6s)
- Mouse movement creates parallax (existing springs — keep)
- Subtle animated mist at island base

**Background (in addition to global layers):**
- Extra hero-specific sun ray from top-right
- Animated leaves crossing the viewport (SVG, 18s drift)

**Scroll hint:**
- Animated chevron + "SCROLL DOWN" text
- Fades out after first scroll

#### [NEW] Generate hero island illustration
- Floating island with moss, rocks, small waterfall, MOQ drink
- High quality, dreamy style, bright colors

---

## 6. Transition Scenes

Premium cinematic transitions between major scenes. These are NOT separate components — they're integrated as scroll-linked reveals between scenes.

#### [NEW] [TransitionText.tsx](file:///c:/Users/mmust/Desktop/Moq%20Drink/src/components/TransitionText.tsx)

A reusable component that renders a large editorial text that fades in/out as the user scrolls through a `50vh` buffer zone.

**Transitions:**

| Between | Text | Style |
|---------|------|-------|
| Hero → Carousel | "Every flavor / has its own / world." | 3 lines, staggered fade, centered |
| Carousel → Drink Worlds | "Enter the worlds." | Single line, dramatic scale-up |
| Drink Worlds → Story | "How it all began..." | Italic, soft, warm tones |
| Story → Vision | *(no text — seamless flow)* | — |
| Vision → Mood Finder | "What do you feel today?" | Centered, glowing text |
| Philosophy → Instagram | "Join the world." | Clean, minimal |

**Animation:**
- `useScroll` with `offset: ["start end", "end start"]`
- Text: `opacity: 0 → 1 → 0`, `scale: 0.95 → 1 → 0.95`, `y: 30 → 0 → -30`
- Duration: 1200ms easing
- Background mist layer increases opacity during transitions

---

## 7. Scene 2 — Flavor Collection (The Gallery)

#### [MODIFY] [InfiniteCarousel.tsx](file:///c:/Users/mmust/Desktop/Moq%20Drink/src/components/InfiniteCarousel.tsx)

**Section header:**
- Label: "EXPLORE THE FLAVORS"
- Title: "EXPLORE EVERY FLAVOR"
- Subtitle: "Choose the world that matches your mood."

**Infinite horizontal carousel:**
- GSAP `x` tween, 25s linear loop (existing — refine)
- 4× duplication for seamless infinite scroll
- Pause on hover, resume on leave
- Touch drag with momentum (existing — refine)

**Product Card — Premium Advertisement:**

| Property | Value |
|----------|-------|
| Size | 420×520 (`w-[420px] h-[520px]`) |
| Border radius | 32px |
| Image area | 65% of card height |
| Background | Generated landscape + soft gradient overlay |
| Glass overlay | `glass` class with `backdrop-blur: 20px` |
| Border | `1px solid rgba(255,255,255,0.6)` |
| Shadow (rest) | `0 15px 35px rgba(15,108,189,0.04)` |
| Shadow (hover) | `0 25px 60px rgba(brand-color, 0.15)` |

**Card content (top to bottom):**
1. Landscape background image (generated — matching flavor world)
2. Glass overlay gradient (bottom 40%)
3. Product image (centered, 65% height, floating animation)
4. Product name (card title typography)
5. Short description (card body typography)
6. "KEŞFET" button (small, rounded-full)

**Hover interaction chain (all within 250ms):**
1. Lift: `translateY(-12px)`
2. 3D Tilt: CSS `perspective(800px)` + `rotateX/Y` based on mouse position within card
3. Scale: `1.03`
4. Glow: `box-shadow` with flavor accent color expands
5. Reflection sweep: `::after` gradient slides across card (3s ease)
6. Pause carousel scrolling

#### [NEW] Generate 6 landscape images for cards
- Blue Mojito: Ice cave with blue crystals
- Passion Breeze: Tropical island sunset
- Berry Boost: Cherry blossom forest
- Lime Fresh: Green valley with morning mist
- Mango Sun: Golden tropical beach
- Strawberry Crush: Strawberry field at dawn

---

## 8. Scene 3 — Drink Worlds (The Journey)

> The most important scene. Each world is a living, breathing environment.

#### [MODIFY] [ProductWorlds.tsx](file:///c:/Users/mmust/Desktop/Moq%20Drink/src/components/ProductWorlds.tsx)

**4 full-screen (100vh) worlds, each a complete living environment:**

### Blue Mojito — Ice Cave
| Element | Animation |
|---------|-----------|
| Background | Ice mountain landscape (generated), subtle parallax on scroll |
| Snow particles | Canvas — 30 falling snowflakes, varying sizes, 8s fall time |
| Ice crystals | SVG elements with `shimmer` animation, positioned at edges |
| Mist | Horizontal fog bands drifting across bottom 30%, `blur-3xl` |
| Water/Waterfall | Vertical gradient strip with ripple animation |
| Light | Cool blue ambient glow, pulsing slowly |

### Berry Boost — Cherry Blossom Forest
| Element | Animation |
|---------|-----------|
| Background | Pink cherry blossom forest (generated) |
| Falling petals | Canvas — 25 pink petals, rotating + drifting, 12s fall |
| Light rays | Diagonal gradient beams through trees, subtle pulse |
| Fireflies | Small glowing dots, random float pattern, warm pink |
| Wind | Horizontal mist bands moving right-to-left |
| Ambient | Soft pink glow at bottom |

### Passion Breeze — Tropical Island
| Element | Animation |
|---------|-----------|
| Background | Tropical island with palm trees (generated) |
| Birds | 3–4 SVG bird silhouettes, sine-wave flight paths across sky |
| Palm leaves | SVG fronds at edges, gentle `sway` animation |
| Water sparkle | Canvas — light reflections on ocean surface |
| Clouds | Extra cloud layer, warm-toned, slow drift |
| Sun flare | Radial gradient from top-right, warm golden |

### Lime Fresh — Green Valley
| Element | Animation |
|---------|-----------|
| Background | Lush green valley with morning light (generated) |
| Leaves | SVG leaves drifting diagonally, 18s cycle |
| Fog/Mist | Morning mist rising from valley floor, `translateY` upward |
| Light beams | Vertical golden light rays, `opacity` pulse |
| Grass particles | Small green dots floating upward |
| Dewdrops | Tiny reflective circles at random positions, `gleam` |

**Each world contains:**
- Full-screen background (generated illustration + CSS overlay gradients)
- Canvas particle system for world-specific effects
- Large product image in glass portal (existing arch design — refined)
- Editorial typography: Drink name + world name + description
- CTA button: "DÜNYAYI KEŞFET"
- Smooth scroll-linked background crossfade between worlds

**Transitions between worlds:**
- No hard cuts — backgrounds crossfade using `opacity` driven by `useScroll`
- Particle systems fade in/out with world visibility
- 200px overlap zone where both worlds are partially visible

#### [NEW] Generate 4 world background illustrations
- Ice cave landscape, cherry blossom forest, tropical island, green valley

---

## 9. Scene 4 — Story (The Origin)

> Full-screen scroll narrative. Each line takes the entire screen.

#### [MODIFY] [Story.tsx](file:///c:/Users/mmust/Desktop/Moq%20Drink/src/components/Story.tsx)

**Complete redesign — 5 full-screen frames:**

| Frame | Text | Background Shift |
|-------|------|-----------------|
| 1 | "One Dream." | Soft morning light, warm cream |
| 2 | "One Recipe." | Warmer, golden accents appear |
| 3 | "One Sip." | Brand blue glow emerges |
| 4 | "Today..." | All colors blend, anticipation |
| 5 | "MOQ." | Full brand blue, triumphant |

**Implementation:**
- Container: `500vh` total height (5 × 100vh frames)
- Each frame: `100vh`, flex-center, single line of text
- Text: Scene Title typography (96/64/42px responsive)
- `useScroll` tracks progress through `500vh` container
- `useTransform` maps progress to:
  - Text `opacity`: `0 → 1 → 1 → 0` per frame
  - Text `scale`: `0.9 → 1 → 1 → 0.95` per frame
  - Text `y`: `40px → 0 → 0 → -40px` per frame
  - Background color interpolation between frames
- Sticky inner container (`position: sticky, top: 0`) holds the visible frame
- Only one text line visible at any time

**"MOQ." frame (final):**
- Text scales up slightly larger
- Subtle particle burst on reveal
- Background settles into brand blue gradient briefly before transitioning

---

## 10. Scene 5 — Vision (The Statement)

#### [MODIFY] [Vision.tsx](file:///c:/Users/mmust/Desktop/Moq%20Drink/src/components/Vision.tsx)
- Keep existing "WE DON'T MAKE DRINKS. WE CREATE MOODS." concept
- Add scroll-triggered reveal: Each line appears sequentially
- Subtle float animation on the text block
- Clean white background (contrast from Story's color)
- Acts as a breathing space / palette cleanser between Story and Mood Finder

---

## 11. Scene 6 — Mood Finder (The Heart)

> A glowing gateway opens between the clouds. The form lives inside. Pressing the button = entering the portal.

#### [MODIFY] [MoodFinderSection.tsx](file:///c:/Users/mmust/Desktop/Moq%20Drink/src/components/MoodFinderSection.tsx)

**Cloud Gateway design (replacing simple glass portal):**
- Two large cloud formations on left and right edges
- Glowing light beams emanating from the gap between clouds
- Vertical light column in center (brand blue/gold gradient)
- Form container floating within the light gateway
- Ambient particles orbiting the gateway

**Form:**
- First Name, Last Name, Birthday
- Premium inputs: Transparent background, bottom-border only, floating labels
- CTA: "Discover My Mood" — glowing button with pulse animation

**Loading sequence (2500ms):**
1. Form slides backward (scale down + opacity)
2. Gateway light intensifies — cloud formations close slightly
3. Liquid morphing shapes appear in the light column (SVG `<path>` morph)
4. Particles accelerate inward toward center
5. Flash of light → result card materializes

**Result card:**
- Large glassmorphic card with flavor-matched accent glow
- Mood Name (large, editorial)
- Inspirational message
- Details grid: Lucky Color (with swatch), Lucky Number, Element, Matched Drink
- Product image with float animation
- Share button (Web Share API) + "Try Again" button
- Confetti burst on reveal (existing canvas-confetti — keep)

---

## 12. Scene 7 — Philosophy (The Soul)

#### [MODIFY] [Philosophy.tsx](file:///c:/Users/mmust/Desktop/Moq%20Drink/src/components/Philosophy.tsx)

- Three premium glass cards: **Fresh**, **Original**, **Together**
- Card size: Generous (min-height 380px)
- Hover: Soft glow (250ms), reflection sweep (3s), lift (-8px), subtle float
- Large whitespace above and below (py-40)
- Scroll-triggered staggered entrance (cards fade in one by one, 200ms stagger)
- Very calm atmosphere — minimal, almost zen

---

## 13. Scene 8 — Instagram (The Community)

#### [MODIFY] [InstagramFeed.tsx](file:///c:/Users/mmust/Desktop/Moq%20Drink/src/components/InstagramFeed.tsx)

- Title: "Join the MOQ Community"
- Magazine-style layout: Masonry or varied card sizes (2:3, 1:1, 3:2)
- Generate premium lifestyle images for each card
- Hover: Zoom (scale 1.05, 250ms), reflection sweep, lift, glass overlay
- Premium magazine feel — not an Instagram embed

---

## 14. Scene 9 — Footer (The Sunset)

> The user reaches the end of the world. The sun is setting. MOQ logo stands as a silhouette against the golden sky.

#### [MODIFY] [Footer.tsx](file:///c:/Users/mmust/Desktop/Moq%20Drink/src/components/Footer.tsx)

**Cinematic sunset design:**
- Background: Multi-layer sunset gradient (warm orange → deep coral → dark indigo)
- Large sun circle: CSS radial gradient, positioned center, partially below horizon
- MOQ logo: Large, silhouetted against the sun (dark navy on glowing background)
- Ocean: Animated wave SVGs at bottom (2–3 layers, different speeds)
- Cloud silhouettes: Dark against the sunset sky, slow drift
- Reflection: Sun's light reflected on water surface (vertical gradient + ripple)

**Content (minimal, centered):**
- MOQ logo (large, silhouette)
- "Mood. Sip. Refresh." tagline
- Navigation links (horizontal, small)
- Social icons (Instagram, TikTok)
- Copyright
- Everything in warm sunset tones

---

## 15. Custom Cursor

#### [MODIFY] [CustomCursor.tsx](file:///c:/Users/mmust/Desktop/Moq%20Drink/src/components/ui/CustomCursor.tsx)

- Default state: Small MOQ text/logo ring (current ring style — add MOQ branding)
- Hover on interactive elements: Ring expands (scale 1.5), fill becomes semi-transparent
- Hover on cards: Ring becomes a "+" or expands further
- Hover on buttons: Ring morphs to match button shape
- Click: Brief squeeze animation (scale 0.8 → 1)
- Smooth spring-based following (existing — refine)
- Hide on mobile (touch devices)

---

## 16. Ambient Sound System

#### [NEW] [AmbientSound.tsx](file:///c:/Users/mmust/Desktop/Moq%20Drink/src/components/AmbientSound.tsx)

**Optional ambient soundscape (off by default):**
- Toggle button: Small speaker icon, fixed bottom-right, above scroll-to-top
- Sounds mixed together:
  - Wind (constant, low volume)
  - Birds (intermittent chirps)
  - Water (gentle stream)
  - Leaves (rustle, very subtle)
- Volume shifts with scroll:
  - Hero: Wind + birds prominent
  - Drink Worlds: Water sounds increase
  - Footer: Ocean waves increase
- Use Web Audio API for smooth crossfading
- All audio files: Small MP3/OGG loops (<100KB each)
- Respect `prefers-reduced-motion` — don't auto-play

#### [NEW] `public/audio/` directory
- `wind.mp3`, `birds.mp3`, `water.mp3`, `leaves.mp3`
- Source: Royalty-free ambient loops

> [!NOTE]
> Audio files need to be royalty-free. I'll use small synthesized/generated ambient loops or recommend free sources. For the initial build, the sound system will be structurally complete but audio files can be placeholders until you source final audio.

---

## 17. Page Assembly

#### [MODIFY] [page.tsx](file:///c:/Users/mmust/Desktop/Moq%20Drink/src/app/page.tsx)

```
CinematicLoading (Scene 0)
  ↓
WorldBackground (11 layers, fixed, beneath everything)
CustomCursor (fixed, top layer)
AmbientSound (fixed toggle, bottom-right)
SmoothScroll (Lenis wrapper)
  ├─ Navbar (fixed, transparent)
  ├─ Hero (Scene 1)
  ├─ TransitionText: "Every flavor has its own world."
  ├─ InfiniteCarousel (Scene 2)
  ├─ TransitionText: "Enter the worlds."
  ├─ ProductWorlds (Scene 3 — 4 worlds)
  ├─ TransitionText: "How it all began..."
  ├─ Story (Scene 4 — 5 full-screen frames)
  ├─ Vision (Scene 5)
  ├─ TransitionText: "What do you feel today?"
  ├─ MoodFinderSection (Scene 6)
  ├─ Philosophy (Scene 7)
  ├─ TransitionText: "Join the world."
  ├─ InstagramFeed (Scene 8)
  └─ Footer (Scene 9 — cinematic sunset)
```

#### [DELETE] [QRClub.tsx](file:///c:/Users/mmust/Desktop/Moq%20Drink/src/components/QRClub.tsx)
#### [DELETE] [DrinkCarousel.tsx](file:///c:/Users/mmust/Desktop/Moq%20Drink/src/components/DrinkCarousel.tsx) (unused duplicate)
#### [DELETE] [MoodFinderModal.tsx](file:///c:/Users/mmust/Desktop/Moq%20Drink/src/components/MoodFinderModal.tsx) (unused)
#### [DELETE] [MoodFinderButton.tsx](file:///c:/Users/mmust/Desktop/Moq%20Drink/src/components/MoodFinderButton.tsx) (FAB not needed)
#### [DELETE] [FloatingLeaves.tsx](file:///c:/Users/mmust/Desktop/Moq%20Drink/src/components/FloatingLeaves.tsx) (merged into WorldBackground)
#### [DELETE] [Particles.tsx](file:///c:/Users/mmust/Desktop/Moq%20Drink/src/components/Particles.tsx) (merged into WorldBackground)

---

## 18. Final Review — Creative Director Pass

After all scenes are built:

> Before considering the implementation complete, act as a Creative Director, Senior Product Designer, Motion Designer, UX Designer, Brand Designer and Frontend Architect.

**Review checklist:**
- [ ] Would Apple ship this?
- [ ] Would this win an Awwwards nomination?
- [ ] Does every scene feel handcrafted?
- [ ] Does every animation have a purpose?
- [ ] Does every component belong to the same design language?
- [ ] Does the experience make the user feel they entered another world?
- [ ] Is every pixel intentional?
- [ ] Is every transition smooth and purposeful?
- [ ] Is every spacing decision considered?
- [ ] Does the user experience a journey, not a page scroll?

If any answer is **no** → redesign that scene until the answer is **yes**.

---

## Execution Order

```
 1. globals.css (Design tokens, typography, animation rules)
 2. WorldBackground.tsx (11-layer background system)
 3. CinematicLoading.tsx (Scene 0 — loading sequence)
 4. CustomCursor.tsx (MOQ branded cursor)
 5. Hero.tsx (Scene 1 — the arrival)
 6. TransitionText.tsx (Reusable transition scenes)
 7. InfiniteCarousel.tsx (Scene 2 — flavor gallery)
 8. ProductWorlds.tsx (Scene 3 — 4 living worlds)
 9. Story.tsx (Scene 4 — full-screen scroll narrative)
10. Vision.tsx (Scene 5 — brand statement)
11. MoodFinderSection.tsx (Scene 6 — cloud gateway)
12. Philosophy.tsx (Scene 7 — glass cards)
13. InstagramFeed.tsx (Scene 8 — magazine community)
14. Footer.tsx (Scene 9 — cinematic sunset)
15. AmbientSound.tsx (Optional sound system)
16. page.tsx (Final assembly)
17. Creative Director review pass
```

---

## Verification Plan

### Build Check
```bash
npm run build
```

### Visual Verification
- Run `npm run dev` and travel through the entire experience
- Verify 60fps animation performance on all scenes
- Test on Chrome, Firefox, Safari
- Test mobile touch interactions (carousel drag, smooth scroll)
- Test loading sequence from fresh page load

### Quality Gates
- Every scene must feel like part of the same world
- No jarring transitions between any two scenes
- All hover effects respond in exactly 250ms
- All scroll reveals complete in 800–1000ms
- Typography is pixel-perfect at every breakpoint
- Glass effects are consistent across all cards
- The experience feels **unforgettable**, not just "working"
