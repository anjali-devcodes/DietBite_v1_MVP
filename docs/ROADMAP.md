# DietBite — Roadmap

> Tracks what's done, what's in progress, and what's next. Update this file at the end of every milestone — it should always reflect ground truth, not aspiration.

Last updated: Milestone 10 complete (Meal Plan Builder)

---

## Completed Milestones

- [x] **Milestone 1 — Project Foundation & Monorepo Setup**
  Monorepo structure, Git init, React+Vite+Tailwind frontend scaffold, FastAPI backend scaffold, both dev servers verified running.

- [x] **Milestone 2 — Database Setup + User Model + JWT Auth**
  PostgreSQL setup, professional backend folder structure (`app/models|schemas|services|routers|core`), User model with roles, full JWT auth (signup, login, refresh, `/me`).

- [x] **Milestone 3 — React Frontend Auth**
  Axios instance with auto-refresh interceptor, AuthContext, Login/Signup pages, ProtectedRoute/RoleRoute guards, role-specific dashboard shells, full login→dashboard→logout flow verified.

- [x] **Milestone 4 — Alembic Migrations + User Profile & Admin Controls**
  Alembic wired up and made the source of truth for schema (removed `create_all`), user profile update + password change endpoints, admin endpoints for listing/updating/deleting users with role guard enforcement.

- [x] **Milestone 5 — Frontend Profile Page + Admin Panel UI**
  Shared `AppLayout` (sidebar + topbar), `ProfilePage` (edit info, change password), `AdminUsersPage` (user table with role dropdown, activate/deactivate, delete), all dashboards migrated to the new layout.

- [x] **Milestone 6 — Food Database Schema + IFCT Data Seeding + Food Search API**
  `food_categories` / `foods` / `food_nutrients` models (EAV-style nutrients), seed script with 12 categories and 40+ real Indian foods (13 nutrients each), search API with text/category/type/region filters, detail + nutrient summary endpoints.

- [x] **Milestone 7 — Food Search UI**
  Debounced live search, category/type/region filter bar, food card grid, nutrient detail modal (macros + vitamins/minerals breakdown), wired into navigation for all roles.

- [x] **Milestone 8 — Nutrient Calculator**
  Backend `/foods/calculate` endpoint reusing the per-100g scaling logic, frontend food picker + running meal list + live combined totals panel with %RDA bars against ICMR-NIN-based daily values.

- [x] **Milestone 9 — Dietitian Patient Management**
  `patients` + `patient_measurements` models, full CRUD API with dietitian ownership isolation (403 across dietitians), auto-BMI calculation, frontend patient list (search, create modal) + patient detail page (stats, edit, measurement history with progress logging).

- [x] **Milestone 10 — Meal Plan Builder**
  `meal_plans` → `meal_plan_days` → `meal_plan_items` models, plan CRUD + day/item management API with fresh-computed nutrient totals per day, frontend plan list (per patient), day-card builder UI grouped by meal slot, day totals summary, fully wired into patient detail page.

---

## Current Milestone In Progress

### 🔶 Milestone 11 — UI/UX Overhaul

**Status**: Scoping stage (not yet started in code)

**Intent**: Revisit all existing screens with deliberate visual design instead of the functional-first styling used to move quickly through Milestones 1–10. No new backend functionality expected in this milestone.

Planned sub-areas (to be broken into smaller working sessions):
- [ ] Establish a formal design token vocabulary (colors, spacing, typography scale, shadows) instead of ad-hoc Tailwind repetition
- [ ] Responsive design pass — verify and fix mobile/tablet behavior across every page (not considered until now)
- [ ] Consistent loading states (skeletons vs. spinners — pick one pattern and apply everywhere)
- [ ] Consistent empty states (currently inconsistent copy/iconography across food search, patients, meal plans)
- [ ] Consistent error states (currently just inline `<Alert>` everywhere — fine functionally, worth a visual review)
- [ ] Visual hierarchy pass on data-dense screens: `PatientDetailPage`, `MealPlanDetailPage`, `AdminUsersPage`
- [ ] Accessibility pass: color contrast, focus rings, semantic HTML (form labels, table headers, ARIA where needed)
- [ ] Navigation/IA review — is the sidebar grouping still right now that there are 5+ items per role?

---

## Planned Future Milestones (Priority Order)

1. **Reports & PDF Export**
   Let dietitians export a meal plan or patient summary as a shareable PDF/print view. High value for the primary user persona — this is often the literal deliverable a dietitian hands a patient today on paper.

2. **Progress Visualization**
   Weight/BMI trend charts on the patient detail page using the `patient_measurements` history already being collected. Pure frontend + a lightweight charting library (free/open-source, e.g. Recharts) — no backend changes needed.

3. **Improved Food Search (Typo Tolerance + Better Hinglish Support)**
   Current search is a simple `LIKE` query against `name` / `name_hindi` / `name_local`. Needs either Postgres trigram/fuzzy search (`pg_trgm`, free extension) or a proper transliteration approach for Hinglish queries like "chawal" matching "Rice."

