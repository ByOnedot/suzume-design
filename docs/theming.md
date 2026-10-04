# Theming, design tokens and dark mode

Suzume Design exposes its design system as **CSS custom properties** defined on
`body`, plus Less variables for compile-time customisation.

## Token layers

| Layer | Where | When it applies |
| --- | --- | --- |
| Global tokens | `--color-*`, `--font-*`, `--spacing-*`, `--border-radius-*`, `--shadow-*`, `--z-index-*`, `--transition-*` | Always |
| Palette ramps | `--suzumeblue-1..10`, `--green-1..10`, `--red-1..10`, `--gray-1..10`, ... | Always |
| Component tokens | `--color-text-1`, `--color-bg-1`, `--color-border`, `--btn-*`, `--modal-*` ... | Always |
| Runtime overrides | inline `style` on `body` | Via `ConfigProvider` `theme` |

The palette ramps come from [`@suzume-design/color`](./color.md). The primary
blue is **`suzumeblue`** (`#165DFF`).

## Inspecting tokens

Open devtools and select `<body>`: every token is listed under
*Computed* → *CSS variables*. Because the prefix is empty by default you will
see `--color-text-1`, not `--suzume-color-text-1`.

```less
// components/style/theme/default.less
@prefix: suzume;                      // class-name prefix -> .suzume-btn
@suzume-theme-tag: body;              // where CSS variables are declared
@suzume-vars-prefix: ~'';             // CSS variable prefix (empty by default)
@suzume-cssvars-prefix: if(@suzume-vars-prefix = ~'', -, ~'--@{suzume-vars-prefix}');
```

Set `@suzume-vars-prefix` to a non-empty value before importing the styles if
another library on the page already owns the unprefixed names:

```less
@suzume-vars-prefix: 'suzume';
@import '@suzume-design/web-react/dist/css/index.less';
```

This produces `--suzume-color-text-1` instead of `--color-text-1`.

## Compile-time theming (Less `modifyVars`)

Only works when you compile the library's Less yourself:

```ts
import '@suzume-design/web-react/es/Button/style/index.less';
import '@suzume-design/web-react/es/Table/style/index.less';
```

```js
// webpack
{
  loader: 'less-loader',
  options: {
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {
        'suzumeblue-6': '#00A870',
        'border-radius-small': '2px',
        'font-size-body-1': '13px',
      },
    },
  },
}
```

```js
// next.config.js
module.exports = {
  lessLoaderOptions: {
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: { 'suzumeblue-6': '#00A870' },
    },
  },
};
```

If you use the prebuilt `suzume.css`, `modifyVars` has no effect - use the
runtime API below instead.

## Runtime theming (works with prebuilt CSS)

```tsx
import { ConfigProvider } from '@suzume-design/web-react';

<ConfigProvider
  theme={{
    primaryColor: '#00B42A',
    primaryColorHover: '#25BB65',
    primaryColorActive: '#009A24',
    infoColor: '#165DFF',
    successColor: '#00B42A',
    warningColor: '#F77234',
    dangerColor: '#F53F3F',
  }}
>
  <App />
</ConfigProvider>;
```

`ConfigProvider` writes the values onto `document.body` as CSS variables
(`--suzumeblue-6`, `--suzumeblue-5`, `--suzumeblue-7`, `--green-6`, ...) on
mount. It is a browser-only operation - render `ConfigProvider` inside a
client component, or accept that the first server render uses the default
theme.

You can also set them yourself:

```ts
document.body.style.setProperty('--suzumeblue-6', '#00B42A');
```

## Class-name prefix

```tsx
<ConfigProvider prefixCls="my-app">
  <Button>Hi</Button>
</ConfigProvider>
```

renders `class="my-app-btn"`. Keep the Less side in sync:

```less
@prefix: my-app;
```

The two must match, otherwise styles stop applying.

## Dark mode

The same stylesheet serves both modes. Dark values are declared as:

```less
@{suzume-theme-tag} {
  // light values
  &[suzume-theme='dark'] {
    // dark values
  }
}
```

Toggle the attribute on `<body>`:

```ts
document.body.setAttribute('suzume-theme', 'dark');
document.body.removeAttribute('suzume-theme'); // back to light
```

Follow the operating-system preference:

```tsx
'use client';
import { useEffect, useState } from 'react';

export function usePrefersDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setDark(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (dark) document.body.setAttribute('suzume-theme', 'dark');
    else document.body.removeAttribute('suzume-theme');
  }, [dark]);

  return dark;
}
```

To avoid a flash of the light theme on first paint, set the attribute before
hydration with a small inline script in your root layout:

```html
<script>
  if (localStorage.getItem('theme') === 'dark') {
    document.body.setAttribute('suzume-theme', 'dark');
  }
</script>
```

There is **no** separate dark stylesheet: do not look for `suzume.dark.css`.

## Design token reference

Tokens are declared in:

| File | Contents |
| --- | --- |
| `components/style/theme/default.less` | prefix configuration, font family, timing, z-index |
| `components/style/theme/global.less` | colour ramps, semantic colours, light + dark |
| `components/style/theme/component.less` | component-level Less tokens |
| `components/style/theme/css-variables.less` | the emitted CSS custom properties |
| `components/style/theme/color/compiled-colors.less` | generated palette values |

Regenerate palette-derived Less with `pnpm color`.

## Custom component skins

Override a single component without touching the rest:

```less
// custom.less - compile after the library styles
.suzume-btn-primary {
  border-radius: 999px;
}

body[suzume-theme='dark'] .suzume-card {
  border-color: #3a3a3c;
}
```

Prefer CSS variables over class overrides when a token exists - they keep
working across light/dark and future releases.
