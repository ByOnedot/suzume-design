import React from 'react';
import { act } from '../../../tests/util';
import mountTest from '../../../tests/mountTest';
import componentConfigTest from '../../../tests/componentConfigTest';
import Cascader from '../cascader';
import CascaderPanel from '../panel/list';
import Store from '../base/store';
import { fireEvent, render } from '../../../tests/util';

mountTest(Cascader);
componentConfigTest(Cascader, 'Cascader');

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

// 模块

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

  it('popupChange correctly', () => {
    const mockFn = vi.fn();
    const wrapper = mountCascader(<Cascader options={options} onVisibleChange={mockFn} />);
    // 找到class为.suzume-cascader dom
    fireEvent.click(wrapper.find(prefixCls)[0]);
    expect(mockFn).toHaveBeenCalledWith(true); // 被调用，传入参数为true
    // 展开第一级
    expect(wrapper.find(`${prefixCls}-list-column`)).toHaveLength(1);
    fireEvent.click(wrapper.find(prefixCls)[0]);
    // 消失有动画的延时
    vi.isFakeTimers() && vi.runAllTimers();
    expect(mockFn).toHaveBeenCalledWith(false); // 传入参数false
  });

  it('onKeyDown is called', () => {
    const onKeyDown = vi.fn();
    const wrapper = mountCascader(<Cascader onKeyDown={onKeyDown} />);
    fireEvent.keyDown(wrapper.querySelector('input') as HTMLElement);
    expect(onKeyDown).toHaveBeenCalled();
  });

  it('select correctly', async () => {
    const mockChange = vi.fn();
    const mockFn = vi.fn();

    const wrapper = mountCascader(
      <Cascader onVisibleChange={mockFn} options={options} onChange={mockChange} />
    );
    // 展开一层
    fireEvent.click(wrapper.find(prefixCls)[0]);
    const list1 = wrapper.querySelector(`${prefixCls}-list-column`);
    // 展开第二层
    fireEvent.click(
      list1.querySelector(`${prefixCls}-list-item ${prefixCls}-list-item-label`) as Element
    );
    expect(wrapper.find(`${prefixCls}-list-column`)).toHaveLength(2);

    const list2 = wrapper.find(`${prefixCls}-list-column`);

    fireEvent.click(
      list2[list2.length - 1].querySelector(`${prefixCls}-list-item ${prefixCls}-list-item-label`)
    );
    // onChange事件触发
    expect(mockChange).toBeCalledTimes(1); // 得到mock函数被触发的次数
    expect(mockChange.mock.calls[0][0]).toEqual(['shanghai', 'shanghaishi']);
    expect(mockChange.mock.calls[0][1].map((item) => item.value)).toEqual([
      'shanghai',
      'shanghaishi',
    ]);

    expect(wrapper.querySelector('.suzume-cascader-view-value')).toHaveTextContent('上海 / 上海市');
    // 消失有动画的延时
    vi.isFakeTimers() && vi.runAllTimers();
    expect(mockFn).toHaveBeenCalledWith(false); // 传入参数false
  });

  it('changeOnselect correctly', () => {
    const wrapper = mountCascader(<Cascader options={options} changeOnSelect />);
    // 展开一层
    fireEvent.click(wrapper.find(prefixCls)[0]);
    const list1 = wrapper.querySelector(`${prefixCls}-list-column`);
    fireEvent.click(
      list1.querySelector(`${prefixCls}-list-item ${prefixCls}-list-item-label`) as Element
    );
    expect(wrapper.querySelector('.suzume-cascader-view-value')).toHaveTextContent('上海');
  });

  it('preserves custom column transform after enter animation', () => {
    const store = new Store(options);
    const wrapper = render(
      <CascaderPanel
        store={store}
        value={[]}
        prefixCls="suzume-cascader"
        popupVisible
        dropdownMenuColumnStyle={{ transform: 'scale(0.9)' }}
        getTriggerElement={() => null}
        icons={{}}
      />
    );

    fireEvent.click(wrapper.find(`${prefixCls}-list-item-label`)[0]);
    act(() => {
      vi.isFakeTimers() && vi.runAllTimers();
    });

    expect(wrapper.find(`${prefixCls}-list-column`)[1]).toHaveStyle({ transform: 'scale(0.9)' });
  });

  it('updates popup position synchronously when panel content changes', () => {
    const updatePopupPosition = vi.fn();
    const store = new Store([
      ...options,
      {
        value: 'beijing',
        label: '北京',
        children: [{ value: 'beijingshi', label: '北京市' }],
      },
    ]);
    const wrapper = render(
      <CascaderPanel
        store={store}
        value={[]}
        prefixCls="suzume-cascader"
        popupVisible
        updatePopupPosition={updatePopupPosition}
        getTriggerElement={() => null}
        icons={{}}
      />
    );

    updatePopupPosition.mockClear();
    fireEvent.click(wrapper.find(`${prefixCls}-list-item-label`)[0]);

    expect(wrapper.find(`${prefixCls}-list-column`)).toHaveLength(2);
    expect(updatePopupPosition).toHaveBeenCalledTimes(1);

    updatePopupPosition.mockClear();
    fireEvent.click(wrapper.find(`${prefixCls}-list-item-label`)[1]);
    expect(wrapper.find(`${prefixCls}-list-column`)).toHaveLength(2);
    expect(updatePopupPosition).toHaveBeenCalledTimes(1);

    updatePopupPosition.mockClear();
    wrapper.rerender(
      <CascaderPanel
        store={store}
        value={[]}
        prefixCls="suzume-cascader"
        popupVisible={false}
        updatePopupPosition={updatePopupPosition}
        getTriggerElement={() => null}
        icons={{}}
      />
    );
    expect(updatePopupPosition).toHaveBeenCalledTimes(1);
  });
    vi.useRealTimers();
});

