---
order: 7
title:
  zh-CN: 移除前校验
  en-US: onRemove
---

## zh-CN

`onRemove` 会在每个文件从上传列表中删除之前执行。如果返回 false 或者 Promise.reject，那么将会终止移除操作。

## en-US

The function will be executed when user click remove icon. Remove actions will be aborted when the return value is false or a Promise which resolve(false) or reject

```js
import React from 'react';
import { Upload, Modal } from '@byonedot/web-react';

class App extends React.Component {
  render() {
    return (
      <div>
        <Upload
          multiple
          action="/"
          onRemove={(file) => {
            return new Promise((resolve, reject) => {
              Modal.confirm({
                title: 'onRemove',
                content: `确认删除 ${file.name}`,
                onConfirm: () => resolve(true),
                onCancel: () => reject('cancel'),
              });
            });
          }}
          defaultFileList={[
            {
              uid: '-2',
              name: 'light.png',
              url: 'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23F77234%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E',
            },
            {
              uid: '-1',
              name: 'ice.png',
              url: 'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23F77234%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E',
            },
          ]}
        />
      </div>
    );
  }
}

export default App;
```
