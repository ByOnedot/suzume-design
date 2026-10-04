import mountTest from '../../../tests/mountTest';
import Modal from '..';
import { $, sleep } from '../../../tests/util';

mountTest(Modal);

/*
 * 测试modal中各个api
 */

describe('Modal config test', () => {
  it('title is null', () => {
    vi.useFakeTimers();
    const modal = Modal.info({
      title: null,
      icon: null,
    });

    vi.isFakeTimers() && vi.runAllTimers();

    expect($('.suzume-modal-title').length).toBe(0);

    modal.close();
  });
  it('icons', () => {
    let modal;
    vi.useFakeTimers();
    modal = Modal.confirm({
      title: 'confirm',
      unmountOnExit: true,
    });
    vi.isFakeTimers() && vi.runAllTimers();

    expect($('.suzume-modal-title .suzume-icon-exclamation-circle-fill').length).toBe(1);
    vi.useFakeTimers();
    modal.close();
    modal = Modal.info({
      title: 'info',
      unmountOnExit: true,
    });
    vi.isFakeTimers() && vi.runAllTimers();

    expect($('.suzume-modal-title .suzume-icon-info-circle-fill').length).toBe(1);

    vi.useFakeTimers();
    modal.close();

    modal = Modal.success({
      title: 'success',
      unmountOnExit: true,
    });
    vi.isFakeTimers() && vi.runAllTimers();
    expect($('.suzume-modal-title .suzume-icon-check-circle-fill').length).toBe(1);

    vi.useFakeTimers();
    modal.close();
    modal = Modal.warning({
      title: 'error',
      unmountOnExit: true,
    });
    vi.isFakeTimers() && vi.runAllTimers();
    expect($('.suzume-modal-title .suzume-icon-exclamation-circle-fill').length).toBe(1);

    vi.useFakeTimers();
    modal.close();

    modal = Modal.error({
      title: '123',
      unmountOnExit: true,
    });
    vi.isFakeTimers() && vi.runAllTimers();
    expect($('.suzume-modal-title .suzume-icon-close-circle-fill').length).toBe(1);
    modal.close();
  });
  it('onOk', () => {
    const okMockFn = vi.fn();
    vi.useFakeTimers();

    const modal = Modal.confirm({
      title: '123',
      onOk: okMockFn,
      unmountOnExit: true,
    });

    vi.isFakeTimers() && vi.runAllTimers();

    // 默认icon
    expect($('.suzume-modal-title > span > .suzume-icon').length).toBe(1);
    expect($('.suzume-modal-footer button').length).toBe(2);

    // 确定按钮
    $('.suzume-modal-footer button')[1].click();
    expect(okMockFn).toBeCalledTimes(1);
    modal.close();
  });

  it('oncancel', () => {
    const cancelMockFn = vi.fn();
    vi.useFakeTimers();

    const modal = Modal.info({
      title: '123',
      simple: false,
      unmountOnExit: true,
      onCancel: cancelMockFn,
    });

    vi.isFakeTimers() && vi.runAllTimers();

    // 确定按钮
    $('.suzume-modal-close-icon')[0].click();
    expect(cancelMockFn).toBeCalledTimes(1);
    modal.close();
  });

  it('update and close', () => {
    const closeFn = vi.fn();
    vi.useFakeTimers();
    const modal = Modal.info({
      afterClose: closeFn,
      title: 'Info',
      icon: null,
      unmountOnExit: true,
    });

    vi.isFakeTimers() && vi.runAllTimers();

    // 确定按钮
    expect($('.suzume-modal-title')[0].innerHTML).toBe('<span>Info</span>');

    modal.update({ title: 'Updated Title' });
    expect($('.suzume-modal-title')[0].innerHTML).toBe('<span>Updated Title</span>');

    vi.useFakeTimers();
    modal.close();
    vi.isFakeTimers() && vi.runAllTimers();

    expect(closeFn).toBeCalledTimes(1);

    expect($('.suzume-modal').length).toBe(0);
  });

  it('promise', () => {
    vi.useFakeTimers();
    const modal = Modal.info({
      title: '123',
      unmountOnExit: true,
      onOk: () => {
        return Promise.resolve();
      },
    });

    vi.isFakeTimers() && vi.runAllTimers();

    $('.suzume-modal-footer button')[0].click();

    expect($('.suzume-modal-footer .suzume-icon-loading').length).toBe(1);

    modal.close();
  });

  it('promise reject', async () => {
    const catchError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const error = new Error('error');

    vi.useFakeTimers();
    const modal = Modal.info({
      title: '123',
      unmountOnExit: true,
      onOk: () => {
        return new Promise((_, reject) => {
          reject(error);
        });
      },
    });

    vi.isFakeTimers() && vi.runAllTimers();
    vi.useRealTimers();

    $('.suzume-modal-footer button')[0].click();

    expect($('.suzume-modal-footer .suzume-icon-loading').length).toBe(1);
    await sleep(0);

    expect($('.suzume-modal-footer .suzume-icon-loading').length).toBe(0);
    expect(catchError).toHaveBeenCalledWith(error);
    modal.close();
  });
});
