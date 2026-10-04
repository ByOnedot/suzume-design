# Hooks

Two hooks are part of the public API. Both are exported from the package root
and from the dedicated hooks entry point.

```tsx
// from the package root
import { useWatermark, useVerificationCode } from '@suzume-design/web-react';

// from the hooks entry point (smaller graph, separate ESM/CJS builds)
import { useWatermark, useVerificationCode } from '@suzume-design/web-react/hooks';
```

The `hooks` entry resolves to `hooks/es` (`module`) and `hooks/lib` (`main`),
which are thin re-export wrappers around `components/_hooks/*`.

Both hooks touch the DOM, so call them from Client Components.

## `useWatermark`

Draws a repeating watermark into a canvas and inserts it into a container.

```tsx
'use client';

import { useRef } from 'react';
import { useWatermark } from '@suzume-design/web-react';

export function Panel() {
  const containerRef = useRef<HTMLDivElement>(null);

  useWatermark(containerRef, {
    content: 'Confidential',
    gap: [160, 160],
    rotate: -22,
    fontStyle: { color: 'rgba(0,0,0,0.08)', fontSize: 16 },
  });

  return <div ref={containerRef} style={{ height: 400 }} />;
}
```

### Options (`WatermarkOptions`)

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `string \| string[]` | `''` | Text lines drawn on the canvas |
| `image` | `string` | - | Image source; takes precedence over `content` |
| `fontStyle` | `{ color, fontFamily, fontSize, fontWeight }` | `rgba(0,0,0,0.15)`, `sans-serif`, `16px`, `normal` | Text style |
| `gap` | `[number, number]` | `[100, 100]` | Horizontal / vertical spacing in px |
| `offset` | `[number, number]` | `gap / 2` | Offset of the pattern |
| `rotate` | `number` | `-20` | Rotation in degrees |
| `width` / `height` | `number \| string` | `100` (image) / measured (text) | Size of one tile |
| `zIndex` | `number` | - | Stacking order of the watermark layer |
| `getContainer` | `() => HTMLElement` | `() => document.body` | Host element |

Returns `{ destroy }`. The host element receives a
`data-suzume-watermark-origin-position` attribute used to preserve the previous
`position` style.

## `useVerificationCode`

State machine for a segmented one-time-code input (email / SMS codes).

```tsx
'use client';

import { useRef } from 'react';
import { useVerificationCode } from '@suzume-design/web-react';

export function CodeInput() {
  const refs = useRef<(HTMLInputElement | HTMLTextAreaElement)[]>([]);

  const { value, filledValue, setValue, getInputProps } = useVerificationCode({
    length: 6,
    value: '',
    onChange: (v) => console.log('code', v),
    onFinish: (v) => console.log('complete', v),
    getInputRefList: () => refs.current,
  });

  return (
    <div>
      {filledValue.map((char, index) => (
        <input
          key={index}
          ref={(el) => (refs.current[index] = el as HTMLInputElement)}
          {...getInputProps(index)}
          inputMode="numeric"
          aria-label={`Digit ${index + 1} of 6`}
        />
      ))}
      <output>{value}</output>
      <button onClick={() => setValue('')}>Clear</button>
    </div>
  );
}
```

### Return value (`VerificationCodeReturnType`)

| Member | Type | Description |
| --- | --- | --- |
| `value` | `string` | Current code |
| `filledValue` | `string[]` | One entry per segment (for rendering the boxes) |
| `setValue` | `(v: string) => void` | Replace the whole code programmatically |
| `getInputProps` | `(index: number) => { key, value, onClick, onKeyDown, onChange, onPaste }` | Spread onto segment `<input>` elements - wires up typing, backspace navigation, paste distribution and focus handling |

### Options (`VerificationCodeOptions`)

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `length` | `number` | `6` | Number of segments |
| `value` / `defaultValue` | `string` | `''` | Controlled / uncontrolled value |
| `onChange` | `(value: string) => void` | - | Fires on every edit |
| `onFinish` | `(value: string) => void` | - | Fires once every segment is filled |
| `getInputRefList` | `() => (HTMLInputElement \| HTMLTextAreaElement)[]` | - | Supplies the DOM nodes used for focus / paste handling |

See `components/_hooks/useVerificationCode/README.en-US.md` for a complete
example with `VerificationCode`-style rendering.

## Internal hooks (not public API)

`components/_util/hooks/` contains shared implementation hooks
(`useMergeValue`, `usePrevious`, `useRefs`, `useUpdate`, `useKeyboardEvent`,
`useStateCallback`, `useResizeObserver`, `useInterval`, `useInView`, ...).
They are used by components internally and are **not** exported from the
package entry points. Import them from your own copy only if you accept that
they may change between minor releases.
