---
order: 8
title:
  zh-CN: 单独使用预览组件
  en-US: Use Preview alone
---

## zh-CN

`Image.Preview` 可单独使用，需要配置 `src`，并控制 `visible`。

## en-US

`Image.Preview` can be used alone, you need to set `src` and control `visible`.

```js
import React from 'react';
import { Image, Button } from '@byonedot/web-react';

function App() {
  const [visible, setVisible] = React.useState(false);
  return (
    <div>
      <Button type="primary" onClick={() => setVisible(true)}>
        Click me to preview image
      </Button>
      <Image.Preview
        src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23F77234%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E"
        visible={visible}
        onVisibleChange={setVisible}
      />
    </div>
  );
}

export default App;
```
