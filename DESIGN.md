# Design System Document: The Ethereal Stage

## 1. Overview & Creative North Star
**Creative North Star: "The Living Atmosphere"**

This design system moves away from the rigid, "boxed-in" nature of traditional ticketing platforms. Instead of a sterile commerce interface, we treat the screen as a digital stage. The core philosophy is **Atmospheric Depth**—using light, blur, and color to create a premium, editorial experience that feels as vibrant as a live event.

We break the "template" look through:
* **Intentional Asymmetry:** Hero elements and carousels should use staggered alignments to create movement.
* **Depth through Diffusion:** We eliminate hard lines in favor of light-based separation.
* **Typographic Authority:** Using *Plus Jakarta Sans* at extreme scales to create a clear, high-fashion hierarchy.

---

## 2. Colors & Surface Logic
The palette is rooted in deep violets and energetic pinks, but its power lies in how these colors interact through transparency.

### The "No-Line" Rule
**Strict Mandate:** 1px solid borders are prohibited for sectioning content. Boundaries must be defined solely through:
1. **Background Shifts:** Transitioning from `surface` (#fef7ff) to `surface-container-low` (#f8f1fe).
2. **Tonal Transitions:** Using the mesh gradient to naturally "pool" color behind specific content blocks.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of frosted acrylic.
* **Base:** Mesh gradient (Violet/Pink/Deep Violet).
* **The Content Layer:** `surface-container-lowest` (#ffffff) at 60-80% opacity with a 20px backdrop-blur.
* **The Elevated Layer:** `surface-container-high` (#ede5f3) for nested elements like event tags or mini-cards.

### The "Glass & Gradient" Rule
Floating elements (modals, navigation bars) must utilize Glassmorphism. Apply `surface_variant` at 40% opacity with a heavy blur. For Primary CTAs, use a **Signature Texture**: a linear gradient from `primary` (#6b38d4) to `secondary` (#b4136d) at a 135-degree angle.

---

## 3. Typography: Plus Jakarta Sans
The typeface is chosen for its geometric precision and modern "ink traps," which remain legible even over complex mesh backgrounds.

* **Display (lg/md):** Reserved for event titles and "Big Moment" headlines. Use `-0.02em` letter spacing for a tighter, editorial feel.
* **Headline (sm):** Used for category headers. Always paired with high-contrast `on_surface` (#1d1a23).
* **Title (md/sm):** For card titles and secondary information.
* **Body (lg/md):** For descriptions. Use `on_surface_variant` (#494454) to ensure the background depth doesn't swallow the text.
* **Label (md):** All-caps with `+0.05em` tracking for utility text (dates, venue names).

---

## 4. Elevation & Depth
We reject drop shadows that look like "dirt." Depth is a function of light.

### The Layering Principle
Stacking tiers creates natural lift. An event card (`surface-container-lowest`) sitting on a search results area (`surface-container-low`) creates a soft edge that feels premium and organic.

### Ambient Shadows & Glows
When a "floating" effect is required (e.g., a Floating Action Button), use a **Shadow Glow**:
* **Color:** Tinted with `primary` (#6b38d4) at 15% opacity.
* **Specs:** Y: 10px, Blur: 30px, Spread: -5px.
* *Note:* Shadows should feel like the button is casting light onto the surface below it.

### The "Ghost Border" Fallback
If accessibility requires a container definition (e.g., input fields), use a **Ghost Border**: `outline_variant` (#cbc3d7) at 20% opacity. Never use 100% opaque outlines.

---

## 5. Components

### Buttons
* **Primary:** Full roundedness (`full`: 9999px). Gradient fill (`primary` to `secondary`). White text (`on_primary`).
* **Secondary Glass:** Full roundedness. `surface_variant` at 30% opacity with backdrop-blur. `primary` text.
* **States:** On press, the "Shadow Glow" increases in intensity, and the button scales to 0.98.

### Interactive Snap Carousels
* **Behavior:** Horizontal scrolling for event cards with a "center-snap" mechanic.
* **Visuals:** The center card is at 100% opacity; flanking cards are at 60% opacity and slightly scaled down (90%) to emphasize the "Stage" focus.

### Cards & Lists
* **Rule:** No dividers. Use `1.5rem` (md) vertical white space to separate items.
* **Cards:** Use `md` (1.5rem) or `lg` (2rem) rounded corners. The card body should be a glass container to allow the mesh gradient background to provide a sense of place.

### Floating Action Button (FAB)
* **Role:** The "Quick Ticket" or "Filter" action.
* **Design:** A perfect circle with the multi-layered gradient. It must sit at the bottom-right, visually detached from the navigation via a heavy ambient shadow.

### Input Fields
* **Style:** Minimalist. No bottom line. A soft `surface-container-highest` background with `sm` (0.5rem) rounding.
* **Focus State:** The "Ghost Border" opacity increases to 50% with a subtle violet outer glow.

---

## 6. Do’s and Don'ts

### Do:
* **Do** use the mesh gradient as a living background that shifts slightly as the user scrolls.
* **Do** embrace negative space. If a screen feels "busy," increase the padding rather than adding a border.
* **Do** use extreme contrast in typography size to guide the eye.

### Don't:
* **Don't** use pure black (#000000) for text. Use `on_surface` (#1d1a23) to maintain the violet-tinted atmosphere.
* **Don't** use standard Material Design "Card Shadows." If the layer doesn't have a backdrop blur, it isn't part of this system.
* **Don't** use sharp corners. Everything in the event world is fluid; the UI must reflect that with `DEFAULT` (1rem) or larger radii.