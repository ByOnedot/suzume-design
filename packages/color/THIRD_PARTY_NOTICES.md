# Third-Party Notices

## Provenance

`@suzume-design/color` is a modified redistribution of the upstream
**ArcoDesign color utils** package (`@arco-design/color`), published under the
MIT License.

- Upstream project: `@arco-design/color` (the colour utilities of the Arco
  Design component library)
- Upstream copyright holder: ByteDance, Inc. and its affiliates
- Upstream license: MIT - reproduced verbatim in [`LICENSE`](./LICENSE)

The upstream MIT copyright and permission notices are preserved exactly as
required. Modifications performed for this distribution include:

- Renaming the package to `@suzume-design/color`.
- Renaming the primary palette preset `arcoblue` to `suzumeblue`.
- Rewriting the README and metadata for this distribution.

The colour **algorithms** are unchanged; only product-specific identifiers
were renamed.

## Where upstream names may appear

Upstream names are confined to:

| File | Why |
| --- | --- |
| `LICENSE` | Required MIT copyright + permission notice |
| `THIRD_PARTY_NOTICES.md` (this file) | Required attribution / provenance |
| `CHANGELOG.md` | Documents the old -> new rename table |

Everything else is checked by `npm run check:branding`
(`scripts/check-branding.js`), which runs in CI.

## Runtime dependencies

| Package | License |
| --- | --- |
| `color` | MIT |
| `jest` (dev) | MIT |
