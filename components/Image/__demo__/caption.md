---
order: 1
title:
  zh-CN: 显示 Caption
  en-US: Show caption
---

## zh-CN

通过设置 `title` 和 `description` 可以将图片的标题和描述显示在图片内部或者底部，显示的位置通过 `footerPosition` 控制。

## en-US

By setting `title` and `description`, the title and description of the picture can be displayed inside or at the bottom of the picture. The display position is controlled by `footerPosition`.

```js
import { Image, Space } from '@byonedot/web-react';

function App() {
  const src =
    'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23F77234%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E';
  const title = 'A user’s avatar';
  const description = 'Present by Suzume Design';
  return (
    <Space size={60} align="start">
      <Image width={200} src={src} title={title} description={description} alt="lamp" />
      <Image
        width={200}
        src={src}
        title={title}
        description={description}
        footerPosition="outer"
        alt="lamp"
      />
    </Space>
  );
}

export default App;
```
