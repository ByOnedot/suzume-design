import React, { useState } from 'react';
import mountTest from '../../../tests/mountTest';
import Modal from '..';
import Button from '../../Button';
import DatePicker from '../../DatePicker';
import Form from '../../Form';
import Input from '../../Input';
import { $, act, cleanup, fireEvent, render } from '../../../tests/util';
import { Esc } from '../../_util/keycode';

mountTest(Modal);

function DemoTest() {
  const [visible, setVisible] = useState(false);

  function open() {
    setVisible(true);
  }

  function onOk() {
    setVisible(false);
  }

  function onCancel() {
    setVisible(false);
  }

  return (
    <>
      <Button onClick={open} type="primary">
        Open
      </Button>
      <Modal title="Title" visible={visible} onConfirm={onOk} onCancel={onCancel}>
        Content
      </Modal>
    </>
  );
}

describe('Modal', () => {
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

  it('renders correctly', () => {
    const component = render(
      <div>
        <Modal title="Title" visible>
          Content
        </Modal>
        <Modal title="Title" visible mask={false}>
          Content
        </Modal>
      </div>
    );
    expect(component.container.firstChild).toMatchSnapshot();
  });

  it('closeIcon correctly', () => {
    const component = render(
      <div>
        <Modal title="Title" visible closeIcon="xxx">
          Content
        </Modal>
      </div>
    );
    expect(component.querySelector('.suzume-modal-close-icon')?.textContent).toBe('xxx');
  });

  it('open modal correctly', () => {
    const wrapper = render(<DemoTest />);
    expect(wrapper.find('.suzume-modal')).toHaveLength(0);
    // modal mask correctly
    expect($('.suzume-modal-mask').length).toBe(0);

    fireEvent.click(wrapper.queryByText('Open') as Element);

    expect(wrapper.find('.suzume-modal')).toHaveLength(1);
    expect(wrapper.querySelector('.suzume-modal-wrapper')).toHaveStyle('display: block');

    expect($('.suzume-modal-mask').length).toBe(1);

    const closeIcon = wrapper.querySelector('.suzume-modal-close-icon');
    expect(closeIcon).toBeTruthy();
    fireEvent.click(closeIcon as Element);

    vi.isFakeTimers() && vi.runAllTimers();

    expect(wrapper.querySelector('.suzume-modal-wrapper')).toHaveStyle('display: none');
    expect($('.suzume-modal-mask').length).toBe(1);
  });

  it('onConfirm and onCancel correctly', () => {
    const wrapper = render(<DemoTest />);
    function open() {
      fireEvent.click(wrapper.queryByText('Open') as Element);
    }
    open();
    expect($('.suzume-modal-wrapper')[0].style.display).toBe('block');
    fireEvent.click(wrapper.queryByText('确定') as Element);
    vi.isFakeTimers() && vi.runAllTimers();
    expect($('.suzume-modal-wrapper')[0].style.display).toBe('none');

    vi.useFakeTimers();
    open();
    expect($('.suzume-modal-wrapper')[0].style.display).toBe('block');
    fireEvent.click(wrapper.queryByText('取消') as Element);

    vi.isFakeTimers() && vi.runAllTimers();
    expect($('.suzume-modal-wrapper')[0].style.display).toBe('none');
  });

  it('close Modal with esc keydown event and focusLock is false', () => {
    vi.useFakeTimers();
    const onCancel = vi.fn();
    Modal.confirm({
      title: 'title',
      content: 'content',
      focusLock: false,
      onCancel,
    });
    Modal.error({
      title: 'title',
      content: 'content',
      focusLock: false,
      onCancel,
    });
    vi.isFakeTimers() && vi.runAllTimers();
    expect(document.querySelectorAll(`.suzume-modal-wrapper`)).toHaveLength(2);
    fireEvent.keyDown(document.querySelectorAll('.suzume-modal-wrapper')[0], {
      key: Esc.key,
    });
    vi.isFakeTimers() && vi.runAllTimers();
    expect(document.querySelectorAll(`.suzume-modal-wrapper`)).toHaveLength(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('close Modal with esc keydown event and focusLock and autoFocus is true', () => {
    vi.useFakeTimers();
    const onCancel = vi.fn();
    Modal.confirm({
      title: 'title',
      content: 'content',
      onCancel,
    });
    Modal.error({
      title: 'title',
      content: 'content',
      onCancel,
    });
    vi.isFakeTimers() && vi.runAllTimers();
    expect(document.querySelectorAll(`.suzume-modal-wrapper`)).toHaveLength(2);
    const focusLockNode = document.querySelectorAll('[data-focus-lock-disabled]')[0];
    expect(focusLockNode).toBeTruthy();
    fireEvent.keyDown(focusLockNode, {
      key: Esc.key,
    });
    vi.isFakeTimers() && vi.runAllTimers();
    expect(document.querySelectorAll(`.suzume-modal-wrapper`)).toHaveLength(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('close Modal with escToExit is false', () => {
    vi.useFakeTimers();
    const onCancel = vi.fn();
    Modal.confirm({
      title: 'title',
      escToExit: false,
      content: 'content',
      onCancel,
    });
    vi.isFakeTimers() && vi.runAllTimers();
    expect(document.querySelectorAll(`.suzume-modal-wrapper`)).toHaveLength(1);
    fireEvent.keyDown(document.querySelectorAll('.suzume-modal-wrapper')[0], {
      key: Esc.key,
    });
    vi.isFakeTimers() && vi.runAllTimers();
    expect(document.querySelectorAll(`.suzume-modal-wrapper`)).toHaveLength(1);
    expect(onCancel).toHaveBeenCalledTimes(0);
    vi.useRealTimers();
  });

  it('clear Modal dom ', () => {
    vi.useFakeTimers();
    const wrapper = render(
      <Modal visible unmountOnExit>
        haha
      </Modal>
    );

    expect(document.querySelectorAll(`.suzume-modal-wrapper`)).toHaveLength(1);

    wrapper.rerender(
      <Modal visible={false} unmountOnExit>
        haha
      </Modal>
    );

    vi.isFakeTimers() && vi.runAllTimers();
    expect(document.querySelectorAll(`.suzume-modal-wrapper`)).toHaveLength(0);
    vi.useRealTimers();
  });

  it('should keep focus on DatePicker input and close modal with esc', () => {
    const onCancel = vi.fn();

    render(
      <Modal visible title="Add User" onCancel={onCancel}>
        <Form>
          <Form.Item label="Date of Birth" field="birthday">
            <DatePicker placeholder="" />
          </Form.Item>
          <Form.Item label="Name" field="name">
            <Input placeholder="" />
          </Form.Item>
        </Form>
      </Modal>
    );

    vi.isFakeTimers() && vi.runAllTimers();

    const focusLockNode = document.querySelector('[data-focus-lock-disabled]');
    expect(focusLockNode).toBeTruthy();

    const dateInput = document.querySelector('.suzume-picker-input input') as HTMLInputElement;
    expect(dateInput).toBeTruthy();
    expect(focusLockNode).toContainElement(dateInput);

    fireEvent.keyDown(focusLockNode as HTMLElement, {
      key: Esc.key,
    });

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
