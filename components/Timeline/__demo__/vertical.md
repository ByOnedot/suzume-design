---
order: 5
title:
  zh-CN: 纵向时间轴
  en-US: Vertical
---

## zh-CN

竖直方向的时间轴。

## en-US

The vertical time axis.

```js
import React from 'react';
import { Timeline, Grid, Radio, Typography } from '@byonedot/web-react';

const TimelineItem = Timeline.Item;
const { Row, Col } = Grid;

const imageStyle = {
  margin: '0 12px 12px 12px'
}

function App() {
  const [mode, setMode] = React.useState('left');
  return (
    <div>
      <Row align="center" style={{ marginBottom: 24 }}>
        <Typography.Text>mode: &nbsp; &nbsp;</Typography.Text>
        <Radio.Group
          value={mode}
          onChange={setMode}
          options={[
            {
              label: 'left',
              value: 'left',
            },
            {
              label: 'right',
              value: 'right',
            },
            {
              label: 'alternate',
              value: 'alternate',
            },
          ]}
        />
      </Row>
      <Timeline mode={mode} labelPosition="relative">
        <TimelineItem label="2012-08">
          <Row style={{ display: 'inline-flex', alignItems: 'center' }}>
            <img
              width="40"
              style={imageStyle}
              src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23F5319D%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E"
            />
            <div style={{ marginBottom: 12 }}>
              Toutiao
              <div style={{ fontSize: 12, color: '#4E5969' }}>Founded in 2012</div>
            </div>
          </Row>
        </TimelineItem>
        <TimelineItem label="2017-05">
          <Row style={{ display: 'inline-flex', alignItems: 'center' }}>
            <img
              width="40"
              style={imageStyle}
              src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%2314C9C9%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E"
            />
            <div style={{ marginBottom: 12 }}>
              Xigua Video
              <div style={{ fontSize: 12, color: '#4E5969' }}>Founded in 2017</div>
            </div>
          </Row>
        </TimelineItem>
        <TimelineItem label="2018-07">
          <Row style={{ display: 'inline-flex', alignItems: 'center' }}>
            <img
              width="40"
              style={imageStyle}
              src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23F7BA1E%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E"
            />
            <div style={{ marginBottom: 12 }}>
              Pipidance
              <div
                style={{
                  fontSize: 12,
                  color: '#4E5969',
                }}
              >
                Founded in 2018
              </div>
            </div>
          </Row>
        </TimelineItem>
      </Timeline>
    </div>
  );
}

export default App;
```
