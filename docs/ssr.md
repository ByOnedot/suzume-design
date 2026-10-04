# SSR and hydration

Suzume Design is safe to render on the server. This page describes the
guarantees and the two things you must still get right.

## Guarantees

- **No browser globals during render.** Component render paths do not read
  `window`, `document`, `navigator`, `localStorage` or `matchMedia`. Browser
  access happens in `useEffect`, event handlers, or behind
  `isServerRendering()` guards (`components/_util/dom.ts`).
- **Stable initial markup.** The first client render is identical to the
  server output, so React does not warn about hydration mismatches for normal
  usage.
- **Portals are created after mount.** `Modal`, `Drawer`, `Dropdown`,
  `Popover`, `Trigger`, `Message` and `Notification` create their portal
  container in `componentDidMount` / `useEffect`, never during the server
  render.
- **IDs are deterministic on the server.** `useId`-style helpers return
  `undefined` during SSR and assign the concrete id after mount
  (`components/_util/hooks/useId.ts`), which React 18 `useId` also handles.

## Things you must do

### 1. Only render overlays on the client

```tsx
'use client';
import { useEffect, useState } from 'react';
import { Modal } from '@suzume-design/web-react';

export function Welcome() {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(true), []);   // never open on the server
  return <Modal visible={open} onCancel={() => setOpen(false)}>...</Modal>;
}
```

Rendering `<Modal visible>` straight into the first paint produces different
markup on the server (nothing) and the client (a portal), which React flags as
a hydration mismatch.

### 2. Do not read browser state while rendering

```tsx
// BAD - window is undefined during SSR
const isDark = document.body.getAttribute('suzume-theme') === 'dark';

// GOOD
const [isDark, setIsDark] = useState(false);
useEffect(() => {
  setIsDark(document.body.getAttribute('suzume-theme') === 'dark');
}, []);
```

The same applies to `localStorage` (theme, language), `window.innerWidth`
(responsive branching) and `navigator.language`.

## Persisting theme and language across SSR

Read the value on the server from a cookie and pass it down, or set it with an
inline script that runs before hydration:

```tsx
// app/layout.tsx
<html lang={locale} suppressHydrationWarning>
  <body suppressHydrationWarning>
    <script
      dangerouslySetInnerHTML={{
        __html: `if (localStorage.getItem('theme') === 'dark') document.body.setAttribute('suzume-theme','dark');`,
      }}
    />
    {children}
  </body>
</html>
```

For the language, prefer a cookie read in the root layout so the server
already renders the right locale:

```tsx
import { cookies } from 'next/headers';
import zhCN from '@suzume-design/web-react/es/locale/zh-CN';
import enUS from '@suzume-design/web-react/es/locale/en-US';

const locale = (await cookies()).get('locale')?.value === 'zh-CN' ? zhCN : enUS;

<ConfigProvider locale={locale}>{children}</ConfigProvider>;
```

## Server-side rendering checks

Run your pages through `next build && next start` (or `getServerSideProps`)
and look for:

| Warning | Cause | Fix |
| --- | --- | --- |
| `Warning: Prop ... did not match` | Value computed from `window`/`Date.now()` during render | Move to `useEffect`, or seed with the same value on both sides |
| `ReferenceError: document is not defined` | Browser API used during render or in a module scope | Guard with `typeof document !== 'undefined'`, or import the module dynamically with `{ ssr: false }` |
| `Hydration failed because the initial UI does not match` | Portal/overlay rendered on first paint | Open overlays after mount (see above) |
| `Expected server HTML to contain a matching ...` | Conditional render based on viewport | Use CSS breakpoints instead of JS branching where possible |

## Node environment

The library itself has no Node-specific code. If you render in a non-DOM
environment (jest node test environment, `react-test-renderer`), components
fall back to `isServerRendering()` behaviour: popups are skipped and canvases
(`Watermark`) are not touched.

## Checklist

- [x] Root layout imports the CSS
- [x] Client boundaries on interactive components
- [x] Overlays opened after mount
- [x] Theme attribute applied before hydration
- [x] Locale resolved on the server
- [x] No `window` / `localStorage` during render
- [x] `next build` + `next start` produce no hydration warnings
