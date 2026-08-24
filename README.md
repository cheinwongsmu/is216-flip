# IS216 - Exemplar Project
## FLIP - Flashcard Learning Interactive Platform

> Study smarter, one flip at a time. Built with Vue 3, Pinia, Vue Router, Bootstrap 5, and Supabase.

This repository is an **exemplar project** — it's meant to be cloned and set up from scratch so you can see a complete, working full-stack app: a Vue 3 frontend, a Supabase backend (Postgres + Auth), and a Playwright end-to-end test suite. Follow the steps below in order.

## Tech stack

| Layer      | Tech                                              |
|------------|----------------------------------------------------|
| Frontend   | Vue 3 (`<script setup>`), Vue Router, Pinia, Bootstrap 5, Chart.js |
| Backend    | Supabase (Postgres database + Auth)               |
| Build tool | Vite                                               |
| E2E tests  | Playwright                                         |

## Try it live

Don't want to set up your own Supabase project? You can try the deployed app directly:

**🔗 [is216-flip.vercel.app](https://is216-flip.vercel.app)**

Two demo accounts are available:

| Role  | Email                | Password    |
|-------|-----------------------|-------------|
| User  | `user1@smu.edu.sg`    | `p@ssw0rd`  |
| Admin | `admin@smu.edu.sg`    | `p@ssw0rd`  |

- Log in with the **user** account to try creating decks, adding cards, and studying.
- Log in with the **admin** account to explore the admin dashboard (usage stats, content moderation).
- Alternatively, click **Sign Up** to register your own free-standing user account.

This is a shared demo environment — please don't enter any real personal information, and expect other students to be using the same demo accounts.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later, and pnpm
- A free [Supabase](https://supabase.com/) account
- Git

## 1. Clone the repo

```bash
git clone https://github.com/cheinwongsmu/flip.git
cd flip
pnpm install
pnpm approve-builds --all
```

## 2. Create your own Supabase project

1. Go to [supabase.com](https://supabase.com/) and sign in (or create an account).
2. Click **New Project**, give it a name and set a database password (save it somewhere).
3. Wait for the project to finish provisioning (usually under two minutes).

## 3. Create the database schema

1. In your Supabase project, open **SQL Editor** (left sidebar).
2. Open [`supabase/schema.sql`](supabase/schema.sql) from this repo, copy its contents, paste them into a new SQL Editor query, and click **Run without RLS**.

This creates three tables:

| Table      | Purpose                                                        |
|------------|------------------------------------------------------------------|
| `profiles` | One row per registered user — username, email, and `role` (`user` or `admin`) |
| `decks`    | Flashcard decks, each owned by a user via `user_uuid`           |
| `cards`    | Individual flashcards (`front` / `back`), linked to a deck via `deck_id` |

The schema deliberately ships without Row Level Security policies, so the publishable key can read and write freely — that keeps the setup simple for learning purposes. If you extend this project for anything beyond local learning, look into [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) to lock down who can read/write what.

## 4. Configure Supabase Auth

By default, Supabase requires users to confirm their email address before they get a session — but this app expects `supabase.auth.signUp()` to return a session immediately (see `register()` in [`src/stores/auth.js`](src/stores/auth.js)), and the Playwright tests rely on the same behavior. For local development, turn that requirement off:

1. In your Supabase project, go to **Authentication → Sign In / Providers → Email**.
2. Turn **off** "Confirm email".
3. Save.

(If you'd rather keep email confirmation on, you'll need to confirm each test/demo account manually from **Authentication → Users** before it can log in — registration and the e2e tests will otherwise fail.)

## 5. Set your environment variables

1. Copy the .env.example file and rename it to .env using the terminal command below:
   ```bash
   cp .env.example .env
   ```
2. In your Supabase project:
    - go to **Project Settings → General** and copy the Project ID for the `your-project-ref` in VITE_SUPABASE_URL.
    - go to **Project Settings → API Keys** and copy the publishable key for the VITE_SUPABASE_PUBLISHABLE_KEY.
3. Fill both values into `.env`:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxxxxxxxxxx
   ```

`.env` is gitignored — never commit your real keys.

## 6. Run the app

```bash
pnpm run dev
```

Open the printed local URL (usually `http://localhost:5173`). You'll land on the landing page; click **Login** or **Sign Up** to register a new account, which drops you into the dashboard at `/user`.

### Becoming an admin (optional)

Every new account gets `role = 'user'` in the `profiles` table. To explore the admin dashboard at `/admin` (usage stats, content moderation), manually update the `role` column in the `profiles` to `admin`.

Log out and back in for the app to pick up the new role — it'll route you to `/admin` automatically.

## 7. Run the end-to-end tests

The `e2e/` folder contains a [Playwright](https://playwright.dev/) test suite that drives the real app in a browser — a good reference for how to structure end-to-end tests of your own.

### One-time setup

Install the browser binaries Playwright needs (only required once per machine):

```bash
npx playwright install
```

### Create a testing account

Before running the suite, create a testing account through the app's **Sign Up** page using the information below:

- Email: `user1@smu.edu.sg`
- Password: `p@ssw0rd`

### Run the tests

You do **not** need to start `pnpm run dev` yourself — Playwright's config (`playwright.config.js`) starts the dev server automatically if one isn't already running.

```bash
pnpm playwright test          # run the full suite headlessly
pnpm playwright test --ui     # run interactively in Playwright's UI mode (great for learning)
pnpm playwright show-report   # open the HTML report from the last run
```

### What's in the suite

| File                            | What it covers                                              |
|----------------------------------|---------------------------------------------------------------|
| `e2e/landing.spec.js`            | Public landing page content and navigation                |
| `e2e/auth.spec.js`               | Registering, logging in/out, invalid-credentials handling   |
| `e2e/deck.spec.js`               | Creating a deck with cards, and deleting a deck              |
| `e2e/helpers.js`                 | Shared helpers (`register`, `login`, `logout`, `uniqueUser`) reused across spec files |

`helpers.js` is worth reading first as it shows the pattern the rest of the suite follows: keep common flows (like registering a user or logging in) in one place, and call them from each test instead of repeating the same clicks everywhere.

## Project structure

```
src/
├── components/      # Reusable UI pieces (FlashCard, DeckCard, CardEditor, ...)
├── composables/     # Reusable composition-API logic (useStudySession)
├── layouts/         # Shared page shells for the user area and the admin area
├── lib/             # Supabase client setup
├── router/          # Vue Router routes and navigation guards
├── stores/          # Pinia stores (auth, deck)
└── views/
    ├── user/        # Dashboard, create/edit deck, study, results, profile
    └── admin/       # Admin dashboard, content moderation

e2e/                 # Playwright end-to-end tests
supabase/schema.sql  # Database schema — run this in Supabase's SQL Editor
```

## Concepts to look at

Beyond just running the app, these are the patterns worth reading if you're learning from this codebase:

- **Pinia stores as the data layer** ([`src/stores/auth.js`](src/stores/auth.js), [`src/stores/deck.js`](src/stores/deck.js)) - components never call `supabase` directly; they call store actions like `deckStore.loadDecks()` or `authStore.login()`. The stores own all the Supabase queries and hold the resulting state (`session`, `profile`, `decks`), so any component can read the same data without re-fetching it. Notice how `deck.js` converts raw database rows (`is_known`, `user_uuid`) into camelCase view models (`isKnown`) via `toCard`/`toDeck` — that's the seam between "what the database calls it" and "what the UI calls it".

- **Route guards for role-based redirects** ([`src/router/index.js`](src/router/index.js)) - `router.beforeEach` runs before every navigation and checks `auth.profile.role`. It's what silently sends an admin account to `/admin` when they land on `/user`. There's no guard blocking a *non*-admin from typing `/admin` into the URL bar directly, which is worth noticing and thinking about (what would you add to close that gap?).

- **A composable for reusable stateful logic** ([`src/composables/useStudySession.js`](src/composables/useStudySession.js)) - this is plain state (current card, flipped/not, known/unknown counts) with no Supabase calls at all. `UserStudyView.vue` calls `useStudySession(cards)` to get an isolated study session, then separately persists results back through `deckStore.markKnown()`.

## Ethical use

This project is a teaching exemplar, not a hardened application, so use it accordingly:

- **Use your own Supabase project and your own test data.** Don't register accounts with anyone else's real name, email, or personal details. Please use fake or clearly-labelled test data (like the `user1@smu.edu.sg` test account above) instead. Because this schema has no Row Level Security ([step 3](#3-create-the-database-schema)), any account can read every profile, deck, and card in your project via the admin views, there's no privacy boundary protecting whatever you put in there.
- **Don't point it at real user data or deploy it to serve real users.** It's built for local learning, not production traffic — see the [Disclaimer](#disclaimer) below.
- **Use it to learn, not to submit as your own work.** Please nota that it is against the academic integrity policy if you copy this exemplar wholesale and presenting it as your own. You should use it as reference and write your own implementation.
- **Don't share your `.env` or Supabase keys.** Even though this project uses no RLS by design, treat your project URL and publishable key as you would any credential - an open backend with no restrictions is one more reason not to leak it publicly (e.g. in a public GitHub repo or Discord message).

## Disclaimer

This project is provided **as-is**, for educational purposes, with no warranty of any kind. It is **intentionally simplified** for learning and is **not** production-ready. Do not use it to store real personal data, deploy it for real users, or treat it as a security reference. You are responsible for what you build with your own Supabase project, including any usage costs, data you store there, and how you configure its access controls. The author(s) of this repository **ARE NOT LIABLE** for any loss, damage, or misuse arising from its use.
