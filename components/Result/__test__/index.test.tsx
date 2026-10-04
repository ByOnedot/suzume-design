import React from 'react';
import { render, cleanup } from '../../../tests/util';
import mountTest from '../../../tests/mountTest';
import componentConfigTest from '../../../tests/componentConfigTest';
import Result from '..';
import { ResultStatus } from '../interface';

mountTest(Result);
componentConfigTest(Result, 'Result');

describe('Result', () => {
  it('render status correctly', () => {
    const status = ['success', 'error', 'info', 'warning', '404', '403', '500'];

    status.forEach((x) => {
      const wrapper = render(<Result status={x as ResultStatus} />);
      expect(wrapper.find('.suzume-result')[0].classList.contains(`suzume-result-is-${x}`)).toBe(
        true
      );
      expect(wrapper.find(`.suzume-result-icon-${x}`)).toHaveLength(1);
      cleanup();
    });
  });

  it('render custom icon correctly', () => {
    const wrapper = render(<Result icon={<span>custom icon</span>} />);
    expect(wrapper.find(`.suzume-result-icon-info`)[0].innerHTML).toEqual(
      '<span>custom icon</span>'
    );
  });
});
