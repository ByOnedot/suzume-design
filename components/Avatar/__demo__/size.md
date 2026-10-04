---
order: 1
title:
  zh-CN: 大小和形状
  en-US: Size
---

## zh-CN

通过设置 `size` 字段，可以调节头像的大小，默认大小为 `40px`。设置 `shape` 字段，可以设置头像是圆形 (circle) 还是正方形 (square)。

## en-US

Use `size` to set the size of the avatar, which defaults to `40px`. Two `shape`s are available for the avatar: `circle` and `square`.

```js
import { Avatar, Space } from '@byonedot/web-react';

const App = () => {
  return (
    <Space size="large" direction="vertical">
      <Space size="large">
        <Avatar size={64}>Suzume</Avatar>
        <Avatar size={40}>Suzume</Avatar>
        <Avatar size={32}>Suzume</Avatar>
        <Avatar size={24}>Suzume</Avatar>
      </Space>
      <Space size="large">
        <Avatar size={64} shape="square">
          Suzume
        </Avatar>
        <Avatar size={40} shape="square">
          Suzume
        </Avatar>
        <Avatar size={32} shape="square">
          Suzume
        </Avatar>
        <Avatar size={24} shape="square">
          Suzume
        </Avatar>
      </Space>
    </Space>
  );
};

export default App;
```
