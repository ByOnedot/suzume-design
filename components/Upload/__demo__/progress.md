---
order: 13
title:
  zh-CN: 自定义进度条
  en-US: customize progress bar
---

## zh-CN
`progressProps` 字段可以自定义进度条属性。

## en-US

Use `progressProps` for customize progress bar.

```js
import React from 'react';
import { Upload, Radio, Button } from '@byonedot/web-react';

function App() {
  const [fileList, setFileList] = React.useState([
    {
      status: 'init',
      uid: '-2',
      percent: 0,
      name: 'light.png',
      url: 'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23F77234%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E',
    },
    {
      status: 'error',
      uid: '-1',
      percent: 0,
      name: 'cat.png',
      url: 'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23F7BA1E%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E',
    },
  ]);
  return (
    <div className="custom-upload-progress">
      <Upload
        showUploadList={{
          startIcon: (
            <Button size="mini" type="text">
              开始上传
            </Button>
          ),
          cancelIcon: (
            <Button size="mini" type="text">
              取消上传
            </Button>
          ),
          reuploadIcon: (
            <Button size="mini" type="text">
              点击重试
            </Button>
          ),
        }}
        progressProps={{
          size: 'small',
          type: 'line',
          showText: true,
          width: '100%',
        }}
        multiple
        fileList={fileList}
        action="/"
        onChange={setFileList}
        onProgress={(file) => {
          setFileList((v) => {
            return v.map((x) => {
              return x.uid === file.uid ? file : x;
            });
          });
        }}
      />
    </div>
  );
}

export default App;
```

```css
.custom-upload-progress .suzume-upload-list-item-text-content {
  flex-wrap: wrap;
}

.custom-upload-progress .suzume-upload-list-start-icon,
.custom-upload-progress .suzume-upload-list-cancel-icon {
  right: 0;
  left: unset;
  top: -22px;
  transform: none;
}

.custom-upload-progress .suzume-upload-list-rtl .suzume-upload-list-start-icon,
.custom-upload-progress .suzume-upload-list-rtl .suzume-upload-list-cancel-icon {
  right: unset;
  left: 0;
}

.custom-upload-progress .suzume-upload-list-status {
  display: block;
}

.custom-upload-progress .suzume-upload-list-progress {
  display: block;
  height: 0;
  margin-top: 0;
  transition: all 0.2s ease;
  opacity: 0;
  overflow: hidden;
}

.custom-upload-progress .suzume-upload-list-item-uploading .suzume-upload-list-progress {
  margin-top: 8px;
  opacity: 1;
  height: 16px;
}
```
