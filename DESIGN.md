# VAMP-X: ASCENT 2D Wave Fighter — Design Brief

## Direction
Cinematic dark cosmic survival game UI — divine gold and ethereal lights against the void, with player evolution and enemy threat progression driving visual intensity.

## Tone
Massively immersive, energetic, and spiritually transcendent. Every UI element radiates presence through glow and depth, matching the player's journey from mortal survivor to cosmic entity.

## Differentiation
Player evolution stage shifts player glow from warm divine gold → celestial light blue → ethereal white-light as abilities unlock, creating a visual power progression that mirrors mechanical advancement.

## Color Palette

| Token | OKLCH | Role |
|-------|-------|------|
| background | 0.12 0 0 | Cosmic void void |
| foreground | 0.94 0 0 | Off-white text |
| primary | 0.65 0.22 60 | Divine gold accents, power buttons |
| secondary | 0.5 0.18 270 | Cosmic purple, borders, HUD |
| card | 0.16 0 0 | HUD card backgrounds |
| evolution-stage-1 | 0.65 0.22 60 | Mortal survivor glow |
| evolution-stage-4 | 0.75 0.2 200 | Empyrean being celestial blue |
| evolution-stage-5 | 0.8 0.22 280 | Cosmic entity ethereal light |
| enemy-corrupted | 0.55 0.22 25 | Red-orange corrupted humans |
| enemy-shadow | 0.5 0.18 270 | Purple shadow wraiths |
| enemy-angel | 0.7 0.2 200 | Cyan fallen angels |
| boss-boss | 0.75 0.22 280 | Ethereal white-blue boss threat |

## Typography

- Display: Space Grotesk — wave counter, wave/score titles, player level labels, start/game-over screen titles
- Body: DM Sans — HUD labels, health bar text, power button descriptions, wave progression numbers
- Scale: h1 24px bold (titles), h2 18px semibold (labels), body 14px regular (info text)

## Elevation & Depth

Semi-transparent glowing cards with purple-tinted borders and backdrop blur, separated by distance-based shadow intensity: HUD elements (distant glow 20px), enemy health bars (medium glow 30px), boss health bar (intense inset + outer glow 50px).

## Structural Zones

| Zone | Background | Border | Notes |
|------|------------|--------|-------|
| Top-Center | hud-card | purple glow | Boss health bar (when active) |
| Top-Right | hud-card | purple glow | Wave counter, score, multiplier |
| Bottom-Left | hud-card | purple glow | Player health bar, energy meter |
| Bottom-Center | power-button grid | purple glow | 4–6 power ability buttons with hover states |
| Enemy Layer | Semi-transparent overlay | RGB type glow | Enemy health bars, type labels (Corrupted/Shadow/Angel) |
| Full-Screen Overlay | gameover: 0.12 0 0 / 0.9, victory: 0.8 0.22 280 / 0.2 | none | Gameover/victory transition screens |

## Spacing & Rhythm

12px base unit: HUD cards use 16px padding, 8px gap between buttons, 4px space inside health bars; wave/score labels centered at 20px top margin; power buttons arranged 48px apart in 2×3 grid at bottom-center.

## Component Patterns

- Player Glow: `animate-evolution-stage-{1–5}` — 3s infinite pulse, intensity increases with evolution
- Health Bars: gradient fill oklch(0.5 270) → oklch(0.65 60), 8px radius, 2px border
- Power Buttons: 60px square, dark bg, purple glow border, gold glow on hover, inset glow on active, 14px icon + 10px label below
- Boss Health Bar: full-width top bar, animates `boss-threat` 1.5s infinite, displays health % as text overlay
- Enemy Type Labels: text-glow by type (red/purple/cyan), updated each wave

## Motion

- Entrance: Fade-in-up 0.8s on HUD spawn, staggered 100ms per element
- Hover: Power buttons scale 1.05 + gold glow expand 0.2s cubic-bezier
- Decorative: Particle-float 6s, glow-pulse 3s infinite on active elements, evolution glow accelerates with power unlock
- Screen State: Gameover darkens overlay 0.8s fade, victory screen pulses light-blue 2s infinite

## Constraints

- No raw hex colors; all OKLCH values
- High contrast: foreground text always 0.94 L on 0.12 background
- Glow effects use backdrop-filter blur 12px for HUD depth
- Boss health bar updates 60fps from game loop (imperative Canvas render)
- Player evolution glow binds to stage number; cascading animation shifts hue 60°→200°→280°

## Signature Detail

Player glow color evolution — as the player ascends through 5 stages, the character's surrounding aura transitions from warm divine gold (0.65 60) → bright celestial blue (0.75 200) → ethereal light-purple (0.8 280), creating a continuous visual metaphor for spiritual transcendence.

