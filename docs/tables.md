# Tables

`Table` handles column configuration, sorting, filtering, selection, expansion,
fixed columns, virtual scrolling and tree data.

## Basic usage

```tsx
'use client';

import { Table } from '@byonedot/web-react';

interface Row {
  key: string;
  name: string;
  salary: number;
}

const columns = [
  { title: 'Name', dataIndex: 'name', sortable: true, filter: true },
  { title: 'Salary', dataIndex: 'salary', render: (v: number) => v.toLocaleString() },
];

export function Users({ data }: { data: Row[] }) {
  return <Table rowKey="key" columns={columns} data={data} stripe />;
}
```

### Key props

| Prop | Type | Description |
| --- | --- | --- |
| `columns` | `ColumnProps[]` | Column definitions |
| `data` | `T[]` | Rows |
| `rowKey` | `string \| (row) => string` | Stable row identity |
| `loading` | `boolean` | Shows the spinner |
| `stripe` | `boolean` | Zebra striping |
| `border` / `borderCell` | `boolean` | Outer / inner cell borders |
| `pagination` | `PaginationProps \| false` | Pagination config, `false` to disable |
| `scroll` | `{ x, y }` | Scrolls the body, enables sticky headers |
| `rowSelection` | `RowSelectionProps` | Checkboxes / bulk actions |
| `expandedRowKeys` | `string[]` | Controlled expansion |
| `virtualized` | `boolean` | Windowed rendering for long lists |
| `onChange` | `(pagination, sorter, filters, extra) => void` | Fires for sort / filter / page changes |

## Columns

```ts
const columns = [
  {
    title: 'Address',
    dataIndex: 'address',
    // cell renderer
    render: (value, record, index) => <a href={`/users/${record.id}`}>{value}</a>,
    // fixed to the edge while scrolling horizontally
    fixed: 'left' | 'right',
    width: 200,
    // sorting: give a comparator or set `sorter: true` for client side
    sorter: (a, b) => a.salary - b.salary,
    // filtering
    filters: [
      { text: 'Engineering', value: 'eng' },
      { text: 'Sales', value: 'sales' },
    ],
    onFilter: (value, record) => record.department === value,
    // freeze the column
    fixed: 'left',
    // custom header / cell class
    className: 'col-address',
  },
];
```

- `dataIndex` supports nested paths (`'user.address.city'`).
- Use `ColumnGroup` entries for multi-level headers.
- Use the `summary` prop for table footers / totals.

## Selection

```tsx
const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

<Table
  rowSelection={{
    selectedRowKeys: selectedKeys,
    onChange: (keys) => setSelectedKeys(keys as string[]),
    checkCrossPage: true, // keep selection across pages
  }}
  data={data}
/>;
```

## Sorting and filtering

- **Client side**: set `sorter: true` (or a comparator) and `filters` +
  `onFilter`; `Table` sorts/filters the local `data`.
- **Server side**: pass `onChange` and fetch the next page yourself; leave
  `sorter`/`filters` as functions returning `undefined` to signal remote mode,
  or use the `sortDirections` + `pagination` together with `data={[]}`.

```tsx
<Table
  data={rows}
  loading={loading}
  pagination={{ total, current, pageSize }}
  onChange={(pagination, sorter, filters) => fetchPage(pagination, sorter, filters)}
/>
```

## Tree data

```tsx
<Table
  data={tree}
  rowKey="key"
  childrenColumnName="children"
  expandedRowKeys={expanded}
  onExpandedRowsChange={setExpanded}
  columns={columns}
/>
```

Each row may carry `children: Row[]`.

## Virtualized tables

```tsx
<Table data={huge} virtualized scroll={{ y: 480 }} rowKey="id" />
```

Combine with `scroll={{ x: 900 }}` for wide, fixed-column tables.

## Responsive behaviour

- Set `scroll.x` so narrow screens scroll horizontally instead of squashing
  columns.
- Hide low-priority columns below a breakpoint with `ResponsiveSpan` /
  `Grid.Col`, or build `columns` from `useResponsive`.
- Fixed columns (`fixed: 'left' | 'right'`) keep identifiers and actions
  reachable on mobile.

See [responsive.md](./responsive.md).

## Accessibility

- Header cells are `<th>` with `scope` and `aria-sort` when sortable.
- Sortable / filterable headers are keyboard reachable (`Enter` / `Space`).
- Selection checkboxes carry labels derived from the row key.
- `Table` sets `role` on tree / expanded rows so screen readers announce the
  hierarchy.

## SSR

Server render the first page with `data` already loaded; leave `loading`
false initially to avoid a hydration mismatch. Sorting/filtering/pagination
that depend on `window` sizes must run client-side.
