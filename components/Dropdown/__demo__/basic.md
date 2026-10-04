---
order: 0
title:
  zh-CN: 基础用法
  en-US: Basic
---

## zh-CN

基础下拉菜单。

## en-US

Basic usage of Dropdown.

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
    <Space className="dropdown-demo">
      <Dropdown droplist={dropList} position="bl">
        <Button type="text">
          Hover me <IconDown />
        </Button>
      </Dropdown>

      <Dropdown droplist={dropList} position="bl" disabled>
        <Button type="text">
          Hover me <IconDown />
        </Button>
      </Dropdown>
    </Space>
  );
}

export default App;
```

```css
.dropdown-demo > .suzume-btn {
  padding: 0 8px;
  font-weight: normal;
}

.dropdown-demo .suzume-dropdown-popup-visible .suzume-icon-down {
  transform: rotate(180deg);
}
```
