import React from 'react';
import { act } from '../../../tests/util';
import mountTest from '../../../tests/mountTest';
import Drawer, { DrawerProps } from '..';
import Button from '../../Button';
import { render, fireEvent } from '../../../tests/util';
import { Esc } from '../../_util/keycode';

mountTest(Drawer);

interface DemoTestState {
  visible: boolean;
}

class DemoTest extends React.Component<DrawerProps, DemoTestState> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  open = () => {
    this.setState({
      visible: true,
    });
  };

  onConfirm = () => {
    this.setState({
      visible: false,
    });
  };

  onCancel = () => {
    this.setState({
      visible: false,
    });
  };

  afterOpen = vi.fn(() => {});

  afterClose = vi.fn(() => {});

  render() {
    const { visible } = this.state;
    return (
      <>
        <Button onClick={this.open} type="primary" className="open-btn">
          Open
        </Button>
        <Drawer
          title="Title"
          visible={visible}
          placement="bottom"
          onOk={this.onConfirm}
          onCancel={this.onCancel}
          afterOpen={this.afterOpen}
          afterClose={this.afterClose}
          {...this.props}
        >
          <p id="test-content">内容</p>
        </Drawer>
      </>
    );
  }
}

const openDrawer = (wrapper) => {
  fireEvent.click(wrapper.find('.open-btn')[0]);
};

describe('Drawer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(async () => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
    vi.isFakeTimers() && vi.runAllTimers();
    // React 18+ schedules the notice exit transition; flush it so the
    // DOM is clean before the next test starts.
    await act(async () => {});
  });

  it('open drawer correctly', () => {
    const wrapper = render(<DemoTest />);
    expect(wrapper.find('.suzume-drawer')).toHaveLength(0);
    // drawer mask correctly
    expect(wrapper.find('.suzume-drawer-mask').length).toBe(0);

    act(() => {
      openDrawer(wrapper);
      vi.isFakeTimers() && vi.runAllTimers();
    });

    expect(wrapper.find('.suzume-drawer')).toHaveLength(1);
    expect(wrapper.find('.suzume-drawer-mask').length).toBe(1);

    act(() => {
      fireEvent.click(wrapper.find('.suzume-drawer-close-icon').item(0));

      vi.isFakeTimers() && vi.runAllTimers();
    });

    expect(
      wrapper.find('.suzume-drawer-wrapper')[0].classList.contains('suzume-drawer-wrapper-hide')
    ).toBe(true);
    wrapper.unmount();
  });

  it('onConfirm and onCancel correctly', () => {
    const wrapper = render(<DemoTest />);

    act(() => {
      openDrawer(wrapper);
      vi.isFakeTimers() && vi.runAllTimers();
    });

    expect(wrapper.find('.suzume-drawer-wrapper')[0].style.display).toBe('block');
    expect(wrapper.find('.suzume-drawer-footer > .suzume-btn-primary')[0]).toHaveTextContent(
      '确定'
    );
    act(() => {
      fireEvent.click(wrapper.find('.suzume-drawer-footer>.suzume-btn-primary')[0]);
      vi.isFakeTimers() && vi.runAllTimers();
    });
    expect(
      wrapper.find('.suzume-drawer-wrapper')[0].classList.contains('suzume-drawer-wrapper-hide')
    ).toBe(true);

    act(() => {
      openDrawer(wrapper);
      vi.isFakeTimers() && vi.runAllTimers();
    });
    expect(wrapper.find('.suzume-drawer-wrapper')[0].style.display).toBe('block');
    expect(wrapper.find('.suzume-drawer-footer > .suzume-btn-secondary')[0]).toHaveTextContent(
      '取消'
    );

    act(() => {
      fireEvent.click(wrapper.find('.suzume-drawer-footer > .suzume-btn-secondary')[0]);
      vi.isFakeTimers() && vi.runAllTimers();
    });

    expect(
      wrapper.find('.suzume-drawer-wrapper')[0].classList.contains('suzume-drawer-wrapper-hide')
    ).toBe(true);
    openDrawer(wrapper);
    expect(wrapper.find('.suzume-drawer-wrapper')[0].style.display).toBe('block');
    expect(wrapper.find('.suzume-drawer-mask')).toHaveLength(1);
    act(() => {
      fireEvent.click(document?.querySelector('.suzume-drawer-mask') as Element);
      vi.isFakeTimers() && vi.runAllTimers();
    });
    expect(
      wrapper.find('.suzume-drawer-wrapper')[0].classList.contains('suzume-drawer-wrapper-hide')
    ).toBe(true);
    wrapper.unmount();
  });

  it('closable=false', () => {
    const wrapper = render(<DemoTest closable={false} />);
    expect(wrapper.find('.suzume-drawer')).toHaveLength(0);
    // drawer mask correctly
    expect(wrapper.find('.suzume-drawer-mask').length).toBe(0);

    act(() => {
      openDrawer(wrapper);
      vi.isFakeTimers() && vi.runAllTimers();
    });

    expect(wrapper.find('.suzume-drawer')).toHaveLength(1);
    expect(wrapper.find('.suzume-drawer-close-icon').length).toBe(0);
    wrapper.unmount();
  });

  it('closeicon=xxx', () => {
    const wrapper = render(<DemoTest closeIcon="xxx" />);
    expect(wrapper.find('.suzume-drawer')).toHaveLength(0);
    // drawer mask correctly
    expect(wrapper.find('.suzume-drawer-mask').length).toBe(0);

    act(() => {
      openDrawer(wrapper);
      vi.isFakeTimers() && vi.runAllTimers();
    });

    expect(wrapper.find('.suzume-drawer')).toHaveLength(1);
    expect(wrapper.find('.suzume-drawer-close-icon').length).toBe(1);
    expect(wrapper.find('.suzume-drawer-close-icon').item(0).textContent).toBe('xxx');

    act(() => {
      fireEvent.click(wrapper.find('.suzume-drawer-close-icon').item(0));

      vi.isFakeTimers() && vi.runAllTimers();
    });

    expect(
      wrapper.find('.suzume-drawer-wrapper')[0].classList.contains('suzume-drawer-wrapper-hide')
    ).toBe(true);

    wrapper.unmount();
  });

  it('esc', () => {
    const wrapper = render(<DemoTest />);
    expect(wrapper.find('.suzume-drawer')).toHaveLength(0);
    // drawer mask correctly
    expect(wrapper.find('.suzume-drawer-mask').length).toBe(0);

    act(() => {
      openDrawer(wrapper);
      vi.isFakeTimers() && vi.runAllTimers();
    });

    expect(wrapper.find('.suzume-drawer')).toHaveLength(1);

    act(() => {
      fireEvent.keyDown(document.querySelector('#test-content') as HTMLElement, {
        keyCode: Esc.code,
      });

      vi.isFakeTimers() && vi.runAllTimers();
    });

    expect(
      wrapper.find('.suzume-drawer-wrapper')[0].classList.contains('suzume-drawer-wrapper-hide')
    ).toBe(true);

    wrapper.unmount();
  });
    vi.useRealTimers();
});
