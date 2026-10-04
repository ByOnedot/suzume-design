---
order: 0
title:
  zh-CN: 基础用法
  en-US: Basic
---

## zh-CN

需要查看图片的时候，简单的设置 `src` 属性，就能获得一个有预览图片功能的组件。

## en-US

When you need to view a picture, simply set the `src` property to get a component with picture preview function.

```js
import { Image } from '@suzume-design/web-react';

function App() {
  return (
    <Image
      width={200}
      src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23F77234%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E"
      alt="lamp"
    />
  );
}

export default App;
```
