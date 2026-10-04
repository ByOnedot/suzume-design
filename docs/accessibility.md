# Accessibility

Suzume Design aims for WCAG 2.1 AA on its interactive components. This page
lists what the library guarantees so you can rely on it, plus what your
application still has to do.

## What the library guarantees

### Keyboard support

| Component | Keys |
| --- | --- |
| `Button` | `Enter` / `Space` activate; native `<button>` semantics |
| `Input` / `InputNumber` | typing, `Enter` submits the enclosing form, `ArrowUp`/`ArrowDown` step numbers |
| `Select` / `AutoComplete` | `ArrowUp`/`ArrowDown` move the active option, `Enter` select, `Esc` close, type-ahead filters |
| `Menu` | `Arrow` keys move between items, `Enter`/`Space` activate, `ArrowRight`/`ArrowLeft` expand/collapse sub-menus |
| `Tabs` | `Enter` activates the focused tab |
| `Modal` / `Drawer` | focus moves in on open, is **trapped** while open, `Esc` closes, focus returns to the trigger |
| `Dropdown` / `Popover` / `Popconfirm` | `Esc` closes, inner controls are reachable |
| `Tree` | `Arrow` navigation, `Enter` selects, `Space` toggles checkboxes |
| `VerificationCode` | typing, `Backspace` moves to the previous segment, paste distributes across segments |
| `Upload` | file input is a real `<input type="file">` |

### ARIA

Verified against the component sources:

| Component | Attributes emitted |
| --- | --- |
| `Modal` / `Drawer` | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` (title), `aria-label="Close"` on the close button, `aria-hidden` on the mask |
| `Message` / `Notification` | `role="alert"` on the notice container, so assistive technology announces it |
| `Select` / `AutoComplete` | `role="listbox"` on the panel, `aria-selected` on options, `aria-hidden` on decorative icons |
| `Menu` | `role="menu"` / `role="menuitem"`, `aria-expanded`, `aria-controls` on the collapse toggle |
| `Tabs` | `role="tabpanel"`, `aria-labelledby`, `aria-hidden` on inactive panels |
| `Progress` | `role="progressbar"` with `aria-valuemin` / `aria-valuemax` / `aria-valuenow` |
| `Input` | `aria-invalid` when `status="error"` |
| `Form.Item` | `<label htmlFor>` bound to the generated field element, required marker |
| `Tree` | `aria-multiselectable`, `aria-expanded`, `aria-disabled`, `aria-label` on expand buttons |
| `Alert` | `role="alert"` |

**Known gaps** (present upstream, unchanged by this migration):

- `Table` sortable / filterable headers are activated by a `click` handler on a
  `<span>`; there is no `aria-sort` and no keyboard binding on the header
  itself. If sorting is essential for your users, also expose it as a real
  `<button>` (for example in a toolbar above the table).
- `Tooltip` / `Popconfirm` triggers do not emit `aria-describedby` /
  `aria-haspopup`. Provide an accessible name on the trigger yourself.

### Focus

- `focusLock` keeps keyboard focus inside `Modal` and `Drawer`
  (`ConfigProvider.focusLock`).
- Focus styles are visible (`:focus-visible` outlines are not removed by the
  default theme).
- Triggering elements regain focus when their overlay closes.

### Colour and contrast

- The default light and dark themes target a contrast ratio ≥ 4.5:1 for body
  text (`--color-text-1/2`) and ≥ 3:1 for large text and UI borders.
- State is never encoded by colour alone: `status` props also change the icon
  or label (`Alert`, `Tag`, `Result`, form errors show a message).
- Dark mode is driven by `body[suzume-theme='dark']`, which redefines the same
  tokens - components do not need dark-specific markup.

## What your application must do

1. **Provide labels.** Placeholder text is not a label. Use `Form.Item
   label="..."` or an explicit `<label>`.
2. **Describe icon-only buttons.** `<Button icon={<IconDelete />} aria-label="Delete" />`
   or `title`.
3. **Give modals a real title.** The `aria-labelledby` target comes from
   `title`; an icon-only header needs `title` anyway.
4. **Announce async results.** `Message`/`Notification` are announced, but
   inline loading states need `aria-busy`.
5. **Keep heading order.** `Typography.Title` maps to `h1`..`h6` - do not skip
   levels for styling.
6. **Respect `prefers-reduced-motion`.** Disable non-essential animation:

   ```css
   @media (prefers-reduced-motion: reduce) {
     .suzume-transition {
       transition: none !important;
       animation: none !important;
     }
   }
   ```

7. **Test with a keyboard only** and with a screen reader (VoiceOver /
   NVDA) before release.

## Common pitfalls

| Pitfall | Fix |
| --- | --- |
| Clickable `<div>` | Use `Button` or add `role="button"` + `tabIndex={0}` + key handling |
| Removing outlines | Never set `outline: none` without a `:focus-visible` replacement |
| `Select` inside `Modal` | Leave `getPopupContainer` default so the dropdown is inside the trapped dialog, or set it to the dialog |
| Tables with `scroll.x` | Keep the first column `fixed` so row context is not lost |
| Sortable table headers | Mouse-only in the library - add a keyboard-reachable equivalent if sorting is critical |
| Colour-only validation | Always render the `Form.Item` error text |

## Automated checks

Run axe/Lighthouse against your own pages - the component library cannot be
audited in isolation because contrast and heading order depend on your
content. The repository's test suite covers keyboard interactions and ARIA
attributes for every interactive component (`components/*/__test__/*`).