let wrapper;
describe('support clear correctly', () => {
  beforeEach(() => {
    const defaultValue = ['shanghai', 'shanghaishi'];
    wrapper = mountCascader(<Cascader options={options} defaultValue={defaultValue} allowClear />);
    vi.useFakeTimers();
  });

  afterEach(async () => {
    vi.useFakeTimers();
    vi.isFakeTimers() && vi.runAllTimers();
    // React 18+ schedules the notice exit transition; flush it so the
    // DOM is clean before the next test starts.
    await act(async () => {});
  });

  // 默认选中值正确
  it('set defaultValue correctly', () => {
    expect(wrapper.querySelector('.suzume-cascader-view-value')).toHaveTextContent('上海 / 上海市');
    fireEvent.click(wrapper.find(prefixCls)[0]);

    expect(wrapper.find('.suzume-cascader-list-column')).toHaveLength(2);
  });

  // 清除值正确
  it('clear value correctly', () => {
    fireEvent.click(wrapper.find('.suzume-icon-close')[0]);
    expect(wrapper.find(`${prefixCls}-view`)[0].textContent).toBe('');
    fireEvent.click(wrapper.find(prefixCls)[0]);
  });
    vi.useRealTimers();
});

describe('support multiple correctly', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(async () => {
    vi.isFakeTimers() && vi.runAllTimers();
    // React 18+ schedules the notice exit transition; flush it so the
    // DOM is clean before the next test starts.
    await act(async () => {});
  });
  const options = [
    {
      value: 'beijing',
      label: '北京',
      children: [
        {
          value: 'beijingshi',
          label: '北京市',
          children: [
            {
              value: 'chaoyang',
              label: '朝阳区',
              children: [
                {
                  value: 'datunli',
                  label: '大屯里',
                },
              ],
            },
            {
              value: 'dongcheng',
              label: '东城区',
            },
            {
              value: 'xicheng',
              label: '西城区',
            },
            {
              value: 'haidian',
              label: '海淀区',
            },
          ],
        },
      ],
    },
  ];

  it('multiply select correctly', () => {
    let value = [['beijing', 'beijingshi', 'chaoyang', 'datunli']];
    let option;
    const wrapper = mountCascader(
      <Cascader
        key="1"
        placeholder="请选择一个地点"
        style={{ maxWidth: 300 }}
        options={options}
        onChange={(v, o) => {
          value = v as string[][];
          option = o;
        }}
        mode="multiple"
        defaultValue={value}
      />
    );
    fireEvent.click(wrapper.find(prefixCls)[0]);
    vi.isFakeTimers() && vi.runAllTimers();

    expect(wrapper.find(`${prefixCls}-list-column`)).toHaveLength(4);
    const list = wrapper.find(`${prefixCls}-list-column`)[2];

    act(() => {
      fireEvent.click(list.querySelector(`${prefixCls}-list-item .suzume-checkbox `), {});
    });
    vi.isFakeTimers() && vi.runAllTimers();
    expect(value).toEqual([]);
    act(() => {
      fireEvent.click(
        list.querySelectorAll(`${prefixCls}-list-item`).item(1).querySelector('.suzume-checkbox')
      );
      fireEvent.click(
        list.querySelectorAll(`${prefixCls}-list-item`).item(2).querySelector('.suzume-checkbox')
      );
    });

    expect(value.length).toEqual(2);
    expect(option.length).toEqual(2);
  });

  it('multiply select checkedStrategy correctly controlled', () => {
    let value = [['beijing']];
    const wrapper = mountCascader(
      <Cascader
        renderFormat={(values) => values.join('-')}
        placeholder="请选择一个地点"
        style={{ maxWidth: 300 }}
        options={options}
        onChange={(v) => {
          value = v as string[][];
        }}
        checkedStrategy="parent"
        mode="multiple"
        value={value}
      />
    );
    expect(wrapper.find('.suzume-tag > span')[0].textContent).toBe(`北京`);

    fireEvent.click(wrapper.find(prefixCls)[0]);
    vi.isFakeTimers() && vi.runAllTimers();

    fireEvent.click(
      wrapper.find(`${prefixCls}-list-column`)[0].querySelector(`${prefixCls}-list-item-label`)
    );
    vi.isFakeTimers() && vi.runAllTimers();
    fireEvent.click(
      wrapper.find(`${prefixCls}-list-column`)[1].querySelector(`${prefixCls}-list-item-label`)
    );

    vi.isFakeTimers() && vi.runAllTimers();

    expect(wrapper.find('.suzume-checkbox').length).toEqual(
      wrapper.find('.suzume-checkbox-checked').length
    );

    expect(wrapper.find(`${prefixCls}-list-column`)).toHaveLength(3);

    vi.isFakeTimers() && vi.runAllTimers();

    fireEvent.click(
      wrapper
        .find(`${prefixCls}-list-column`)[2]
        .querySelectorAll(`${prefixCls}-list-item`)[1]
        .querySelector('.suzume-checkbox')
    );

    vi.isFakeTimers() && vi.runAllTimers();
    expect(value).toEqual([
      ['beijing', 'beijingshi', 'chaoyang'],
      ['beijing', 'beijingshi', 'xicheng'],
      ['beijing', 'beijingshi', 'haidian'],
    ]);
  });

  it('multiply select checkedStrategy correctly', () => {
    let value = [['beijing', 'beijingshi', 'chaoyang', 'datunli']];
    const wrapper = mountCascader(
      <Cascader
        renderFormat={(values) => values.join('-')}
        placeholder="请选择一个地点"
        style={{ maxWidth: 300 }}
        options={options}
        onChange={(v) => {
          value = v as string[][];
        }}
        checkedStrategy="parent"
        mode="multiple"
        defaultValue={value}
      />
    );
    expect(wrapper.find('.suzume-tag > span').item(0).textContent).toBe(`北京-北京市-朝阳区`);

    fireEvent.click(wrapper.container.querySelector(prefixCls) as Element);
    vi.isFakeTimers() && vi.runAllTimers();
    fireEvent.click(document.querySelector('.suzume-checkbox') as Element);

    expect(value).toEqual([['beijing']]);
  });

  it('support multiply search correctly', () => {
    // const wrapper = mountCascader(<Cascader  options={options} showSearch mode="multiple" />);
    // fireEvent.click(wrapper.find(prefixCls)[0]);
    // wrapper.find(`${prefixCls}-view-search>input`).simulate('change', {
    //   target: {
    //     value: '北京',
    //   },
    // });
    // const store = wrapper.find('Cascader').instance().store;
    // const mockSearch = vi.spyOn(store, 'searchNodeByLabel');
  });

  describe('loadmore', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.isFakeTimers() && vi.runAllTimers();
    });

    const options = [
      {
        value: 'beijing',
        label: '北京',
      },
      {
        value: 'shanghai',
        label: '上海',
      },
    ];
    const mockfn = vi.fn();
    it('loadmore correctly', () => {
      const wrapper = mountCascader(
        <Cascader
          style={{ maxWidth: 300 }}
          options={options}
          loadMore={mockfn}
          showSearch
          mode="multiple"
        />
      );
      fireEvent.click(wrapper.find(prefixCls)[0]);
      const list = wrapper.find(`${prefixCls}-list-column`)[0];
      fireEvent.click(
        list.querySelectorAll(`${prefixCls}-list-item ${prefixCls}-list-item-label`).item(0)
      );
      expect(mockfn.mock.calls).toHaveLength(1);
    });

    it('value control', () => {
      // const Demo = function() {
      //   const [value, setValue] = React.useState([]);
      //   return (
      //     <Cascader
      //       placeholder="请选择一个地点"
      //       options={options}
      //       mode="multiple"
      //       value={value}
      //       onChange={setValue}
      //     />
      //   );
      // };
      // const wrapper = mountCascader(<Demo />);
      // const cascader = wrapper.find('Cascader');
      // cascader.find(prefixCls).simulate('click');
      // const list1 = cascader.find(`${prefixCls}-list-column`);
      // list1.find(`${prefixCls}-list-item ${prefixCls}-list-item-label`).simulate('click');
    });
  });
});

