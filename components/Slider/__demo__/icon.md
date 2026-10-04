---
order: 6
title:
  zh-CN: 带有icon的滑动输入条
  en-US: With Icon
---

## zh-CN

两边带有 icon 表示状态。

## en-US

There are icons on both sides of the slider to indicate status.

```js
import { useState } from 'react';
import { Slider, Space } from '@byonedot/web-react';
import { IconSound, IconMute } from '@byonedot/web-react/icon';

function App() {
  const [value, setValue] = useState(10);
  return (
    <Space size={60}>
      <Space>
        <img
          style={{ width: 22, verticalAlign: 'bottom' }}
          src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27640%27%20height%3D%27360%27%3E%3Crect%20width%3D%27640%27%20height%3D%27360%27%20fill%3D%27%2314C9C9%27%2F%3E%3Crect%20width%3D%27640%27%20height%3D%27140%27%20y%3D%27220%27%20fill%3D%27%2300000022%27%2F%3E%3C%2Fsvg%3E"
        />
        <Slider defaultValue={50} style={{ width: 200 }} />
        <img
          style={{ width: 22, verticalAlign: 'bottom' }}
          src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27640%27%20height%3D%27360%27%3E%3Crect%20width%3D%27640%27%20height%3D%27360%27%20fill%3D%27%23165DFF%27%2F%3E%3Crect%20width%3D%27640%27%20height%3D%27140%27%20y%3D%27220%27%20fill%3D%27%2300000022%27%2F%3E%3C%2Fsvg%3E"
        />
      </Space>
      <Space>
        <IconMute
          style={{
            fontSize: 16,
            color: value > 0 ? 'var(--color-text-4)' : 'var(--color-text-1)',
          }}
        />
        <Slider value={value} onChange={setValue} style={{ width: 200 }} />
        <IconSound
          style={{
            fontSize: 16,
            color: value === 0 ? 'var(--color-text-4)' : 'var(--color-text-1)',
          }}
        />
      </Space>
    </Space>
  );
}

export default App;
```
