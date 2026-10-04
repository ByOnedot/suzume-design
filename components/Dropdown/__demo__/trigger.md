---
order: 3
title:
  zh-CN: 触发方式
  en-US: Trigger mode
---

## zh-CN

通过 `trigger` 指定触发方式。

## en-US

Specify the trigger mode by `trigger`.

```js
import { Dropdown, Menu, Button, Space } from '@suzume-design/web-react';
import { IconDown } from '@suzume-design/web-react/icon';
const dropList = (
  <Menu>
    <Menu.Item key="1">Beijing</Menu.Item>
    <Menu.Item key="2">Shanghai</Menu.Item>
    <Menu.Item key="3">Guangzhou</Menu.Item>
  </Menu>
);

function App() {
  return (
    <Space size="large" className="dropdown-demo">
      <Dropdown droplist={dropList} position="br">
        <Button type="text">
          Hover
          <IconDown />
        </Button>
      </Dropdown>
      <Dropdown droplist={dropList} trigger="click" position="br">
        <Button type="text">
          Click
          <IconDown />
        </Button>
      </Dropdown>
    </Space>
  );
}

export default App;
```

```css:silent
.dropdown-demo > .suzume-btn {
  padding: 0 8px;
  font-weight: normal;
}

.dropdown-demo .suzume-dropdown-popup-visible .suzume-icon-down {
  transform: rotate(180deg);
}
```
