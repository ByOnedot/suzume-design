import React from 'react';
import { act } from 'react-dom/test-utils';
import { fireEvent, render } from '../../../tests/util';
import componentConfigTest from '../../../tests/componentConfigTest';
import Image from '..';
import Button from '../../Button';

// mountTest(Image);
componentConfigTest(Image, 'Image');

const imgSrc =
  'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27640%27%20height%3D%27360%27%3E%3Crect%20width%3D%27640%27%20height%3D%27360%27%20fill%3D%27%2386909C%27%2F%3E%3Crect%20width%3D%27640%27%20height%3D%27140%27%20y%3D%27220%27%20fill%3D%27%2300000022%27%2F%3E%3C%2Fsvg%3E';

describe('Image', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
  });
  afterEach(async () => {
    vi.useFakeTimers();
    vi.isFakeTimers() && vi.runAllTimers();
    // React 18+ schedules the notice exit transition; flush it so the
    // DOM is clean before the next test starts.
    await act(async () => {});
  });

  const updateImg = (wrapper, method = 'load') => {
    if (wrapper.find('img')[0] && fireEvent[method]) {
      fireEvent[method](wrapper.find('img')[0]);
      vi.isFakeTimers() && vi.runAllTimers();
    }
  };

  it('render image with error src', () => {
    const mockError = vi.fn();
    const mockLoad = vi.fn();
    const wrapper = render(<Image src="error" onError={mockError} onLoad={mockLoad} />);
    act(() => {
      updateImg(wrapper, 'error');
    });
    expect(wrapper.find('.suzume-image-error')).toHaveLength(1);
    act(() => {
      wrapper.find('img')[0].setAttribute('src', imgSrc);
      updateImg(wrapper);
    });
    expect(wrapper.find('.suzume-image-error')).toHaveLength(0);
  });

  it('render basic instance correctly', () => {
    const mockClick = vi.fn();
    const mockVisibleChange = vi.fn();
    const wrapper = render(
      <Image
        src={imgSrc}
        width={200}
        onClick={mockClick}
        previewProps={{ onVisibleChange: mockVisibleChange }}
      />
    );
    act(() => {
      updateImg(wrapper, 'click');
    });

    expect(mockClick).toHaveBeenCalledTimes(1);
    expect(mockVisibleChange).toHaveBeenCalledTimes(1);
  });

  it('render extra options correctly', () => {
    const mockClick = vi.fn();
    const wrapper = render(
      <Image
        src={imgSrc}
        width={200}
        actions={[
          <Button key={1} onClick={mockClick} className="extra-btn">
            extra
          </Button>,
        ]}
      />
    );
    act(() => {
      updateImg(wrapper);
    });
    expect(wrapper.find('.suzume-image-actions-list .suzume-image-actions-item')).toHaveLength(1);
    act(() => {
      fireEvent.click(wrapper.find('.extra-btn')[0]);
    });
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('The image common property behaves normally', () => {
    const mockLoad = vi.fn();
    const mockMouseEnter = vi.fn();
    const title = 'image_title';
    const wrapper = render(
      <Image
        src={imgSrc}
        width={200}
        onLoad={mockLoad}
        onMouseEnter={mockMouseEnter}
        title={title}
      />
    );
    act(() => {
      updateImg(wrapper);
    });
    expect(mockLoad).toHaveBeenCalledTimes(1);
    expect(wrapper.find(`img[title=${title}]`)).toHaveLength(1);

    act(() => {
      updateImg(wrapper, 'mouseEnter');
    });
    expect(mockMouseEnter).toHaveBeenCalledTimes(1);
  });
    vi.useRealTimers();
});
