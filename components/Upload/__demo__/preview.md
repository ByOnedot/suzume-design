---
order: 2
title:
  zh-CN: 照片墙
  en-US: pictures wall
---

## zh-CN

点击图片预览按钮时，可以`onPreview`中进行预览逻辑。

可以通过 `imagePreview` 属性启用内置的图片预览。（`imagePreview` 属性在 `2.41.0` 支持）

## en-US

`onPreview` will be executed when user click preview icon.

The built-in image preview can be enabled via the `imagePreview` property. (The `imagePreview` property is supported in `2.41.0`)

```js
import { Upload, Message } from '@suzume-design/web-react';

const App = () => {
  return (
    <div>
      <Upload
        multiple
        imagePreview
        defaultFileList={[
          {
            uid: '-2',
            name: '20200717-103937.png',
            url: 'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23F77234%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E',
          },
          {
            uid: '-1',
            name: 'hahhahahahaha.png',
            url: 'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23F7BA1E%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E',
          },
        ]}
        action="/"
        listType="picture-card"
        onPreview={(file) => {
          Message.info('click preview icon')
        }}
      />
    </div>
  );
};

export default App;
```
