import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '../../../tests/util';
import mountTest from '../../../tests/mountTest';
import Button from '../../Button';
import Tooltip from '..';
// import { TriggerState } from '../../Trigger';

mountTest(Tooltip);

describe('Tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(async () => {
    vi.isFakeTimers() && vi.runAllTimers();
    // React 18+ schedules the notice exit transition; flush it so the
    // DOM is clean before the next test starts.
    await act(async () => {});
  });
  it('mouseenter and mouseleave', () => {
    vi.useFakeTimers();
    const wrapper = render(
      <Tooltip position="top" trigger="hover" content="Content">
        <Button>Top</Button>
      </Tooltip>
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    vi.isFakeTimers() && vi.runAllTimers();
    expect(wrapper.find('.suzume-trigger').length).toBe(1);
    fireEvent.mouseLeave(screen.getByRole('button'));
    vi.isFakeTimers() && vi.runAllTimers();
    expect(wrapper.find('.suzume-trigger').length).toBe(0);
  });

  it('does not show tooltip when content is null or undefined or false or "  "', () => {
    [false, undefined, null, '  '].forEach((item) => {
      const wrapper = render(
        <Tooltip position="top" color="#333333" trigger="hover" content={item}>
          <Button>Top</Button>
        </Tooltip>
      );
      fireEvent.mouseEnter(screen.getByRole('button'));
      vi.isFakeTimers() && vi.runAllTimers();
      expect(wrapper.find('.suzume-tooltip-content-inner').length).toBe(0);
      cleanup();
    });
  });
  it('should show tooltip when content is 0', () => {
    const wrapper = render(
      <Tooltip position="top" color="#333333" trigger="hover" content={0}>
        <Button>Top</Button>
      </Tooltip>
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    vi.isFakeTimers() && vi.runAllTimers();
    expect(wrapper.find('.suzume-tooltip-content-inner').length).not.toBe(0);
  });

  it('showArrow property', () => {
    const wrapper = render(
      <Tooltip
        position="top"
        color="#333333"
        triggerProps={{
          showArrow: false,
        }}
        popupVisible
        trigger="hover"
        content="Content"
      >
        <Button>Top</Button>
      </Tooltip>
    );
    expect(wrapper.find('.suzume-trigger-arrow')).toHaveLength(0);
  });
  it('arrowProps property', async () => {
    vi.useFakeTimers();
    const container = render(
      <Tooltip
        position="top"
        trigger="hover"
        content="Content"
        triggerProps={{
          arrowProps: {
            style: {
              backgroundColor: '#fff',
            },
          },
        }}
      >
        <Button>Top</Button>
      </Tooltip>
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    vi.isFakeTimers() && vi.runAllTimers();
    expect(container.querySelector('.suzume-trigger-arrow')?.style.backgroundColor).toBe(
      'rgb(255, 255, 255)'
    );
  });

  it('position', () => {
    const positions = [
      'top',
      'tl',
      'tr',
      'bottom',
      'bl',
      'br',
      'left',
      'lt',
      'lb',
      'right',
      'rt',
      'rb',
    ] as const;
    positions.forEach((position) => {
      const wrapper = render(
        <Tooltip position={position} trigger="hover" content="Content">
          <Button>Position</Button>
        </Tooltip>
      );
      fireEvent.mouseEnter(screen.getByRole('button'));
      vi.isFakeTimers() && vi.runAllTimers();
      expect(wrapper.find('.suzume-trigger')[0].className).toContain(
        `suzume-trigger-position-${position}`
      );
      cleanup();
    });
  });

  it('should onchange be called', () => {
    const visibleChangeHandler = vi.fn();
    render(
      <Tooltip
        position="top"
        trigger="hover"
        content="Content"
        onVisibleChange={visibleChangeHandler}
      >
        <Button>Top</Button>
      </Tooltip>
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    vi.isFakeTimers() && vi.runAllTimers();
    expect(visibleChangeHandler).toHaveBeenCalledTimes(1);
  });
});
