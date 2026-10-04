# Overlays: Modal, Drawer, Message, Notification, Popconfirm, Tooltip

Overlays render into portals attached to `document.body` (or a custom
container). They are created **after** the first client render, so they are
safe during SSR.

## Modal

```tsx
'use client';

import { Modal, Button } from '@suzume-design/web-react';

function Example() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button onClick={() => setVisible(true)}>Open</Button>
      <Modal
        title="Delete project"
        visible={visible}
        okText="Delete"
        cancelText="Cancel"
        hideCancel={false}
        onOk={async () => {
          await remove();
          setVisible(false);
        }}
        onCancel={() => setVisible(false)}
      >
        This cannot be undone.
      </Modal>
    </>
  );
}
```

Imperative confirm:

```tsx
import { Modal } from '@suzume-design/web-react';

Modal.confirm({
  title: 'Discard changes?',
  content: 'Your edits will be lost.',
  onOk: () => history.back(),
});
```

| Prop | Notes |
| --- | --- |
| `visible` / `defaultVisible` | Controlled / uncontrolled |
| `mountOnEnter` / `unmountOnExit` | Lazily mount / destroy content |
| `mask` / `maskClosable` | Overlay behaviour |
| `focusLock` | Keeps focus inside while open (globally configurable via `ConfigProvider.focusLock`) |
| `getPopupContainer` | Custom portal parent |

Focus moves into the dialog on open, is trapped while open, and returns to the
trigger on close. The title is linked with `aria-labelledby`, the body with
`aria-describedby`.

## Drawer

Same API as `Modal`, with `placement` (`'left' | 'right' | 'top' | 'bottom'`),
`size` and `cancelText`:

```tsx
<Drawer title="Filters" placement="right" width={360} visible={open} onCancel={close}>
  <FilterForm />
</Drawer>
```

## Message (transient, top)

```tsx
import { Message } from '@suzume-design/web-react';

Message.info('Saved');
Message.success('Published');
Message.error('Something went wrong');
Message.warning({ content: 'Check the form', duration: 5000 });
Message.loading('Uploading...');
Message.clear(); // dismiss everything
```

Scoped (recommended inside Client Components with a local container):

```tsx
import { Message } from '@suzume-design/web-react';

const [messageHolder, messageApi] = Message.useMessage();

return (
  <>
    {messageHolder}
    <Button onClick={() => messageApi.success('Saved')}>Save</Button>
  </>
);
```

Set `ConfigProvider effectGlobalNotice={false}` when you use the hooks so the
global instance is not also updated, and `effectGlobalModal={false}` for the
modal hooks.

## Notification (persistent, corner)

```tsx
import { Notification } from '@suzume-design/web-react';

Notification.info({ title: 'Deployment finished', content: 'v1.4.0 is live' });
Notification.success({ title: 'Saved', duration: 0 });
Notification.error({ title: 'Failed', content: err.message });

const [holder, api] = Notification.useNotification();
```

Notification is keyboard dismissible and exposes `role="alert"`.

## Tooltip / Popconfirm / Dropdown

```tsx
<Tooltip content="Edit">
  <IconButton icon={<IconEdit />} />
</Tooltip>

<Popconfirm
  title="Remove this row?"
  okText="Remove"
  cancelText="Keep"
  onOk={remove}
>
  <Button status="danger">Delete</Button>
</Popconfirm>

<Dropdown droplist={<Menu><Menu.Item key="1">Clone</Menu.Item></Menu>}>
  <Button>More</Button>
</Dropdown>
```

All three use `Trigger` underneath, which manages `position`, delay, hover vs
click behaviour, `document` click-outside handling and repositioning on
scroll/resize.

## Portal container

```tsx
<ConfigProvider getPopupContainer={(node) => node.parentElement || document.body}>
  <App />
</ConfigProvider>
```

or per-component via `getPopupContainer`.

## Z-index

Popups start from `--z-index-popup-base` (1000). Override globally:

```tsx
<ConfigProvider zIndex={2000}>...</ConfigProvider>
```

## Accessibility summary

| Component | Behaviour |
| --- | --- |
| Modal / Drawer | Focus trapped, `Escape` closes, `role="dialog"`, labelled by title, focus restored on close |
| Notification | `role="alert"`, keyboard dismiss |
| Popconfirm | Trigger keyboard-activatable, confirm/cancel buttons focusable |
| Dropdown / Menu | Arrow-key navigation, `Enter`/`Space` activate, `Escape` closes |
| Tooltip | Opens on focus as well as hover; content referenced via `aria-describedby` |

Keyboard and ARIA details are in [accessibility.md](./accessibility.md).

## SSR

- Do not render `Modal visible` on the server: the portal target does not
  exist yet, and the first client render must match the server markup.
- `Message` / `Notification` calls must be inside `useEffect` or event
  handlers, never during render.
