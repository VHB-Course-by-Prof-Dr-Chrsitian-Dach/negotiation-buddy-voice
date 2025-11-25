Cloudflare Pages deployment notes

If your Cloudflare Pages build log fails with an error like:

```
error: lockfile had changes, but lockfile is frozen
note: try re-running without --frozen-lockfile and commit the updated lockfile
```

This repository included a `bun.lockb` file which causes Cloudflare to use `bun install --frozen-lockfile` during the build. The Pages build can fail when the lockfile does not match `package.json`.

What to do

Option A — Recommended: Remove `bun.lockb`
- Remove the tracked `bun.lockb` file so Cloudflare Pages falls back to the Node/npm install flow. This is the safest option unless you specifically rely on Bun in CI.

Commands:

```bash
git rm bun.lockb
git commit -m "Remove bun.lockb to avoid Cloudflare frozen-lockfile install"
git push
```

Option B — Keep using Bun
- If you prefer Bun, regenerate a matching lockfile and commit it. Run `bun install` locally, add `bun.lockb`, and push.

Cloudflare Pages recommended settings
- Framework preset: `None` (or `Vite`)
- Install command: leave blank (or `npm ci`)
- Build command: `npm run build`
- Output directory: `dist`

Quick local checks
- Install dependencies: `npm ci`
- Build: `npm run build`

If you'd like, I can also regenerate a `bun.lockb` locally and commit it instead (requires Bun installed).
