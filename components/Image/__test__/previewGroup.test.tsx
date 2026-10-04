import React from 'react';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/dom';
import Image from '..';
import { render } from '../../../tests/util';
// import Space from '../../Space';

const srcList = [
  'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27640%27%20height%3D%27360%27%3E%3Crect%20width%3D%27640%27%20height%3D%27360%27%20fill%3D%27%2386909C%27%2F%3E%3Crect%20width%3D%27640%27%20height%3D%27140%27%20y%3D%27220%27%20fill%3D%27%2300000022%27%2F%3E%3C%2Fsvg%3E',
  'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27640%27%20height%3D%27360%27%3E%3Crect%20width%3D%27640%27%20height%3D%27360%27%20fill%3D%27%2314C9C9%27%2F%3E%3Crect%20width%3D%27640%27%20height%3D%27140%27%20y%3D%27220%27%20fill%3D%27%2300000022%27%2F%3E%3C%2Fsvg%3E',
  'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27640%27%20height%3D%27360%27%3E%3Crect%20width%3D%27640%27%20height%3D%27360%27%20fill%3D%27%2300B42A%27%2F%3E%3Crect%20width%3D%27640%27%20height%3D%27140%27%20y%3D%27220%27%20fill%3D%27%2300000022%27%2F%3E%3C%2Fsvg%3E',
  'data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27640%27%20height%3D%27360%27%3E%3Crect%20width%3D%27640%27%20height%3D%27360%27%20fill%3D%27%23F5319D%27%2F%3E%3Crect%20width%3D%27640%27%20height%3D%27140%27%20y%3D%27220%27%20fill%3D%27%2300000022%27%2F%3E%3C%2Fsvg%3E',
];

describe('mount and unmount', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(async () => {
    vi.useFakeTimers();
    vi.useRealTimers();
  });

  const updateImg = (wrapper, method = 'load', index = 0) => {
    const imgElem = wrapper.find('img')[index];
    if (imgElem) {
      fireEvent[method](imgElem);
      vi.isFakeTimers() && vi.runAllTimers();
    act(() => {});
    }
  };

  it('render basic group correctly', () => {
    const wrapper = render(
      <Image.PreviewGroup>
        <Image src={srcList[0]} />
        <Image src={srcList[1]} />
      </Image.PreviewGroup>
    );

    act(() => {
      updateImg(wrapper, 'click');
      updateImg(wrapper);
    });

    expect(wrapper.find('.suzume-image-preview')[0]).toBeTruthy();

    expect(() => {
      wrapper.unmount();
    }).not.toThrow();
  });

  it('handle arrow click correctly', () => {
    const mockChange = vi.fn();

    const wrapper = render(
      <Image.PreviewGroup defaultVisible srcList={srcList} onChange={mockChange} />
    );
    vi.isFakeTimers() && vi.runAllTimers();

    const disabledArrowClass = 'suzume-image-preview-arrow-disabled';

    expect(
      wrapper.find('.suzume-image-preview-arrow-left')[0].classList.contains(disabledArrowClass)
    ).toBeTruthy();

    act(() => {
      fireEvent.click(wrapper.find('.suzume-image-preview-arrow-right')[0]);
    });
    expect(
      wrapper.find('.suzume-image-preview-arrow-left')[0].classList.contains(disabledArrowClass)
    ).toBeFalsy();

    expect(mockChange.mock.calls).toHaveLength(1);
    expect(mockChange.mock.calls[0]).toEqual([1]);
  });

  it('should trigger change event correctly', () => {
    const mockChange = vi.fn();

    const wrapper = render(
      <Image.PreviewGroup onChange={mockChange}>
        {srcList.map((src, index) => (
          <Image key={index} src={src} />
        ))}
      </Image.PreviewGroup>
    );

    act(() => {
      fireEvent.click(wrapper.find('.suzume-image-img')[1]);
      vi.isFakeTimers() && vi.runAllTimers();
    });

    act(() => {
      fireEvent.click(wrapper.find('.suzume-image-preview-arrow-right')[0]);
      vi.isFakeTimers() && vi.runAllTimers();
    });

    act(() => {
      fireEvent.click(wrapper.find('.suzume-image-preview-arrow-left')[0]);
      vi.isFakeTimers() && vi.runAllTimers();
    });

    expect(mockChange.mock.calls).toHaveLength(3);
    expect(mockChange.mock.calls[0]).toEqual([1]);
    expect(mockChange.mock.calls[1]).toEqual([2]);
    expect(mockChange.mock.calls[2]).toEqual([1]);
  });

  it('handle group onVisibleChange correctly', () => {
    const mockOnVisibleChange = vi.fn();
    const wrapper = render(
      <Image.PreviewGroup defaultVisible srcList={srcList} onVisibleChange={mockOnVisibleChange} />
    );

    vi.isFakeTimers() && vi.runAllTimers();

    act(() => {
      fireEvent.click(wrapper.find('.suzume-image-preview-close-btn')[0]);
    });
    expect(mockOnVisibleChange.mock.calls[0]).toEqual([false, true]);
    expect(wrapper.find('img')).toHaveLength(0);
  });

  it('with index controlled', () => {
    const wrapper = render(<Image.PreviewGroup defaultVisible srcList={srcList} />);
    vi.isFakeTimers() && vi.runAllTimers();
    expect(wrapper.find('img')[0].getAttribute('src')).toEqual(srcList[0]);
    wrapper.unmount();

    const wrapper1 = render(<Image.PreviewGroup defaultVisible srcList={srcList} current={2} />);
    vi.isFakeTimers() && vi.runAllTimers();
    expect(wrapper1.find('img')[0].getAttribute('src')).toEqual(srcList[2]);
  });

  it('transparent transmission of previewProps', () => {
    const mockLoad = vi.fn();
    const mockError = vi.fn();
    const wrapper = render(
      <Image.PreviewGroup>
        <Image
          src={srcList[0]}
          previewProps={{ className: 'preview-0', imgAttributes: { onLoad: mockLoad } }}
        />
        <Image
          src="error-url"
          previewProps={{ className: 'preview-1', imgAttributes: { onError: mockError } }}
        />
      </Image.PreviewGroup>
    );

    // 检查是否透传至第一个Preview。
    act(() => {
      updateImg(wrapper, 'click');
    });
    expect(wrapper.find('.suzume-image-preview')[0].classList).toContain('preview-0');

    act(() => {
      fireEvent.load(wrapper.find('.suzume-image-preview img')[0]);
      vi.isFakeTimers() && vi.runAllTimers();
    });
    expect(mockLoad).toBeCalledTimes(1);

    act(() => {
      fireEvent.click(wrapper.find('.suzume-image-preview-close-btn')[0]);
      vi.isFakeTimers() && vi.runAllTimers();
    });

    // 检查是否透传至第二个Preview。
    act(() => {
      updateImg(wrapper, 'click', 1);
    });
    expect(wrapper.find('.suzume-image-preview')[0].classList).toContain('preview-1');
    act(() => {
      fireEvent.error(wrapper.find('.suzume-image-preview img')[0]);
      vi.isFakeTimers() && vi.runAllTimers();
    });
    expect(mockError).toBeCalledTimes(1);
  });
    vi.useRealTimers();
});
