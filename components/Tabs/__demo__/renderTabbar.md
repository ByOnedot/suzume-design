---
order: 8
title:
  zh-CN: 自定义选项卡头部
  en-US: Customize Header
---

## zh-CN

使用原生 `position: sticky` 实现选项卡头部吸顶效果。

## en-US

Use the native `position: sticky` to fix the tab head to the top.

```js
import { Tabs, Typography } from '@suzume-design/web-react';
const TabPane = Tabs.TabPane;
const style = {
  textAlign: 'center',
  marginTop: 20,
};

const App = () => {
  return (
    <Tabs
      defaultActiveTab="3"
      renderTabHeader={(props, DefaultTabHeader) => {
        return (
          <DefaultTabHeader
            {...props}
            style={{
              position: 'sticky',
              top: 52,
              zIndex: 1,
              background: 'var(--color-bg-2)',
            }}
          />
        );
      }}
    >
      <TabPane key="1" title="Tab 1" style={{ height: 300 }}>
        <Typography.Paragraph style={style}>Content of Tab Panel 1</Typography.Paragraph>
      </TabPane>
      <TabPane key="2" title="Tab 2">
        <Typography.Paragraph style={style}>Content of Tab Panel 2</Typography.Paragraph>
      </TabPane>
      <TabPane key="3" title="Tab 3">
        <Typography.Paragraph style={style}>Content of Tab Panel 3</Typography.Paragraph>
      </TabPane>
    </Tabs>
  );
};

export default App;
```
