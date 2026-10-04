---
order: 6
title:
  zh-CN: 预加载的卡片
  en-US: With skeleton
---

## zh-CN

结合 `Skeleton` 来在数据读入前显示文本骨架。

## en-US

Combine `Skeleton` to display the text skeleton before the data is loaded.

```js
import { useState } from 'react';
import { Card, Switch, Skeleton, Avatar, Link, Typography, Space } from '@byonedot/web-react';
const { Meta } = Card;

function App() {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <Switch
        style={{ display: 'block', marginBottom: 10 }}
        checked={!loading}
        onChange={(checked) => setLoading(!checked)}
      />
      <Space align="start" size="large">
        <Card
          style={{ width: 384 }}
          cover={
            <Skeleton
              loading={loading}
              text={{ rows: 0 }}
              image={{
                style: {
                  width: 352,
                  height: 188,
                  margin: '16px 16px 0 16px',
                },
              }}
            >
              <div style={{ height: 204, overflow: 'hidden' }}>
                <img
                  style={{ width: '100%', transform: 'translateY(-20px)' }}
                  alt="dessert"
                  src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23F77234%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E"
                />
              </div>
            </Skeleton>
          }
        >
          <Meta
            avatar={
              <Skeleton
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: 4,
                }}
                loading={loading}
                text={{ rows: 1, width: 64 }}
                image={{
                  shape: 'circle',
                  style: {
                    width: 24,
                    height: 24,
                  },
                }}
              >
                <Space>
                  <Avatar size={24}>
                    A
                  </Avatar>
                  <Typography.Text>Username</Typography.Text>
                </Space>
              </Skeleton>
            }
            title={
              <Skeleton
                loading={loading}
                style={{ marginTop: 0 }}
                text={{
                  rows: 1,
                  width: 72,
                }}
              >
                Card title
              </Skeleton>
            }
            description={
              <Skeleton
                loading={loading}
                text={{ rows: 1, width: 150 }}
              >
                This is the description
              </Skeleton>
            }
          />
        </Card>
        <Card
          style={{ width: 384 }}
          title={
            <Skeleton
              loading={loading}
              text={{ rows: 1, width: 72 }}
            >
              Suzume Card
            </Skeleton>
          }
          extra={
            <Skeleton
              loading={loading}
              text={{
                rows: 1,
                width: '100%',
                style: {
                  width: 30,
                  float: 'right',
                },
              }}
            >
              <Link>More</Link>
            </Skeleton>
          }
        >
          <Skeleton
            loading={loading}
            text={{ rows: 2, width: ['100%', '80%'] }}
          >
            Example's core product, Toutiao ("Headlines"), is a content platform in China and around
            the world.
          </Skeleton>

          <Meta
            avatar={
              <Skeleton
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: 4,
                }}
                loading={loading}
                text={{ rows: 1, width: 64 }}
                image={{
                  shape: 'circle',
                  style: {
                    width: 24,
                    height: 24,
                  },
                }}
              >
                <Space>
                  <Avatar
                    size={24}
                  >
                    A
                  </Avatar>
                  <Typography.Text>Username</Typography.Text>
                </Space>
              </Skeleton>
            }
          />
        </Card>
      </Space>
    </>
  );
}

export default App;
```
