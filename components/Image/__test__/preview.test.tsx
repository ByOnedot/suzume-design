import React, { useState } from 'react';
import { act } from '../../../tests/util';
import Image, { ImagePreviewProps } from '..';
import Button from '../../Button';
import { fireEvent, render } from '../../../tests/util';

const imgSrc =
  'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27640%27%20height%3D%27360%27%3E%3Crect%20width%3D%27640%27%20height%3D%27360%27%20fill%3D%27%2386909C%27%2F%3E%3Crect%20width%3D%27640%27%20height%3D%27140%27%20y%3D%27220%27%20fill%3D%27%2300000022%27%2F%3E%3C%2Fsvg%3E';

const DemoImage = (props: ImagePreviewProps) => {
  const [visible, setVisible] = useState(false);
  const [scales, setScales] = useState(props.scales || []);
  return (
    <>
      <Button onClick={() => setVisible(true)} className="open-img-btn">
        {visible ? 'Close' : 'Open'}
      </Button>
      <Button
        onClick={() => {
          const value = document.querySelector('.image-scales')?.innerHTML;
          if (value) {
            setScales(value.split(',').map((str) => Number(str)));
          }
        }}
        className="update-img-scales"
      >
        updateScales
      </Button>
      <div className="image-scales" />
      <Image.Preview visible={visible} {...props} scales={scales} />
    </>
  );
};

const openPreview = (wrapper) => {
  fireEvent.click(wrapper.find('.open-img-btn')[0]);
};

const updateScales = (wrapper, value) => {
  const numberContainer = document.querySelector('.image-scales');
  if (numberContainer) {
    numberContainer.innerHTML = value.join(',');
    fireEvent.click(wrapper.querySelector('.update-img-scales'));
  }
};

