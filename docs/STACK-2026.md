# Verified target stack (checked against the npm registry at execution time)

Versions below were read from `npm view <pkg> dist-tags` / `versions` during
this modernization pass. Only stable, non-prerelease versions are targeted.

| Tool | Selected | Registry `latest` | Notes |
| --- | --- | --- | --- |
| React / React DOM | **19.3.0** | 19.3.0 | `latest` tag, stable |
| Next.js | **16.3.8** | 16.3.8 | `latest` tag, stable |
| TypeScript | **6.0.3** | 7.0.2 | see note 1 |
| pnpm | **12.9.1** | 12.9.1 | `latest` tag |
| Vitest | **5.0.3** | 5.0.3 | `latest` tag (not `V4`) |
| Playwright | **1.63.0** | 1.63.0 | `latest` tag (not `next`) |
| ESLint | **10.12.0** | 10.12.0 | `latest` (not `maintenance` 9.x) |
| Prettier | **3.9.9** | 3.9.9 | |
| @testing-library/react | **16.3.3** | 16.3.3 | peers `react ^18 \|\| ^19` |
| typescript-eslint | **8.71.0** | 8.71.0 | peers `eslint ^8.57\|\|^9\|\|^10`, `typescript >=4.8.4 <6.1.0` |
| jsdom | **30.1.1** | 30.1.1 | |
| Less | **4.9.1** | 4.9.1 | |
| tsup | **8.5.1** | 8.5.1 | peers `typescript >=4.5` |
| Node.js | **26.x (running)** | 22.23.3 (`node` pkg) | environment LTS-class release |

### Note 1 - why TypeScript 6.0.3 and not 7.0.2

`typescript@latest` is `7.0.2`, but it is **not usable by this repository
today** for two independent reasons, both verified from the registry:

1. `typescript-eslint@8.71.0` declares `peerDependencies.typescript`:
   `>=4.8.4 <6.1.0`. TypeScript 7.0.2 violates that peer range.
2. `typescript@7.0.2` is the native compiler: it exposes `bin.tsc` only
   (`main: null`), i.e. there is no `lib/typescript.js` JavaScript API. Every
   tool in this repo that does `require('typescript')` (declaration emit,
   `typescript-eslint`, `tsup`, editor tooling) would break.

TypeScript 6.0.3 is the newest stable release that satisfies both constraints
and matches the modernization brief ("TypeScript 6 or newer stable"). The
codebase is nevertheless being prepared for TypeScript 7 by removing
deprecated configuration rather than silencing it with `ignoreDeprecations`.

### Explicitly excluded

`alpha`, `beta`, `rc`, `canary`, `nightly`, `experimental`, `next` dist-tags
for every package above.
