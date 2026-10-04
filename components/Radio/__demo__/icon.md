---
order: 2
title:
  zh-CN: 带图标的单选框
  en-US: Radio with icon
---

## zh-CN

单选框可以与图标进行组合。

## en-US

You can display icons in children.

```js
import { Radio } from '@suzume-design/web-react';
import { IconXiguaColor, IconLarkColor, IconTiktokColor } from '@suzume-design/web-react/icon';
const RadioGroup = Radio.Group;
const imgStyle = {
  width: 30,
  height: 30,
  verticalAlign: 'middle',
};

const App = () => {
  return (
    <div>
      <RadioGroup>
        <Radio value="BCY">
          <img
            src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27640%27%20height%3D%27360%27%3E%3Crect%20width%3D%27640%27%20height%3D%27360%27%20fill%3D%27%23722ED1%27%2F%3E%3Crect%20width%3D%27640%27%20height%3D%27140%27%20y%3D%27220%27%20fill%3D%27%2300000022%27%2F%3E%3C%2Fsvg%3E"
            style={imgStyle}
          />
          BCY
        </Radio>
        <Radio value="pipidance">
          <img
            src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27640%27%20height%3D%27360%27%3E%3Crect%20width%3D%27640%27%20height%3D%27360%27%20fill%3D%27%2314C9C9%27%2F%3E%3Crect%20width%3D%27640%27%20height%3D%27140%27%20y%3D%27220%27%20fill%3D%27%2300000022%27%2F%3E%3C%2Fsvg%3E"
            style={imgStyle}
          />
          Pipidance
        </Radio>
        <Radio disabled value="xigua">
          <img
            src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27640%27%20height%3D%27360%27%3E%3Crect%20width%3D%27640%27%20height%3D%27360%27%20fill%3D%27%2386909C%27%2F%3E%3Crect%20width%3D%27640%27%20height%3D%27140%27%20y%3D%27220%27%20fill%3D%27%2300000022%27%2F%3E%3C%2Fsvg%3E"
            style={imgStyle}
          />
          Xigua Video
        </Radio>
      </RadioGroup>
    </div>
  );
};

export default App;
```
