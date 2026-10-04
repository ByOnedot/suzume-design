# Third-Party Notices

## Provenance of this distribution

`suzume-design` / `@byonedot/web-react` is a **modified redistribution**
of the upstream **Arco Design** React component library
(`github.com/arco-design/arco-design`), which is published under the MIT
License.

- Upstream project: Arco Design (React component library)
- Upstream copyright holder: ByteDance, Inc. and its affiliates
- Upstream license: MIT - reproduced verbatim in [`LICENSE`](./LICENSE)

The upstream MIT copyright notice and permission notice are preserved exactly
as required by the license. Modifications made for this distribution include:

- Renaming the product ("Arco Design" -> "Suzume Design") and the npm scope
  (`@arco-design/*` -> `@byonedot/*`).
- Renaming the CSS / class / Less / CSS-variable prefixes
  (`arco` -> `suzume`, `arcoblue` -> `suzumeblue`).
- Removing the upstream documentation website, marketing assets, upstream
  corporate logo icon and upstream release-history files.
- Vendoring the upstream build tooling as `tools/build-scripts/` so no
  upstream package is required at build or install time.
- Documentation rewritten for this distribution.

Nothing in this repository should be read as a claim that the original
component library was authored by Suzume Design.

## Where upstream names may appear

Upstream project names, the upstream company name and upstream repository
paths are intentionally confined to:

| File | Why |
| --- | --- |
| `LICENSE` | Required MIT copyright + permission notice |
| `THIRD_PARTY_NOTICES.md` (this file) | Required attribution / provenance |
| `Copyright ...` lines in generated bundle banners | Copyright notice carried into binaries |

Every other file - source, tests, styles, documentation, package metadata and
build output - is expected to be free of upstream branding. This is enforced
by `yarn check:branding` (`scripts/check-branding.js`), which runs in CI and
fails the build on any match outside the allowlist above.

## Vendored upstream code

| Location | Upstream | License | Change |
| --- | --- | --- | --- |
| `tools/build-scripts/lib/**` | `arco-scripts` (`@arco-design/arco-scripts` build CLI) | MIT | Renamed, site/doc-site commands removed, branded as `suzume-build` |
| `tools/build-scripts/vendor/dev-utils/**` | `arco-cli-dev-utils` (`print`, `getRealRequirePath`, `webpackExternalForArco`) | MIT | Renamed, reduced to the three helpers actually used |
| `tools/build-scripts/vendor/babel-config.*` | `arco-scripts-babel-config` | MIT | Unchanged apart from its file location |

These are build-time tools only. They are **not** dependencies of the
published package: `dependencies` in `package.json` contains no upstream
package, and `devDependencies` are never installed by consumers.

## Runtime dependencies

`@byonedot/web-react` declares these runtime dependencies, all MIT (or
compatible) licensed third-party packages from the public npm registry:

| Package | License |
| --- | --- |
| `@babel/runtime` | MIT |
| `@byonedot/color` | MIT (this ecosystem) |
| `b-tween` | MIT |
| `b-validate` | MIT |
| `compute-scroll-into-view` | MIT |
| `dayjs` | MIT |
| `lodash` | MIT |
| `number-precision` | MIT |
| `react-focus-lock` | MIT |
| `react-is` | MIT |
| `react-transition-group` | MIT |
| `resize-observer-polyfill` | Apache-2.0 |
| `scroll-into-view-if-needed` | MIT |
| `shallowequal` | MIT |

`react` and `react-dom` are peer dependencies (MIT).

## Fonts

The default font stack references system fonts only
(`Inter, -apple-system, BlinkMacSystemFont, PingFang SC, ...`). No web font
files are bundled or downloaded.

## Icons

The icon set is derived from the upstream SVG set. Third-party platform /
social brand marks that shipped with that set are redistributed as content
icons under their upstream terms. The upstream project's corporate logo icon
was removed from this distribution because it is upstream branding rather
than a functional part of the design system.

## Demo content

Sample strings used in demos and tests were replaced with neutral
placeholders (`Example`, `Sample`, `Demo`). Mock images that were hosted on
upstream infrastructure were replaced with locally generated SVG data URIs, so
the templates make no upstream network requests.
