import React from 'react';
import { fireEvent, render } from '../../../tests/util';
import mountTest from '../../../tests/mountTest';
import componentConfigTest from '../../../tests/componentConfigTest';
import Radio from '..';

const RadioGroup = Radio.Group;

mountTest(RadioGroup);
componentConfigTest(RadioGroup, 'Radio.Group');

describe('Radio.Group', () => {
  function test(options, isChildren) {
    const children = isChildren
      ? options.map((x) => (
          <Radio key={x} value={x}>
            {x}
          </Radio>
        ))
      : null;
    it('expect render correctly', () => {
      const radioGroup = render(
        <RadioGroup defaultValue="zhou" options={options}>
          {children}
        </RadioGroup>
      );
      expect(radioGroup.find('.suzume-radio').length).toBe(3);

      expect(radioGroup.find('.suzume-radio')[0]).toHaveClass('suzume-radio-checked');
    });
    it('expect onChange correctly', () => {
      const mockFn = vi.fn();
      const radioGroup = render(
        <RadioGroup defaultValue="zhou" onChange={mockFn} options={options}>
          {children}
        </RadioGroup>
      );

      expect(radioGroup.find('.suzume-radio')[0]).toHaveClass('suzume-radio-checked');

      fireEvent.click(radioGroup.find('.suzume-radio')[2]);

      expect(mockFn).toBeCalledTimes(1);
    });

    it('value control', () => {
      let value = 'zhou';
      const radioGroup = render(
        <RadioGroup value={value} onChange={(v) => (value = v)} options={options}>
          {children}
        </RadioGroup>
      );
      expect(radioGroup.find('.suzume-radio')[0]).toHaveClass('suzume-radio-checked');

      fireEvent.click(radioGroup.find('.suzume-radio')[1]);

      expect(value).toBe('jie');
      radioGroup.rerender(
        <RadioGroup value={value} onChange={(v) => (value = v)} options={options}>
          {children}
        </RadioGroup>
      );

      expect(radioGroup.find('.suzume-radio')[1]).toHaveClass('suzume-radio-checked');

      radioGroup.rerender(
        <RadioGroup value="lun" onChange={(v) => (value = v)} options={options}>
          {children}
        </RadioGroup>
      );

      expect(radioGroup.find('.suzume-radio')[2]).toHaveClass('suzume-radio-checked');
    });
  }

  test(['zhou', 'jie', 'lun'], true);

  test(['zhou', 'jie', 'lun'], false);

  test(
    [
      { value: 'zhou', label: '周' },
      { value: 'jie', label: '杰' },
      { value: 'lun', label: '伦' },
    ],
    false
  );

  it('test disabled props', () => {
    const mockFn = vi.fn();
    const wrapper = render(
      <RadioGroup
        onChange={mockFn}
        options={[
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3', disabled: true },
        ]}
        defaultValue="2"
      />
    );

    expect(wrapper.find('.suzume-radio')[2]).toHaveClass('suzume-radio-disabled');

    expect(wrapper.find('.suzume-radio')[1]).toHaveClass('suzume-radio-checked');

    fireEvent.click(wrapper.find('.suzume-radio')[0]);
    expect(wrapper.find('.suzume-radio')[0]).toHaveClass('suzume-radio-checked');
    expect(mockFn).toBeCalledTimes(1);

    fireEvent.click(wrapper.find('.suzume-radio')[2]);
    expect(wrapper.find('.suzume-radio')[0]).toHaveClass('suzume-radio-checked');

    expect(mockFn).toBeCalledTimes(1);
  });
});
