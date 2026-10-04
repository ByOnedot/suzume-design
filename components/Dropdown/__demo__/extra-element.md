---
order: 2
title:
  zh-CN: 其他元素
  en-US: Extra node
---

## zh-CN

设置 Menu 禁用项和插入分割线。

## en-US

Disable menu items and insert dividing lines.

```js
import { Dropdown, Menu, Button, Divider } from '@suzume-design/web-react';
import { IconDown } from '@suzume-design/web-react/icon';
const dropList = (
  <Menu>
    <Menu.Item key="1">Beijing</Menu.Item>
    <Menu.Item key="2">Shanghai</Menu.Item>
    <Menu.Item key="3">Guangzhou</Menu.Item>
    <Divider style={{ margin: '4px 0' }} />
    <Menu.Item key="4" disabled>
      Shenzhen
    </Menu.Item>
  </Menu>
);

function App() {
  return (
    <div className="dropdown-demo">
      <Dropdown droplist={dropList} position="br">
        <Button type="text">
          Hover
          <IconDown />
        </Button>
      </Dropdown>
    </div>
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
