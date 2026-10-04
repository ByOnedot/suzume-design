import React from 'react';
import { fireEvent, render } from '../../../tests/util';
import Table from '..';
import { columns } from './common/columns';
import { data } from './common/data';
import Tooltip from '../../Tooltip/index';

describe('Table components', () => {
  it('table custom header and body by param components', () => {
    const component = render(
      <Table
        components={{
          table: 'custom-table',
          header: {
            wrapper: 'custom-header-wrapper',
            thead: 'custom-thead',
            row: 'custom-header-tr',
            th: 'custom-th',
            cell: 'custom-th-cell',
          },
          body: {
            wrapper: 'custom-body-wrapper',
            tbody: 'custom-tbody',
            row: 'custom-body-tr',
            td: 'custom-td',
            cell: 'custom-td-cell',
          },
        }}
        scroll={{ y: true }}
        columns={columns}
        data={data}
      />
    );

    expect(
      component.find('custom-header-wrapper custom-table custom-thead custom-header-tr')
    ).toHaveLength(1);
    expect(
      component.find(
        'custom-header-wrapper custom-table custom-thead custom-header-tr custom-th custom-th-cell'
      )
    ).toHaveLength(5);

    expect(
      component.find('custom-body-wrapper custom-table custom-tbody custom-body-tr')
    ).toHaveLength(5);
    expect(
      component.find(
        'custom-body-wrapper custom-table custom-tbody custom-body-tr custom-td custom-td-cell'
      )
    ).toHaveLength(5 * 5);
  });

  it('table custom operations', () => {
    const component = render(
      <Table
        components={{
          header: {
            operations: ({ selectionNode, expandNode }) => [
              {
                node: <th>Index</th>,
                width: 40,
              },
              {
                name: 'selectionNode',
                node: selectionNode,
              },
              {
                name: 'expandNode',
                node: expandNode,
              },
            ],
          },
          body: {
            operations: ({ selectionNode, expandNode }) => [
              {
                node: (record) => {
                  return <td>{record.key}</td>;
                },
                width: 40,
              },
              {
                name: 'selectionNode',
                node: selectionNode,
              },
              {
                name: 'expandNode',
                node: expandNode,
              },
            ],
          },
        }}
        columns={columns}
        data={data}
      />
    );

    expect(component.find('thead th').item(0).textContent).toBe('Index');

    for (let i = 0; i < 5; i++) {
      expect(component.find('tbody tr').item(i).querySelectorAll('td').item(0).textContent).toBe(
        `${i + 1}`
      );
    }
  });

  // operations wrap selectionNode with tooltip should act correctly
  it('Table custom operations selectionNode with tooltip', () => {
    vi.useFakeTimers();

    const component = render(
      <Table
        components={{
          header: {
            operations: ({ selectionNode }) => [
              {
                name: 'selectionNode',
                node: <Tooltip content="123">{selectionNode}</Tooltip>,
              },
            ],
          },
          body: {
            operations: ({ selectionNode }) => [
              {
                name: 'selectionNode',
                node: <Tooltip content="456">{selectionNode}</Tooltip>,
              },
            ],
          },
        }}
        columns={columns}
        data={data}
        rowSelection={{}}
      />
    );
    fireEvent.mouseEnter(component.find('thead .suzume-table-checkbox')[0]);
    vi.isFakeTimers() && vi.runAllTimers();

    expect(component.find('thead .suzume-table-checkbox')[0].className).toBe(
      'suzume-table-th suzume-table-operation suzume-table-checkbox suzume-tooltip-open'
    );
    fireEvent.mouseEnter(component.find('tbody .suzume-table-checkbox').item(0));
    vi.isFakeTimers() && vi.runAllTimers();

    expect(component.find('tbody .suzume-table-checkbox').item(0).className).toBe(
      'suzume-table-td suzume-table-operation suzume-table-checkbox suzume-tooltip-open'
    );
  });

  it('Table custom cell', () => {
    const Cell = vi.fn(({ children }) => children);
    render(
      <Table
        components={{
          body: {
            cell: Cell,
          },
        }}
        columns={columns}
        data={data}
      />
    );

    const { rowData } = Cell.mock.calls[0][0];

    expect(Object.keys(rowData).includes('__ORIGIN_DATA')).toBe(false);
    expect('__ORIGIN_DATA' in rowData).toBe(false);
  });
});