describe('Image', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(async () => {
    vi.useFakeTimers();
    vi.useRealTimers();
  });

  const updateImg = (wrapper, method = 'load', params = {}) => {
    if (wrapper.find('img')[0] && fireEvent[method]) {
      fireEvent[method](wrapper.find('img')[0], params);
      vi.isFakeTimers() && vi.runAllTimers();
      act(() => {});
    }
  };

  const handleAction = (wrapper, index) => {
    const curElem = wrapper.find('.suzume-image-preview-toolbar-action')[index];
    if (curElem) {
      fireEvent.click(curElem);
      vi.isFakeTimers() && vi.runAllTimers();
    }
  };

  it('render with defaultVisible and visible', () => {
    const wrapper = render(<DemoImage src={imgSrc} defaultVisible />);

    expect(wrapper.find('img')).toHaveLength(0);

    act(() => {
      openPreview(wrapper);
      vi.isFakeTimers() && vi.runAllTimers();
    });

    expect(wrapper.find('img')).toHaveLength(1);
  });

  it('handle scale event correctly', () => {
    const beforeScale = 'scale(1, 1)';
    const afterScale = 'scale(0.9, 0.9)';
    const wrapper = render(<Image.Preview src={imgSrc} visible />);
    vi.isFakeTimers() && vi.runAllTimers();
    expect(wrapper.find('.suzume-image-preview-img-container')[0].style.transform).toEqual(
      beforeScale
    );
    act(() => {
      updateImg(wrapper);
    });
    act(() => {
      handleAction(wrapper, 4);
    });

    expect(wrapper.find('.suzume-image-preview-img-container')[0].style.transform).toEqual(
      afterScale
    );

    act(() => {
      updateImg(wrapper);
    });
    act(() => {
      handleAction(wrapper, 5);
    });

    expect(wrapper.find('.suzume-image-preview-img-container')[0].style.transform).toEqual(
      beforeScale
    );
  });

  it('handle rotate event correctly', async () => {
    const wrapper = render(<Image.Preview src={imgSrc} visible />);
    vi.isFakeTimers() && vi.runAllTimers();
    expect(wrapper.find('.suzume-image-preview-img')[0].style.transform).toEqual(
      'translate(0px, 0px) rotate(0deg)'
    );

    act(() => {
      updateImg(wrapper);
    });
    act(() => {
      handleAction(wrapper, 1);
    });

    expect(wrapper.find('.suzume-image-preview-img')[0].style.transform).toEqual(
      'translate(0px, 0px) rotate(90deg)'
    );

    act(() => {
      updateImg(wrapper);
    });
    act(() => {
      handleAction(wrapper, 2);
    });

    expect(wrapper.find('.suzume-image-preview-img')[0].style.transform).toEqual(
      'translate(0px, 0px) rotate(0deg)'
    );
  });

  it('should remove listener when unmount', () => {
    const wrapper = render(<DemoImage src={imgSrc} />);
    const add = vi.spyOn(document, 'addEventListener');
    const remove = vi.spyOn(document, 'removeEventListener');

    // visible true;
    act(() => {
      openPreview(wrapper);
      vi.isFakeTimers() && vi.runAllTimers();
    });

    // `resize-observer-polyfill` registers one document-level `transitionend`
    // listener of its own the first time it observes. That is the polyfill's
    // plumbing rather than something Image owns, so it is not counted here.
    const imageDocumentAdds = (spy: { mock: { calls: unknown[][] } }) =>
      spy.mock.calls.filter((call) => call[0] !== 'transitionend');

    expect(imageDocumentAdds(add)).toHaveLength(1);
    // moving true
    act(() => {
      updateImg(wrapper, 'mouseDown');
    });
    expect(imageDocumentAdds(add)).toHaveLength(3);
    wrapper.unmount();

    // TODO: 实际remove listener上被调了6次
    // expect(remove.mock.calls).toHaveLength(2);
    expect(remove).toHaveBeenCalled();
  });

  it('handle fullScreen event correctly', async () => {
    const width = 400;
    const height = 200;

    const wrapper = render(
      <div style={{ width, height, position: 'relative' }} id="image_wrapper">
        <Image.Preview
          src={imgSrc}
          visible
          getPopupContainer={() => document.getElementById('image_wrapper') as HTMLElement}
        />
      </div>
    );
    vi.isFakeTimers() && vi.runAllTimers();

    // jsdom performs no layout, so both rects are 0x0 and `onFullScreen` would
    // derive `Math.max(NaN, NaN)` - an invalid `scale()` the style setter then
    // drops. Give the preview wrapper and the image the boxes a real browser
    // would give them so the scale it computes is a real number.
    const previewWrapper = wrapper.find('.suzume-image-preview-wrapper')[0];
    const previewImg = wrapper.find('img')[0];
    vi.spyOn(previewWrapper, 'getBoundingClientRect').mockReturnValue({
      width,
      height,
      top: 0,
      left: 0,
      right: width,
      bottom: height,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);
    vi.spyOn(previewImg, 'getBoundingClientRect').mockReturnValue({
      width: 640,
      height: 360,
      top: 0,
      left: 0,
      right: 640,
      bottom: 360,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    act(() => {
      updateImg(wrapper);
    });
    act(() => {
      handleAction(wrapper, 0);
    });

    // 只能判断全屏按钮后scale与原值不同。
    expect(wrapper.find('.suzume-image-preview-img-container')[0].style.transform).not.toEqual(
      `scale(1, 1)`
    );
  });

  it('handle close event correctly', () => {
    const mockVisibleChange = vi.fn();
    const wrapper = render(
      <Image.Preview src={imgSrc} onVisibleChange={mockVisibleChange} defaultVisible />
    );
    vi.isFakeTimers() && vi.runAllTimers();
    expect(wrapper.find('img')).toHaveLength(1);
    act(() => {
      fireEvent.click(wrapper.find('.suzume-image-preview-close-btn')[0]);
    });
    expect(mockVisibleChange.mock.calls[0]).toEqual([false, true]);
  });

  it('should not trigger parent click event when click close button', () => {
    const mockParentClick = vi.fn();
    const mockVisibleChange = vi.fn();
    const wrapper = render(
      <div onClick={mockParentClick}>
        <Image.Preview src={imgSrc} onVisibleChange={mockVisibleChange} defaultVisible />
      </div>
    );

    vi.isFakeTimers() && vi.runAllTimers();

    act(() => {
      fireEvent.click(wrapper.find('.suzume-image-preview-close-btn')[0]);
    });

    expect(mockVisibleChange.mock.calls[0]).toEqual([false, true]);
    expect(mockParentClick).toHaveBeenCalledTimes(0);
  });

  it('handle maskClosable prop correctly', () => {
    const mockVisibleChange = vi.fn();
    const wrapper = render(
      <Image.Preview
        src={imgSrc}
        onVisibleChange={mockVisibleChange}
        defaultVisible
        maskClosable={false}
      />
    );
    vi.isFakeTimers() && vi.runAllTimers();
    expect(wrapper.find('img')).toHaveLength(1);

    act(() => {
      fireEvent.click(wrapper.find('.suzume-image-preview-wrapper')[0]);
    });

    expect(mockVisibleChange).toHaveBeenCalledTimes(0);
    expect(wrapper.find('img')).toHaveLength(1);
  });

  it('handle error src prop correctly', () => {
    const wrapper = render(<Image.Preview src="error" defaultVisible />);
    vi.isFakeTimers() && vi.runAllTimers();
    expect(wrapper.find('.suzume-icon-loading')).toHaveLength(1);
    act(() => {
      updateImg(wrapper, 'error');
    });
    expect(wrapper.find('.suzume-image-preview-toolbar')).toHaveLength(0);

    act(() => {
      wrapper.find('img')[0].setAttribute('src', imgSrc);
      vi.isFakeTimers() && vi.runAllTimers();
      updateImg(wrapper);
    });
    expect(wrapper.find('.suzume-image-preview-toolbar')).toHaveLength(1);
  });

  it('Mouse Event mouse start and mouse end', () => {
    const wrapper = render(<Image.Preview src={imgSrc} defaultVisible />);
    vi.isFakeTimers() && vi.runAllTimers();
    act(() => {
      updateImg(wrapper, 'mouseDown', {
        pageX: 100,
        pageY: 100,
      });
      vi.isFakeTimers() && vi.runAllTimers();
    });

    expect(wrapper.find('.suzume-image-preview-img-moving')[0]).toBeTruthy();

    act(() => {
      document.dispatchEvent(new Event('mouseup'));
      vi.isFakeTimers() && vi.runAllTimers();
    });

    expect(wrapper.find('.suzume-image-preview-img-moving')[0]).toBeUndefined();
  });

  it('handle zoom event correctly when set custom scales', () => {
    const customsScale = [-90, 20, 120];

    const wrapper = render(<DemoImage src={imgSrc} visible scales={customsScale} />);
    vi.isFakeTimers() && vi.runAllTimers();
    expect(wrapper.find('.suzume-image-preview-img-container')[0].style.transform).toEqual(
      `scale(1, 1)`
    );

    // 放大
    act(() => {
      updateImg(wrapper);
    });
    act(() => {
      handleAction(wrapper, 3);
    });

    expect(wrapper.find('.suzume-image-preview-img-container')[0].style.transform).toEqual(
      `scale(1.2, 1.2)`
    );

    // 1:1
    act(() => {
      updateImg(wrapper);
    });
    act(() => {
      handleAction(wrapper, 5);
    });

    expect(wrapper.find('.suzume-image-preview-img-container')[0].style.transform).toEqual(
      `scale(1, 1)`
    );

    // 缩小两次
    act(() => {
      updateImg(wrapper);
    });
    act(() => {
      handleAction(wrapper, 4);
    });

    act(() => {
      updateImg(wrapper);
    });
    act(() => {
      handleAction(wrapper, 4);
    });

    expect(wrapper.find('.suzume-image-preview-img-container')[0].style.transform).toEqual(
      `scale(0.2, 0.2)`
    );

    act(() => {
      updateScales(wrapper, [50, 100]);
      vi.isFakeTimers() && vi.runAllTimers();
      updateImg(wrapper);
    });

    expect(wrapper.find('.suzume-image-preview-img-container')[0].style.transform).toEqual(
      `scale(1, 1)`
    );
  });

  it('support imgAttribute correctly', () => {
    const onLoad = vi.fn();
    const wrapper = render(
      <DemoImage
        src={imgSrc}
        imgAttributes={{ className: 'img-elem', onLoad, style: { background: 'red' } }}
      />
    );

    expect(wrapper.find('img')).toHaveLength(0);

    act(() => {
      openPreview(wrapper);
      vi.isFakeTimers() && vi.runAllTimers();
    });

    expect(wrapper.find('img')[0].classList).toContain('img-elem');
    expect(wrapper.find('img')[0].style.background).toEqual('red');
    act(() => {
      updateImg(wrapper);
    });
    expect(onLoad).toHaveBeenCalledTimes(1);
  });
    vi.useRealTimers();
});
