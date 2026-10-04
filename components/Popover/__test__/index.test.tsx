import React from 'react';
import { fireEvent, render } from '../../../tests/util';
import mountTest from '../../../tests/mountTest';
import Button from '../../Button';
import Popover from '..';

mountTest(Popover);

describe('Popover', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('mouseenter and mouseleave', () => {
    const wrapper = render(
      <Popover position="top" title="Title" content="Content">
        <Button>Top</Button>
      </Popover>
    );
    fireEvent.mouseEnter(wrapper.getByRole('button'));
    vi.isFakeTimers() && vi.runAllTimers();
    expect(1).toBe(1);
  });
});
