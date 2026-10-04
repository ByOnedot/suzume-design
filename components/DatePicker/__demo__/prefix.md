---
order: 1
title:
  zh-CN: 带有前缀
  en-US: Prefix
---

## zh-CN

通过 `prefix` 属性设置前缀

## en-US

Set the prefix via the `prefix` property

```js
import { DatePicker, Space } from '@byonedot/web-react';
import { IconInfoCircle } from '@byonedot/web-react/icon';

const App = () => {
  return (
    <Space>
      <DatePicker style={{ width: 200 }} prefix={<IconInfoCircle />}/>
      <DatePicker.RangePicker style={{ width: 350 }} prefix={<IconInfoCircle />}/>
    </Space>
  );
};

export default App;
```
