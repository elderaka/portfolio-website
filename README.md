# Lauda Dhia Raka — Portfolio

Personal portfolio website for **Lauda Dhia Raka**, a Full-Stack AI Engineer at Keption and Informatics graduate of Telkom University (cum laude, 3.5 years).

## Stack

- React 19, TypeScript, Vite 7
- Tailwind CSS 4 and Lucide icons
- Tone.js for the interactive piano mode
- Client-side experiments under `src/components/labs/` (currently not rendered on the main page)

## Development

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Content and structure

- `src/personal-data.json` — projects, experience, education, publications, and contact links
- `src/App.tsx` — hero, expertise, project archive, navigation, and animations
- `src/components/` — career, education/publications, organizations, and contact sections
- `src/index.css` — styling and light/dark theme variables
- `public/pdf/cv.pdf` — downloadable resume (update separately when needed)

The main project archive includes public and private work. Private project source links are intentionally omitted.

## Deployment

The website is associated with the custom domain `erudera.me`. Keep `index.html`, `public/sitemap.xml`, and any social preview image in sync with the deployed URL.
