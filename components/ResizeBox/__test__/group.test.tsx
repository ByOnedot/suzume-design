import React, { ReactNode } from 'react';
import { act } from 'react-dom/test-utils';
import ResizeBox from '..';
import Typography from '../../Typography';
import { IconPlus } from '../../../icon';
import Button from '../../Button';
import { fireEvent, render } from '../../../tests/util';

const wrapperRef = {
  offsetWidth: 800,
  offsetHeight: 600,
};

const triggerContentRect = {
  width: 6,
  height: 8,
};

const triggerPrefixCls = 'suzume-resizebox-trigger';

const groupPrefixCls = 'suzume-resizebox-split-group';

vi.mock('resize-observer-polyfill', () => ({
  __esModule: true,
  default: vi.fn(function (cb) {
    try {
      typeof cb === 'function' && cb([{ contentRect: triggerContentRect }]);
    } catch {}

    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };
  }),
}));

beforeEach(() => {
  vi.useFakeTimers();
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { value: wrapperRef.offsetWidth });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    value: wrapperRef.offsetHeight,
  });
});

afterEach(async () => {
    vi.useFakeTimers();
  vi.isFakeTimers() && vi.runAllTimers();
    // React 18+ schedules the notice exit transition; flush it so the
    // DOM is clean before the next test starts.
    await act(async () => {});
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    value: HTMLElement.prototype.offsetWidth,
  });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    value: HTMLElement.prototype.offsetHeight,
  });
    vi.useRealTimers();
});