4. **Automated Testing Foundation**
   No tests exist yet. Start with backend service-layer unit tests (pure functions, easy to test in isolation given the layering) and a handful of critical-path API integration tests (auth, ownership isolation). Frontend E2E (e.g. Playwright, free) can follow once backend coverage exists.

5. **Expand the Food Database**
   40+ foods is a strong proof of concept but not production-ready coverage. Needs a real ingestion pipeline from full IFCT 2017 data rather than hand-curated entries in a seed script.

6. **Admin Oversight Scoping**
   Explicitly decide and document what admins can/should do with patients and meal plans (currently they have full dietitian-equivalent access via the shared role guard). Likely needs read-only oversight + audit logging rather than full edit access.

7. **Notifications / Reminders** *(exploratory)*
   E.g. reminding a dietitian to log a patient's measurement, or a patient to follow their meal plan. Needs a decision on delivery channel (email is the cheapest free-tier option).

8. **AI-Assisted Features** *(explicitly deferred from MVP scope)*
   Nutrition AI assistant, OCR for food label scanning, recommendation engine. Not started, not scoped — intentionally last on this list per the original MVP boundaries.

---

## Deployment Checklist

Nothing below has been started. This is a planning checklist for when deployment becomes the active focus — **not a current todo list**.

- [ ] Choose free-tier hosting for the backend (e.g. Render, Railway free tier, or Fly.io — evaluate current free-tier terms at decision time, they change)
- [ ] Choose free-tier hosting for the frontend (e.g. Vercel, Netlify, Cloudflare Pages)
- [ ] Choose a free/managed Postgres option for production (e.g. Supabase, Neon, Railway — evaluate storage/connection limits against actual needs)
- [ ] Move all secrets (`SECRET_KEY`, `DATABASE_URL`) out of local `.env` into the hosting platform's secret management
- [ ] Update CORS `allow_origins` in `main.py` from `localhost:5173` to the real production frontend domain
- [ ] Set up a production build pipeline for the frontend (`npm run build`, verify output, configure hosting to serve `dist/`)
- [ ] Run Alembic migrations against the production database before first deploy
- [ ] Re-seed or migrate food data into production database (decide: re-run seed script, or export/import a data dump)
- [ ] Set `ACCESS_TOKEN_EXPIRE_MINUTES` / `REFRESH_TOKEN_EXPIRE_DAYS` deliberately for production (current values were dev defaults, not a security review)
- [ ] Generate a fresh, strong `SECRET_KEY` for production — never reuse the local dev key
- [ ] Decide on a custom domain (free options exist via some hosting providers; otherwise this is the most likely first paid cost)
- [ ] Set up basic uptime monitoring (free tier options: UptimeRobot, Better Uptime free plan)
- [ ] Set up basic error logging/monitoring (free tier options: Sentry free plan)
- [ ] Configure automated database backups (check what's included free on the chosen Postgres provider before assuming it's covered)
- [ ] Smoke-test the full auth → food search → calculator → patient → meal plan flow against the deployed environment before sharing the link with anyone

---

## Resume-Readiness Checklist

Things worth having in place before showcasing this project to employers, in interviews, or in a portfolio.

- [ ] **Live deployed link** — a real, working URL beats a "clone and run locally" instruction every time
- [ ] **Demo account or guest login** — a reviewer should not have to sign up to see the product; a pre-seeded dietitian + a few sample patients/plans makes a far better first impression
- [ ] **A polished README** at the repo root with: a short pitch, a screenshot or two, the tech stack, and setup instructions (the existing root `README.md` is currently minimal and was written in Milestone 1 — revisit it once UI work lands)
- [ ] **At least one architecture diagram** (even simple: client → API → DB) — visual communication matters more than people expect in interviews
- [ ] **Some automated tests** — even a modest backend test suite signals engineering maturity far beyond what manual Swagger testing communicates
- [ ] **A clear "what I'd do differently / what's next" section** — this `ROADMAP.md` file itself can largely serve this purpose if kept current
- [ ] **Clean, consistent commit history** — if commits so far have been large/milestone-sized, that's fine, but make sure commit messages clearly describe what shipped
- [ ] **This document and `PROJECT_CONTEXT.md` kept up to date** — a reviewer (or future you) skimming these two files should understand the entire project in under 10 minutes
- [ ] **A short demo video or GIF** in the README — especially valuable for a project with this much UI surface area, since not every reviewer will click through to the live link

---

## Nice-to-Have Future Enhancements

Lower priority than the roadmap above, but worth keeping on record so good ideas aren't lost:

- Dark mode
- Multi-language UI (Hindi/regional language interface, not just food name data)
- Bulk patient import (CSV) for dietitians migrating from spreadsheets
- Meal plan templates (save a plan as reusable, apply to a new patient)
- Recipe support — combining multiple foods into a single named dish with its own computed nutrition (the `recipe` `FoodType` enum value already exists but is unused)
- Patient-facing portal (currently only dietitians/admins ever view meal plans — patients have no way to log in and see their own plan)
- Barcode/packaged food lookup for branded Indian products
- Export patient progress charts as images for sharing
- Audit log for admin actions (who changed what role, when)
- Soft-delete instead of hard-delete for patients and meal plans (currently `DELETE` is permanent)
