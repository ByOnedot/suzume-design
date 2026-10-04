---
order: 15
title:
  zh-CN: 定制日期单元格
  en-US: Customize cell
---

## zh-CN

利用 `dateRender` 可以定制日期单元格。

## en-US

Use `dateRender` to customize date cells.

```js
import { DatePicker } from '@byonedot/web-react';
const highlightStyle = {
  border: '1px solid rgb(var(--suzumeblue-6))',
};

const App = () => {
  return (
    <DatePicker
      dateRender={(current) => {
        const date = current.date();
        const highlightDates = [6, 14, 22];
        return (
          <div className="suzume-picker-date">
            <div
              className="suzume-picker-date-value"
              style={highlightDates.indexOf(date) > -1 ? highlightStyle : {}}
            >
              {current.date()}
            </div>
          </div>
        );
      }}
      style={{ width: 200 }}
    />
  );
};

export default App;
```
