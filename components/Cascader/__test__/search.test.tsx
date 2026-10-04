import React from 'react';
import Cascader from '../cascader';
import { act, fireEvent, render } from '../../../tests/util';

const prefixCls = '.suzume-cascader';
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

function mountCascader(component: React.ReactElement) {
  return render(component);
}

describe('Cascader search', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(async () => {
    vi.useFakeTimers();
    vi.isFakeTimers() && vi.runAllTimers();
    // React 18+ schedules the notice exit transition; flush it so the
    // DOM is clean before the next test starts.
    await act(async () => {});
  });

  it('multiply select correctly', async () => {
    const mockFn = vi.fn();
    const wrapper = mountCascader(
      <Cascader
        placeholder="Please enter ..."
        mode="multiple"
        style={{ width: 300 }}
        options={[]}
        onSearch={mockFn}
        showSearch
      />
    );
    fireEvent.click(wrapper.querySelector('.suzume-cascader-view') as any);
    expect(wrapper.find(`${prefixCls}-list`)).toHaveLength(0);
    fireEvent.change(wrapper.container.querySelector('input') as Element, {
      target: { value: '1' },
    });

    vi.isFakeTimers() && vi.runAllTimers();

    expect(mockFn).toBeCalledTimes(1); // 得到mock函数被触发的次数
    expect(mockFn.mock.calls[0][0]).toEqual('1');

    wrapper.rerender(
      <Cascader
        placeholder="Please enter ..."
        mode="multiple"
        style={{ width: 300 }}
        options={options}
        onSearch={mockFn}
      />
    );
    vi.isFakeTimers() && vi.runAllTimers();
    expect(wrapper.find(`${prefixCls}-list-item`)).toHaveLength(1);
  });

  it('showSearch.panelMode', async () => {
    const wrapper = mountCascader(
      <Cascader
        placeholder="Please enter ..."
        mode="multiple"
        style={{ width: 300 }}
        options={options}
        showSearch={{ panelMode: 'select' }}
      />
    );
    fireEvent.click(wrapper.querySelector('.suzume-cascader-view') as any);

    vi.isFakeTimers() && vi.runAllTimers();
    expect(wrapper.find(`${prefixCls}-list-search-item`)).toHaveLength(1);
  });

  it('showSearch.renderOption', async () => {
    const wrapper = mountCascader(
      <Cascader
        placeholder="Please enter ..."
        style={{ width: 300 }}
        options={options}
        showSearch={{ panelMode: 'select', renderOption: () => 'aaa' }}
      />
    );
    fireEvent.click(wrapper.querySelector('.suzume-cascader-view') as any);
    vi.isFakeTimers() && vi.runAllTimers();
    expect(
      wrapper.querySelector(`${prefixCls}-list-search-item .suzume-cascader-list-item-label`)
        ?.textContent
    ).toBe('aaa');
  });
    vi.useRealTimers();
});
