'use client';

import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  DatePicker,
  Drawer,
  Dropdown,
  Form,
  Input,
  Menu,
  Message,
  Modal,
  Notification,
  Select,
  Space,
  Table,
  Tabs,
  Tooltip,
  Tree,
  Upload,
} from '@suzume-design/web-react';
import { IconPlus, IconUpload } from '@suzume-design/web-react/icon';

const columns = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Role', dataIndex: 'role' },
];

const rows = [
  { key: '1', name: 'Ada Lovelace', role: 'Engineer' },
  { key: '2', name: 'Grace Hopper', role: 'Admiral' },
];

const treeData = [
  {
    key: '0-0',
    title: 'Parent',
    children: [
      { key: '0-0-0', title: 'Child one' },
      { key: '0-0-1', title: 'Child two' },
    ],
  },
];

/** Every interactive component, rendered as a Client Component. */
export function InteractivePanel() {
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    Message.info({ content: 'Suzume Design is mounted', duration: 600000 });
    Notification.info({
      title: 'Notification',
      content: 'Rendered through a portal.',
      duration: 600000,
    });
  }, []);

  return (
    <section data-testid="interactive-panel" data-ready={ready ? '1' : '0'}>
      <Space direction="vertical" size="large" style={{ width: '100%', marginTop: 24 }}>
        <Space wrap>
          <Button type="primary" icon={<IconPlus />}>
            Button
          </Button>
          <Tooltip content="Tooltip content">
            <Button>Tooltip</Button>
          </Tooltip>
          <Dropdown
            droplist={
              <Menu>
                <Menu.Item key="1">Option one</Menu.Item>
                <Menu.Item key="2">Option two</Menu.Item>
              </Menu>
            }
          >
            <Button>Dropdown</Button>
          </Dropdown>
          <Button onClick={() => setModal(true)}>Open modal</Button>
          <Button onClick={() => setDrawer(true)}>Open drawer</Button>
          <Upload listType="text" fileList={[{ uid: '1', name: 'tokens.css', status: 'done' }]}>
            <Button icon={<IconUpload />}>Upload</Button>
          </Upload>
        </Space>

        <Form
          layout="vertical"
          onSubmit={(values) => Message.success(JSON.stringify(values))}
          initialValues={{ email: '', username: '' }}
        >
          <Space wrap>
            <Form.Item label="Username" field="username" rules={[{ required: true }]}>
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item label="Email" field="email" rules={[{ required: true, type: 'email' }]}>
              <Input placeholder="you@example.com" />
            </Form.Item>
            <Form.Item label="Select" field="select">
              <Select
                style={{ width: 200 }}
                placeholder="Pick one"
                options={[
                  { label: 'Option one', value: '1' },
                  { label: 'Option two', value: '2' },
                ]}
              />
            </Form.Item>
            <Form.Item label="Date" field="date">
              <DatePicker style={{ width: 200 }} placeholder="Pick a date" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Space>
        </Form>

        <Tabs defaultActiveTab="1">
          <Tabs.TabPane title="Table" key="1">
            <Table rowKey="key" columns={columns} data={rows} pagination={false} />
          </Tabs.TabPane>
          <Tabs.TabPane title="Tree" key="2">
            <Tree defaultExpandedKeys={['0-0']} defaultSelectedKeys={['0-0-0']} treeData={treeData} />
          </Tabs.TabPane>
        </Tabs>

        <Modal title="Modal title" visible={modal} onCancel={() => setModal(false)} onOk={() => setModal(false)}>
          Modal body rendered through a portal.
        </Modal>

        <Drawer title="Drawer title" visible={drawer} width={320} onCancel={() => setDrawer(false)} onOk={() => setDrawer(false)}>
          Drawer body rendered through a portal.
        </Drawer>

        <Alert type="success" title="Interactive panel ready" content="Hydration completed without warnings." />
      </Space>
    </section>
  );
}
