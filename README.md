# Svitlana Biletska — portfolio/service site

Stack: HTML + Tailwind CSS v4 + Alpine.js (mobile nav, contact form) + GSAP (hero reveal + services card-stack, used sparingly). Hosting: Netlify (built-in Forms).

## Local dev

```
npm install
npm run watch   # rebuilds css/style.css on save
```

Open `index.html` directly in a browser, or serve the folder with any static server.

## Deploy to Netlify

**Option A — drag & drop (fastest):** `css/style.css` is already built and committed, so you can drag the whole project folder straight into Netlify's "Deploys" tab. No build step runs, nothing to configure.

**Option B — connect a Git repo:** push this folder to GitHub/GitLab and connect it in Netlify. `netlify.toml` already tells Netlify to run `npm run build` (recompiling Tailwind) before publishing — this is the option to use once you're editing the CSS/classes regularly.
