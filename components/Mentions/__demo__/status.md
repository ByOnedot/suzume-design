---
order: 3
title:
  zh-CN: 无效或只读
  en-US: Disabled & ReadOnly
---

## zh-CN

通过 `disabled` 设置是否禁用，通过 `readOnly` 属性设置是否只读。

## en-US

Set whether to be disabled via `disabled`, and set whether to be readonly via `readOnly` property.

```js
import { Mentions, Space } from '@byonedot/web-react';

const App = () => {
  return (
    <Space size={40}>
      <Mentions
        style={{ width: 154 }}
        readOnly
        defaultValue="Example"
        options={['Example', 'Sample', 'Demo']}
      />
      <Mentions
        style={{ width: 154 }}
        disabled
        defaultValue="Example"
        options={['Example', 'Sample', 'Demo']}
      />
    </Space>
  );
};

export default App;
```
