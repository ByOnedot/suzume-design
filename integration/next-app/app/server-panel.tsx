import { Grid, Layout, Typography, Card, Space, Tag, Badge, Alert, Divider } from '@suzume-design/web-react';

const { Row, Col } = Grid;
const { Text, Paragraph } = Typography;

/**
 * Rendered by the React Server Component renderer. It must not be marked
 * `"use client"` - if the library forced a client boundary this page would
 * fail to build.
 */
export function ServerPanel() {
  return (
    <section data-testid="server-panel">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Alert type="info" title="Server Component" content="Rendered on the server without a client boundary." />

        <Row gutter={[16, 16]}>
          <Col span={12} md={8}>
            <Card title="Layout" bordered>
              <Layout>
                <Layout.Header style={{ background: 'var(--color-fill-1)' }}>Header</Layout.Header>
                <Layout.Content style={{ padding: 12 }}>Content</Layout.Content>
              </Layout>
            </Card>
          </Col>
          <Col span={12} md={8}>
            <Card title="Typography" bordered>
              <Paragraph>
                <Text strong>Suzume Design</Text> ships <Text code>React</Text> primitives.
              </Paragraph>
              <Paragraph type="secondary">Secondary supporting line.</Paragraph>
            </Card>
          </Col>
          <Col span={24} md={8}>
            <Card title="Status" bordered>
              <Space wrap>
                <Badge count={3}>
                  <Tag color="suzumeblue">suzumeblue</Tag>
                </Badge>
                <Tag color="green">stable</Tag>
                <Tag color="orangered">beta</Tag>
              </Space>
              <Divider />
              <Text type="success">All good</Text>
            </Card>
          </Col>
        </Row>
      </Space>
    </section>
  );
}
