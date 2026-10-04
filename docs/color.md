# Colour utilities - `@suzume-design/color`

The palette generation that powers Suzume Design's tokens lives in a separate,
framework-free package: `@suzume-design/color`.

```bash
npm i @suzume-design/color
```

```js
const { generate, getRgbStr, getPresetColors } = require('@suzume-design/color');
```

## API

### `generate(color, options)`

Returns one step or the whole 1-10 ramp for a colour, in light or dark mode.

```js
generate('#165DFF', { index: 1 });              // '#EDF3FF'
generate('#165DFF', { index: 10 });             // '#003AAB'
generate('#165DFF', { list: true });            // 10 light values
generate('#165DFF', { list: true, dark: true });// 10 dark values
generate('#165DFF', { index: 6, format: 'rgb' });
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `string` | - | Any CSS colour |
| `index` | `number` | `6` | Palette step `1..10` |
| `dark` | `boolean` | `false` | Use the dark palette algorithm |
| `list` | `boolean` | `false` | Return the full ramp |
| `format` | `'hex' \| 'rgb' \| 'hsl'` | `'hex'` | Output format |

### `getRgbStr(color)`

```js
getRgbStr('#165DFF'); // '22,93,255'
```

Handy because the CSS variables store channels separately:

```css
.suzume-tag-primary {
  background: rgb(var(--suzumeblue-6));
}
```

### `getPresetColors()`

```js
const presets = getPresetColors();
presets.suzumeblue.light;   // 10 light values
presets.suzumeblue.dark;    // 10 dark values
presets.suzumeblue.primary; // '#165DFF'
```

Presets: `red`, `orangered`, `orange`, `gold`, `yellow`, `lime`, `green`,
`cyan`, `blue`, **`suzumeblue`**, `purple`, `pinkpurple`, `magenta`, `gray`.

`suzumeblue` is the product primary blue. It is the renamed form of the
upstream brand token; every reference (Less variables, CSS variables,
`modifyVars` keys, `ConfigProvider` colour maps) uses `suzumeblue`.

## Where it is used

- `components/style/theme/color/palette.js` - Less function `color-palette()`
- `components/style/theme/color/palette-dark.js` - dark variant
- `components/style/theme/color/getRgbStr.js` - `color-rgb()` Less function
- `scripts/compileColors.js` - regenerates `compiled-colors.less`

Run `pnpm color` after changing a palette source.

## Testing

```bash
cd ../suzume-color
npm install
npm test     # 15 tests covering light/dark generation and every preset
```

## Relationship to the component library

`@suzume-design/web-react` declares `@suzume-design/color` as a regular
dependency, so installing the component library also brings the colour
utilities. You can import it directly in application code (for example to
build a chart palette that matches the design system).

See the `README.md` of the `suzume-color` repository for the full reference.
