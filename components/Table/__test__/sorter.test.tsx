import React from 'react';
import { fireEvent, render, cleanup, sleep } from '../../../tests/util';
import Table, { ColumnProps } from '..';
import { columnsSorter } from './common/columns';
import { data, treeData, TestData } from './common/data';

describe('Table sorter', () => {
  it('sorter', () => {
    function checkSorter(columns: ColumnProps<TestData>[]) {
      const onChange = vi.fn();
      const component = render(<Table columns={columns} data={data} onChange={onChange} />);
      const sorter = component.find('.suzume-table-cell-with-sorter')[0];
      const getFirstTdText = () => {
        return component.find('tbody tr').item(0).querySelectorAll('td .suzume-table-cell').item(3)
          .textContent;
      };

      // default ascend
      expect(getFirstTdText()).toBe('19');

      function checkSortDirections() {
        // descend
        fireEvent.click(sorter);

        expect(getFirstTdText()).toBe('30');

        // cancel
        fireEvent.click(sorter);

        expect(getFirstTdText()).toBe('20');
      }

      checkSortDirections();

      // onChange extra
      expect(onChange.mock.calls[0][3].action).toBe('sort');
      expect(onChange.mock.calls[0][3].currentData.map((a) => a.name)).toEqual([
        'Name4',
        'Name2',
        'Name5',
        'Name1',
        'Name3',
      ]);

      component.rerender(
        <Table columns={columns} data={data} onChange={onChange} pagination={false} />
      );

      // ascend
      fireEvent.click(sorter);

      expect(getFirstTdText()).toBe('19');

      checkSortDirections();
      cleanup();
    }

    checkSorter(columnsSorter);
    // no dataIndex
    checkSorter(
      columnsSorter.map((col) => {
        const newCol = { ...col };
        if (newCol.sorter) {
          newCol.render = (_, record) => record.age;
          delete newCol.dataIndex;
        }
        return newCol;
      })
    );
  });

  it('sortDirections', () => {
    const component = render(
      <Table
        columns={columnsSorter.map((d) => {
          const _d = { ...d };
          if (_d.title === 'Age') {
            delete _d.defaultSortOrder;
            return {
              ..._d,
              sortDirections: ['descend'],
              sorter: (a, b) => a.age - b.age,
            };
          }
          return _d;
        })}
        data={data}
      />
    );
    const sorter = component.find('.suzume-table-cell-with-sorter')[0];
    const getFirstTdText = () => {
      return component.find('tbody tr').item(0).querySelectorAll('td .suzume-table-cell').item(3)
        .textContent;
    };

    // default
    expect(getFirstTdText()).toBe('20');

    // descend
    fireEvent.click(sorter);

    expect(getFirstTdText()).toBe('30');

    // cancel
    fireEvent.click(sorter);

    expect(getFirstTdText()).toBe('20');
  });

  it('showSorterTooltip', async () => {
    const component = render(<Table columns={columnsSorter} data={data} />);
    const tooltipText = () => document.querySelector('.suzume-tooltip-content')?.innerHTML;

    // The sorter tooltip opens on a 200ms `mouseEnterDelay`, so leave headroom
    // before asserting rather than racing the timer.
    fireEvent.mouseEnter(component.find('.suzume-table-cell-with-sorter')[0]);
    await sleep(400);
    expect(tooltipText()).toEqual(
      `<div class="suzume-tooltip-content-inner">点击降序</div>`
    );

    fireEvent.click(component.find('.suzume-table-cell-with-sorter')[0]);
    await sleep(400);
    expect(tooltipText()).toEqual(
      `<div class="suzume-tooltip-content-inner">取消排序</div>`
    );

    fireEvent.click(component.find('.suzume-table-cell-with-sorter')[0]);
    await sleep(400);
    expect(tooltipText()).toEqual(
      `<div class="suzume-tooltip-content-inner">点击升序</div>`
    );

    // `showSorterTooltip={false}` only disables the tooltip's handlers, so it
    // cannot close a popup that is already open. Check the prop from a clean
    // slate instead.
    cleanup();
    const noTooltip = render(
      <Table columns={columnsSorter} data={data} showSorterTooltip={false} />
    );
    fireEvent.mouseEnter(noTooltip.find('.suzume-table-cell-with-sorter')[0]);
    await sleep(400);
    expect(document.querySelector('.suzume-tooltip-content')).toBeNull();
  });

  it('sort tree data', () => {
    const component = render(
      <Table data={treeData} columns={columnsSorter} defaultExpandAllRows />
    );

    const sorter = component.find('.suzume-table-cell-with-sorter')[0];

    const getAge = (index) => {
      return component
        .find('tbody tr')
        .item(index)
        .querySelectorAll('td .suzume-table-cell')
        .item(3).textContent;
    };

    expect(getAge(0)).toBe('20');
    expect(getAge(1)).toBe('30');
    expect(getAge(2)).toBe('25');
    expect(getAge(3)).toBe('19');
    expect(getAge(4)).toBe('24');
    expect(getAge(5)).toBe('29');

    fireEvent.click(sorter);

    expect(getAge(0)).toBe('30');
    expect(getAge(1)).toBe('29');
    expect(getAge(2)).toBe('25');
    expect(getAge(3)).toBe('24');
    expect(getAge(4)).toBe('19');
    expect(getAge(5)).toBe('20');

    fireEvent.click(sorter);

    expect(getAge(0)).toBe('30');
    expect(getAge(1)).toBe('25');
    expect(getAge(2)).toBe('19');
    expect(getAge(3)).toBe('24');
    expect(getAge(4)).toBe('29');
    expect(getAge(5)).toBe('20');
  });
});
