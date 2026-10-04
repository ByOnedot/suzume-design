import React from 'react';
import { fireEvent, render } from '../../../tests/util';
import mountTest from '../../../tests/mountTest';
import Checkbox from '..';
import Grid from '../../Grid';

const { Col, Row } = Grid;

mountTest(Checkbox);
const options = ['Option A', 'Option B', 'Option C'];
describe('Checkbox group', () => {
  it('Checkbox default options', () => {
    const wrapper = render(<Checkbox.Group options={options} />);
    wrapper.rerender(<Checkbox.Group options={options} direction="vertical" />);
    expect(wrapper.find('.suzume-checkbox-group')[0]).toHaveClass(
      'suzume-checkbox-group-direction-vertical'
    );
  });

  it('Checkbox default options object', () => {
    const options = [
      {
        label: 'Option 1',
        value: '1',
      },
      {
        label: 'Option 2',
        value: '2',
        disabled: true,
      },
      {
        label: 'Option 3',
        value: '3',
        icon: <div id="mock-icon" />,
      },
      {
        label: 'Option 4',
        value: '4',
      },
    ];
    const wrapper = render(<Checkbox.Group options={options} />);
    const values = [].slice.call(wrapper.find('input')).map((x) => {
      return x.getAttribute('value');
    });
    expect(values).toEqual(options.map((x) => x.value));
    expect(
      [].slice.call(wrapper.find('.suzume-checkbox-text')).map((x) => {
        return x.textContent;
      })
    ).toEqual(options.map((x) => x.label));
    expect(wrapper.find('#mock-icon').length).toBe(1);
  });

  it('CheckboxGroup onChange', () => {
    const mockFn = vi.fn();
    const wrapper = render(
      <Checkbox.Group options={options} onChange={mockFn}>
        Checkbox
      </Checkbox.Group>
    );

    fireEvent.click(wrapper.find('.suzume-checkbox').item(0));

    expect(mockFn.call.length).toBe(1);

    expect(wrapper.find('.suzume-checkbox').item(0)).toHaveClass('suzume-checkbox-checked');
  });
});

describe('checkbox group controled', () => {
  it('defaultvalue', () => {
    const mockFn = vi.fn();

    const wrapper = render(
      <Checkbox.Group options={options} defaultValue={[options[1]]} onChange={mockFn}>
        Checkbox
      </Checkbox.Group>
    );
    expect(wrapper.find('.suzume-checkbox').item(1)).toHaveClass('suzume-checkbox-checked');
    // checked: true,
    fireEvent.click(wrapper.find('.suzume-checkbox').item(0));
    expect(mockFn.call.length).toBe(1);

    expect(wrapper.find('.suzume-checkbox').item(0)).toHaveClass('suzume-checkbox-checked');

    expect(wrapper.find('.suzume-checkbox').item(1)).toHaveClass('suzume-checkbox-checked');
  });

  it('value', () => {
    let checked = [options[0]];
    const wrapper = render(
      <Checkbox.Group options={options} value={checked} onChange={(v) => (checked = v)} />
    );

    fireEvent.click(wrapper.find('.suzume-checkbox > input').item(1));

    expect(checked).toEqual(options.slice(0, 2));
    wrapper.rerender(
      <Checkbox.Group options={options} value={checked} onChange={(v) => (checked = v)} />
    );
    expect(wrapper.find('.suzume-checkbox').item(1)).toHaveClass('suzume-checkbox-checked');

    fireEvent.click(wrapper.find('.suzume-checkbox').item(0));
    expect(checked).toEqual([options[1]]);
    wrapper.rerender(
      <Checkbox.Group options={options} value={checked} onChange={(v) => (checked = v)} />
    );

    expect(
      wrapper.find('.suzume-checkbox')[0].className.includes('suzume-checkbox-checked')
    ).toBeFalsy();
    expect(wrapper.find('.suzume-checkbox').item(1)).toHaveClass('suzume-checkbox-checked');
  });

  it('value is undefined', () => {
    const wrapper = render(
      <Checkbox.Group options={options} value={undefined}>
        Checkbox
      </Checkbox.Group>
    );

    const rerender = (props) => {
      wrapper.rerender(<Checkbox.Group options={options} value={undefined} {...props} />);
    };

    expect(wrapper.find('.suzume-checkbox-checked')).toHaveLength(0);

    rerender({ value: [options[0]] });
    expect(wrapper.find('.suzume-checkbox-checked')).toHaveLength(1);
    rerender({ value: undefined });
    expect(wrapper.find('.suzume-checkbox-checked')).toHaveLength(0);
  });
});

describe('checkbox group children', () => {
  let checked: any = ['Option 1'];

  const Demo = (props) => {
    return (
      <Checkbox.Group
        value={checked}
        onChange={(v) => {
          checked = v;
        }}
        {...props}
      >
        <Row>
          <Col span={8} style={{ marginBottom: 12 }}>
            <Checkbox value="Option 1">Option 1</Checkbox>
          </Col>
          <Col span={8} style={{ marginBottom: 12 }}>
            <Checkbox disabled value="Option 2">
              {' '}
              Option 2{' '}
            </Checkbox>
          </Col>
          <Col span={8} style={{ marginBottom: 12 }}>
            <Checkbox value="Option 3">Option 3</Checkbox>
          </Col>
          <Col span={8}>
            <Checkbox value="Option 4">Option 4</Checkbox>
          </Col>
          <Col span={8}>
            <Checkbox value="Option 5">Option 5</Checkbox>
          </Col>
        </Row>
      </Checkbox.Group>
    );
  };
  it('children render and toggle correctly', () => {
    const wrapper = render(<Demo />);

    expect(wrapper.find('.suzume-checkbox').item(0)).toHaveClass('suzume-checkbox-checked');

  fireEvent.click(wrapper.find('.suzume-checkbox').item(1));
  fireEvent.click(wrapper.find('.suzume-checkbox').item(2));

  expect(checked).toEqual(['Option 1', 'Option 3']);
  wrapper.rerender(<Demo value={checked} />);
  expect(wrapper.find('.suzume-checkbox').item(2)).toHaveClass('suzume-checkbox-checked');

  // checked: false,
  fireEvent.click(wrapper.find('.suzume-checkbox').item(0));
  expect(checked).toEqual(['Option 3']);
  wrapper.rerender(<Demo value={checked} />);

  expect(
    wrapper.find('.suzume-checkbox').item(0).className.includes('suzume-checkbox-checked')
  ).toBeFalsy();
  expect(wrapper.find('.suzume-checkbox').item(2)).toHaveClass('suzume-checkbox-checked');

    expect(wrapper.find('.suzume-checkbox-checked')).toHaveLength(1);
  });
});
