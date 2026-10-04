import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import {
  Affix,
  Alert,
  Anchor,
  AutoComplete,
  Avatar,
  BackTop,
  Badge,
  Breadcrumb,
  Button,
  Calendar,
  Card,
  Carousel,
  Cascader,
  Checkbox,
  Collapse,
  ColorPicker,
  Comment,
  ConfigProvider,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  Form,
  Grid,
  Image,
  Input,
  InputNumber,
  InputTag,
  Layout,
  Link,
  List,
  Mentions,
  Menu,
  Message,
  Modal,
  Notification,
  PageHeader,
  Pagination,
  Popconfirm,
  Popover,
  Portal,
  Progress,
  Radio,
  Rate,
  ResizeBox,
  Result,
  Select,
  Skeleton,
  Slider,
  Space,
  Spin,
  Statistic,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  TimePicker,
  Timeline,
  Tooltip,
  Transfer,
  Tree,
  TreeSelect,
  Trigger,
  Typography,
  Upload,
  VerificationCode,
  Watermark,
} from '@byonedot/web-react';
import {
  IconDelete,
  IconHome,
  IconLeft,
  IconLoading,
  IconPlus,
  IconSearch,
  IconSettings,
  IconUpload,
} from '@byonedot/web-react/icon';

export type Scenario = {
  /** Stable identifier - used in the screenshot file name. */
  id: string;
  title: string;
  /** Visual states to capture. Always contains at least `default`. */
  variants: string[];
  render: (variant: string) => ReactNode;
  /**
   * Whether the scenario is expected to produce visible text in the document.
   * Defaults to `true`; scenarios that render only non-textual controls
   * (icons, images, inputs, sliders, ...) opt out. It is the regression guard
   * that catches a component silently rendering an empty label.
   */
  expectText?: boolean;
  /**
   * Optional CSS selector (scoped to the document) for the primary
   * interactive element. When present the suite also captures
   * hover / focus / active at 1280x800 in the light theme.
   */
  act?: string;
};

const IMG_A =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Crect width='160' height='160' fill='%23165DFF'/%3E%3Ccircle cx='80' cy='62' r='30' fill='%23ffffff'/%3E%3Cpath d='M36 160a44 44 0 0188 0z' fill='%23ffffff'/%3E%3C/svg%3E";
const IMG_B =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E%3Crect width='640' height='360' fill='%2300B42A'/%3E%3Ccircle cx='500' cy='90' r='70' fill='%23ffffff' fill-opacity='0.25'/%3E%3C/svg%3E";
const IMG_C =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E%3Crect width='640' height='360' fill='%23F77234'/%3E%3Ccircle cx='140' cy='260' r='90' fill='%23ffffff' fill-opacity='0.25'/%3E%3C/svg%3E";

const byVariant = <T extends Record<string, ReactNode>>(map: T, variant: string) =>
  map[variant] ?? map.default;

const box: CSSProperties = { width: 420, maxWidth: '100%' };
const wideBox: CSSProperties = { width: 720, maxWidth: '100%' };

