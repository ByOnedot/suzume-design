import React, { useState } from 'react';
import { Image, Button, Space } from '@self';

function ImageWrapper({ actions }) {
  console.log(actions);
  return (
    <Image
      src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27160%27%20height%3D%27160%27%3E%3Crect%20width%3D%27160%27%20height%3D%27160%27%20fill%3D%27%23F77234%27%2F%3E%3Ccircle%20cx%3D%2780%27%20cy%3D%2762%27%20r%3D%2730%27%20fill%3D%27%23ffffffdd%27%2F%3E%3Cpath%20d%3D%27M36%20160a44%2044%200%200188%200z%27%20fill%3D%27%23ffffffdd%27%2F%3E%3C%2Fsvg%3E"
      previewProps={{
        actions: actions || [],
      }}
    />
  );
}
ImageWrapper.displayName = 'Image';

function Demo1() {
  const [actions, setActions] = useState([]);
  return (
    <a>
      <span
        onClick={() => {
          setActions([
            {
              key: 'download',
              content: (
                <span
                  onClick={() => {
                    setActions([
                      {
                        key: 'info',
                        content: 'info',
                        name: 'Info',
                      },
                    ]);
                  }}
                >
                  download
                </span>
              ),
              name: 'Download',
            },
            {
              key: 'info',
              content: 'info',
              name: 'Info',
            },
          ]);
        }}
      >
        asdd
      </span>
      <Image.PreviewGroup>
        <ImageWrapper actions={actions} />
      </Image.PreviewGroup>
    </a>
  );
}

export const Demo = () => <Demo1 />;

export default {
  title: 'Image',
};
