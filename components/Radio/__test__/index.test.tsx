import React from 'react';
import { act, fireEvent, render } from '../../../tests/util';
import mountTest from '../../../tests/mountTest';
import componentConfigTest from '../../../tests/componentConfigTest';
import Radio from '..';

mountTest(Radio);
componentConfigTest(Radio, 'Radio');

function mountRadio(component: React.ReactElement) {
  return render(component);
}

describe('Radio', () => {
  it('radio render correctly', () => {
    const wrapper = mountRadio(<Radio>周</Radio>);
    expect(wrapper.find('.suzume-radio')).toHaveLength(1);

    fireEvent.click(wrapper.find('.suzume-radio')[0]);
    expect(wrapper.find('.suzume-radio')[0]).toHaveClass('suzume-radio-checked');
  });

  it('radio defaultChecked correctly', () => {
    const wrapper = mountRadio(<Radio defaultChecked>周</Radio>);
    expect(wrapper.find('.suzume-radio')).toHaveLength(1);

    expect(wrapper.find('.suzume-radio')[0]).toHaveClass('suzume-radio-checked');
  });

  it('radio onChange correctly', () => {
    const mockFn = vi.fn();
    const checked = false;
    const wrapper = mountRadio(
      <Radio checked={checked} onChange={mockFn}>
        周
      </Radio>
    );
    expect(wrapper.find('.suzume-radio')).toHaveLength(1);

    expect(wrapper.find('.suzume-radio')[0].className).toBe('suzume-radio');

    act(() => {
      fireEvent.click(wrapper.find('.suzume-radio')[0]);
    });

    expect(mockFn).toBeCalledTimes(1);
    expect(wrapper.find('.suzume-radio')[0].className).toBe('suzume-radio');
  });
});
