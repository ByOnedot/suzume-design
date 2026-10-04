---
order: 0
title:
  zh-CN: 基础用法
  en-US: Basic
---

## zh-CN

头像的基础使用。如果头像是文字的话，会自动调节字体大小，来适应头像框。

## en-US

Basic usage. If the avatar content is text, the font size will be automatically adjusted to fit the content in the avatar.

```js
import { Avatar, Typography, Space } from '@byonedot/web-react';
import { IconUser } from '@byonedot/web-react/icon';
const { Text } = Typography;

const App = () => {
  return (
    <Space size="large">
      <Avatar>A</Avatar>
      <Avatar style={{ backgroundColor: '#3370ff' }}>
        <IconUser />
      </Avatar>
      <Avatar style={{ backgroundColor: '#14a9f8' }}>
        Suzume
      </Avatar>
      <Avatar style={{ backgroundColor: '#00d0b6' }}>
        Design
      </Avatar>
      <Avatar>
        <img
          alt="avatar"
          src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23F77234%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E"
        />
      </Avatar>
    </Space>
  );
};

export default App;
```
