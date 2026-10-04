---
order: 10
title:
  zh-CN: 支持更多内容配置
  en-US: With actions
---

## zh-CN

`actions` 字段接收一个 `ReactNode` 数组，用于展示底部按钮组。

## en-US

The `actions` field receives an array of `ReactNode`, which will be displayed at the bottom as button group.

```js
import { Card, Avatar, Typography, Space } from '@byonedot/web-react';
import { IconThumbUp, IconShareInternal, IconMore } from '@byonedot/web-react/icon';
const { Meta } = Card;

const App = () => {
  return (
    <Card
      className="card-with-icon-hover"
      style={{ width: 360 }}
      cover={
        <div style={{ height: 204, overflow: 'hidden' }}>
          <img
            style={{ width: '100%', transform: 'translateY(-20px)' }}
            alt="dessert"
            src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%2386909C%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E"
          />
        </div>
      }
      actions={[
        <span className="icon-hover">
          <IconThumbUp />
        </span>,
        <span className="icon-hover">
          <IconShareInternal />
        </span>,
        <span className="icon-hover">
          <IconMore />
        </span>,
      ]}
    >
      <Meta
        avatar={
          <Space>
            <Avatar size={24}>A</Avatar>
            <Typography.Text>Username</Typography.Text>
          </Space>
        }
        title="Card Title"
        description="This is the description"
      />
    </Card>
  );
};

export default App;
```

```css:silent
.card-with-icon-hover .icon-hover {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: all 0.1s;
}

.card-with-icon-hover .icon-hover:hover {
  background-color: rgb(var(--gray-2));
}
```
