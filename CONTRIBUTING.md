# Contributing to SysWatch

Thanks for taking the time to contribute. This document walks you through everything you need to go from zero to an open pull request — prerequisites, local setup, the checks you need to pass before pushing, and how we like commits and branches to be named.

---

## Prerequisites

Make sure you have these installed before starting:

| Tool | Minimum version | Check with |
|---|---|---|
| Git | 2.x | `git --version` |
| Python | 3.11 | `python --version` |
| Node.js | 18 | `node --version` |
| npm | 9 | `npm --version` |
| Docker *(optional)* | 24 | `docker --version` |

---

## Forking and cloning

1. **Fork** the repository on GitHub using the Fork button at the top right.

2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/SysWatch.git
   cd SysWatch
   ```

3. **Add the upstream remote** so you can pull future changes from the original repo:

   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/SysWatch.git
   ```

4. **Verify your remotes:**

   ```bash
   git remote -v
   # origin    https://github.com/YOUR_USERNAME/SysWatch.git (fetch)
   # origin    https://github.com/YOUR_USERNAME/SysWatch.git (push)
   # upstream  https://github.com/ORIGINAL_OWNER/SysWatch.git (fetch)
   # upstream  https://github.com/ORIGINAL_OWNER/SysWatch.git (push)
   ```

---

## Keeping your fork up to date

Before starting any new piece of work, sync with upstream:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## Branch naming

Branch names follow a `<type>/<short-description>` pattern using lowercase and hyphens. The type tells reviewers what kind of change to expect before they even open a diff.

| Type | When to use |
|---|---|
| `feat/` | A new user-facing feature |
| `fix/` | A bug fix |
| `chore/` | Dependency updates, config changes, tooling |
| `test/` | Adding or improving tests |
| `docs/` | Documentation only — no code changes |

**Examples:**

```
feat/process-kill-button
fix/websocket-reconnect-on-sleep
chore/upgrade-socketio-5
test/session-manager-unit
docs/docker-compose-env-vars
```

Always branch off `main`:

```bash
git checkout main
git checkout -b feat/your-feature-name
```

---

## Local setup

### Backend

```bash
cd backend

python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

pip install -r requirements.txt
pip install flake8             # linter used in CI

python app.py
```

The server starts at **http://localhost:5000**. Leave it running while you work on the frontend.

### Frontend

Open a second terminal:

```bash
cd frontend

cp ../.env.example .env       # only needed once
npm install

npm run dev
```

The dev server starts at **http://localhost:3000** with hot module replacement. Changes to `.tsx` and `.ts` files reflect immediately without a page reload.

---

## Checks to run before pushing

CI will fail your pull request if any of these checks fail. Run them locally first — it is much faster to catch a problem on your own machine than to wait for GitHub Actions.

### 1. Backend — flake8 lint

```bash
cd backend
source venv/bin/activate
flake8 . --max-line-length=120 --exclude=__pycache__,venv
```

A clean run produces no output. Fix all reported issues before pushing.

### 2. Frontend — TypeScript type check

```bash
cd frontend
npx tsc --noEmit
```

The project uses `strict: true`. No `any` types are allowed anywhere. Fix every error before pushing.

### 3. Frontend — production build

```bash
cd frontend
npm run build
```

This runs `tsc && vite build`. If the type check passes but the build fails (e.g. a missing import, an incompatible dependency), you will catch it here. The build output goes to `frontend/dist/` which is git-ignored.

All three checks must pass cleanly. If you are unsure about a type, look at the existing patterns in `src/types/index.ts` — every interface is explicit, and the store in `dashboardStore.ts` shows how they are used together.

---

## Commit message format

We use a lightweight version of Conventional Commits. Every commit message should be a single line in the form:

```
<type>(<scope>): <short imperative description>
```

- **type** — same values as branch types: `feat`, `fix`, `chore`, `test`, `docs`
- **scope** — the part of the codebase affected, in parentheses (optional but encouraged)
- **description** — what the commit *does*, written in the imperative mood ("add", "fix", "remove", not "added", "fixed", "removes")

**Good examples:**

```
feat(socket): add per-client greenthread stream with pause support
fix(session): remove stale session on WebSocket disconnect
chore(deps): upgrade flask-socketio to 5.4.0
test(session_manager): add cleanup_old_sessions unit tests
docs(readme): add architecture decision section
```

**What to avoid:**

```
# Too vague
fix stuff
update code
wip

# Wrong tense
added dark mode toggle
fixed the reconnect bug

# No scope context
feat: thing
```

If a commit genuinely touches multiple areas, split it into separate commits. Small, focused commits are much easier to review and to revert if something goes wrong.

---

## Opening a pull request

1. Push your branch to your fork:

   ```bash
   git push origin feat/your-feature-name
   ```

2. Open a pull request from your branch to `main` on the upstream repository.

3. Fill in the PR description. A good description answers three questions:
   - **What** does this change?
   - **Why** is this change needed?
   - **How** can a reviewer verify it works?

4. Make sure all three GitHub Actions jobs pass — `backend-test`, `frontend-build`, and (on merges to `main`) `docker-build`.

5. Address review feedback with additional commits on the same branch. Do not force-push a branch that already has a pull request open — it makes the review history harder to follow.

---

## Code style

- **Python** — PEP 8, max line length 120, no docstrings, no inline comments unless the logic is genuinely non-obvious
- **TypeScript** — strict mode, no `any`, interfaces over type aliases for object shapes, named exports everywhere
- **CSS** — Tailwind utility classes only, no custom CSS except for the CSS custom properties in `index.css`
- **Formatting** — no automated formatter is enforced at the moment, but keep your style consistent with the surrounding code

---

## Questions

If something is unclear, open an issue before writing code. It is far easier to align on an approach in a short discussion than to refactor a complete implementation during review.
