# Icons

Suzume Design ships **277 React icon components** across 7 categories.

```tsx
import { IconSearch, IconPlus, IconDelete } from '@byonedot/web-react/icon';

<IconSearch />;
<IconPlus style={{ fontSize: 20, color: '#165DFF' }} />;
```

The icon entry point is separate from the component entry point so unused
icons are dropped from the bundle.

## Sizes and colours

Icons inherit `font-size` and `color` from CSS:

```tsx
<IconHome style={{ fontSize: 16 }} />
```

```css
.menu-icon {
  font-size: 18px;
  color: var(--color-text-2);
}
```

## Props

All icons accept `IconProps`:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `spin` | `boolean` | `false` | Renders the rotating loading state |
| `size` | `number \| string` | - | Shortcut for `font-size` |
| `strokeWidth` | `number` | - | SVG stroke width (outline icons) |
| `...rest` | `SVGAttributes<SVGSVGElement>` | - | Passed to the underlying `<svg>` |

```tsx
<IconLoading spin size={24} />
```

## Custom prefix

The icon prefix follows `ConfigProvider`:

```tsx
import { ConfigProvider, IconHome } from '@byonedot/web-react';

<ConfigProvider prefixCls="my-app">
  <IconHome /> {/* class="my-app-icon" */}
</ConfigProvider>;
```

Inside the generated icon components this comes from `IconContext`
(`prefixCls = 'suzume'` by default).

## Inventory

Run `pnpm icon` in the repository to regenerate `icon/react-icon`,
`icon/react-icon-cjs`, `icon/index.js`, `icon/index.es.js`, `icon/index.d.ts`
and `icon/icons.json` from the SVG sources in `icon/_svgs/`.

The category/style breakdown lives in [`components.md`](./components.md).

## Adding an icon

1. Drop the SVG into `icon/_svgs/<category>/<style>/<name>.svg`.
2. Run `pnpm icon`.
3. Import it as `Icon<PascalName>`.

The generator runs SVGO, renders a Nunjucks template, transpiles it with Babel
and writes both ESM and CJS variants. The generated entry points start with
`'use client'` so they work as App Router client boundaries.

## CDN

```html
<script src="https://unpkg.com/@byonedot/web-react@latest/dist/suzume-icon.min.js"></script>
```

Global: `window.suzumeicon`.

## Note on third-party marks

The icon set contains third-party brand marks (social/platform logos) that are
part of the original asset set. They are content icons, not Suzume Design
branding. Corporate marks belonging to the upstream project are not
redistributed - see `THIRD_PARTY_NOTICES.md`.
