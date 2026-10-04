# Getting started

Suzume Design is a React component library. It works with any React setup
(CRA, Vite, Next.js, webpack, a plain `<script>` tag) and it does **not**
require a build plugin.

## Requirements

| | |
| --- | --- |
| React | `^19.0.0` - declared in `peerDependencies` |
| react-dom | same as React |
| TypeScript | `>= 4.4` recommended (older versions work, types are plain) |
| Node (SSR) | `>= 16` |

## Install

```bash
npm i @suzume-design/web-react
# yarn
yarn add @suzume-design/web-react
# pnpm
pnpm add @suzume-design/web-react
```

`react` and `react-dom` stay **peer** dependencies - they are never bundled.

## Load the styles

Pick **one** of these. Loading more than one will duplicate CSS.

### 1. Prebuilt CSS (recommended)

```ts
// main.tsx / app/layout.tsx / _app.tsx
import '@suzume-design/web-react/dist/css/suzume.css';
```

| File | Purpose |
| --- | --- |
| `dist/css/suzume.css` | Development / debuggable |
| `dist/css/suzume.min.css` | Production |
| `dist/css/index.less` | Less entry, if you want to compile Less yourself |

### 2. Per-component Less (on-demand)

```ts
import '@suzume-design/web-react/es/Button/style/index.less';
import '@suzume-design/web-react/es/Table/style/index.less';
```

Each component ships `style/index.less`, `style/token.less` and
`style/index.ts`. This path is what the optional
[build plugins](./plugins.md) automate, and it is the only path that supports
compile-time `modifyVars` theming.

### 3. UMD / CDN

```html
<link rel="stylesheet" href="https://unpkg.com/@suzume-design/web-react@latest/dist/css/suzume.min.css" />
<script src="https://unpkg.com/@suzume-design/web-react@latest/dist/suzume.min.js"></script>
<script src="https://unpkg.com/@suzume-design/web-react@latest/dist/suzume-icon.min.js"></script>
```

Globals: `window.suzume`, `window.suzumeicon`, `window.suzumehooks`.

## First component

```tsx
import { Button, Space, message } from '@suzume-design/web-react';

export function Example() {
  return (
    <Space>
      <Button type="primary" onClick={() => message.info('Saved')}>
        Save
      </Button>
      <Button>Cancel</Button>
    </Space>
  );
}
```

## Icons

```tsx
import { IconSearch, IconPlus } from '@suzume-design/web-react/icon';

<IconSearch />;
```

Icons live in a separate entry point so they can be tree-shaken
individually. See [icons.md](./icons.md).

## Global configuration

```tsx
import { ConfigProvider } from '@suzume-design/web-react';
import enUS from '@suzume-design/web-react/es/locale/en-US';

<ConfigProvider
  locale={enUS}
  prefixCls="suzume"
  componentConfig={{
    Modal: { okText: 'Confirm', cancelText: 'Cancel' },
  }}
>
  <App />
</ConfigProvider>;
```

## TypeScript

Types come from the package itself:

```ts
import type { TableProps, FormInstance, ButtonProps } from '@suzume-design/web-react';
```

`tsconfig.json` needs `"jsx": "react"` (or `react-jsx`) and
`"esModuleInterop": true`.

## Next steps

- [Next.js](./nextjs.md)
- [Theming and dark mode](./theming.md)
- [Component inventory](./components.md)
- [Forms](./forms.md) / [Tables](./tables.md) / [Overlays](./overlays.md)