describe('fieldNames Cascader', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(async () => {
    vi.isFakeTimers() && vi.runAllTimers();
    // React 18+ schedules the notice exit transition; flush it so the
    // DOM is clean before the next test starts.
    await act(async () => {});
  });
  const options = [
    {
      id: 'beijing',
      name: '北京',
      child: [
        {
          id: 'beijingshi',
          name: '北京市',
          child: [
            {
              id: 'chaoyang',
              name: '朝阳区',
              child: [
                {
                  id: 'datunli',
                  name: '大屯里',
                },
              ],
            },
            {
              id: 'dongcheng',
              name: '东城区',
            },
            {
              id: 'xicheng',
              name: '西城区',
            },
            {
              id: 'haidian',
              name: '海淀区',
            },
          ],
        },
      ],
    },
  ];

  it('multiply select correctly', () => {
    let value;
    const wrapper = mountCascader(
      <Cascader
        key="multiplyselect"
        fieldNames={{
          label: 'name',
          value: 'id',
          children: 'child',
        }}
        placeholder="请选择一个地点"
        onChange={(v) => {
          value = v;
        }}
        style={{ maxWidth: 300 }}
        options={options}
        mode="multiple"
        defaultValue={[['beijing', 'beijingshi', 'chaoyang', 'datunli']]}
      />
    );
    expect(wrapper.find('.suzume-tag').length).toBe(1);
    act(() => {
      fireEvent.click(wrapper.find(prefixCls)[0]);
    });

    expect(wrapper.find(`.suzume-cascader-list-column`)).toHaveLength(4);
    const list = wrapper.find(`${prefixCls}-list-column`).item(2);

    act(() => {
      fireEvent.click(
        list.querySelectorAll(`${prefixCls}-list-item`).item(0).querySelector('.suzume-checkbox')
      );
    });

    expect(value.length).toBe(0);
    act(() => {
      fireEvent.click(
        list.querySelectorAll(`${prefixCls}-list-item`).item(1).querySelector('.suzume-checkbox')
      );
    });

    act(() => {
      fireEvent.click(
        list.querySelectorAll(`${prefixCls}-list-item`).item(2).querySelector('.suzume-checkbox')
      );
    });
    expect(value.length).toBe(2);
  });

  describe('loadmore', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.isFakeTimers() && vi.runAllTimers();
    });

    const options = [
      {
        id: 'beijing',
        name: '北京',
      },
      {
        id: 'shanghai',
        name: '上海',
      },
    ];
    const mockfn = vi.fn();
    it('loadmore correctly', () => {
      const wrapper = mountCascader(
        <Cascader
          fieldNames={{ label: 'name', isLeaf: 'is-leaf', value: 'id' }}
          style={{ maxWidth: 300 }}
          options={options}
          loadMore={mockfn}
          showSearch
          mode="multiple"
        />
      );
      fireEvent.click(wrapper.find(prefixCls)[0]);
      const list = wrapper.find(`${prefixCls}-list-column`)[0];
      fireEvent.click(
        list.querySelectorAll(`${prefixCls}-list-item ${prefixCls}-list-item-label`).item(0)
      );
      expect(mockfn.mock.calls).toHaveLength(1);
    });

    it('render next && loading icon', async () => {
      const options = [
        {
          value: 'beijing',
          label: 'Beijing',
        },
        {
          value: 'shanghai',
          label: 'Shanghai',
          children: [
            {
              value: 'shanghaishi',
              label: 'Shanghai',
            },
          ],
        },
      ];
      const loadMore: any = (pathValue, level) =>
        new Promise((resolve) => {
          setTimeout(() => {
            const nodes = pathValue.map((_x, i) => ({
              label: `Option ${i + 1}`,
              value: i,
              isLeaf: level >= 2,
            }));
            resolve(nodes);
          }, 5000);
        });
      const wrapper = mountCascader(
        <Cascader
          style={{ maxWidth: 300 }}
          options={options}
          defaultValue={['beijing']}
          loadMore={loadMore}
          icons={{
            next: <span>next</span>,
            loading: <span>loading</span>,
          }}
        />
      );

      fireEvent.click(wrapper.find(prefixCls)[0]);
      expect(
        wrapper.find(`${prefixCls}-list-item ${prefixCls}-list-item-label span`).item(0).textContent
      ).toBe('next');

      fireEvent.click(wrapper.find(prefixCls)[0]);
      fireEvent.click(wrapper.find(`${prefixCls}-list-item-label`)[0]);

      expect(
        wrapper.find(`${prefixCls}-list-item ${prefixCls}-list-item-label span`).item(0).textContent
      ).toBe('loading');
    });
    it('render checked icon', async () => {
      const wrapper = mountCascader(
        <Cascader
          fieldNames={{ label: 'name', isLeaf: 'is-leaf', value: 'id' }}
          style={{ maxWidth: 300 }}
          options={options}
          defaultValue={['beijing']}
          showSearch
          icons={{
            checked: <span>checked</span>,
          }}
        />
      );
      fireEvent.click(wrapper.find(prefixCls)[0]);
      const input = wrapper.find(`${prefixCls}-view-input`).item(0) as HTMLInputElement;
      fireEvent.change(input, { target: { value: '北京' } });
      expect(
        wrapper
          .find(`${prefixCls}-list ${prefixCls}-list-search-item ${prefixCls}-check-icon span`)
          .item(0).textContent
      ).toBe('checked');
    });
  });
});