export const scenarios: Scenario[] = [
  // ---------------------------------------------------------------- layout
  {
    id: 'affix',
    title: 'Affix',
    variants: ['default'],
    render: () => (
      <div style={{ ...box, height: 260, background: 'var(--color-fill-1)', padding: 16 }}>
        <div style={{ height: 100 }} />
        <div data-act tabIndex={-1}>
          Affixed button
        </div>
      </div>
    ),
    act: '[data-act]',
  },
  {
    id: 'alert',
    title: 'Alert',
    variants: ['default', 'info', 'success', 'warning', 'error', 'closable'],
    render: (v) => (
      <div style={{ ...box, display: 'grid', gap: 12 }}>
        <Alert
          type={v === 'default' ? 'info' : (v as any)}
          title="Suzume Design"
          content="A descriptive message goes here."
        />
        {v === 'closable' && (
          <Alert
            closable
            type="warning"
            title="Storage almost full"
            content="Free up space to continue."
          />
        )}
      </div>
    ),
  },
  {
    id: 'anchor',
    title: 'Anchor',
    variants: ['default'],
    render: () => (
      <div style={wideBox}>
        <div data-act tabIndex={-1} />
        <Anchor affix={false}>
          <Anchor.Link href="#part-1" title="Part one" />
          <Anchor.Link href="#part-2" title="Part two" />
          <Anchor.Link href="#part-3" title="Part three" />
        </Anchor>
      </div>
    ),
    act: '.suzume-anchor-link',
  },
  {
    id: 'auto-complete',
    title: 'AutoComplete',
    variants: ['default', 'disabled'],
    expectText: false,
    render: (v) => (
      <div style={box}>
        <AutoComplete
          data={['one', 'two', 'three', 'four']}
          placeholder="Type to search"
          disabled={v === 'disabled'}
        />
      </div>
    ),
    act: '.suzume-autocomplete input',
  },
  {
    id: 'avatar',
    title: 'Avatar',
    variants: ['default', 'circle', 'group'],
    render: (v) => (
      <div style={{ ...box, display: 'flex', gap: 16, alignItems: 'center' }}>
        {v === 'group' ? (
          <Avatar.Group>
            <Avatar>JD</Avatar>
            <Avatar style={{ backgroundColor: '#00B42A' }}>AB</Avatar>
            <Avatar src={IMG_A} />
          </Avatar.Group>
        ) : (
          <>
            <Avatar size={48}>SU</Avatar>
            <Avatar size={48} shape={v === 'circle' ? 'circle' : 'square'}>
              ZH
            </Avatar>
            <Avatar size={48} src={IMG_A} />
            <Avatar size={48} status="error">
              !
            </Avatar>
          </>
        )}
      </div>
    ),
  },
  {
    id: 'back-top',
    title: 'BackTop',
    variants: ['default'],
    render: () => (
      <div style={{ ...box, position: 'relative', height: 220, background: 'var(--color-fill-1)' }}>
        <div data-act tabIndex={-1} style={{ position: 'absolute', right: 16, bottom: 16 }}>
          Top
        </div>
      </div>
    ),
    act: '[data-act]',
  },
  {
    id: 'badge',
    title: 'Badge',
    variants: ['default', 'dot', 'status'],
    render: (v) => (
      <div style={{ ...box, display: 'flex', gap: 32, alignItems: 'center' }}>
        <Badge count={5}>
          <div
            className="suzume-badge-status-wrapper"
            style={{ width: 40, height: 40, background: 'var(--color-fill-2)', borderRadius: 4 }}
          />
        </Badge>
        <Badge dot>
          <div
            style={{ width: 40, height: 40, background: 'var(--color-fill-2)', borderRadius: 4 }}
          />
        </Badge>
        <Badge status="processing" text="Processing" />
        <Badge status="success" text="Done" />
        <Badge status="error" text="Failed" />
        <Badge status="default" text="Idle" />
      </div>
    ),
  },
  {
    id: 'breadcrumb',
    title: 'Breadcrumb',
    variants: ['default', 'separator'],
    render: (v) => (
      <div style={box}>
        <Breadcrumb separator={v === 'separator' ? '/' : undefined}>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item href="/components">Components</Breadcrumb.Item>
          <Breadcrumb.Item>Breadcrumb</Breadcrumb.Item>
        </Breadcrumb>
      </div>
    ),
  },
  {
    id: 'button',
    title: 'Button',
    variants: ['default', 'primary', 'dashed', 'text', 'status', 'shapes'],
    render: (v) => (
      <div style={{ ...box, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <Button data-act>Default</Button>
        <Button data-act type="primary">
          Primary
        </Button>
        <Button data-act type="dashed">
          Dashed
        </Button>
        <Button data-act type="text">
          Text
        </Button>
        <Button data-act status="danger" type="primary">
          Danger
        </Button>
        <Button data-act disabled>
          Disabled
        </Button>
        <Button data-act loading>
          Loading
        </Button>
        <Button data-act size="small">
          Small
        </Button>
        <Button data-act size="large">
          Large
        </Button>
        {v === 'shapes' && (
          <>
            <Button data-act shape="circle">
              OK
            </Button>
            <Button data-act shape="round">
              Round
            </Button>
            <Button data-act icon={<IconPlus />} type="primary" />
          </>
        )}
      </div>
    ),
    act: '[data-act]',
  },
  {
    id: 'calendar',
    title: 'Calendar',
    variants: ['default'],
    render: () => (
      <div style={{ width: 720, maxWidth: '100%' }}>
        <Calendar value={new Date(2026, 3, 15)} />
      </div>
    ),
  },
  {
    id: 'card',
    title: 'Card',
    variants: ['default', 'borderless', 'hover'],
    render: (v) => (
      <div style={box}>
        <Card
          title="Card title"
          extra={<a href="#more">More</a>}
          bordered={v !== 'borderless'}
          style={v === 'hover' ? { cursor: 'pointer' } : undefined}
        >
          Card body content with a description of the section.
        </Card>
      </div>
    ),
    act: '.suzume-card',
  },
  {
    id: 'carousel',
    title: 'Carousel',
    variants: ['default'],
    expectText: false,
    render: () => (
      <div style={{ width: 560, maxWidth: '100%' }}>
        <Carousel autoPlay={false} style={{ height: 200 }}>
          <div>
            <img src={IMG_B} alt="" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
          </div>
          <div>
            <img src={IMG_C} alt="" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
          </div>
        </Carousel>
      </div>
    ),
  },
  {
    id: 'cascader',
    title: 'Cascader',
    variants: ['default', 'open'],
    render: (v) => (
      <div style={box}>
        <Cascader
          options={[
            {
              label: 'Section A',
              value: 'a',
              children: [
                { label: 'Option A1', value: 'a1' },
                { label: 'Option A2', value: 'a2' },
              ],
            },
            {
              label: 'Section B',
              value: 'b',
              children: [{ label: 'Option B1', value: 'b1' }],
            },
          ]}
          placeholder="Select"
          popupVisible={v === 'open'}
        />
      </div>
    ),
    act: '.suzume-cascader',
  },
  {
    id: 'checkbox',
    title: 'Checkbox',
    variants: ['default', 'group', 'disabled'],
    render: (v) => (
      <div style={{ ...box, display: 'flex', gap: 16, alignItems: 'center' }}>
        <Checkbox data-act defaultChecked={v !== 'disabled'} disabled={v === 'disabled'}>
          Checkbox
        </Checkbox>
        <Checkbox data-act indeterminate>
          Indeterminate
        </Checkbox>
        <Checkbox.Group
          options={[
            { label: 'One', value: '1' },
            { label: 'Two', value: '2' },
            { label: 'Three', value: '3' },
          ]}
          defaultValue={['1', '3']}
        />
      </div>
    ),
    act: '.suzume-checkbox',
  },
  {
    id: 'collapse',
    title: 'Collapse',
    variants: ['default', 'expanded', 'accordion'],
    render: (v) => (
      <div style={box}>
        <Collapse defaultActiveKey={v === 'expanded' ? ['1'] : []} accordion={v === 'accordion'}>
          <Collapse.Item header="Panel one" key="1">
            Content for panel one.
          </Collapse.Item>
          <Collapse.Item header="Panel two" key="2">
            Content for panel two.
          </Collapse.Item>
        </Collapse>
      </div>
    ),
    act: '.suzume-collapse',
  },
  {
    id: 'color-picker',
    title: 'ColorPicker',
    variants: ['default', 'disabled'],
    expectText: false,
    render: (v) => (
      <div style={box}>
        <ColorPicker defaultValue="#165DFF" disabled={v === 'disabled'} />
      </div>
    ),
    act: '.suzume-color-picker-preview',
  },
  {
    id: 'comment',
    title: 'Comment',
    variants: ['default'],
    render: () => (
      <div style={wideBox}>
        <Comment
          author={<span>Suzume Designer</span>}
          datetime={<span>2 hours ago</span>}
          content={<p>Great work on the design system migration.</p>}
          actions={[<span key="like">Like</span>, <span key="reply">Reply</span>]}
        />
      </div>
    ),
  },
  {
    id: 'config-provider',
    title: 'ConfigProvider',
    variants: ['default', 'rtl', 'size-large'],
    render: (v) => (
      <ConfigProvider
        prefixCls="suzume"
        rtl={v === 'rtl'}
        size={v === 'size-large' ? 'large' : undefined}
      >
        <div style={{ ...box, display: 'grid', gap: 12 }}>
          <Button type="primary">Primary</Button>
          <Input placeholder="Input" />
        </div>
      </ConfigProvider>
    ),
  },
  {
    id: 'date-picker',
    title: 'DatePicker',
    variants: ['default', 'open', 'disabled', 'error'],
    expectText: false,
    render: (v) => (
      <div style={box}>
        <DatePicker
          value={new Date(2026, 3, 15)}
          popupVisible={v === 'open'}
          disabled={v === 'disabled'}
          status={v === 'error' ? 'error' : undefined}
          placeholder="Pick a date"
        />
      </div>
    ),
    act: '.suzume-picker input',
  },
  {
    id: 'descriptions',
    title: 'Descriptions',
    variants: ['default', 'border', 'vertical'],
    render: (v) => (
      <div style={wideBox}>
        <Descriptions
          title="User"
          border={v === 'border'}
          layout={v === 'vertical' ? 'vertical' : 'horizontal'}
          column={2}
          data={[
            { label: 'Name', value: 'Suzume' },
            { label: 'Role', value: 'Engineer' },
            { label: 'Email', value: 'hi@byonedot.in' },
            { label: 'Team', value: 'Design Systems' },
          ]}
        />
      </div>
    ),
  },
  {
    id: 'divider',
    title: 'Divider',
    variants: ['default', 'vertical', 'with-text'],
    render: (v) => (
      <div style={box}>
        <p>Above the divider</p>
        <Divider orientation={v === 'with-text' ? 'left' : 'center'}>
          {v === 'with-text' ? 'Section' : ''}
        </Divider>
        <p>Below the divider</p>
        <Divider type="vertical">Vertical</Divider>
      </div>
    ),
  },
  {
    id: 'drawer',
    title: 'Drawer',
    variants: ['closed', 'open', 'open-left'],
    render: (v) => (
      <div style={box}>
        <Drawer
          title="Drawer title"
          visible={v.startsWith('open')}
          placement={v === 'open-left' ? 'left' : 'right'}
          width={320}
          onCancel={() => {}}
          onOk={() => {}}
        >
          <p>Drawer body content.</p>
        </Drawer>
        <Button data-act>Open drawer</Button>
      </div>
    ),
    act: '[data-act]',
  },
  {
    id: 'dropdown',
    title: 'Dropdown',
    variants: ['default', 'open'],
    render: (v) => (
      <div style={box}>
        <Dropdown
          popupVisible={v === 'open'}
          droplist={
            <Menu>
              <Menu.Item key="1">Option one</Menu.Item>
              <Menu.Item key="2">Option two</Menu.Item>
              <Menu.Item key="3" disabled>
                Option three
              </Menu.Item>
            </Menu>
          }
        >
          <Button data-act>Dropdown</Button>
        </Dropdown>
      </div>
    ),
    act: '[data-act]',
  },
  {
    id: 'empty',
    title: 'Empty',
    variants: ['default', 'description'],
    render: (v) => (
      <div style={box}>
        <Empty description={v === 'description' ? 'Nothing to show yet' : undefined} />
      </div>
    ),
  },
  {
    id: 'form',
    title: 'Form',
    variants: ['default', 'error', 'disabled', 'vertical'],
    render: (v) => (
      <div style={wideBox}>
        <Form
          layout={v === 'vertical' ? 'vertical' : 'horizontal'}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ username: 'suzume' }}
          disabled={v === 'disabled'}
        >
          <Form.Item label="Username" field="username" rules={[{ required: true }]}>
            <Input data-act placeholder="Username" />
          </Form.Item>
          <Form.Item
            label="Email"
            field="email"
            validateStatus={v === 'error' ? 'error' : undefined}
            help={v === 'error' ? 'Enter a valid email address' : undefined}
          >
            <Input data-act placeholder="you@example.com" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 5 }}>
            <Button data-act type="primary">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    ),
    act: '[data-act]',
  },
  {
    id: 'grid',
    title: 'Grid',
    variants: ['default', 'gutter', 'offset'],
    render: (v) => (
      <div style={wideBox}>
        <Grid.Row gutter={v === 'gutter' ? [16, 16] : 0}>
          <Grid.Col span={12}>
            <div style={{ background: 'var(--color-fill-2)', padding: 12 }}>col 12</div>
          </Grid.Col>
          <Grid.Col span={v === 'offset' ? 8 : 12} offset={v === 'offset' ? 4 : 0}>
            <div style={{ background: 'var(--color-fill-2)', padding: 12 }}>
              {v === 'offset' ? 'col 8 offset 4' : 'col 12'}
            </div>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row style={{ marginTop: 16 }}>
          <Grid.Col span={6} xs={24} sm={12} md={6}>
            <div style={{ background: 'var(--color-fill-3)', padding: 12 }}>responsive</div>
          </Grid.Col>
          <Grid.Col span={6} xs={24} sm={12} md={6}>
            <div style={{ background: 'var(--color-fill-3)', padding: 12 }}>responsive</div>
          </Grid.Col>
        </Grid.Row>
      </div>
    ),
  },
  {
    id: 'icon',
    title: 'Icon',
    variants: ['default', 'spin'],
    expectText: false,
    render: (v) => (
      <div style={{ ...box, display: 'flex', gap: 20, alignItems: 'center' }}>
        <IconHome style={{ fontSize: 24 }} />
        <IconSettings style={{ fontSize: 24 }} />
        <IconSearch style={{ fontSize: 24, color: 'var(--color-primary-6)' }} />
        <IconDelete style={{ fontSize: 24, color: 'var(--color-danger-6)' }} />
        <IconLoading spin style={{ fontSize: 24 }} />
        {v === 'spin' && <IconLoading spin size={32} />}
      </div>
    ),
  },
  {
    id: 'image',
    title: 'Image',
    variants: ['default', 'preview'],
    expectText: false,
    render: (v) => (
      <div style={box}>
        <Image
          src={IMG_A}
          width={200}
          height={200}
          alt="placeholder"
          preview={{ visible: v === 'preview' }}
        />
      </div>
    ),
    act: '.suzume-image',
  },
  {
    id: 'input',
    title: 'Input',
    variants: ['default', 'filled', 'disabled', 'error', 'success', 'prefix'],
    expectText: false,
    render: (v) => (
      <div style={{ ...box, display: 'grid', gap: 12 }}>
        <Input
          data-act
          placeholder="Default"
          defaultValue={v === 'filled' ? 'Filled value' : ''}
          disabled={v === 'disabled'}
        />
        <Input
          data-act
          status={v === 'error' ? 'error' : v === 'success' ? 'success' : undefined}
          placeholder="Status"
        />
        <Input data-act prefix={<IconSearch />} placeholder="Search" allowClear />
      </div>
    ),
    act: '[data-act]',
  },
  {
    id: 'input-number',
    title: 'InputNumber',
    variants: ['default', 'disabled', 'error'],
    expectText: false,
    render: (v) => (
      <div style={box}>
        <InputNumber
          data-act
          defaultValue={42}
          min={0}
          max={100}
          disabled={v === 'disabled'}
          error={v === 'error'}
        />
      </div>
    ),
    act: '.suzume-input-number input',
  },
  {
    id: 'input-tag',
    title: 'InputTag',
    variants: ['default', 'disabled'],
    render: (v) => (
      <div style={box}>
        <InputTag
          data-act
          defaultValue={['design', 'system']}
          disabled={v === 'disabled'}
          placeholder="Add a tag"
        />
      </div>
    ),
    act: '.suzume-input-tag',
  },
  {
    id: 'layout',
    title: 'Layout',
    variants: ['default', 'collapsed'],
    render: (v) => (
      <div style={{ width: 720, maxWidth: '100%' }}>
        <Layout style={{ minHeight: 240 }}>
          <Layout.Sider
            collapsed={v === 'collapsed'}
            width={180}
            style={{ background: 'var(--color-fill-2)' }}
          >
            <div style={{ padding: 12 }}>Sider</div>
          </Layout.Sider>
          <Layout>
            <Layout.Header style={{ background: 'var(--color-fill-1)', padding: '0 16px' }}>
              Header
            </Layout.Header>
            <Layout.Content style={{ padding: 16 }}>Content</Layout.Content>
            <Layout.Footer style={{ background: 'var(--color-fill-1)', padding: '0 16px' }}>
              Footer
            </Layout.Footer>
          </Layout>
        </Layout>
      </div>
    ),
  },
  {
    id: 'link',
    title: 'Link',
    variants: ['default', 'disabled'],
    render: (v) => (
      <div style={{ ...box, display: 'flex', gap: 16 }}>
        <Link data-act href="#link">
          Link text
        </Link>
        <Link data-act disabled>
          Disabled link
        </Link>
        <Link data-act type="primary">
          Primary link
        </Link>
      </div>
    ),
    act: '[data-act]',
  },
  {
    id: 'list',
    title: 'List',
    variants: ['default', 'bordered', 'loading', 'empty'],
    render: (v) => (
      <div style={wideBox}>
        <List
          bordered={v === 'bordered'}
          loading={v === 'loading'}
          header={<div>Header</div>}
          footer={<div>Footer</div>}
          dataSource={v === 'empty' ? [] : ['Item one', 'Item two', 'Item three']}
          render={(item) => <div style={{ padding: '8px 0' }}>{item}</div>}
        />
      </div>
    ),
  },
  {
    id: 'mentions',
    title: 'Mentions',
    variants: ['default', 'disabled'],
    expectText: false,
    render: (v) => (
      <div style={box}>
        <Mentions
          data-act
          defaultValue="@Su"
          options={['Suzume', 'Sample', 'Demo']}
          disabled={v === 'disabled'}
          placeholder="Mention someone"
        />
      </div>
    ),
    act: '.suzume-mentions textarea',
  },
  {
    id: 'menu',
    title: 'Menu',
    variants: ['default', 'horizontal', 'open-sub'],
    render: (v) => (
      <div style={{ width: 320, maxWidth: '100%' }}>
        <Menu
          mode={v === 'horizontal' ? 'horizontal' : 'vertical'}
          defaultOpenKeys={v === 'open-sub' ? ['sub1'] : []}
          defaultSelectedKeys={['key1']}
          style={{ width: v === 'horizontal' ? '100%' : 240 }}
        >
          <Menu.Item key="key1">Dashboard</Menu.Item>
          <Menu.Item key="key2">Settings</Menu.Item>
          <Menu.SubMenu key="sub1" title="More">
            <Menu.Item key="sub1-1">Reports</Menu.Item>
            <Menu.Item key="sub1-2">Analytics</Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </div>
    ),
    act: '.suzume-menu-item',
  },
  {
    id: 'message',
    title: 'Message',
    variants: ['default', 'success', 'error', 'loading'],
    render: (v) => <MessageScene variant={v} />,
  },
  {
    id: 'modal',
    title: 'Modal',
    variants: ['closed', 'open'],
    render: (v) => (
      <div style={box}>
        <Modal
          title="Modal title"
          visible={v === 'open'}
          onCancel={() => {}}
          onOk={() => {}}
          okText="Confirm"
          cancelText="Cancel"
        >
          <p>Modal body content with a short description.</p>
        </Modal>
        <Button data-act>Open modal</Button>
      </div>
    ),
    act: '[data-act]',
  },
  {
    id: 'notification',
    title: 'Notification',
    variants: ['default', 'error'],
    render: (v) => <NotificationScene variant={v} />,
  },
  {
    id: 'page-header',
    title: 'PageHeader',
    variants: ['default', 'back-icon'],
    render: (v) => (
      <div style={wideBox}>
        <PageHeader
          title="Page title"
          subTitle="Supporting text"
          backIcon={v === 'back-icon' ? <IconLeft /> : undefined}
          extra={<Button type="primary">Action</Button>}
        />
      </div>
    ),
  },
  {
    id: 'pagination',
    title: 'Pagination',
    variants: ['default', 'simple'],
    render: (v) => (
      <div style={wideBox}>
        <Pagination
          data-act
          total={80}
          current={3}
          pageSize={10}
          onChange={() => {}}
          showTotal={(t) => `Total ${t}`}
        />
        <div style={{ height: 16 }} />
        <Pagination data-act simple total={80} current={3} pageSize={10} onChange={() => {}} />
      </div>
    ),
    act: '.suzume-pagination-item',
  },
  {
    id: 'popconfirm',
    title: 'Popconfirm',
    variants: ['closed', 'open'],
    render: (v) => (
      <div style={box}>
        <Popconfirm
          popupVisible={v === 'open'}
          title="Delete this item?"
          okText="Delete"
          cancelText="Cancel"
          onOk={() => {}}
          onCancel={() => {}}
        >
          <Button data-act status="danger">
            Delete
          </Button>
        </Popconfirm>
      </div>
    ),
    act: '[data-act]',
  },
  {
    id: 'popover',
    title: 'Popover',
    variants: ['closed', 'open'],
    render: (v) => (
      <div style={box}>
        <Popover
          popupVisible={v === 'open'}
          title="Popover title"
          content={<span>Popover body content.</span>}
        >
          <Button data-act>Hover me</Button>
        </Popover>
      </div>
    ),
    act: '[data-act]',
  },
  {
    id: 'portal',
    title: 'Portal',
    variants: ['default'],
    render: () => (
      <div style={box}>
        <Portal>
          <div
            style={{
              position: 'fixed',
              right: 16,
              top: 80,
              background: 'var(--color-bg-3)',
              border: '1px solid var(--color-border)',
              borderRadius: 4,
              padding: 12,
              zIndex: 1001,
            }}
          >
            Portalled node
          </div>
        </Portal>
        <p>In-flow content</p>
      </div>
    ),
  },
  {
    id: 'progress',
    title: 'Progress',
    variants: ['default', 'success', 'error', 'circle'],
    render: (v) => (
      <div style={{ ...box, display: 'grid', gap: 16 }}>
        <Progress
          percent={v === 'success' ? 100 : v === 'error' ? 40 : 65}
          status={v === 'error' ? 'error' : v === 'success' ? 'success' : undefined}
        />
        <Progress
          percent={v === 'success' ? 100 : 72}
          type="circle"
          status={v === 'error' ? 'error' : undefined}
        />
      </div>
    ),
  },
  {
    id: 'radio',
    title: 'Radio',
    variants: ['default', 'group', 'button'],
    render: (v) => (
      <div style={{ ...box, display: 'flex', gap: 16, alignItems: 'center' }}>
        <Radio data-act defaultChecked>
          Radio
        </Radio>
        <Radio data-act disabled>
          Disabled
        </Radio>
        {v === 'group' ? (
          <Radio.Group
            options={[
              { label: 'A', value: 'a' },
              { label: 'B', value: 'b' },
            ]}
            defaultValue="a"
          />
        ) : (
          <Radio.Group
            type="button"
            options={[
              { label: 'A', value: 'a' },
              { label: 'B', value: 'b' },
            ]}
            defaultValue="a"
          />
        )}
      </div>
    ),
    act: '.suzume-radio',
  },
  {
    id: 'rate',
    title: 'Rate',
    variants: ['default', 'readonly', 'disabled'],
    expectText: false,
    render: (v) => (
      <div style={box}>
        <Rate data-act defaultValue={3} readonly={v === 'readonly'} disabled={v === 'disabled'} />
      </div>
    ),
    act: '.suzume-rate',
  },
  {
    id: 'resize-box',
    title: 'ResizeBox',
    variants: ['default', 'split-group'],
    render: (v) => (
      <div style={{ width: 480, maxWidth: '100%' }}>
        <ResizeBox style={{ width: 320, height: 120, border: '1px solid var(--color-border)' }}>
          <div style={{ padding: 12 }}>Drag the handles</div>
        </ResizeBox>
        {v === 'split-group' && <div style={{ height: 12 }} />}
      </div>
    ),
    act: '.suzume-resizebox-trigger',
  },
  {
    id: 'result',
    title: 'Result',
    variants: ['success', 'error', 'info', 'warning'],
    render: (v) => (
      <div style={wideBox}>
        <Result
          status={v as any}
          title="Operation result"
          subTitle="Additional explanation about the result goes here."
          extra={
            <Space>
              <Button type="primary">Primary</Button>
              <Button>Back</Button>
            </Space>
          }
        />
      </div>
    ),
  },
  {
    id: 'select',
    title: 'Select',
    variants: ['default', 'open', 'multiple', 'disabled', 'error'],
    render: (v) => (
      <div style={box}>
        <Select
          data-act
          style={{ width: 260 }}
          placeholder="Select an option"
          defaultValue={v === 'multiple' ? ['1'] : undefined}
          mode={v === 'multiple' ? 'multiple' : undefined}
          disabled={v === 'disabled'}
          status={v === 'error' ? 'error' : undefined}
          popupVisible={v === 'open'}
          options={[
            { label: 'Option one', value: '1' },
            { label: 'Option two', value: '2' },
            { label: 'Option three', value: '3', disabled: true },
          ]}
        />
      </div>
    ),
    act: '.suzume-select-view',
  },
  {
    id: 'skeleton',
    title: 'Skeleton',
    variants: ['default', 'animation'],
    expectText: false,
    render: (v) => (
      <div style={box}>
        <Skeleton animation={v === 'animation'} image={{ shape: 'circle' }} text={{ rows: 3 }} />
      </div>
    ),
  },
  {
    id: 'slider',
    title: 'Slider',
    variants: ['default', 'disabled', 'range'],
    expectText: false,
    render: (v) => (
      <div style={box}>
        <Slider
          data-act
          defaultValue={v === 'range' ? [20, 60] : 40}
          range={v === 'range'}
          disabled={v === 'disabled'}
          style={{ width: 320 }}
          tooltipVisible={v === 'default'}
        />
      </div>
    ),
    act: '.suzume-slider',
  },
  {
    id: 'space',
    title: 'Space',
    variants: ['default', 'vertical', 'wrap'],
    render: (v) => (
      <div style={box}>
        <Space
          direction={v === 'vertical' ? 'vertical' : 'horizontal'}
          wrap={v === 'wrap'}
          size="middle"
        >
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
          <Button>Four</Button>
        </Space>
      </div>
    ),
  },
  {
    id: 'spin',
    title: 'Spin',
    variants: ['default', 'tip', 'loading'],
    render: (v) => (
      <div style={{ ...box, display: 'flex', gap: 24, alignItems: 'center' }}>
        <Spin />
        <Spin tip="Loading..." />
        <Spin loading={v === 'loading'} />
        <Button loading={v === 'loading'} type="primary">
          Button
        </Button>
      </div>
    ),
  },
  {
    id: 'statistic',
    title: 'Statistic',
    variants: ['default', 'precision', 'loading'],
    render: (v) => (
      <div style={{ ...box, display: 'flex', gap: 32 }}>
        <Statistic title="Visits" value={125670} groupSeparator loading={v === 'loading'} />
        <Statistic title="Ratio" value={0.7325} precision={4} suffix="%" />
        <Statistic title="Revenue" value={8921} prefix="¥" />
      </div>
    ),
  },
  {
    id: 'steps',
    title: 'Steps',
    variants: ['default', 'small', 'vertical', 'error'],
    render: (v) => (
      <div style={wideBox}>
        <Steps
          current={v === 'error' ? 1 : 1}
          status={v === 'error' ? 'error' : undefined}
          size={v === 'small' ? 'small' : 'default'}
          direction={v === 'vertical' ? 'vertical' : 'horizontal'}
        >
          <Steps.Step title="First" description="Description" />
          <Steps.Step title="Second" description="Description" />
          <Steps.Step title="Third" description="Description" />
        </Steps>
      </div>
    ),
  },
  {
    id: 'switch',
    title: 'Switch',
    variants: ['default', 'checked', 'disabled', 'loading'],
    expectText: false,
    render: (v) => (
      <div style={{ ...box, display: 'flex', gap: 20, alignItems: 'center' }}>
        <Switch
          data-act
          defaultChecked={v === 'checked'}
          disabled={v === 'disabled'}
          loading={v === 'loading'}
        />
        <Switch data-act checked disabled />
        <Switch data-act defaultChecked size="large" />
      </div>
    ),
    act: '.suzume-switch',
  },
  {
    id: 'table',
    title: 'Table',
    variants: ['default', 'bordered', 'striped', 'empty', 'loading', 'selected'],
    render: (v) => (
      <div style={{ ...wideBox, overflow: 'auto' }}>
        <Table
          rowKey="key"
          bordered={v === 'bordered'}
          stripe={v === 'striped'}
          loading={v === 'loading'}
          pagination={false}
          rowSelection={v === 'selected' ? { selectedRowKeys: ['1'] } : undefined}
          columns={[
            { title: 'Name', dataIndex: 'name' },
            { title: 'Role', dataIndex: 'role' },
            { title: 'Status', dataIndex: 'status' },
          ]}
          data={
            v === 'empty'
              ? []
              : [
                  { key: '1', name: 'Ada Lovelace', role: 'Engineer', status: 'Active' },
                  { key: '2', name: 'Grace Hopper', role: 'Admiral', status: 'Active' },
                  { key: '3', name: 'Alan Turing', role: 'Scientist', status: 'Away' },
                ]
          }
        />
      </div>
    ),
  },
  {
    id: 'tabs',
    title: 'Tabs',
    variants: ['default', 'active-two', 'card', 'disabled'],
    render: (v) => (
      <div style={wideBox}>
        <Tabs
          defaultActiveTab={v === 'active-two' ? '2' : '1'}
          type={v === 'card' ? 'card' : 'line'}
        >
          <Tabs.TabPane title="Overview" key="1">
            Overview content
          </Tabs.TabPane>
          <Tabs.TabPane title="Details" key="2">
            Details content
          </Tabs.TabPane>
          <Tabs.TabPane title="Disabled" key="3" disabled={v === 'disabled'}>
            Disabled content
          </Tabs.TabPane>
        </Tabs>
      </div>
    ),
    act: '.suzume-tabs-header-title',
  },
  {
    id: 'tag',
    title: 'Tag',
    variants: ['default', 'colors', 'checkable'],
    render: (v) => (
      <div style={{ ...box, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <Tag>Default</Tag>
        <Tag color="suzumeblue">suzumeblue</Tag>
        <Tag color="green">green</Tag>
        <Tag color="orangered">orangered</Tag>
        <Tag checkable checked={v === 'checkable'}>
          Checkable
        </Tag>
      </div>
    ),
  },
  {
    id: 'time-picker',
    title: 'TimePicker',
    variants: ['default', 'open'],
    expectText: false,
    render: (v) => (
      <div style={box}>
        <TimePicker
          value={new Date(2026, 3, 15, 10, 30, 0)}
          popupVisible={v === 'open'}
          placeholder="Pick a time"
        />
      </div>
    ),
    act: '.suzume-picker input',
  },
  {
    id: 'timeline',
    title: 'Timeline',
    variants: ['default', 'pending'],
    render: (v) => (
      <div style={box}>
        <Timeline pending={v === 'pending'}>
          <Timeline.Item label="2026-04-01">First milestone</Timeline.Item>
          <Timeline.Item label="2026-04-08">Second milestone</Timeline.Item>
          <Timeline.Item label="2026-04-15" type="error">
            Blocked
          </Timeline.Item>
        </Timeline>
      </div>
    ),
  },
  {
    id: 'tooltip',
    title: 'Tooltip',
    variants: ['closed', 'open', 'positions'],
    render: (v) => (
      <div style={{ ...box, paddingTop: 40 }}>
        <Tooltip popupVisible={v === 'open'} content="Tooltip content">
          <Button data-act>Hover target</Button>
        </Tooltip>
      </div>
    ),
    act: '[data-act]',
  },
  {
    id: 'transfer',
    title: 'Transfer',
    variants: ['default'],
    render: () => (
      <div style={{ width: 480, maxWidth: '100%' }}>
        <Transfer
          dataSource={[
            { key: '1', title: 'Item one' },
            { key: '2', title: 'Item two' },
            { key: '3', title: 'Item three' },
          ]}
          defaultTargetKeys={['2']}
        />
      </div>
    ),
  },
  {
    id: 'tree',
    title: 'Tree',
    variants: ['default', 'expanded', 'checkable', 'selected'],
    render: (v) => (
      <div style={box}>
        <Tree
          checkable={v === 'checkable'}
          defaultExpandedKeys={v === 'expanded' || v === 'checkable' ? ['0-0'] : []}
          defaultSelectedKeys={v === 'selected' ? ['0-0-0'] : []}
          defaultCheckedKeys={v === 'checkable' ? ['0-0-1'] : []}
          treeData={[
            {
              key: '0-0',
              title: 'Parent node',
              children: [
                { key: '0-0-0', title: 'Leaf node one' },
                { key: '0-0-1', title: 'Leaf node two' },
              ],
            },
            { key: '0-1', title: 'Second parent' },
          ]}
        />
      </div>
    ),
    act: '.suzume-tree-node',
  },
  {
    id: 'tree-select',
    title: 'TreeSelect',
    variants: ['default', 'open'],
    render: (v) => (
      <div style={box}>
        <TreeSelect
          data-act
          style={{ width: 260 }}
          popupVisible={v === 'open'}
          treeData={[
            {
              key: '0-0',
              title: 'Parent',
              children: [
                { key: '0-0-0', title: 'Child one' },
                { key: '0-0-1', title: 'Child two' },
              ],
            },
          ]}
          placeholder="Select a node"
        />
      </div>
    ),
    act: '.suzume-tree-select',
  },
  {
    id: 'trigger',
    title: 'Trigger',
    variants: ['closed', 'open'],
    render: (v) => (
      <div style={box}>
        <Trigger
          popupVisible={v === 'open'}
          popup={() => <div style={{ padding: 8 }}>Trigger popup</div>}
        >
          <Button data-act>Target</Button>
        </Trigger>
      </div>
    ),
    act: '[data-act]',
  },
  {
    id: 'typography',
    title: 'Typography',
    variants: ['default', 'ellipsis', 'editing'],
    render: (v) => (
      <div style={wideBox}>
        <Typography.Title level={1}>Heading one</Typography.Title>
        <Typography.Title level={3}>Heading three</Typography.Title>
        <Typography.Text>Regular body text.</Typography.Text>
        <br />
        <Typography.Text type="secondary">Secondary text</Typography.Text>
        {'  '}
        <Typography.Text type="success">Success</Typography.Text>
        {'  '}
        <Typography.Text type="danger">Danger</Typography.Text>
        {'  '}
        <Typography.Text code>inline code</Typography.Text>
        <br />
        <Typography.Text delete>Delete text</Typography.Text>
        <br />
        <Typography.Text underline>Underlined</Typography.Text>
        <br />
        <Typography.Paragraph ellipsis={{ rows: 1, showTooltip: false }}>
          This paragraph is intentionally longer than the available width so the ellipsis behaviour
          is visible in the screenshot.
        </Typography.Paragraph>
        <Typography.Paragraph editable={v === 'editing'} style={{ marginTop: 8 }}>
          Editable paragraph text
        </Typography.Paragraph>
      </div>
    ),
    act: '.suzume-typography',
  },
  {
    id: 'upload',
    title: 'Upload',
    variants: ['default', 'picture-card', 'disabled'],
    render: (v) => (
      <div style={{ width: 480, maxWidth: '100%' }}>
        <Upload
          data-act
          disabled={v === 'disabled'}
          listType={v === 'picture-card' ? 'picture-card' : 'text'}
          fileList={[
            { uid: '1', name: 'design-system.png', status: 'done', url: IMG_A },
            { uid: '2', name: 'tokens.png', status: 'uploading', percent: 55 },
          ]}
        >
          <Button icon={<IconUpload />}>Upload</Button>
        </Upload>
      </div>
    ),
    act: '[data-act]',
  },
  {
    id: 'verification-code',
    title: 'VerificationCode',
    variants: ['default', 'filled'],
    expectText: false,
    render: (v) => (
      <div style={box}>
        <VerificationCode
          data-act
          defaultValue={v === 'filled' ? '482913' : ''}
          length={6}
          onChange={() => {}}
        />
      </div>
    ),
    act: '.suzume-verification-code input',
  },
  {
    id: 'watermark',
    title: 'Watermark',
    variants: ['default'],
    render: () => (
      <div style={{ ...box, height: 220, border: '1px solid var(--color-border)' }}>
        <Watermark content="Suzume Design">
          <div style={{ padding: 24 }}>
            <p>Protected content</p>
            <p>Second line of content</p>
          </div>
        </Watermark>
      </div>
    ),
  },
];

const NOTICE_DURATION = 600000;

function MessageScene({ variant }: { variant: string }) {
  const type = variant === 'default' ? 'info' : variant;
  const fired = useRef(false);
  useEffect(() => {
    // StrictMode runs effects twice. Two `Message.info()` calls are two
    // legitimate notices, so fire exactly once per mount to keep the
    // screenshot deterministic; the library's own dismissal is untouched.
    if (fired.current) return undefined;
    fired.current = true;
    const api = (Message as any)[type];
    if (api) {
      // Deferred out of the effect: the imperative API flushes its root
      // synchronously, and React 19 warns when `flushSync` runs while it is
      // still committing. A macrotask runs outside React's commit phase.
      // Deliberately not cancelled on unmount: React 19 StrictMode runs
      // `setup -> cleanup -> setup`, and cancelling here would leave the
      // second pass without a timer. Every capture loads a fresh page, so
      // there is nothing to clean up.
      setTimeout(
        () => api({ content: 'Suzume Design message', duration: NOTICE_DURATION, position: 'top' }),
        0
      );
    }
    // No unmount cleanup: every screenshot loads a fresh page, and calling the
    // imperative `clear()` from an effect cleanup makes React flush during the
    // commit phase (React 19 warns about that).
    return undefined;
  }, [type]);
  return <div style={{ height: 8 }} />;
}

function NotificationScene({ variant }: { variant: string }) {
  const type = variant === 'default' ? 'info' : variant;
  const fired = useRef(false);
  useEffect(() => {
    // See MessageScene: fire once per mount so StrictMode cannot double up.
    if (fired.current) return undefined;
    fired.current = true;
    const api = (Notification as any)[type];
    if (api) {
      // Deferred out of the effect - see MessageScene.
      // Not cancelled on unmount - see MessageScene.
      setTimeout(
        () =>
          api({
            title: variant === 'error' ? 'Deployment failed' : 'Deployment finished',
            content: 'Build 1.0.0 was published successfully.',
            duration: NOTICE_DURATION,
          }),
        0
      );
    }
    // See MessageScene: no unmount cleanup, every capture uses a fresh page.
    return undefined;
  }, [type, variant]);
  return <div style={{ height: 8 }} />;
}

export const responsiveIds = new Set([
  'grid',
  'layout',
  'menu',
  'table',
  'form',
  'descriptions',
  'tabs',
  'modal',
  'drawer',
  'card',
  'typography',
  'list',
  'steps',
  'transfer',
]);
