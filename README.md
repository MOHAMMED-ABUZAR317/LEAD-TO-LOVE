# Lead to Love 💛

**Every path can lead to love.**

Lead to Love is a front-end concept website for a charity/donation platform that connects everyday
generosity to real need — food, education, shelter, and healthcare for families who need it most.
It's built entirely with **HTML, CSS, and vanilla JavaScript** — no frameworks, no build tools, no
dependencies to install.

> ⚠️ This is a **front-end demo**. There is no backend, no database, and no real payment processing.
> Donation and volunteer forms simulate success messages only.

---

## ✨ Features

- **Animated hero section** — a self-drawing SVG path and pulsing heart icon that echo the "path" in
  the site's name
- **Scroll progress bar** — a thin gradient bar at the top that fills as you scroll down the page
- **Sticky, shrinking header** with active-section highlighting and a mobile hamburger menu
- **Animated impact counters** — meals delivered, children in school, etc., count up on page load
- **Filterable causes grid** — filter programs by Food / Education / Shelter / Healthcare, with
  animated funding-progress bars
- **"The Path" section** — an SVG line that draws itself as you scroll through the four-step
  "how it works" explainer
- **Interactive donation calculator** — a slider + preset amount chips + one-time/monthly toggle that
  translates rupees into real impact in real time (e.g. "₹1,500 → 5 clinic visits")
- **Testimonial carousel** — auto-advancing story slider with manual arrows and dot navigation
- **Volunteer sign-up form** with live inline validation
- **Newsletter sign-up** with email validation
- **Toast confirmations** and **button ripple effects** for tactile feedback
- **Back-to-top button**
- Fully **responsive** (mobile, tablet, desktop), respects `prefers-reduced-motion`, and uses visible
  keyboard focus states throughout

---

## 📁 Project structure

```
lead-to-love/
├── index.html   # Page structure & content (all sections)
├── style.css    # Design system, layout, and all animations
├── script.js    # All interactivity (calculator, carousel, forms, counters, etc.)
└── README.md    # This file
```

All three files must stay **in the same folder** — `index.html` loads the other two using relative
paths (`href="style.css"` and `src="script.js"`).

---

## 🚀 Running the project

### Option A — Just open it (simplest)
Double-click `index.html`. It will open directly in your browser. No server required.

### Option B — Local dev server (recommended if editing)
Some browser security rules behave slightly differently on `file://` pages. If you're actively
developing, serve the folder locally instead:

```bash
# Python
python3 -m http.server 8000
# then open http://localhost:8000

# Node (if you have npx)
npx serve .
```

### Option C — Inside a Java/Spring Boot project
Place the three files in `src/main/resources/static/`, then run:

```bash
mvn spring-boot:run
```

Spring Boot will serve `index.html` automatically at `http://localhost:8080`.

> ⚠️ Don't preview the files through Google Drive's built-in viewer — Drive's preview sandbox
> doesn't reliably run JavaScript or resolve relative file paths, which will make the page look
> empty. Always open it from a real folder on disk or a local server.

---

## 🎨 Design system

| Token | Value | Use |
|---|---|---|
| `--ink` | `#1B2A4A` | Primary text, dark sections |
| `--ink-deep` | `#0F1B33` | Footer / darkest background |
| `--ivory` | `#FBF3E7` | Page background |
| `--gold` | `#F2A93B` | Warmth / hope accent |
| `--rose` | `#E8546B` | "Love" accent |
| `--teal` | `#3E8E7E` | Secondary accent |

**Typography:** [Fraunces](https://fonts.google.com/specimen/Fraunces) (display/serif headlines),
[Work Sans](https://fonts.google.com/specimen/Work+Sans) (body text),
[JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (stats, tags, numbers).

Fonts load from Google Fonts via `<link>` tags in `index.html` — an internet connection is needed
the first time a page loads for fonts to display correctly (the site still works offline, just with
fallback system fonts).

---

## 🛠 Customizing

- **Text/copy:** edit directly in `index.html` — all section content is plain HTML, no templating.
- **Colors/fonts/spacing:** edit the CSS custom properties at the top of `style.css` under `:root`.
- **Donation tiers:** edit the `tierFor()` function in `script.js` to change what amount ranges map to
  which impact message (meals, school kits, clinic visits, shelter nights).
- **Testimonials:** add or remove `<figure class="story-card">` blocks inside `#carouselTrack` in
  `index.html` — the carousel and dot navigation update automatically.
- **Causes:** duplicate a `<article class="cause-card">` block, set its `data-cat` attribute to
  `food`, `education`, `shelter`, or `health` so it works with the filter buttons.

---

## ✅ Browser support

Works in all modern evergreen browsers (Chrome, Edge, Firefox, Safari). No IntersectionObserver or
other reveal-on-scroll logic is used for content visibility — sections fade in via pure CSS
animation on load, so the page renders correctly even in restrictive or sandboxed environments.

---

## 📄 License

Free to use, modify, and extend for personal, educational, or non-commercial charitable purposes.