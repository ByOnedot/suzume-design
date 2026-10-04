import React from 'react';
import { fireEvent, render } from '../../../tests/util';
import DatePicker from '..';
import { getDateCell, getInput } from './utils';
import '../../../tests/mockDate';

const { RangePicker } = DatePicker;

describe('RangePicker hover', () => {
  it('mode = date', () => {
    const component = render(<RangePicker />);
    fireEvent.click(getInput(component, 0));

    expect(
      component.find('.suzume-picker')[0].classList.contains('suzume-picker-focused')
    ).toBeTruthy();

    // 2020-04-06
    fireEvent.click(getDateCell(component, 0, 7).querySelector('.suzume-picker-date')!);

    expect(getDateCell(component, 0, 7).className).toBe(
      'suzume-picker-cell suzume-picker-cell-in-view suzume-picker-cell-selected suzume-picker-cell-range-start'
    );

    // 2020-04-08
    fireEvent.mouseEnter(getDateCell(component, 0, 9));

    expect(getDateCell(component, 0, 7).className).toBe(
      'suzume-picker-cell suzume-picker-cell-in-view suzume-picker-cell-selected suzume-picker-cell-range-start suzume-picker-cell-in-range'
    );
    expect(getDateCell(component, 0, 9).className).toBe(
      'suzume-picker-cell suzume-picker-cell-in-view suzume-picker-cell-range-end suzume-picker-cell-in-range'
    );
    expect(component.find('.suzume-picker-cell-in-range')).toHaveLength(3);

    expect(getInput(component, 0).getAttribute('value')).toBe('2020-04-06');
    expect(getInput(component, 1).getAttribute('value')).toBe('2020-04-08');
    expect(
      getInput(component, 1).parentElement?.classList.contains('suzume-picker-input-placeholder')
    ).toBeTruthy();

    fireEvent.click(getDateCell(component, 0, 9).querySelector('.suzume-picker-date')!);

    expect(getInput(component, 0).getAttribute('value')).toBe('2020-04-06');
    expect(getInput(component, 1).getAttribute('value')).toBe('2020-04-08');

    expect(
      component.find('.suzume-picker')[0].classList.contains('suzume-picker-focused')
    ).toBeFalsy();

    // reopen
    fireEvent.click(getInput(component, 1));

    // 2020-04-10
    fireEvent.mouseEnter(getDateCell(component, 0, 11));

    expect(getDateCell(component, 0, 7).className).toBe(
      'suzume-picker-cell suzume-picker-cell-in-view suzume-picker-cell-selected suzume-picker-cell-range-start suzume-picker-cell-in-range suzume-picker-cell-hover-range-start suzume-picker-cell-hover-in-range'
    );
    expect(getDateCell(component, 0, 9).className).toBe(
      'suzume-picker-cell suzume-picker-cell-in-view suzume-picker-cell-selected suzume-picker-cell-range-end suzume-picker-cell-in-range suzume-picker-cell-hover-in-range suzume-picker-cell-range-edge-in-hover-range'
    );
    expect(getDateCell(component, 0, 11).className).toBe(
      'suzume-picker-cell suzume-picker-cell-in-view suzume-picker-cell-today suzume-picker-cell-hover-range-end suzume-picker-cell-hover-in-range'
    );
    expect(component.find('.suzume-picker-cell-hover-in-range')).toHaveLength(5);
  });
});
