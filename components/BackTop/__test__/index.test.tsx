import React from 'react';
import { fireEvent, render, sleep } from '../../../tests/util';
import mountTest from '../../../tests/mountTest';
import componentConfigTest from '../../../tests/componentConfigTest';
import BackTop from '..';

mountTest(BackTop);
componentConfigTest(BackTop, 'BackTop');

describe('BackTop', () => {
  it('click button scroll to top', async () => {
    const onClick = vi.fn();

    const window = {
      scrollTop: 400,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    const component = render(<BackTop onClick={onClick} target={() => window as any} />);
    fireEvent.click(component.find('.suzume-backtop')[0]);
    await sleep(500);
    expect(window.scrollTop).toBe(0);
    expect(onClick).toHaveBeenCalled();
    component.unmount();
    expect(window.removeEventListener).toHaveBeenCalled();
  });
});
