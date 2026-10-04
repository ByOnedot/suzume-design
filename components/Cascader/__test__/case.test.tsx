import React from 'react';
import Cascader from '../cascader';
import { act, fireEvent, render } from '../../../tests/util';
import { Backspace } from '../../_util/keycode';

const options = [
  {
    value: 'shanghai',
    label: '上海',
    children: [
      {
        value: 'shanghaishi',
        label: '上海市',
      },
    ],
  },
];

describe('Cascader basic test', () => {
  // 生命周期
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(async () => {
    vi.useFakeTimers();
    // 运行所有定时器
    vi.isFakeTimers() && vi.runAllTimers();
    // React 18+ schedules the notice exit transition; flush it so the
    // DOM is clean before the next test starts.
    await act(async () => {});
  });

  it('string[] correctly', () => {
    const wrapper = render(
      <Cascader defaultValue={['shanghai', 'shanghaishi']} options={options} mode="multiple" />
    );

    expect(wrapper.querySelector('.suzume-tag-content')?.textContent).toBe('');
  });

  it('string[][] correctly', () => {
    const wrapper = render(
      <Cascader
        defaultValue={[['shanghai', 'shanghaishi'], 'xxx']}
        options={options}
        mode="multiple"
      />
    );

    expect(wrapper.querySelectorAll('.suzume-tag-content').item(1)?.textContent).toBe('');
  });

  it('checked & unchecked correctly', () => {
    const options = [
      {
        value: 'Beijing',
        label: 'Beijing',
        children: [
          {
            value: 'dongcheng',
            label: 'Dongcheng',
            disabled: true,
            children: [
              {
                value: 'chaoyangmen',
                label: 'Chaoyangmen',
              },
              {
                value: 'jianguo',
                label: 'Jianguomen',
              },
            ],
          },
          {
            value: 'xicheng',
            label: 'Xicheng',
          },
        ],
      },
    ];
    const wrapper = render(<Cascader options={options} mode="multiple" />);

    fireEvent.click(wrapper.find('.suzume-cascader')[0]);
    expect(wrapper.find(`.suzume-cascader-list-column`)).toHaveLength(1);
    fireEvent.click(wrapper.find('.suzume-checkbox')[0]);
    expect(wrapper.find('.suzume-checkbox')[0]).toHaveClass('suzume-checkbox-indeterminate');
    fireEvent.click(wrapper.find('.suzume-checkbox')[0]);
    expect(wrapper.find('.suzume-checkbox')[0].className).toBe('suzume-checkbox');
  });

  it('halfchecked correctly', () => {
    const options = [
      {
        value: 'beijing',
        label: 'Beijing',
        children: [
          {
            value: 'dongcheng',
            label: 'Dongcheng',
            disabled: true,
            children: [
              {
                value: 'chaoyangmen',
                label: 'Chaoyangmen',
              },
              {
                value: 'jianguo',
                label: 'Jianguomen',
              },
            ],
          },
          {
            value: 'xicheng',
            label: 'Xicheng',
          },
        ],
      },
    ];
    const wrapper = render(
      <Cascader
        defaultValue={[['beijing', 'dongcheng', 'chaoyangmen']]}
        options={options}
        mode="multiple"
      />
    );

    fireEvent.click(wrapper.find('.suzume-cascader')[0]);
    expect(wrapper.find('.suzume-checkbox')[0]).toHaveClass('suzume-checkbox-indeterminate');
    expect(wrapper.find('[title="Dongcheng"] .suzume-checkbox')[0]).toHaveClass(
      'suzume-checkbox-indeterminate'
    );

    fireEvent.click(wrapper.find('.suzume-checkbox')[0]);
    expect(wrapper.find('.suzume-checkbox')[0]).toHaveClass('suzume-checkbox-indeterminate');
    expect(wrapper.find('[title="Xicheng"] .suzume-checkbox')[0]).toHaveClass(
      'suzume-checkbox-checked'
    );

    fireEvent.click(wrapper.find('.suzume-checkbox')[0]);
    expect(wrapper.find('.suzume-checkbox')[0]).toHaveClass('suzume-checkbox-indeterminate');
    expect(wrapper.find('[title="Dongcheng"] .suzume-checkbox')[0]).toHaveClass(
      'suzume-checkbox-indeterminate'
    );
    expect(wrapper.find('[title="Xicheng"] .suzume-checkbox')[0].className).toBe('suzume-checkbox');
  });

  it('checked & halfchecked correctly', () => {
    const options = [
      {
        value: 'beijing',
        label: 'Beijing',
        children: [
          {
            value: 'dongcheng',
            label: 'Dongcheng',
            disabled: true,
            children: [
              {
                value: 'chaoyangmen',
                label: 'Chaoyangmen',
              },
              {
                value: 'jianguo',
                label: 'Jianguomen',
              },
            ],
          },
          {
            value: 'xicheng',
            label: 'Xicheng',
          },
        ],
      },
    ];
    const wrapper = render(
      <Cascader
        defaultValue={[
          ['beijing', 'dongcheng', 'chaoyangmen'],
          ['beijing', 'dongcheng', 'jianguo'],
        ]}
        options={options}
        mode="multiple"
      />
    );

    fireEvent.click(wrapper.find('.suzume-cascader')[0]);
    expect(wrapper.find('.suzume-checkbox')[0]).toHaveClass('suzume-checkbox-indeterminate');
    expect(wrapper.find('[title="Dongcheng"] .suzume-checkbox')[0]).toHaveClass(
      'suzume-checkbox-checked'
    );

    fireEvent.click(wrapper.find('.suzume-checkbox')[0]);
    expect(wrapper.find('.suzume-checkbox')[0]).toHaveClass('suzume-checkbox-checked');
    expect(wrapper.find('[title="Xicheng"] .suzume-checkbox')[0]).toHaveClass(
      'suzume-checkbox-checked'
    );

    fireEvent.click(wrapper.find('.suzume-checkbox')[0]);
    expect(wrapper.find('.suzume-checkbox')[0]).toHaveClass('suzume-checkbox-indeterminate');
    expect(wrapper.find('[title="Dongcheng"] .suzume-checkbox')[0]).toHaveClass(
      'suzume-checkbox-checked'
    );
    expect(wrapper.find('[title="Xicheng"] .suzume-checkbox')[0].className).toBe('suzume-checkbox');
  });

  it('changeonselect ', () => {
    const wrapper = render(<Cascader changeOnSelect options={options} mode="multiple" />);

    fireEvent.click(wrapper.find('.suzume-cascader')[0]);
    fireEvent.click(wrapper.find('.suzume-cascader-list-item-label')[0]);
    expect(wrapper.find('.suzume-checkbox')).toHaveLength(2);
    fireEvent.click(wrapper.find('.suzume-checkbox')[1]);

    expect(wrapper.find('.suzume-tag')).toHaveLength(1);

    fireEvent.click(wrapper.find('.suzume-checkbox')[0]);

    expect(wrapper.find('.suzume-tag')).toHaveLength(2);
  });

  it('delete by Del ', () => {
    const wrapper = render(
      <Cascader
        options={options}
        defaultValue={[
          ['beijing', 'dongcheng', 'chaoyangmen'],
          ['beijing', 'dongcheng', 'jianguo'],
        ]}
        mode="multiple"
        showSearch
      />
    );

    fireEvent.click(wrapper.find('.suzume-cascader')[0]);

    fireEvent.keyDown(wrapper.find('input')[0], {
      keyCode: Backspace.code,
    });

    vi.isFakeTimers() && vi.runAllTimers();

    expect(wrapper.find('.suzume-tag')).toHaveLength(1);
  });

  it('dragToSort controlled', () => {
    const defaultValue = [
      ['shanghai', 'shanghai'],
      ['beijing', 'beijing'],
    ];
    let value: string[][] = defaultValue;
    const wrapper = render(
      <Cascader
        dragToSort
        value={value}
        onChange={(v) => (value = v as string[][])}
        options={[
          {
            value: 'shanghai',
            label: 'Shanghai',
            children: [
              {
                value: 'shanghai',
                label: 'Shanghai',
              },
            ],
          },
          {
            value: 'beijing',
            label: 'Beijing',
            children: [
              {
                value: 'beijing',
                label: 'Beijing',
              },
            ],
          },
        ]}
        mode="multiple"
      />
    );

    expect(wrapper.querySelectorAll('.suzume-tag')).toHaveLength(2);
    expect(wrapper.querySelector('.suzume-tag-content')?.textContent).toBe('Shanghai / Shanghai');

    const tags = wrapper.querySelectorAll('.suzume-draggable-item');

    fireEvent.drag(tags[1]);
    fireEvent.dragStart(tags[1]);
    fireEvent.dragOver(tags[0], {
      pageX: 0,
    });

    fireEvent.drop(tags[0]);
    expect(value).toEqual(defaultValue.reverse());
  });

  it('dragToSort uncontrolled', () => {
    let value: string[][] = [];
    const defaultValue = [
      ['shanghai', 'shanghai'],
      ['beijing', 'beijing'],
    ];
    const wrapper = render(
      <Cascader
        dragToSort
        defaultValue={defaultValue}
        onChange={(v) => (value = v as string[][])}
        options={[
          {
            value: 'shanghai',
            label: 'Shanghai',
            children: [
              {
                value: 'shanghai',
                label: 'Shanghai',
              },
            ],
          },
          {
            value: 'beijing',
            label: 'Beijing',
            children: [
              {
                value: 'beijing',
                label: 'Beijing',
              },
            ],
          },
        ]}
        mode="multiple"
      />
    );

    expect(wrapper.querySelectorAll('.suzume-tag')).toHaveLength(2);
    const tags = wrapper.querySelectorAll('.suzume-draggable-item');

    fireEvent.drag(tags[1]);
    fireEvent.dragStart(tags[1]);
    fireEvent.dragOver(tags[0], {
      pageX: 0,
    });

    fireEvent.drop(tags[0]);
    expect(value).toEqual(defaultValue.reverse());
    expect(wrapper.querySelector('.suzume-tag-content')?.textContent).toBe('Beijing / Beijing');
  });
    vi.useRealTimers();
});
