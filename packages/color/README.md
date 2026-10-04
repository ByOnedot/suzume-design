# @suzume-design/color

Color palette generation and color utilities for **Suzume Design**.

`@suzume-design/color` generates the 1–10 light and dark palettes used by the
Suzume Design token system, and exposes a few small helpers for reading color
channels.

## Install

```bash
npm i @suzume-design/color
# or
yarn add @suzume-design/color
```

## Usage

```js
const { generate, getRgbStr, getPresetColors } = require('@suzume-design/color');

// A single step of a palette (index 1 - 10, default 6)
generate('#165DFF', { index: 1 }); // '#EDF3FF'

// The whole palette as an array
generate('#165DFF', { list: true });
// ['#EDF3FF', '#DCEBFF', ..., '#165DFF', ..., '#003AAB']

// Dark palette
generate('#165DFF', { list: true, dark: true });

// RGB channel string, handy for CSS `rgb(var(--token))`
getRgbStr('#165DFF'); // '22,93,255'

// Every preset palette (light + dark + primary for each key)
getPresetColors();
```

### `generate(color, options)`

| Option  | Type      | Default | Description                                  |
| ------- | --------- | ------- | -------------------------------------------- |
| `color` | `string`  | -       | Any CSS color string                         |
| `index` | `number`  | `6`     | Palette step, `1` – `10`                     |
| `dark`  | `boolean` | `false` | Generate the dark palette                    |
| `list`  | `boolean` | `false` | Return the full 10-step palette              |
| `format`| `string`  | `'hex'` | `hex`, `rgb` or `hsl`                        |

### Preset colors

`getPresetColors()` returns an object with a `light`, `dark` and `primary`
entry for every preset:

`red`, `orangered`, `orange`, `gold`, `yellow`, `lime`, `green`, `cyan`,
`blue`, **`suzumeblue`**, `purple`, `pinkpurple`, `magenta`, `gray`.

`suzumeblue` is the Suzume Design brand/primary blue (`#165DFF`).

## TypeScript

The package ships plain CommonJS source with no build step; types are not
bundled. It is consumed by `@suzume-design/web-react` for theme generation.

## License

MIT. See `LICENSE` and `THIRD_PARTY_NOTICES.md` in this repository.
