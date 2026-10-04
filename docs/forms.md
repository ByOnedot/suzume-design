# Forms

`Form` provides layout, validation, nested data handling and submission
helpers on top of controlled inputs.

## Basic usage

```tsx
'use client';

import { Form, Input, Button, message } from '@suzume-design/web-react';

export function LoginForm() {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      initialValues={{ username: '' }}
      onSubmit={async (values) => {
        await api.login(values);
        message.success('Welcome back');
      }}
    >
      <Form.Item
        label="Username"
        field="username"
        rules={[{ required: true, message: 'Username is required' }]}
      >
        <Input placeholder="you@example.com" />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 6 }}>
        <Button type="primary" htmlType="submit">
          Sign in
        </Button>
      </Form.Item>
    </Form>
  );
}
```

## API surface

| Member | Purpose |
| --- | --- |
| `Form.useForm()` | Create a form instance |
| `form.validate()` | Validate all fields, returns/throws with errors |
| `form.getFieldValue()` / `setFieldsValue()` | Read / write values |
| `form.getFieldsError()` | Current error map |
| `form.resetFields()` | Reset to `initialValues` |
| `form.submit()` | Validate then call `onSubmit` |
| `Form.Item` | Field wrapper: label, rules, layout |
| `Form.List` | Dynamic arrays |
| `Form.useForm` + `shouldUpdate` | Cross-field / conditional rendering |

## Validation rules

```tsx
<Form.Item
  field="email"
  rules={[
    { required: true },
    { type: 'email', message: 'Enter a valid address' },
    {
      validator: async (value, callback) => {
        if (value && (await emailTaken(value))) callback('Already registered');
      },
    },
  ]}
>
  <Input />
</Form.Item>
```

Built-in rules come from `b-validate`: `required`, `type`, `min`/`max`,
`len`, `match`, `pattern`, `validator`. Set `validateTrigger` on `Form` to
control when they run (`onSubmit` by default, or `onChange`/`onBlur`).

## Layout

```tsx
<Form
  layout="horizontal"
  labelCol={{ span: 6 }}
  wrapperCol={{ span: 14 }}
  autoComplete="off"
>
```

`layout` accepts `horizontal` | `vertical` | `inline`. `Form.Item` can also
take `wrapperCol`/`labelCol` overrides, `required`, `extra`, `help` and
`trigger`.

## Conditional fields

```tsx
<Form shouldUpdate={(prev, next) => prev.type !== next.type}>
  {({ type }) => (
    <>
      <Form.Item field="type" label="Type">
        <Radio.Group options={['personal', 'company']} />
      </Form.Item>
      {type === 'company' && (
        <Form.Item field="company" label="Company" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      )}
    </>
  )}
</Form>
```

## Arrays

```tsx
<Form.List field="contacts">
  {(fields, { add, remove }) => (
    <>
      {fields.map((field, index) => (
        <Form.Item {...field} key={field.key} label={`Contact ${index + 1}`}>
          <Input suffix={<IconDelete onClick={() => remove(index)} />} />
        </Form.Item>
      ))}
      <Button onClick={() => add({ name: '' })}>Add contact</Button>
    </>
  )}
</Form.List>
```

## Controlled vs uncontrolled

- Controlled: `value` + `onChange`
- Uncontrolled: `defaultValue`

`Form.Item` wires the field's value for you through `field`; do not also pass
`value`/`onChange` unless you need to intercept them.

## Accessibility

- Every `Form.Item` with a label renders a `<label>` bound to the control.
- Validation messages are announced through `aria-describedby`; error state is
  also exposed visually and via `status`.
- Required fields get `required` on the control.
- Keep the visible label; use `labelCol` rather than `aria-label` alone.

See [accessibility.md](./accessibility.md).

## SSR

`Form` is a controlled component: the first render uses `initialValues`, so
server and client markup match. Any default that depends on `window`
(e.g. `navigator.language`) must be resolved client-side or passed down as a
serialisable prop.
