import React from 'react';
import { $, act, render, sleep } from '../../../tests/util';
import Notification from '..';
import Notice from '../../_class/notice';
import { IconMessage } from '../../../icon';

it('render correctly', () => {
  const notification = render(
    <div>
      <Notice type="info" content="Info Content" prefixCls="suzume-notification" />
      <Notice type="success" content="Success Content" prefixCls="suzume-notification" />
      <Notice type="warning" content="Warning Content" prefixCls="suzume-notification" />
      <Notice type="error" content="Error Content" prefixCls="suzume-notification" />
      <Notice type="Normal" content="Normal Content" prefixCls="suzume-notification" />
      <Notice
        type="Normal"
        content="Normal Content"
        icon={<IconMessage />}
        prefixCls="suzume-notification"
      />
    </div>
  );
  expect(notification.container.firstChild).toMatchSnapshot();
});

describe('open message', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(async () => {
    vi.useFakeTimers();
    Notification.clear();
    vi.isFakeTimers() && vi.runAllTimers();
    // React 18+ schedules the notice exit transition; flush it so the
    // DOM is clean before the next test starts.
    await act(async () => {});
  });

  it('Open message number and icon type, title, content correct', () => {
    Notification.info({
      title: 'Title',
      content: 'Content',
    });
    expect($('.suzume-notification').length).toBe(1);
    expect(
      $('.suzume-notification .suzume-notification-icon .suzume-icon-info-circle-fill').length
    ).toBe(1);
    expect($('.suzume-notification .suzume-notification-title')[0].innerHTML).toBe('Title');
    expect($('.suzume-notification .suzume-notification-content')[0].innerHTML).toBe('Content');
    vi.isFakeTimers() && vi.runAllTimers();
    Notification.info({
      content: 'Content',
      showIcon: false,
    });
    expect($('.suzume-notification').length).toBe(1);
    expect(
      $('.suzume-notification .suzume-notification-icon .suzume-icon-info-circle-fill').length
    ).toBe(0);
  });

  it('Muti instances number correct', () => {
    const number = 5;
    for (let i = 0; i < number; i++) {
      Notification.info({
        content: 'Content',
      });
    }
    expect($('.suzume-notification').length).toBe(number);
  });

  it('Different position correct', () => {
    (['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const).forEach((position) => {
      Notification.info({
        content: 'Content',
        position,
      });
      expect($(`.suzume-notification-wrapper-${position} .suzume-notification`).length).toBe(1);
    });
  });

  it('update old notification', () => {
    Notification.info({
      content: 'Old Content',
      id: 'update',
    });
    Notification.info({
      content: 'New Content',
      id: 'update',
    });
    expect($('.suzume-notification .suzume-notification-content')[0].innerHTML).toBe('New Content');
  });

  // it('close notification manually', () => {
  //   Notification.info({
  //     content: 'Content',
  //   });
  //   expect($('.suzume-notification').length).toBe(1);
  //   $('.suzume-notification .close')[0].simulate('click');
  //   vi.isFakeTimers() && vi.runAllTimers();
  //   expect($('.suzume-notification').length).toBe(0);
  // });

  it('notice icon prefix', () => {
    Notification.config({
      prefixCls: 'aaa',
    });
    Notification.success({
      content: 'New Content',
    });

    expect($('.aaa-notification')).toHaveLength(1);

    expect($('.aaa-icon-check-circle-fill')).toHaveLength(1);

    Notification.config({
      prefixCls: 'suzume',
    });
  });

  it('closable=false', () => {
    Notification.info({
      content: 'closable=false',
      id: 'update',
      closable: false,
      closeIcon: 'xxx',
    });
    expect($('.suzume-notification-close-btn').length).toBe(0);
  });

  it('closeicon=xxx', () => {
    Notification.info({
      content: 'closeicon=xxx',
      id: 'update',
      closable: true,
      closeIcon: 'xxx',
    });

    expect($('.suzume-notification-close-btn').length).toBe(1);
    expect($('.suzume-notification-close-btn').item(0).textContent).toBe('xxx');
  });

  it('update when maxCount', async () => {
    vi.useRealTimers();

    Notification.config({ maxCount: 2, duration: 0 });

    Notification.info({ content: 'content1' });

    Notification.info({ id: 'update', content: 'content update 1' });

    Notification.info({ id: 'update', content: 'content update 2' });

    expect($('.suzume-notification').length).toBe(2);
    expect($('.suzume-notification .suzume-notification-content')[0].innerHTML).toBe('content1');
    expect($('.suzume-notification .suzume-notification-content')[1].innerHTML).toBe(
      'content update 2'
    );

    Notification.info({ content: 'content 2' });

    await sleep(1000);

    expect($('.suzume-notification').length).toBe(2);
    expect($('.suzume-notification .suzume-notification-content')[0].innerHTML).toBe(
      'content update 2'
    );
    expect($('.suzume-notification .suzume-notification-content')[1].innerHTML).toBe('content 2');

    Notification.info({ id: 'update', content: 'content update 3' });

    expect($('.suzume-notification').length).toBe(2);
    expect($('.suzume-notification .suzume-notification-content')[0].innerHTML).toBe(
      'content update 3'
    );
    expect($('.suzume-notification .suzume-notification-content')[1].innerHTML).toBe('content 2');
  });
    vi.useRealTimers();
});
