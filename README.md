# Drunagor Companion App

The official companion app for **Chronicles of Drunagor**, live at [drunagor.app](https://drunagor.app). Players use it to run their campaigns at the table, and retailers use it to host **Drunagor Nights** events in their stores.

It is built with **Vue 3**, **Vuetify 3**, **TypeScript** and **Vite**, and is installable as a PWA.

## What it does

**For players**

- **Lobbies:** join a store table by QR code or lobby code, pick a hero and start or load a campaign.
- **Immersive campaign view:**
  - door-by-door setups;
  - Read Scene;
  - room Interactions, opened with a QR scanner;
  - runes, keywords and rules.
- **Campaign books:** story books, rules references and the Tutorial book, with keyword pop-ups and picture zoom.
- **Hero preparation** and **first-setup guides,** step by step with pictures.
- Hero management, a library, achievements and a profile.

**For retailers**

- Create and manage events, with tables, seats, rewards and table assembly guides.
- Print table QR codes, and the Tutorial book PDF for Wing 1 Tutorial events.

### Wing 1 Tutorial

The Wing 1 Tutorial is taught by its own book, *Into the Underkeep*:

- **In the app:** the TRIGGERS tab opens the page for each physical trigger card as the party reaches it, and Read Scene opens the page for each door.
- **On paper:** the book also exists as a printable PDF, so the tutorial can be played with the PDF alone. Its QR code points to the public page `/interaction/barricade`, which opens the Interaction without logging in.

The Tutorial wing is currently enabled only against the test API (see `isTestApi()` in `src/utils/apiEnv.ts`).

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm

### Install and run

```bash
git clone https://github.com/CGS-WEBSITES/drunagor_app_front.git
cd drunagor_app_front
npm install
npm run dev
```

The dev server runs at [http://localhost:3000](http://localhost:3000) and talks to the **test** API by default.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build-only` | Production build into `dist/` (no type check) |
| `npm run build` | Type check and build |
| `npm run type-check` | `vue-tsc` only |
| `npm run preview` | Serve the built `dist/` |
| `npm run test` | Playwright end-to-end tests (`e2e/`) |
| `npm run lint` / `npm run format` | ESLint / Prettier |

## Environments

A build talks to the **prod** API unless it is built with `VITE_API_ENV=test`. The switch is in `src/main.ts`.

```bash
npx vite build                      # prod  → drunagor.app
VITE_API_ENV=test npx vite build    # test  → teste.drunagor.app
```

Use the test server for any new feature, and keep test data on the test backend only.

## Deploying

Deploys are manual. Each site is an S3 bucket behind CloudFront.

1. **Build:** build for the right environment (see above).
2. **Sync assets:** run `aws s3 sync dist/ s3://<bucket>/` **without `--delete`**, because the buckets hold other folders.
3. **Upload the uncached files:** upload `index.html`, `sw.js`, `registerSW.js` and `manifest.webmanifest` with `Cache-Control: no-cache`.
4. **Invalidate CloudFront:** invalidate `/*` on the site's distribution.

**Production:** before deploying, copy the four uncached files to `_backup/<date>-before-<version>/` in the bucket. To roll back, copy them back and invalidate again.

## Project layout

```
src/
  components/      UI. The main screens are Lobby, CampaignImmersiveView, CampaignBookNew and InteractViewNew
  components/dialogs/  ManageEventDialog and other dialogs
  pages/           Routed pages, including the public InteractionPage (/interaction/:code)
  router/          Routes (index.ts)
  data/book/       Book content as JSON (PageSection: section, layout, content[{ id, title, body }])
  data/assembly/   Step-by-step guides (first setup, hero preparation, table assembly)
  utils/           Helpers: roomInteractions, tutorialBook, apiEnv, lobbyCode…
  store/           Pinia stores
e2e/               Playwright tests
```

Book images and PDFs are served from `assets.drunagor.app`. Large source files are not committed, such as InDesign packages and raw art.

## Contributing

1. Branch off `main`: `git checkout -b feature/your-feature`.
2. Keep commits small and in English, using [Conventional Commits](https://www.conventionalcommits.org/) (`feat(lobby): …`, `fix(book): …`).
3. Use the Vuetify theme tokens (`rgb(var(--v-theme-…))`) instead of hard-coded colors.
4. Open a pull request against `main` that describes the change and how you tested it.

See [CONTRIBUTING](./CONTRIBUTING.md) and the [Code of Conduct](./Code_of_conduct.md).

## Issues and support

Open an issue in this repository using GitHub Issues.

## License

MIT. See [LICENSE](./LICENSE.md).

## Acknowledgements

Our journey would not be possible without the community heroes who laid the foundation for this project. Read their tribute in [The Scroll of Gratitude](./The_Scroll_of_Gratitude.md).
