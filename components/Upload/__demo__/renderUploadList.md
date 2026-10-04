---
order: 11
title:
  zh-CN: 自定义文件上传列表展示
  en-US: Customize upload list
---

## zh-CN
传入 `renderUploadList` 可以自定义展示文件上传列表。第一个参数是当前上传列表，第二个参数是上传列表相关的属性。详细可参考 `<UploadListProps>`

## en-US

Customize the display of uploaded files

```js
import { Upload, Card, Modal } from '@byonedot/web-react';
import { IconEye, IconDelete } from '@byonedot/web-react/icon';

function App() {
  const renderUploadList = (filesList, props) => (
    <div style={{ display: 'flex', marginTop: 20, }} >
      {filesList.map((file) => {
        const url = file.url || URL.createObjectURL(file.originFile);
        return (
          <Card
            key={file.uid}
            hoverable
            style={{
              width: 140,
              marginRight: 10,
            }}
            bodyStyle={{ padding: '4px 8px', }}
            cover={
              <img
                src={url}
                style={{ width: '100%', }}
              />
            }
            actions={[
              <div
                onClick={() => {
                  Modal.info({
                    title: '预览',
                    content: <img src={url || file.url} width="100%" />,
                  });
                }}
              >
                <IconEye style={{ fontSize: 12, }} />
              </div>,
              <div>
                <IconDelete
                  style={{ fontSize: 12, }}
                  onClick={() => {
                    props.onRemove(file);
                  }}
                />
              </div>,
            ]}
          >
            <Card.Meta description={file.name.split('.')[0]} />
          </Card>
        );
      })}
    </div>
  );

  return (
    <div>
      <Upload
        action="/"
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
        renderUploadList={renderUploadList}
      />
    </div>
  );
}

export default App;
```
