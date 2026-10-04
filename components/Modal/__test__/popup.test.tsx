import React from 'react';
import mountTest from '../../../tests/mountTest';
import Modal from '..';
import Select from '../../Select';
import { $, act, cleanup, fireEvent, render } from '../../../tests/util';

mountTest(Modal);

/*
 * 测试modal中的popup
 */

describe('Modal popup test', () => {
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

  it('popup correctly', () => {
    const ui = (
      <div>
        <Modal title="Title" visible>
          <Select options={[1, 2, 3]} />
        </Modal>
      </div>
    );
    const wrapper = render(ui);
    vi.useFakeTimers();

    // Component stylesheets are not loaded under `css: false`, so the wrapper
    // resolves to `z-index: auto` and Modal would keep its 1050 fallback. Seed
    // the value `Modal/style/index.less` would have applied, then re-render so
    // Modal re-reads it through the wrapper ref - which is what the assertion
    // below is really about: the popup sits one level above the modal.
    const modalWrapper = document.querySelector('.suzume-modal-wrapper') as HTMLElement;
    act(() => {
      modalWrapper.style.zIndex = '1049';
    });
    wrapper.rerender(ui);

    fireEvent.click(wrapper.find('.suzume-select-view')[0]);

    vi.isFakeTimers() && vi.runAllTimers();

    expect($('.suzume-select-popup').length).toBe(1);
    const zIndex = +window.getComputedStyle(
      document.querySelector('.suzume-modal-wrapper') as HTMLElement,
      null
    )?.zIndex;
    expect(Number($('.suzume-select-popup')[0].parentNode.style['z-index'])).toBe(zIndex + 1);
    // dom插入在 content下。
    expect($('.suzume-modal-content .suzume-select-popup').length).toBe(1);
  });

  it('getChildrenPopupContainer correctly', () => {
    const wrapper = render(
      <Modal
        title="Title"
        visible
        getChildrenPopupContainer={() => {
          // console.log(document.querySelector('.test'));
          return document.querySelector('.test') as Element;
        }}
      >
        <div className="test">
          <Select options={[1, 2, 3]} />
        </div>
      </Modal>
    );

    vi.useFakeTimers();

    fireEvent.click(wrapper.find('.suzume-select-view')[0]);
    vi.isFakeTimers() && vi.runAllTimers();

    expect($('.suzume-select-popup').length).toBe(1);
    // dom插入在 test 下
    expect($('.test .suzume-select-popup').length).toBe(1);
  });
});
