import React, { createContext } from 'react';
import Notification from '..';
import { ConfigProvider } from '../..';
import { $, act, render } from '../../../tests/util';

describe('useNotification Test', () => {
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

  it('useNotification', async () => {
    const [notification, contextHolder] = Notification.useNotification({});

    const ConfigContext = createContext({});

    const wrapper = render(
      <div>
        <ConfigProvider prefixCls="demo" rtl effectGlobalNotice={false}>
          <ConfigContext.Provider value="PJY">{contextHolder}</ConfigContext.Provider>
        </ConfigProvider>
      </div>
    );

    // prefixCls: demo
    notification.info?.({
      content: <ConfigContext.Consumer>{(name) => name}</ConfigContext.Consumer>,
    });
    expect(wrapper.find('.demo-notification')[0].classList).toContain('demo-notification-rtl');
    expect(wrapper.find('.demo-notification-content')[0].innerHTML).toBe('PJY');

    // prefixCls: suzume
    Notification.info?.({
      content: 'YYH',
      duration: 0,
    });
    expect($('.suzume-notification')).toHaveLength(1);
    expect($('.suzume-notification-content')[0].innerHTML).toBe('YYH');
  });

  it('notification update', async () => {
    const [notification, contextHolder] = Notification.useNotification({ maxCount: 2 });
    const wrapper = render(
      <div>
        <ConfigProvider>{contextHolder}</ConfigProvider>
      </div>
    );

    notification.info?.({
      id: 'demo',
      content: 'PJY',
    });
    expect(wrapper.find('.suzume-notification-content')[0].innerHTML).toBe('PJY');
    notification.info?.({
      id: 'demo',
      content: 'YYH',
    });
    expect(wrapper.find('.suzume-notification-content')[0].innerHTML).toBe('YYH');
  });

  it('useNotification getcontainer', async () => {
    const [notification, contextHolder] = Notification.useNotification({
      getContainer: () => document.getElementById('root') as HTMLElement,
    });

    const wrapper = render(
      <div>
        {contextHolder}
        <div id="root" />
      </div>
    );

    notification.info?.({
      content: 'hahahah',
    });
    expect(wrapper.find('#root .suzume-notification')).toHaveLength(1);
  });
    vi.useRealTimers();
});
