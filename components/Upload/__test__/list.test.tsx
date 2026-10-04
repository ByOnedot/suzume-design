import React from 'react';
import { act } from '../../../tests/util';
import { IconFileAudio, IconClose, IconFaceFrownFill, IconUpload } from '../../../icon';
import { STATUS } from '../interface';
import mountTest from '../../../tests/mountTest';
import Upload from '..';
import { render, fireEvent } from '../../../tests/util';

mountTest(Upload);

const defaultFileList = [
  {
    uid: '-2',
    name: '20200717-103937.png',
    url: 'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27640%27%20height%3D%27360%27%3E%3Crect%20width%3D%27640%27%20height%3D%27360%27%20fill%3D%27%23722ED1%27%2F%3E%3Crect%20width%3D%27640%27%20height%3D%27140%27%20y%3D%27220%27%20fill%3D%27%2300000022%27%2F%3E%3C%2Fsvg%3E',
  },
  {
    uid: '-1',
    name: 'hahhahahahaha.png',
    url: 'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27640%27%20height%3D%27360%27%3E%3Crect%20width%3D%27640%27%20height%3D%27360%27%20fill%3D%27%23722ED1%27%2F%3E%3Crect%20width%3D%27640%27%20height%3D%27140%27%20y%3D%27220%27%20fill%3D%27%2300000022%27%2F%3E%3C%2Fsvg%3E',
  },
];

describe('Upload list', function () {
  it('renderUploadList', async function () {
    const mockFn = vi.fn();
    const wrapper = render(
      <Upload
        defaultFileList={defaultFileList}
        action="/sss"
        renderUploadList={() => {
          mockFn();
          return <div id="test">123</div>;
        }}
      />
    );

    expect(mockFn.mock.calls.length).toBe(1);
    expect(wrapper.find('#test')).toHaveLength(1);
  });

  it('showUploadList', async function () {
    const onRemoveFn = vi.fn();
    const wrapper = render(
      <Upload
        fileList={[defaultFileList[0], { ...defaultFileList[1], status: 'error' }]}
        action="/sss"
        onRemove={onRemoveFn}
        showUploadList={{
          reuploadIcon: <IconUpload />,
          cancelIcon: <IconClose />,
          fileIcon: <IconFileAudio />,
          removeIcon: <IconClose />,
          previewIcon: null,
          errorIcon: <IconFaceFrownFill />,
          fileName: (file) => {
            return <a id="test">{file.name}</a>;
          },
        }}
      />
    );

    expect(wrapper.find('#test')).toHaveLength(2);
    expect(wrapper.find('.suzume-upload-list-remove-icon .suzume-icon-close')).toHaveLength(2);

    await act(() => {
      fireEvent.click(wrapper.find('.suzume-upload-list-remove-icon .suzume-icon-close').item(0));
    });

    expect(onRemoveFn.mock.calls.length).toBe(1);

    expect(wrapper.find('.suzume-upload-list-reupload-icon .suzume-icon-upload')).toHaveLength(1);
    expect(
      wrapper.find('.suzume-upload-list-error-icon .suzume-icon-face-frown-fill')
    ).toHaveLength(1);

    let changeFile;

    wrapper.rerender(
      <Upload
        listType="picture-card"
        fileList={[defaultFileList[0], { ...defaultFileList[1], status: 'error' }]}
        action="/sss"
        onRemove={onRemoveFn}
        onChange={(_, file) => {
          changeFile = file;
        }}
        showUploadList={{
          reuploadIcon: <IconUpload />,
          cancelIcon: <IconClose />,
          fileIcon: <IconFileAudio />,
          removeIcon: <IconClose />,
          previewIcon: null,
          errorIcon: <IconFaceFrownFill />,
          fileName: (file) => {
            return <a id="test">{file.name}</a>;
          },
        }}
      />
    );

    expect(wrapper.find('.suzume-upload-list-preview-icon')).toHaveLength(0);
    expect(wrapper.find('.suzume-upload-list-reupload-icon')).toHaveLength(1);

    await act(() => {
      fireEvent.click(wrapper.find('.suzume-upload-list-reupload-icon')[0]);
    });

    expect(changeFile.status).toBe(STATUS.uploading);
  });

  it('showUploadList progressRender, imageRender', async function () {
    const wrapper = render(
      <Upload
        fileList={[defaultFileList[0]]}
        action="/sss"
        showUploadList={{
          progressRender: () => {
            return <div id="progress">aaa</div>;
          },
          imageRender: () => {
            return <div id="image">aaa</div>;
          },
        }}
      />
    );

    expect(wrapper.find('#progress')).toHaveLength(1);

    wrapper.rerender(
      <Upload
        listType="picture-card"
        fileList={[defaultFileList[0]]}
        action="/sss"
        showUploadList={{
          progressRender: () => {
            return <div id="progress">aaa</div>;
          },
          imageRender: () => {
            return <div id="image">aaa</div>;
          },
        }}
      />
    );

    expect(wrapper.find('#image')).toHaveLength(1);
  });
});
