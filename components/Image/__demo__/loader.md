---
order: 4
title:
  zh-CN: 加载状态
  en-US: Loading
---

## zh-CN

默认情况下，加载效果是不显示的，可通过设置 `loader=true` 显示默认加载效果。如果默认加载效果不符合需求。还可以通过 `loaderClassName` 自行设置加载样式。

## en-US

There is no loading effect by default. Default loading effect can be enabled with `loader=true`. If the default loading effect does not meet the requirements, you can also set the loading style through `loaderClassName`.

Loading

```js
import React from 'react';
import { Image, Button, Space } from '@suzume-design/web-react';

function App() {
  const [timestamp, setTimestamp] = React.useState('');
  return (
    <div>
      <div>
        <Button
          type="primary"
          onClick={() => {
            setTimestamp(Date.now());
          }}
          style={{ marginBottom: 20 }}
        >
          reload
        </Button>
      </div>
      <Space size={20}>
        <Image
          width={200}
          height={200}
          src={`data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23F77234%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E`}
          loader={true}
          alt="lamp1"
        />
        <Image
          width={200}
          height={200}
          src={`data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23F77234%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E`}
          loaderClassName="image-demo-loader-animate"
          alt="lamp2"
          style={{ marginLeft: 67 }}
        />
      </Space>
    </div>
  );
}

export default App;
```

```css
.image-demo-loader-animate {
  background: linear-gradient(
    -60deg,
    var(--color-fill-2) 25%,
    var(--color-neutral-3) 40%,
    var(--color-fill-3) 55%
  );
  background-size: 400% 100%;
  animation: image-demo-loader-circle 1.5s cubic-bezier(0.34, 0.69, 0.1, 1) infinite;
}

@keyframes image-demo-loader-circle {
  0% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0 50%;
  }
}
```
