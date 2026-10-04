---
order: 10
title:
  zh-CN: 挂载节点
  en-US: Popup container
---

## zh-CN

可以通过 `getPopupContainer` 指定预览挂载的父级节点。

## en-US

Use `getPopupContainer` to specify the parent node where the preview should mount to.

```js
import React from 'react';
import { Image } from '@byonedot/web-react';

const wrapperStyle = {
  width: '100%',
  height: 400,
  backgroundColor: 'var(--color-fill-2)',
  position: 'relative',
  overflow: 'hidden',
  lineHeight: '400px',
  textAlign: 'center',
};

function App() {
  const ref = React.useRef();
  return (
    <div style={wrapperStyle} ref={ref}>
      <Image
        width={200}
        previewProps={{
          getPopupContainer: () => ref.current,
          closable: false,
        }}
        src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23F77234%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E"
        alt="lamp"
      />
    </div>
  );
}

export default App;
```
