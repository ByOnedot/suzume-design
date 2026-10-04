# TypeScript

Every component, prop interface and utility is typed in the shipped
declarations (`es/index.d.ts`).

## Setup

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "react-jsx",          // or "react"
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

`skipLibCheck: true` is recommended: it skips `.d.ts` internals (including
third-party declarations) while still checking your own code.

## Importing types

```ts
import type {
  ButtonProps,
  TableProps,
  ColumnProps,
  FormInstance,
  FormItemProps,
  ModalProps,
  TriggerProps,
  CSSProperties as SuzumeCSSProperties,
} from '@byonedot/web-react';

import type { Locale } from '@byonedot/web-react';
```

Type-only imports keep the value graph small and are erased at compile time.

## Typing a form

```tsx
interface Values {
  email: string;
  password: string;
  remember: boolean;
}

const [form] = Form.useForm<Values>();

<Form<Values>
  form={form}
  initialValues={{ remember: false }}
  onSubmit={async (values) => {
    //    ^? Values
    await login(values);
  }}
>
  <Form.Item field="email" rules={[{ required: true, type: 'email' }]}>
    <Input />
  </Form.Item>
</Form>;
```

`Form.useForm<T>()` types `getFieldValue`, `setFieldsValue`, `validate` and
`onSubmit`.

## Typing columns

```tsx
interface User {
  id: string;
  name: string;
  joinedAt: string;
}

const columns: ColumnProps<User>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: (name, record, index) => {
      //      ^? string, User, number
      return name;
    },
  },
];

<Table<User> columns={columns} data={users} rowKey="id" />;
```

## Typing a custom prefix

```tsx
const { getPrefixCls } = useContext(ConfigContext);
const cls = getPrefixCls('button'); // string
```

`ConfigContext` and `ConfigProviderProps` are exported for advanced use.

## Typing locale dictionaries

```ts
import type { Locale } from '@byonedot/web-react';
import enUS from '@byonedot/web-react/es/locale/en-US';

const locale: Locale = {
  ...enUS,
  Pagination: { ...enUS.Pagination, jumpTo: 'Jump to' },
};
```

## Common errors

| Error | Cause | Fix |
| --- | --- | --- |
| `Cannot find module '@byonedot/web-react'` | Package not installed, or `moduleResolution` is not `node` | `npm i @byonedot/web-react`, set `moduleResolution: "node"` |
| `JSX element type 'Provider' does not have any construct or call signatures` | Two different `@types/react` copies in the tree | Deduplicate: add an `overrides`/`pnpm.overrides` entry pinning `**/@types/react` to a single `^19` version and reinstall |
| `Type 'Dayjs' is not assignable to type 'Dayjs'` | Two `dayjs` copies (usually a local `link:` of the library) | Map `dayjs` in `paths` to your app's copy, or install from the registry instead of linking |
| `Type instantiation is excessively deep` | Very deep `Table<User>` / `Form` generics on TS < 4.4 | Upgrade TypeScript to 4.4+ |
| Property `'x'` does not exist on type | Using an internal/undocumented prop | Check [`components.md`](./components.md) and the component's `README.en-US.md` |

## Version support

Declarations are generated with TypeScript 4.4 and avoid newer syntax
(`const` type parameters, `satisfies`), so TS 4.x and 5.x both work.
