import React from 'react';
import { cleanup, fireEvent, render, screen } from '../../../tests/util';
import mountTest from '../../../tests/mountTest';
import componentConfigTest from '../../../tests/componentConfigTest';
import Switch from '..';
import Popconfirm from '../../Popconfirm';
import IconCheck from '../../../icon/react-icon/IconCheck';
import IconClose from '../../../icon/react-icon/IconClose';

mountTest(Switch);
componentConfigTest(Switch, 'Switch');

describe('Switch', () => {
  it('onChange listener correctly', () => {
    const onChange = vi.fn();
    const component = render(<Switch defaultChecked onChange={onChange} />);

    expect(component.find('.suzume-switch')[0].className).toContain('suzume-switch-checked');
    fireEvent.click(component.container.firstChild!);

    expect(component.find('.suzume-switch')[0].className).not.toContain('suzume-switch-checked');
    expect(onChange.mock.calls[0][0]).toBe(false);
  });

  it('different size correctly', () => {
    const component = render(<Switch size="small" defaultChecked />);

    expect(component.find('.suzume-switch')[0].className).toContain('suzume-switch-small');
  });

  it('different type correctly', () => {
    const component = render(<Switch type="round" defaultChecked />);
    expect(component.find('.suzume-switch')[0].className).toContain('suzume-switch-type-round');
    cleanup();
    const component2 = render(<Switch type="line" defaultChecked />);
    expect(component2.find('.suzume-switch')[0].className).toContain('suzume-switch-type-line');
  });

  it('checked and unchecked correctly', () => {
    const component = render(<Switch defaultChecked checkedText="ON" uncheckedText="OFF" />);
    expect(component.find('.suzume-switch')[0].className).toContain('suzume-switch-checked');

    fireEvent.click(component.container.firstChild!);

    expect(component.find('.suzume-switch')[0].className).not.toContain('suzume-switch-checked');
  });

  it('loading', () => {
    const component = render(<Switch defaultChecked loading />);
    expect(component.find('.suzume-switch')[0].className).toContain('suzume-switch-checked');
    expect(
      component
        .find<SVGElement>('.suzume-switch-dot .suzume-switch-dot-icon svg')[0]
        .classList.contains('suzume-icon-loading')
    ).toBe(true);

    fireEvent.click(component.container.firstChild!);

    expect(component.find('.suzume-switch')[0].className).toContain('suzume-switch-checked');
  });

  it('dot icon', () => {
    vi.useFakeTimers();
    const component = render(<Switch checkedIcon={<IconCheck />} uncheckedIcon={<IconClose />} />);

    expect(
      component
        .find<SVGElement>('.suzume-switch-dot .suzume-switch-dot-icon svg')[0]
        .classList.contains('suzume-icon-close')
    ).toBe(true);

    fireEvent.click(screen.getByRole('switch'));
    vi.isFakeTimers() && vi.runAllTimers();
    expect(
      component
        .find<SVGElement>('.suzume-switch-dot .suzume-switch-dot-icon svg')[0]
        .classList.contains('suzume-icon-check')
    ).toBe(true);
  });

  it('showTriger ', () => {
    const component = render(
      <Popconfirm title="xxx">
        <Switch />
      </Popconfirm>
    );

    fireEvent.click(component.container.firstChild!);

    expect(component.find('.suzume-popconfirm')).toHaveLength(1);
  });
});
