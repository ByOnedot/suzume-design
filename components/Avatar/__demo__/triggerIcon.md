---
order: 3
title:
  zh-CN: 交互按钮
  en-US: Trigger icon
---

## zh-CN

可以通过 `triggerIcon` `triggerType` 来定制交互按钮，类型有 `mask (遮罩)` 和 `button (按钮)` 两种，通过 `onClick` 参数来添加回调。

## en-US

Customize the interactive button through `triggerIcon` and `triggerType`. Two types are available: `mask` and `button`. Callbacks can be added through the `onClick` parameter.

```js
import { Avatar, Message, Space } from '@suzume-design/web-react';
import { IconUser, IconCamera, IconEdit, IconClose } from '@suzume-design/web-react/icon';

const App = () => {
  return (
    <Space size="large">
      <Avatar
        triggerIcon={<IconCamera />}
        triggerIconStyle={{
          color: '#3491FA',
        }}
        onClick={() => Message.info('Upload...')}
        autoFixFontSize={false}
        style={{
          backgroundColor: '#168CFF',
        }}
      >
        A
      </Avatar>
      <Avatar
        triggerIcon={<IconEdit />}
        onClick={() => Message.info('Upload...')}
        style={{ backgroundColor: '#14C9C9' }}
      >
        <IconUser />
      </Avatar>
      <Avatar
        shape="square"
        triggerIcon={<IconEdit />}
        onClick={() => Message.info('Upload...')}
        style={{ backgroundColor: '#FFC72E' }}
      >
        <IconUser />
      </Avatar>
      <Avatar triggerIcon={<IconCamera />} triggerType="mask">
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
