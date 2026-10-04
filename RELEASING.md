# Releasing

Suzume Design publishes two version-locked packages:

| package | path | published |
| --- | --- | --- |
| `@byonedot/color` | `packages/color` | yes |
| `@byonedot/web-react` | `.` (workspace root) | yes |

Every other workspace package (`hooks/`, `icon/`, `tools/build-scripts`,
`tests/visual`, `integration/next-app`) is `"private": true` and is never
published.

Both packages always share one version: `web-react` declares
`@byonedot/color` as `^<version>` (rewritten at pack time by
`scripts/sync-color-dep.js`) and `scripts/pack-check.js` fails if that range
does not match the library's own version.

## One-time setup

### npm Trusted Publishing (preferred, no stored token)

1. Sign in at <https://www.npmjs.com> as a member of the `@byonedot`
   organisation.
2. For **each** package → *Settings* → *Trusted Publisher* → *GitHub Actions*:
   - Repository owner: `byonedot`
   - Repository name: `suzume-design`
   - Workflow filename: `release.yml`
   - Environment: leave empty
3. Nothing else. The workflow requests an OIDC token via `id-token: write` and
   `npm publish --provenance`; npm exchanges it for a short-lived publication
   grant. No `NPM_TOKEN` secret is stored.

### Fallback token

If trusted publishing is not configured yet, create an npm **automation** token
(granular, *Read and write*, scoped to `@byonedot`) and add it as the
repository secret `NPM_TOKEN`. The workflow prefers it when present.

### Repository rules

- `main` is protected: require the `CI / verify` status checks, 1 review, and
  dismiss stale reviews. Restrict pushes to the `Release` workflow.
- Tags matching `v*.*.*` may only be created by the release workflow.

## Cutting a release

1. Make sure `main` is green.
2. Update `CHANGELOG.md` with the new version's entries.
3. GitHub → **Actions** → **Release** → **Run workflow** with:
   - `version`: the semver, e.g. `1.1.0`
   - `dry_run`: `true` for a rehearsal, `false` for the real release

The workflow then, in order:

1. installs with `pnpm install --frozen-lockfile`
2. runs the full gate - branding, eslint, stylelint, typecheck, build, tests,
   `pack:check`, branding over `es/ lib/ dist/`
3. bumps `package.json`, `packages/color/package.json` and the version export in
   `components/index.tsx`
4. commits `chore(release): vX.Y.Z` and pushes it to `main`
5. tags `vX.Y.Z` and pushes the tag
6. publishes `@byonedot/color`, then `@byonedot/web-react`, both with
   `--provenance`
7. creates the GitHub release

### Tag-driven release

Pushing a tag `vX.Y.Z` runs the same workflow without the bump step, which is
useful when the version was bumped locally:

```bash
node ./scripts/bump-version.js 1.2.0
git add package.json packages/color/package.json components/index.tsx
git commit -m "chore(release): v1.2.0"
git push origin main
git tag -a v1.2.0 -m v1.2.0
git push origin v1.2.0
```

## Verifying a release

```bash
npm view @byonedot/color version
npm view @byonedot/web-react version
npm view @byonedot/web-react dist.attestations   # provenance URL

# clean-consumer smoke test (see integration/next-app for the fixture)
npx create-next-app@latest --ts --app /tmp/suzume-smoke
cd /tmp/suzume-smoke
npm i @byonedot/web-react react react-dom
```

## Local rehearsal

```bash
pnpm install --frozen-lockfile
pnpm check:branding && pnpm eslint && pnpm stylelint && pnpm typecheck
pnpm icon && pnpm build && pnpm test
pnpm pack:check
npm publish --dry-run
(cd packages/color && npm publish --dry-run)
```
