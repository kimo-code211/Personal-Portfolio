# Hakim Hakim — Personal Portfolio

A modern, responsive, hand-written personal portfolio website built with plain
**HTML5**, **CSS3** and **vanilla JavaScript** — no frameworks, no build step,
no dependencies to install.

It presents me as an aspiring web developer while also showing my electronics
and programming background as a third-year **BSc Electronics Technology**
student (Communication Electronics option) at the University of Eastern Africa,
Baraton.

> **Live demo:** publish it to GitHub Pages (instructions below) and paste the
> URL here.

---

## Table of contents

1. [Technologies used](#technologies-used)
2. [Features](#features)
3. [File structure](#file-structure)
4. [Running it locally](#running-it-locally)
5. [Customising it](#customising-it)
6. [Publishing to GitHub Pages](#publishing-to-github-pages)
7. [Accessibility notes](#accessibility-notes)
8. [Performance notes](#performance-notes)
9. [Future improvements](#future-improvements)

---

## Technologies used

| Technology  | What it is used for |
|-------------|---------------------|
| **HTML5**   | Semantic page structure (`header`, `main`, `section`, `article`, `aside`, `footer`, `dl`) |
| **CSS3**    | Mobile-first responsive layout with Flexbox and Grid, custom properties (design tokens), theming, keyframe animations |
| **JavaScript (ES5+)** | Mobile menu, dark/light theme, scroll spy, scroll-reveal animations, form validation |
| **Google Fonts** | Inter (body) and JetBrains Mono (code accents), loaded with `display=swap` |

No CSS framework, no JS library, no bundler. The whole site is three files.

---

## Features

- **Sticky navigation** with a frosted-glass header that gains a border once you scroll
- **Mobile hamburger menu** that slides in, closes on `Esc`, closes on link click, and unlocks body scroll
- **Scroll spy** — the nav link for the section currently on screen is highlighted
- **Dark / light theme toggle** that remembers your choice via `localStorage` and matches your OS preference on first visit
- **Hero section** with a pure-CSS "code editor" card (no images, so nothing to download)
- **Skills** grouped into Programming, Technology and Tools, with honest
  `Currently Learning` badges rather than invented percentages
- **Project cards** with clear `Learning Project` / `In Development` / `Planned` status
- **Learning journey** rendered as a vertical timeline on mobile and a
  horizontal progression path on desktop — same HTML, different CSS
- **Contact form** with inline validation, character counter and accessible error messages
- **Scroll-reveal animations** that respect `prefers-reduced-motion`
- **Skip link**, visible focus rings, ARIA labels and `aria-current` throughout
- **Fully responsive** across mobile, tablet and desktop

---

## File structure

```
Personal Portfolio/
├── index.html      ← all markup and content
├── style.css       ← all styling, organised in 15 numbered sections
├── script.js       ← all behaviour, organised in 7 numbered functions
└── README.md       ← this file
```

Both `style.css` and `script.js` are heavily commented and split into numbered
blocks, so you can find any feature quickly.

---

## Running it locally

Because there is no build step, you have two easy options.

### Option A — just open the file

Double-click `index.html`, or from a terminal:

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

This works fine for viewing the site.

### Option B — use a local server (recommended)

A local server behaves more like real hosting and avoids browser restrictions
on `file://` URLs. With Python already installed:

```bash
cd "path/to/Personal Portfolio"
python -m http.server 8000
```

Then open <http://localhost:8000>.

If you prefer Node.js:

```bash
npx serve .
```

In **VS Code**, install the *Live Server* extension, right-click `index.html`
and choose **Open with Live Server** — it also auto-reloads when you save.

---

## Customising it

### Change the accent colour

Every colour is a design token at the top of `style.css`. Edit the two theme
blocks and the whole site updates:

```css
:root {                 /* light theme */
  --accent: #0f766e;    /* ← change this */
}

[data-theme="dark"] {   /* dark theme */
  --accent: #2dd4bf;    /* ← and this */
}
```

Tip: keep the light-theme accent dark enough to read white text on it
(contrast ratio ≥ 4.5:1). [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
will confirm it.

### Change fonts

Replace the Google Fonts URL in the `<head>` of `index.html`, then update
`--font-sans` and `--font-mono` in `style.css`.

### Update personal details

| What | Where |
|------|-------|
| Name, tagline, intro paragraph | `index.html` → hero section (`id="home"`) |
| Quick facts under the hero | `index.html` → `.hero__facts` |
| About text and details card | `index.html` → `id="about"` |
| Skills | `index.html` → `id="skills"`, each `.skill` list item |
| Education | `index.html` → `id="education"` |
| Learning steps | `index.html` → `id="journey"`, each `.journey__step` |
| Contact details | `index.html` → `id="contact"` |
| Email address used by the form | `script.js` → search for `hakimelia3@gmail.com` |
| Copyright year | automatic — `script.js` fills in the current year |

### Add a new project

In `index.html`, find the comment `PROJECT CARD TEMPLATE` inside the projects
section. Copy that whole `<article class="project-card">` block, paste it after
the last card, then change:

1. the `<h3>` title
2. the badge (`badge--done`, `badge--wip`, or delete the `<span>`)
3. the description
4. the `<li class="tag">` technologies
5. the `href` in the link — point it at the specific repository, e.g.
   `https://github.com/kimo-code211/kimo-mini-banking-app`

The grid handles the layout automatically for any number of cards.

### Connect the contact form to a real backend

Right now the form validates the input and then opens the visitor's own email
app with the message pre-filled — a real behaviour, but it depends on them
having a mail client configured. To collect submissions properly, use a free
form service. With [Formspree](https://formspree.io):

1. Create an account and a form; copy your form endpoint URL.
2. In `index.html`, change the opening form tag to:

   ```html
   <form class="contact__form" id="contact-form"
         action="https://formspree.io/f/YOUR_FORM_ID" method="POST" novalidate>
   ```

3. In `script.js`, open `initContactForm()` and remove the
   `event.preventDefault()` line and the `mailto` block — or delete the whole
   `form.addEventListener('submit', …)` handler if you want the service to
   handle everything.

The field names (`name`, `email`, `message`) already match what these services
expect, so nothing else needs changing. Getform, Basin and Formsubmit work the
same way.

---

## Publishing to GitHub Pages

This project already lives in the repository
[`kimo-code211/Personal-Portfolio`](https://github.com/kimo-code211/Personal-Portfolio)
and has been pushed to `main`, so the only remaining step is switching Pages on.

### 1. Turn on Pages

Repository → **Settings** → **Pages** → under *Build and deployment*, set
**Source** to `Deploy from a branch`, **Branch** to `main` and folder to
`/ (root)` → **Save**.

### 2. Wait and visit

Deployment takes about a minute. Your site will then be live at:

```
https://kimo-code211.github.io/Personal-Portfolio/
```

> **Note on the URL:** because the repository is named `Personal-Portfolio`
> rather than `kimo-code211.github.io`, GitHub serves it from a subfolder.
> If you would prefer the cleaner `https://kimo-code211.github.io/` address,
> rename the repository to exactly `kimo-code211.github.io` (Settings →
> General → Repository name) and update the remote:
>
> ```bash
> git remote set-url origin https://github.com/kimo-code211/kimo-code211.github.io.git
> ```

### 3. Update it later

```bash
cd "path/to/Personal Portfolio"

git add index.html style.css script.js README.md
git commit -m "Update project cards"
git push
```

Changes go live within a minute or two.

> **Heads-up:** anything you push to that repository is public. Do not commit
> passwords, tokens, or a `.env` file. `server.log` is a local test artefact
> and is worth removing from the repo:
>
> ```bash
> git rm --cached server.log
> echo "server.log" >> .gitignore
> git commit -m "Stop tracking local server log"
> ```

---

## Accessibility notes

Things that were deliberately built in, so you know what to keep when editing:

- **Skip link** as the first focusable element — jumps straight to the content
- **Semantic landmarks** — `header`, `nav`, `main`, `section`, `footer`, each with an accessible name
- **One `<h1>`**, and heading levels never skip (h1 → h2 → h3)
- **Labels on every form field**, plus `aria-invalid`, `aria-describedby` and a `role="status"` live region for the result message
- **`aria-expanded` / `aria-controls`** on the hamburger button, kept in sync by JS
- **`aria-current`** on the active nav link
- **`aria-hidden="true"`** on all decorative icons and the code card
- **`:focus-visible` outlines** on every interactive element
- **44px minimum touch targets**
- **`prefers-reduced-motion`** disables all animation and reveals content immediately
- **Colour is never the only signal** — work-in-progress project cards use a
  dashed border in addition to their badge, and statuses are written as text

---

## Performance notes

- **No frameworks or libraries** — nothing to download besides three small files
- **No images at all.** The hero visual and every icon are inline SVG or CSS,
  so there are zero image requests and everything stays sharp on any screen
- **Google Fonts** loaded with `preconnect` and `display=swap`, so text paints
  immediately in a fallback font instead of staying invisible
- **`defer` on the script** — HTML parsing is never blocked
- **Animations use only `transform` and `opacity`**, which the GPU handles
  without recalculating layout
- **`IntersectionObserver`** instead of scroll-position maths, so scrolling
  stays smooth
- **Scroll reveal elements are unobserved** after animating, so the observer
  stops doing work

---

## Future improvements

Ideas to work through as my skills grow:

- [ ] Add real project screenshots once I have finished projects to show
- [ ] Connect the contact form to Formspree (or a small Node/Express backend)
- [ ] Write a `robots.txt` and add Open Graph image for nicer link previews
- [ ] Add a downloadable CV/ résumé PDF
- [ ] Rebuild the projects section by fetching my repositories from the GitHub API
- [ ] Add a simple blog or "notes" section for what I learn
- [ ] Add JSON-LD structured data (`Person` schema) for search engines
- [ ] Run a full Lighthouse audit and push every score above 95
- [ ] Explore a CSS-only version of the theme toggle as a learning exercise

---

## Licence

Free to use as a reference or starting point for your own portfolio.

---

**Hakim Hakim** — Eldoret, Kenya
[hakimelia3@gmail.com](mailto:hakimelia3@gmail.com) ·
[github.com/kimo-code211](https://github.com/kimo-code211)

*Learning, building, and improving one project at a time.*
