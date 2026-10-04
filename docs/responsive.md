# Responsive design

Everything needed for responsive layouts ships in the main package - there is
no separate mobile library.

## Breakpoints

| Token | Min width | Typical use |
| --- | --- | --- |
| `xs` | 0 | phone (portrait) |
| `sm` | 576px | phone (landscape) |
| `md` | 768px | tablet |
| `lg` | 992px | small laptop |
| `xl` | 1200px | desktop |
| `xxl` | 1600px | wide desktop |
| `xxxl` | 2000px | extra wide |

The same breakpoints are available as Less variables
(`@grid-xs` ... `@grid-xxxl`) and as a JS map
(`components/Grid/utils.ts`).

## Grid

```tsx
import { Grid } from '@byonedot/web-react';
const { Row, Col } = Grid;

<Row gutter={[16, 16]}>
  <Col span={24} md={12} lg={8}>
    <Card title="KPI">...</Card>
  </Col>
  <Col span={24} md={12} lg={8}>
    <Card title="Traffic">...</Card>
  </Col>
  <Col span={24} md={24} lg={8}>
    <Card title="Revenue">...</Card>
  </Col>
</Row>;
```

- `span` is the default column width out of 24.
- `xs`/`sm`/`md`/`lg`/`xl`/`xxl`/`xxxl` override `span` at that breakpoint and
  above.
- `offset`, `push` and `pull` accept the same responsive object form.
- `gutter` accepts `{ xs: 8, sm: 12, md: 16 }` for responsive spacing.

## Responsive building blocks

```tsx
import { Grid, Layout, Menu, Table, Typography, Card } from '@byonedot/web-react';
```

| Component | Responsive behaviour |
| --- | --- |
| `Grid.Row` / `Grid.Col` | 24-column responsive grid |
| `Grid` / `Grid.GridItem` | CSS-grid based responsive container (`cols`, `colGap`, `rowGap` accept breakpoint objects) |
| `Layout.Sider` | `breakpoint="md"` collapses automatically below the breakpoint; `collapsible` + `onBreakpoint` |
| `Menu` | `collapse` / horizontal menus scroll horizontally on narrow screens |
| `Table` | `scroll={{ x: 900 }}` + `fixed` columns keep data usable on phones |
| `Form` | `layout="vertical"` stacks labels above inputs - best on mobile |
| `Modal` | `style={{ width: '90vw', maxWidth: 640 }}` for phone widths |
| `Drawer` | `placement="left"` / `"bottom"` reads better than a centred dialog |
| `Typography` / `Card` | fluid by default; avoid fixed pixel widths |

## Collapse a sider below a breakpoint

```tsx
const [collapsed, setCollapsed] = useState(false);

<Layout>
  <Layout.Sider
    breakpoint="md"
    collapsed={collapsed}
    onCollapse={setCollapsed}
    onBreakpoint={(broken) => setCollapsed(broken)}
    width={220}
  >
    <Menu>{items}</Menu>
  </Layout.Sider>
  <Layout>{children}</Layout>
</Layout>;
```

## Conditional rendering in JS

```tsx
import { useResponsiveState } from '@byonedot/web-react/es/Grid/hooks/useResponsiveState';

// or implement it yourself with matchMedia:
function useMedia(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

const isPhone = useMedia('(max-width: 767px)');
```

Prefer CSS (responsive `span`/`offset`) over JS where possible: CSS does not
cause a re-render and works before hydration.

## Media queries in Less

```less
.suzume-card {
  padding: 16px;

  @media (min-width: @grid-lg) {
    padding: 24px;
  }
}
```

## Validating layouts

Check at least:

| Width | Layout |
| --- | --- |
| 360x640 | Grid collapses to 1 column, Table scrolls horizontally, Modal is ~90vw, Sider collapsed, Form vertical |
| 768x1024 | 2-column cards, Sider collapsible, Table shows priority columns |
| 1280x800 | 3-column cards, Sider expanded, Table fully visible |
| 1920x1080 | Extra spacing used, no stretched single-column content |

Cover `Menu`, `Table`, `Form`, `Modal`, `Drawer`, `Typography`, `Card`,
`Tabs` and the navigation (`Layout`, `Breadcrumb`, `Pagination`) at each size.
