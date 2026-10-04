---
order: 2
title:
  zh-CN: 自定义图片
  en-US: Customize Image
---

## zh-CN

可以通过 `imgSrc` 参数传入图片 Url。

## en-US

You can pass in the image URL through the `imgSrc` parameter.

```js
import { Empty, Button } from '@suzume-design/web-react';

const App = () => {
  return (
    <Empty
      imgSrc="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23F77234%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E"
      description={<Button type="primary">Refresh</Button>}
    />
  );
};

export default App;
```