describe('ResizeBox Split Group', () => {
  it('render one panes correctly', () => {
    const wrapper = render(
      <ResizeBox.SplitGroup
        panes={[
          {
            content: <Typography.Text>text1</Typography.Text>,
          },
        ]}
      />
    );
    expect(wrapper.find('.suzume-typography')).toHaveLength(1);
    const pane = wrapper.find(`.${groupPrefixCls}-pane`)[0];
    expect(pane.style.flexBasis).toEqual(`calc(100% - 0px)`);
  });

  it('render direction vertical correctly', () => {
    const panes = [{ size: 0.2 }, {}];
    const wrapper = render(
      <ResizeBox.SplitGroup
        direction="vertical"
        panes={panes.map((obj) => {
          return {
            content: <Typography.Text>text </Typography.Text>,
            ...obj,
          };
        })}
      />
    );

    vi.isFakeTimers() && vi.runAllTimers();

    expect(wrapper.find('.suzume-typography')).toHaveLength(2);
    expect(wrapper.find(`.${triggerPrefixCls}`)).toHaveLength(1);
    const pane1 = wrapper.find(`.${groupPrefixCls}-pane`)[0];
    const pane2 = wrapper.find(`.${groupPrefixCls}-pane`)[1];
    expect(pane1.style.flexBasis).toEqual(`calc(20% - ${triggerContentRect.height / 2}px)`);
    expect(pane2.style.flexBasis).toEqual(`calc(80% - ${triggerContentRect.height / 2}px)`);
  });

  it('handle collapsed correctly', () => {
    const panes = new Array(4).fill('');
    const prevFn = vi.fn();
    const nextFn = vi.fn();
    const mockMoving = vi.fn();
    const wrapper = render(
      <ResizeBox.SplitGroup
        panes={panes.map((_, index) => {
          return {
            content: <Typography.Text>text {index}</Typography.Text>,
            collapsible: {
              prev: {
                onClick: prevFn,
              },
              next: {
                onClick: nextFn,
              },
            },
          };
        })}
        onMoving={mockMoving}
      />
    );

    const basicOffset = wrapperRef.offsetWidth / panes.length;

    expect(wrapper.find('.suzume-typography')).toHaveLength(panes.length);
    const firstTrigger = wrapper.find(`.${triggerPrefixCls}`)[0];
    act(() => {
      fireEvent.click(firstTrigger.querySelector(`.${triggerPrefixCls}-next`) as Element);
    });

    const params = nextFn.mock.calls[0];
    expect(params.slice(1)).toEqual([0, 'next', true]);

    const movingParams = mockMoving.mock.calls[0];
    expect(movingParams[1]).toEqual([
      `${basicOffset * 2}px`,
      '0px',
      `${basicOffset}px`,
      `${basicOffset}px`,
    ]);
    expect(movingParams[2]).toEqual(0);
    expect(firstTrigger.querySelectorAll(`.${triggerPrefixCls}-icon-empty`)).toHaveLength(1);
  });

  it('set pane min correctly when collapsiable', () => {
    const min = 0.1;
    const panes = [{ collapsible: true }, { min, collapsible: true }, {}, {}];
    const mockMoving = vi.fn();
    const wrapper = render(
      <ResizeBox.SplitGroup
        direction="vertical"
        panes={panes.map((obj) => {
          return {
            content: <Typography.Text>text </Typography.Text>,
            ...obj,
          };
        })}
        onMoving={mockMoving}
      />
    );

    const basicOffset = wrapperRef.offsetHeight / panes.length;
    const minOffset = wrapperRef.offsetHeight * min;

    const trigger1 = wrapper.find(`.${triggerPrefixCls}`)[1];
    act(() => {
      fireEvent.click(trigger1.querySelector(`.${triggerPrefixCls}-prev`) as Element);
    });

    expect(mockMoving).toHaveBeenCalledTimes(1);
    const movingParams = mockMoving.mock.calls[0];

    expect(movingParams[1]).toEqual([
      `${basicOffset}px`,
      `${minOffset}px`,
      `${basicOffset * 2 - minOffset}px`,
      `${basicOffset}px`,
    ]);
    expect(movingParams[2]).toEqual(1);
  });

  it('set size correctly', () => {
    const panes = [{ size: 0.1 }, { size: '80px' }, { size: 0.2 }, {}, {}];
    const wrapper = render(
      <ResizeBox.SplitGroup
        panes={panes.map((obj) => {
          return {
            content: <Typography.Text>text </Typography.Text>,
            ...obj,
          };
        })}
      />
    );

    vi.isFakeTimers() && vi.runAllTimers();

    const panesEl = wrapper.find(`.${groupPrefixCls}-pane`);
    const offsetWidth = wrapperRef.offsetWidth;
    const triggerWidth = triggerContentRect.width;

    const averageWidth = (offsetWidth - offsetWidth * 0.3 - 80) / 2;

    expect(panesEl[0].style.flexBasis).toEqual(`calc(10% - ${triggerWidth / 2}px)`);

    expect(panesEl[1].style.flexBasis).toEqual(`calc(10% - ${triggerWidth}px)`);

    expect(panesEl[2].style.flexBasis).toEqual(`calc(20% - ${triggerWidth}px)`);

    expect(panesEl[3].style.flexBasis).toEqual(
      `calc(${(averageWidth / offsetWidth) * 100}% - ${triggerWidth}px)`
    );

    expect(panesEl[4].style.flexBasis).toEqual(
      `calc(${(averageWidth / offsetWidth) * 100}% - ${triggerWidth / 2}px)`
    );
  });

  it('render customer icon and trigger correctly', () => {
    const panes = [
      {
        collapsible: {
          prev: {
            icon: (<IconPlus />) as ReactNode,
          },
        },
        trigger: (prev: ReactNode, resize: ReactNode, next: ReactNode): ReactNode => (
          <Button>
            {prev}
            {resize}
            {next}
          </Button>
        ),
      },
      {},
    ];

    const wrapper = render(
      <ResizeBox.SplitGroup
        panes={panes.map((obj) => {
          return {
            content: <Typography.Text>text </Typography.Text>,
            ...obj,
          };
        })}
      />
    );

    expect(wrapper.find('.suzume-btn')).toHaveLength(1);
    expect(wrapper.find('.suzume-btn .suzume-icon-plus')).toHaveLength(1);
  });
});
