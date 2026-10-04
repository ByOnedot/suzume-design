---
order: 1
title:
  zh-CN: 自定义触发字符
  en-US: Custom Trigger Word
---

## zh-CN

指定 `prefix` 来自定义触发字符。默认为 `@`，可以自定义为任意字符。

## en-US

Specify `prefix` to customize the trigger character. The default is `@`, which can be customized to any character.

```js
import { Mentions, Space } from '@suzume-design/web-react';

const App = () => {
  return (
    <Space size={40}>
      <Mentions
        style={{ width: 154, marginBottom: 10 }}
        placeholder="Input @"
        options={['Example', 'Sample', 'Demo']}
      />
      <Mentions
        style={{ width: 154, marginBottom: 10 }}
        prefix="#"
        placeholder="Input #"
        options={['Example', 'Sample', 'Demo']}
      />
      <Mentions
        style={{ width: 154, marginBottom: 10 }}
        prefix="*"
        placeholder="Input *"
        options={['Example', 'Sample', 'Demo']}
      />
       <Mentions
        style={{ width: 154, marginBottom: 10 }}
        prefix="${"
        placeholder="Input ${"
        options={['Example', 'Sample', 'Demo']}
      />
    </Space>
  );
};

export default App;
```
