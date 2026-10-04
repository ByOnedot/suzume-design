'use client';

import { Grid, Layout, Typography, Card, Space, Divider, Tag, Badge } from '@byonedot/web-react';

const { Row, Col } = Grid;
const { Text, Paragraph } = Typography;

/**
 * Namespace members such as `Grid.Row` or `Typography.Text` only exist as real
 * values inside the client runtime, so the destructuring has to happen in a
 * file that carries a `'use client'` boundary.
 */
export function ServerGrid() {
  return (
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
            <Text bold>Suzume Design</Text> ships <Text code>React</Text> primitives.
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
  );
}
