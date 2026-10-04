import React from 'react';
import { $, act, render, sleep } from '../../../tests/util';
import Message from '..';
import Notice from '../../_class/notice';
import { IconMessage } from '../../../icon';

it('render correctly', () => {
  const message = render(
    <div>
      <Notice type="info" content="Info type" prefixCls="suzume-message" />
      <Notice type="success" content="Success type" prefixCls="suzume-message" />
      <Notice type="warning" content="Warning type" prefixCls="suzume-message" />
      <Notice type="error" content="Error type" prefixCls="suzume-message" />
      <Notice type="normal" content="Normal type" prefixCls="suzume-message" />
      <Notice
        type="normal"
        content="Custom icon"
        icon={<IconMessage />}
        prefixCls="suzume-message"
      />
    </div>
  );
  expect(message.container.firstChild).toMatchSnapshot();
});

describe('open message', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(async () => {
    vi.useFakeTimers();
    Message.clear();
    vi.isFakeTimers() && vi.runAllTimers();
    // React 18+ schedules the notice exit transition; flush it so the
    // DOM is clean before the next test starts.
    await act(async () => {});
  });

  it('Open message number and icon type, content correct', () => {
    Message.info({
      content: 'Content',
    });
    expect($('.suzume-message').length).toBe(1);
    expect($('.suzume-message .suzume-message-icon .suzume-icon-info-circle-fill').length).toBe(1);
    expect($('.suzume-message .suzume-message-content')[0].innerHTML).toBe('Content');
    vi.isFakeTimers() && vi.runAllTimers();
    Message.info({
      content: 'Content',
      showIcon: false,
    });
    expect($('.suzume-message').length).toBe(1);
    expect($('.suzume-message .suzume-message-icon .suzume-icon-info-circle-fill').length).toBe(0);
  });

  it('Muti instances number correct', () => {
    const number = 5;
    for (let i = 0; i < number; i++) {
      Message.info({
        content: 'Content',
      });
    }
    expect($('.suzume-message').length).toBe(number);
  });

  it('Different position correct', () => {
    (['top', 'bottom'] as const).forEach((position) => {
      Message.info({
        content: 'Content',
        position,
      });
      expect($(`.suzume-message-wrapper-${position} .suzume-message`).length).toBe(1);
    });
  });

  it('notice icon prefix', () => {
    Message.config({
      prefixCls: 'aaa',
    });
    Message.success({
      content: 'New Content',
    });

    expect($('.aaa-message')).toHaveLength(1);

    expect($('.aaa-icon-check-circle-fill')).toHaveLength(1);

    Message.config({
      prefixCls: 'suzume',
    });
  });

  it('closable=false', () => {
    Message.info({
      content: 'closable=false',
      closable: false,
      closeIcon: 'xxx',
    });
    expect($('.suzume-message-close-btn').length).toBe(0);
  });

  it('closeicon=xxx', () => {
    Message.info({
      content: 'closeicon=xxx',
      closable: true,
      closeIcon: 'xxx',
    });

    expect($('.suzume-message-close-btn').length).toBe(1);
    expect($('.suzume-message-close-btn').item(0).textContent).toBe('xxx');
  });

  it('update when maxCount', async () => {
    vi.useRealTimers();

    Message.config({ maxCount: 2, duration: 0 });

    Message.info('content1');

    Message.info({ id: 'update', content: 'content update 1' });

    Message.info({ id: 'update', content: 'content update 2' });

    expect($('.suzume-message').length).toBe(2);
    expect($('.suzume-message .suzume-message-content')[0].innerHTML).toBe('content1');
    expect($('.suzume-message .suzume-message-content')[1].innerHTML).toBe('content update 2');

    Message.info('content 2');

    await sleep(1000);

    expect($('.suzume-message').length).toBe(2);
    expect($('.suzume-message .suzume-message-content')[0].innerHTML).toBe('content update 2');
    expect($('.suzume-message .suzume-message-content')[1].innerHTML).toBe('content 2');

    Message.info({ id: 'update', content: 'content update 3' });

    expect($('.suzume-message').length).toBe(2);
    expect($('.suzume-message .suzume-message-content')[0].innerHTML).toBe('content update 3');
    expect($('.suzume-message .suzume-message-content')[1].innerHTML).toBe('content 2');
  });
    vi.useRealTimers();
});
