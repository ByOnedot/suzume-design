---
order: 4
title:
  zh-CN: 图片列表样式
  en-US: pictures with list
---

## zh-CN

图片列表样式

## en-US

Pictures with list style.

```js
import { Upload, Radio } from '@byonedot/web-react';
const defaultFileList = [
  {
    uid: '-3',
    name: 'light.png',
    url: 'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23F77234%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E',
  },
];

const App = () => {
  return (
    <div>
      <Upload
        listType="picture-list"
        action="/"
        multiple
        defaultFileList={defaultFileList}
      ></Upload>
    </div>
  );
};

export default App;
```
