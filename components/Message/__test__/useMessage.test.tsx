import React, { createContext } from 'react';
import Message from '..';
import { Button, ConfigProvider } from '../..';
import { $, act, fireEvent, render } from '../../../tests/util';

describe('useMessage Test', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(async () => {
    vi.useFakeTimers();
    vi.isFakeTimers() && vi.runAllTimers();
    // React 18+ schedules the notice exit transition; flush it so the
    // DOM is clean before the next test starts.
    await act(async () => {});
  });

  it('useMessage', async () => {
    const ConfigContext = createContext({});
    let messageInstance;

    const TestComponent = () => {
      const [message, contextHolder] = Message.useMessage({});
      messageInstance = message;
      return (
        <div>
          <ConfigProvider prefixCls="demo" rtl effectGlobalNotice={false}>
            <ConfigContext.Provider value="PJY">{contextHolder}</ConfigContext.Provider>
          </ConfigProvider>
        </div>
      );
    };

    const wrapper = render(<TestComponent />);

    // prefixCls: demo
    const m = messageInstance.info?.({
      content: <ConfigContext.Consumer>{(name) => name}</ConfigContext.Consumer>,
    });
    expect(wrapper.find('.demo-message')[0].classList).toContain('demo-message-rtl');
    expect(wrapper.find('.demo-message-content')[0].innerHTML).toBe('PJY');

    // prefixCls: suzume
    const n = Message.info({
      content: 'YYH',
      duration: 0,
    });
    expect($('.suzume-message')).toHaveLength(1);
    expect($('.suzume-message-content')[0].innerHTML).toBe('YYH');

    // close
    m?.();
    n();
    vi.isFakeTimers() && vi.runAllTimers();
    expect(wrapper.find('.demo-message').length).toBe(0);
    expect(wrapper.find('.suzume-message').length).toBe(0);
  });

  it('message update', async () => {
    let messageInstance;

    const TestComponent = () => {
      const [message, contextHolder] = Message.useMessage({ maxCount: 2 });
      messageInstance = message;
      return (
        <div>
          <ConfigProvider>{contextHolder}</ConfigProvider>
        </div>
      );
    };

    const wrapper = render(<TestComponent />);

    messageInstance.info?.({
      id: 'demo',
      content: 'PJY',
    });
    expect(wrapper.find('.suzume-message-content')[0].innerHTML).toBe('PJY');

    const m = messageInstance.info?.({
      id: 'demo',
      content: 'YYH',
    });
    expect(wrapper.find('.suzume-message-content')[0].innerHTML).toBe('YYH');

    m?.();

    vi.isFakeTimers() && vi.runAllTimers();
    expect(wrapper.find('.suzume-message').length).toBe(0);
  });

  it('should maintain instance stability during re-renders', async () => {
    // const { promise, resolve } = promiseWithResolvers();
    const TestComponent = () => {
      const [loading, setLoading] = React.useState(false);
      const [message, contextHolder] = Message.useMessage({});
      return (
        <div>
          <Button
            className="async-button"
            loading={loading}
            onClick={async () => {
              setLoading(true);
              await Promise.resolve(null);
              message?.info?.('success');
              // resolve();
              setLoading(false);
            }}
          >
            Click
          </Button>
          {contextHolder}
        </div>
      );
    };

    const wrapper = render(<TestComponent />);
    expect($('.suzume-message')).toHaveLength(0);
    fireEvent.click(wrapper.querySelector('.async-button')!);
    await Promise.resolve(null);
    expect($('.suzume-message')).toHaveLength(1);
  });
    vi.useRealTimers();
});
