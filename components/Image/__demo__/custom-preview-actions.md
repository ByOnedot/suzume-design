---
order: 6
title:
  zh-CN: 自定义预览控制条
  en-US: Preview control bar
---

## zh-CN

通过设置 `actionsLayout` 可以调整预览控制条中功能按钮的顺序，同时可以过滤功能按钮，只有在 actionsLayout 中的按钮才会出现。其中 `extra` 代表 `actions` 中的按钮，而且 `actions` 中的 `key` 也支持单独拿出来排序。

## en-US

The function buttons on the control preview control bar can be sorted and filtered through `actionLayout`. Among them, `extra` represents the buttons in `actions`, and the `key` in `actions` also supports separate sorting.

```js
import { Image, Tooltip, Space } from '@suzume-design/web-react';
import { IconDownload, IconInfoCircle } from '@suzume-design/web-react/icon';

function App() {
  return (
    <Image
      width={200}
      src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23F77234%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E"
      previewProps={{
        actions: [
          {
            key: 'download',
            content: <IconDownload />,
            name: 'Download',
          },
          {
            key: 'info',
            content: <IconInfoCircle />,
            name: 'Info',
            getContainer: (action) => {
              return <Tooltip content="A user’s avatar">{action}</Tooltip>;
            },
          },
        ],
        actionsLayout: ['info', 'rotateRight', 'zoomIn', 'zoomOut', 'extra'],
      }}
      alt="lamp"
    />
  );
}

export default App;
```
