import React from 'react';

import { act } from '../../../tests/util';
import mountTest from '../../../tests/mountTest';
import Modal from '..';
import { $, cleanup, fireEvent, render } from '../../../tests/util';

mountTest(Modal);

/*
 * 测试modal中各个api
 */

describe('Modal api test', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(async () => {
    cleanup();
    document.body.innerHTML = '';
    vi.isFakeTimers() && vi.runAllTimers();
    // React 18+ schedules the notice exit transition; flush it so the
    // DOM is clean before the next test starts.
    await act(async () => {});
  });

  it('afteropen afterClose correctly', () => {
    const openMockFn = vi.fn();
    const closeMockFn = vi.fn();
    const wrapper = render(
      <Modal afterOpen={openMockFn} afterClose={closeMockFn} visible={false}>
        <div>123</div>
      </Modal>
    );

    vi.useFakeTimers();
    wrapper.rerender(
      <Modal afterOpen={openMockFn} afterClose={closeMockFn} visible>
        <div>123</div>
      </Modal>
    );
    vi.isFakeTimers() && vi.runAllTimers();

    expect(openMockFn).toBeCalledTimes(1);
    vi.useFakeTimers();

    wrapper.rerender(
      <Modal afterOpen={openMockFn} afterClose={closeMockFn} visible={false}>
        <div>123</div>
      </Modal>
    );
    vi.isFakeTimers() && vi.runAllTimers();

    expect(closeMockFn).toBeCalledTimes(1);
  });
  it('simple and closable', () => {
    const wrapper = render(<Modal visible />);
    expect($('.suzume-modal-close-icon').length).toBe(1);

    wrapper.rerender(<Modal visible simple />);
    expect($('.suzume-modal-close-icon').length).toBe(0);

    wrapper.rerender(<Modal visible simple closable />);
    expect($('.suzume-modal-close-icon').length).toBe(1);
    wrapper.rerender(<Modal visible simple={false} closable={false} />);
    expect($('.suzume-modal-close-icon').length).toBe(0);
  });
  it('click mask', () => {
    let visible = true;

    const wrapper = render(
      <Modal
        visible={visible}
        onCancel={() => {
          visible = false;
        }}
      />
    );

    vi.useFakeTimers();
    act(() => {
      fireEvent.mouseDown(wrapper.find('.suzume-modal-wrapper')[0]);
      fireEvent.click(wrapper.find('.suzume-modal-wrapper')[0]);
    });

    vi.isFakeTimers() && vi.runAllTimers();

    expect(visible).toBe(false);
  });

  it('modalRender and custom footer', () => {
    const wrapper = render(
      <Modal
        footer={<div>1234</div>}
        modalRender={(node) => {
          return (
            <div>
              {node} <div className="test-content" />
            </div>
          );
        }}
        visible
      >
        <div>123</div>
      </Modal>
    );

    // 作为modal的兄弟节点
    expect(document.querySelectorAll('.suzume-modal+.test-content')).toHaveLength(1);

    expect(wrapper.find('.suzume-modal-footer')[0].innerHTML).toBe('<div>1234</div>');
  });
});
