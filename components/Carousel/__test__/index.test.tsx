import React from 'react';
import mountTest from '../../../tests/mountTest';
import componentConfigTest from '../../../tests/componentConfigTest';
import Carousel from '..';
import { CarouselHandle } from '../interface';
import { sleep, render, fireEvent, act } from '../../../tests/util';

vi.mock('resize-observer-polyfill', () => ({
  __esModule: true,
  default: vi.fn(function (cb) {
    // 直接触发，不用onResize
    cb();

    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };
  }),
}));

mountTest(Carousel);
componentConfigTest(Carousel, 'Carousel');

const prefixCls = '.suzume-carousel';

const wrapperStyle: React.CSSProperties = {
  width: '600px',
  height: '300px',
};

const itemStyle1: React.CSSProperties = {
  backgroundColor: '#3370FF',
  color: '#ffffff',
  textAlign: 'center',
  width: '100%',
  height: '100%',
  fontSize: '25px',
  padding: '100px',
};

const itemStyle2: React.CSSProperties = {
  backgroundColor: '#ADCEFF',
  color: '#ffffff',
  textAlign: 'center',
  width: '100%',
  height: '100%',
  fontSize: '25px',
  padding: '100px',
};

const checkActiveIndex = (wrapper, index) => {
  const indicatorClassName = 'suzume-carousel-indicator-item';
  vi.advanceTimersByTime(50);
  expect(wrapper.find(`.${indicatorClassName}`)[index]).toHaveClass(`${indicatorClassName}-active`);
};

