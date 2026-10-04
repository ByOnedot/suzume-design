import React from 'react';
import { cleanup } from '@testing-library/react';
import { $, act, fireEvent, render } from '../../../tests/util';
import Tree from '..';

const TreeData = [
  {
    key: 'Trunk 0-0',
    title: '0-0',
    children: [
      {
        key: 'Branch 0-0-2',
        title: '0-0-2',
        children: [
          {
            key: 'Leaf',
            title: '0-0-2-1',
          },
        ],
      },
    ],
  },
  {
    key: 'Trunk 0-1',
    title: '0-1',
    children: [
      {
        key: 'Branch 0-1-1',
        title: '0-1-1',
        children: [
          {
            key: 'Leaf',
            title: '0-1-1-0',
          },
        ],
      },
    ],
  },
];

describe('Tree case', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(async () => {
    vi.useFakeTimers();
    vi.isFakeTimers() && vi.runAllTimers();
    // React 18+ schedules the notice exit transition; flush it so the
    // DOM is clean before the next test starts.
    await act(async () => {});
    cleanup();
  });

  it('icons correctly', async () => {
    const wrapper = render(
      <Tree
        treeData={TreeData}
        icons={(nodeprops) => {
          return {
            switcherIcon: nodeprops.expanded ? '-' : '+',
          };
        }}
      />
    );

    const firstNode = wrapper.find(`.suzume-tree-node-switcher-icon`).item(0);

    // 默认是展开的
    expect(firstNode.textContent).toBe('-');
    fireEvent.click(firstNode);
    // 收起节点
    expect(firstNode.textContent).toBe('+');
  });

  it('does not focus switcher when clicking by mouse', () => {
    const wrapper = render(<Tree treeData={TreeData} />);
    const firstNode = wrapper.find(`.suzume-tree-node-switcher-icon`).item(0);

    expect(fireEvent.mouseDown(firstNode)).toBe(false);
  });

  it('show child correctly', async () => {
    const data = [
      {
        key: 'Trunk 0-0',
        title: '0-0',
        children: [
          {
            key: 'Branch 0-0-2',
            title: '0-0-2',
            disableCheckbox: true,
            children: [
              {
                key: 'Leaf',
                title: '0-0-2-1',
              },
            ],
          },
        ],
      },
    ];

    let currentKeys;
    render(
      <Tree
        onCheck={(keys) => {
          currentKeys = keys;
        }}
        checkable
        treeData={data}
        checkedStrategy="child"
      />
    );

    fireEvent.click($('.suzume-checkbox').item(0));

    // 默认是展开的
    expect(currentKeys).toEqual([data[0].key]);

    fireEvent.click($('.suzume-checkbox').item(2));

    expect(currentKeys).toEqual([data[0].key, data[0].children[0].children[0].key]);

    // 取消节点选中
    fireEvent.click($('.suzume-checkbox').item(2));

    expect(currentKeys).toEqual([data[0].key]);
  });
    vi.useRealTimers();
});
