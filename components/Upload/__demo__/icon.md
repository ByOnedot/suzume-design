---
order: 10
title:
  zh-CN: 自定义图标
  en-US: custom icon
---

## zh-CN

`showUploadList` 字段可以设置图标。

## en-US

`showUploadList` can be an object to customize `previewIcon`, `removeIcon`, `fileIcon`, `reuploadIcon`, `cancelIcon`, `startIcon`, `errorIcon` and `fileName`.

```js
import React from 'react';
import { Upload, Radio, Typography, Message } from '@byonedot/web-react';
import {
  IconFileAudio,
  IconClose,
  IconFaceFrownFill,
  IconUpload,
  IconEye,
} from '@byonedot/web-react/icon';

function App() {
  const [listType, setListtype] = React.useState('text');
  return (
    <div>
      <Typography.Text>Type:</Typography.Text> &emsp;
      <Radio.Group
        name="listType"
        value={listType}
        onChange={setListtype}
        style={{ marginLeft: 20, marginBottom: 20 }}
        options={['text', 'picture-list', 'picture-card']}
      ></Radio.Group>
      <div>
        <Upload
          showUploadList={{
            // Please dont remove this comment
            reuploadIcon: <IconUpload />,
            cancelIcon: <IconClose />,
            fileIcon: <IconFileAudio />,
            removeIcon: <IconClose />,
            previewIcon: null,
            errorIcon: <IconFaceFrownFill />,
            fileName: (file) => {
              return (
                <a
                  onClick={() => {
                    Message.info('click ' + file.name);
                  }}
                >
                  {file.name}
                </a>
              );
            },
          }}
          progressProps={{
            formatText: (percent) => `${percent}%`,
          }}
          multiple
          defaultFileList={[
            {
              uid: '-2',
              name: 'light.png',
              url: 'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23F77234%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E',
            },
            {
              uid: '-1',
              name: 'ice.png',
              url: 'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23F77234%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E',
            },
          ]}
          listType={listType}
          action="/"
        />
      </div>
    </div>
  );
}

export default App;
```