describe('Carousel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render only child correctly', () => {
    const wrapper = render(
      <Carousel style={wrapperStyle}>
        <div style={itemStyle1} />
      </Carousel>
    );
    expect(wrapper.find(`${prefixCls}-slide`)).toHaveLength(1);
  });

  it('should init currentIndex correctly', () => {
    const currentIndex = 3;
    const wrapper = render(
      <Carousel style={wrapperStyle} currentIndex={currentIndex}>
        <div style={itemStyle1} />
        <div style={itemStyle2} />
        <div style={itemStyle1} />
        <div style={itemStyle2} />
      </Carousel>
    );
    checkActiveIndex(wrapper, 3);
  });

  it('should autoPlay correctly', () => {
    const wrapper = render(
      <Carousel style={wrapperStyle} autoPlay>
        <div style={itemStyle1} />
        <div style={itemStyle2} />
        <div style={itemStyle1} />
        <div style={itemStyle2} />
      </Carousel>
    );
    vi.advanceTimersByTime(3000);
    checkActiveIndex(wrapper, 1);
  });

  it('miniRender works correctly', () => {
    const wrapper = render(
      <Carousel style={wrapperStyle} miniRender>
        <div style={itemStyle1} />
        <div style={itemStyle2} />
        <div style={itemStyle1} />
        <div style={itemStyle2} />
        <div style={itemStyle1} />
      </Carousel>
    );
    expect(wrapper.find('.suzume-carousel-slide > div')).toHaveLength(3);
  });

  it('should move correctly', () => {
    const wrapper = render(
      <Carousel style={wrapperStyle}>
        <div style={itemStyle1} />
        <div style={itemStyle2} />
        <div style={itemStyle1} />
      </Carousel>
    );

    fireEvent.click(wrapper.querySelector('.suzume-carousel-arrow-right'));
    checkActiveIndex(wrapper, 1);

    // 等待向右的动画结束，否则下次点击会被忽略
    vi.advanceTimersByTime(1000);

    fireEvent.click(wrapper.querySelector('.suzume-carousel-arrow-left'));
    checkActiveIndex(wrapper, 0);
  });

  it('should selectIndex correctly', () => {
    const wrapper = render(
      <Carousel style={wrapperStyle}>
        <div style={itemStyle1} />
        <div style={itemStyle2} />
        <div style={itemStyle1} />
      </Carousel>
    );
    fireEvent.click(wrapper.find('.suzume-carousel-indicator-item').item(2));
    checkActiveIndex(wrapper, 2);
  });

  it('should addInterval, clearInterval correctly', () => {
    const wrapper = render(
      <Carousel style={wrapperStyle} autoPlay>
        <div style={itemStyle1} />
        <div style={itemStyle2} />
        <div style={itemStyle1} />
        <div style={itemStyle2} />
      </Carousel>
    );

    fireEvent.mouseEnter(document.querySelector('.suzume-carousel'));
    vi.advanceTimersByTime(4000);
    checkActiveIndex(wrapper, 0);

    fireEvent.mouseLeave(document.querySelector('.suzume-carousel'));
    vi.advanceTimersByTime(4000);
    checkActiveIndex(wrapper, 1);
  });

  it('should be vertical', () => {
    const wrapper = render(
      <Carousel style={wrapperStyle} direction="vertical" indicatorPosition="right">
        <div style={itemStyle1} />
        <div style={itemStyle2} />
        <div style={itemStyle1} />
      </Carousel>
    );
    expect(wrapper.find(`${prefixCls}-vertical`)).toHaveLength(1);
  });

  it('should be dots', () => {
    const wrapper = render(
      <Carousel
        style={wrapperStyle}
        direction="vertical"
        indicatorType="dot"
        indicatorPosition="right"
        showArrow="hover"
      >
        <div style={itemStyle1} />
        <div style={itemStyle2} />
        <div style={itemStyle1} />
      </Carousel>
    );
    expect(wrapper.find('.suzume-carousel-indicator-dot')).toHaveLength(1);
    expect(wrapper.find('.suzume-carousel-indicator-right')).toHaveLength(1);
    expect(wrapper.find('.suzume-carousel-arrow')[0]).toHaveClass('suzume-carousel-arrow-hover');
  });

  it('animation timingfunc should be correct', () => {
    const wrapper = render(
      <Carousel style={wrapperStyle} moveSpeed={800} timingFunc="ease-out">
        <div style={itemStyle1} />
        <div style={itemStyle2} />
        <div style={itemStyle1} />
      </Carousel>
    );

    const style = wrapper.find(`${prefixCls}-slide > *`)[0].style;
    expect(style.transitionTimingFunction).toEqual('ease-out');
    expect(style.transitionDuration).toEqual('800ms');
  });

  it('support the ref trigger change scene', async () => {
    const carousel = React.createRef<CarouselHandle>();
    const onChange = vi.fn();
    const wrapper = render(
      <Carousel
        style={wrapperStyle}
        autoPlay={{ interval: 1000 }}
        carousel={carousel}
        onChange={onChange}
      >
        <div style={itemStyle1} />
        <div style={itemStyle2} />
        <div style={itemStyle1} />
        <div style={itemStyle2} />
      </Carousel>
    );

    const { dom, goto } = carousel.current;
    expect(dom.className.includes('suzume-carousel ')).toBeTruthy();
    expect(typeof goto).toBe('function');

    // `goto` is an imperative setState from outside React; React 19 defers
    // those until an `act` boundary, so the flush has to be explicit here.
    act(() => {
      goto({ index: 2, resetAutoPlayInterval: true });
    });

    checkActiveIndex(wrapper, 2);
    expect(onChange.mock.calls).toHaveLength(1);
    expect(onChange.mock.calls[0]).toEqual([2, 0, false]);

    // Two steps, not one: `clock.tick` runs every callback before React gets
    // to commit, so the interval would still see `isAnimating: true` from the
    // goto above and drop the slide. Splitting lets React commit the animation
    // end first, exactly as it does in a browser between two timer ticks.
    vi.advanceTimersByTime(500);
    vi.advanceTimersByTime(500);

    expect(onChange.mock.calls[1]).toEqual([3, 2, false]);
    act(() => {
      goto({ index: 1, isManual: true, isNegative: true });
    });
    expect(onChange).toHaveBeenCalledTimes(3);
    checkActiveIndex(wrapper, 1);
  });

  it('support child props scene', () => {
    const handleClick = vi.fn();
    const wrapper = render(
      <Carousel style={wrapperStyle}>
        <li style={itemStyle1} />
        <li style={itemStyle2} className="carousel-child" />
        <li style={itemStyle1} onClick={handleClick} />
        <li style={itemStyle2} />
      </Carousel>
    );

    fireEvent.click(wrapper.find('li')[2]);
    expect(handleClick).toHaveBeenCalled();
    expect(wrapper.find('li')[1]).toHaveClass('carousel-child');
    checkActiveIndex(wrapper, 2);
  });

  it('support card animation scene', async () => {
    const wrapper = render(
      <Carousel style={wrapperStyle} animation="card">
        <div style={{ width: '60%' }}>
          <div style={itemStyle1} />
        </div>
        <div style={{ width: '60%' }}>
          <div style={itemStyle2} />
        </div>
        <div style={{ width: '60%' }}>
          <div style={itemStyle1} />
        </div>
      </Carousel>
    );

    const cardWrapper = wrapper.find(`${prefixCls}-card`);
    expect(cardWrapper).toHaveLength(1);
    expect(cardWrapper.item(0).style.perspective).not.toBeUndefined();
  });

  it('support slider indicatorType correctly', () => {
    const wrapper = render(
      <Carousel style={wrapperStyle} autoPlay indicatorType="slider">
        {new Array(4).fill('1').map((_, i) => (
          <div key={i} style={itemStyle1} />
        ))}
      </Carousel>
    );

    expect(wrapper.find('.suzume-carousel-indicator-slider')).toHaveLength(1);
    vi.advanceTimersByTime(3000);

    const activeIndicator = document.querySelector(
      '.suzume-carousel-indicator-slider .suzume-carousel-indicator-item'
    ) as HTMLElement;
    expect(activeIndicator.style?.width).toEqual('25%');
    expect(activeIndicator.style?.left).toEqual('25%');
  });

  it('customize icon in arrows', () => {
    const wrapper = render(
      <Carousel style={wrapperStyle} icons={{ prev: null, next: '>' }}>
        <li style={itemStyle1} />
        <li style={itemStyle2} />
      </Carousel>
    );

    expect(wrapper.find(`${prefixCls}-arrow-left`)[0]).toHaveTextContent('');
    expect(wrapper.find(`${prefixCls}-arrow-right`)[0]).toHaveTextContent('>');
  });
});
