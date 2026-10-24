# Brand Identity — ScienceHub.io × Sukoon.Brain

## 1. ScienceHub.io Internal App Icon
**Purpose:** Internal application identity, internal development resources, or a separately installed internal app if one exists.

**Visual:** Friendly science mascot with brain/neural motif, DNA and orbital elements.

**Personality:** Curious, intelligent, friendly.

**Rule:** Do not use this as the default AI assistant identity. It should not imply a separate installed application unless one actually exists.

## 2. ScienceHub.io Frontend App Icon
**Purpose:** Primary public-facing ScienceHub identity.

**Locations:** Browser favicon; Android home-screen/PWA icon; web app manifest; public website branding and supported launch/loading surfaces.

**Visual:** Cleaner DNA double helix and atom symbol, recognizable at small sizes.

**Rule:** Prefer symbol-only artwork for small icon surfaces. Keep the wordmark separate.

## 3. Sukoon.Brain Realtime Icon
**Purpose:** AI assistant identity within ScienceHub.io.

**Locations:** Floating assistant button; assistant/chat header and avatar; study-helper conversation panel; realtime/voice surfaces only when those features are implemented. A separate app icon is appropriate only if Sukoon.Brain becomes a standalone product.

**Rule:** An animated mascot, glowing dot, or icon does not prove a live AI connection.

## Shared visual system
- Deep Space Navy: `#070D20`
- Electric Cyan: `#79F3FF`
- Neon Violet: `#BB8CFF`
- Warm Gold: `#FFC66D`
- Use restrained glow, clear contrast, rounded components and readable typography.
- Support small-size variants; fine particles and tiny letters should not be necessary for recognition.
- Respect reduced-motion preferences and keyboard focus.
- Do not communicate connection state through color alone.

## Technical relationship
ScienceHub.io is the learning platform. Sukoon.Brain is the assistant experience inside it. These are three icon roles, not automatically three apps.

Assistant states:
- `offline`: local fallback only.
- `connecting`: connection attempt underway.
- `connected`: backend successfully returned a response.
- `error`: request failed; show local fallback if available.

Never display `connected` before the backend has actually succeeded.
