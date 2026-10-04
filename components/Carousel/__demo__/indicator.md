---
order: 2
title:
  zh-CN: 指示器
  en-US: Indicator
---

## zh-CN

可以指定指示器类型：`dot` | `line` | `slider` 和位置 `left` | `right` | `top` | `bottom` | `outer`。

## en-US

You can specify the indicator type: `dot` | `line` | `slider` and position `left` | `right` | `top` | `bottom` | `outer`.

```js
import { Carousel, Radio } from '@byonedot/web-react';
import { useState } from 'react';
const RadioGroup = Radio.Group;
const imageSrc = [
  'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%2314C9C9%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E',
  'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23165DFF%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E',
  'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%2386909C%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E',
  'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23F77234%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E',
];

function App() {
  const [indicatorType, setIndicatorType] = useState('dot');
  const [indicatorPosition, setIndicatorPosition] = useState('bottom');
  return (
    <>
      <RadioGroup
        type="button"
        name="type"
        value={indicatorType}
        onChange={(value) => { setIndicatorType(value) }}
        style={{ marginBottom: 10 }}
      >
        <Radio value="dot">dot</Radio>
        <Radio value="line">line</Radio>
        <Radio value="slider">slider</Radio>
      </RadioGroup>
      <br />
      <RadioGroup
        type="button"
        name="position"
        value={indicatorPosition}
        onChange={(value) => {
          setIndicatorPosition(value);
        }}
        style={{
          marginBottom: 20,
        }}
      >
        <Radio value="left">left</Radio>
        <Radio value="right">right</Radio>
        <Radio value="top">top</Radio>
        <Radio value="bottom">bottom</Radio>
        <Radio value="outer">outer</Radio>
      </RadioGroup>
      <Carousel
        indicatorType={indicatorType}
        indicatorPosition={indicatorPosition}
        showArrow="never"
        style={{ width: 600, height: 240 }}
      >
        {imageSrc.map((src, index) => (
          <div key={index}>
            <img
              src={src}
              style={{ width: '100%' }}
            />
          </div>
        ))}
      </Carousel>
    </>
  );
}

export default App;
```
