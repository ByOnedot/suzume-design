import React from 'react';
import { render, fireEvent } from '../../../tests/util';
import mountTest from '../../../tests/mountTest';
import componentConfigTest from '../../../tests/componentConfigTest';
import Transfer from '..';
import { TransferListType, TransferProps } from '../interface';

mountTest(Transfer);
componentConfigTest(Transfer, 'Transfer');

const listCommonProps: TransferProps = {
  dataSource: [
    {
      key: 'a',
      value: 'a',
    },
    {
      key: 'b',
      value: 'b',
    },
    {
      key: 'c',
      value: 'c',
      disabled: true,
    },
  ],
  defaultSelectedKeys: ['a'],
  defaultTargetKeys: ['b'],
};

const listDisabledProps: TransferProps = {
  dataSource: [
    {
      key: 'a',
      value: 'a',
      disabled: true,
    },
    {
      key: 'b',
      value: 'b',
    },
  ],
  defaultSelectedKeys: ['a', 'b'],
};

const sortedTargetKeyProps: TransferProps = {
  dataSource: [
    {
      key: 'a',
      value: 'a',
    },
    {
      key: 'b',
      value: 'b',
    },
    {
      key: 'c',
      value: 'c',
    },
  ],
  defaultTargetKeys: ['c'],
  defaultSelectedKeys: ['c'],
  showFooter: true,
};

function getTransferItemElement(type: TransferListType, index: number) {
  return document.querySelector(
    `.suzume-transfer-view-${type} .suzume-transfer-view-item:nth-child(${index + 1})`
  );
}

function checkAll(type: TransferListType) {
  fireEvent.click(
    document.querySelector(
      `.suzume-transfer-view-${type} .suzume-transfer-view-header .suzume-checkbox`
    )
  );
}

function checkTransferItem(type: TransferListType, index: number) {
  fireEvent.click(
    document.querySelector(
      `.suzume-transfer-view-${type} .suzume-transfer-view-item:nth-child(${
        index + 1
      }) .suzume-checkbox`
    )
  );
}

function searchTransferItem(type: TransferListType, keyword: string) {
  fireEvent.change(
    document.querySelector(`.suzume-transfer-view-${type} .suzume-transfer-view-search input`),
    { target: { value: keyword } }
  );
}

describe('Transfer', () => {
  it('should move selected keys to corresponding list', () => {
    const handleChange = vi.fn();
    const wrapper = render(<Transfer {...listCommonProps} onChange={handleChange} />);
    // move selected keys to target list
    fireEvent.click(wrapper.querySelector('.suzume-transfer-operations button'));
    expect(handleChange).toHaveBeenCalledWith(['a', 'b'], 'target', ['a']);
  });

  it('should move selected keys expected disabled to corresponding list', () => {
    const handleChange = vi.fn();
    const wrapper = render(<Transfer {...listDisabledProps} onChange={handleChange} />);
    // move selected keys to target list
    fireEvent.click(wrapper.querySelector('.suzume-transfer-operations button'));
    expect(handleChange).toHaveBeenCalledWith(['b'], 'target', ['b']);
  });

  it('should uncheck checkbox when click on checked item', () => {
    const handleSelectChange = vi.fn();
    render(<Transfer {...listCommonProps} onSelectChange={handleSelectChange} />);
    checkTransferItem('source', 0);
    expect(handleSelectChange).toHaveBeenLastCalledWith([], []);
  });

  it('should check checkbox when click on unchecked item', () => {
    const handleSelectChange = vi.fn();
    render(<Transfer {...listCommonProps} onSelectChange={handleSelectChange} />);
    checkTransferItem('target', 0);
    expect(handleSelectChange).toHaveBeenLastCalledWith(['a'], ['b']);
  });

  it('should not check checkbox when click on disabled item', () => {
    const handleSelectChange = vi.fn();
    render(<Transfer {...listCommonProps} onSelectChange={handleSelectChange} />);
    fireEvent.click(getTransferItemElement('source', 1));
    expect(handleSelectChange).not.toHaveBeenCalled();
  });

  it('should check all item when click on check all', () => {
    const handleSelectChange = vi.fn();
    render(<Transfer {...listCommonProps} onSelectChange={handleSelectChange} />);
    checkAll('target');
    expect(handleSelectChange).toHaveBeenCalledWith(['a'], ['b']);
  });

  it('should uncheck all item when click on uncheck all', () => {
    const handleSelectChange = vi.fn();
    render(<Transfer {...listCommonProps} onSelectChange={handleSelectChange} />);
    checkAll('source');
    expect(handleSelectChange).toHaveBeenCalledWith([], []);
  });

  it('should only check all filtered items when click on check all and there is a search text', () => {
    const handleSelectChange = vi.fn();
    render(<Transfer {...sortedTargetKeyProps} showSearch onSelectChange={handleSelectChange} />);
    searchTransferItem('source', 'a');
    checkAll('source');
    expect(handleSelectChange).toHaveBeenCalledWith(['a'], ['c']);
  });

  it('should only uncheck all filtered items when click on uncheck all and there is a search text', () => {
    const handleSelectChange = vi.fn();
    render(<Transfer {...sortedTargetKeyProps} showSearch onSelectChange={handleSelectChange} />);
    checkAll('source');
    searchTransferItem('source', 'a');
    checkAll('source');
    expect(handleSelectChange).toHaveBeenCalledWith(['b'], ['c']);
  });

  it('should call `onSearch` when use input in search box', () => {
    const onSearch = vi.fn();
    const wrapper = render(<Transfer {...listCommonProps} showSearch onSearch={onSearch} />);
    searchTransferItem('source', 'a');
    expect(
      wrapper.querySelectorAll('.suzume-transfer-view-source .suzume-transfer-view-item')
    ).toHaveLength(1);
    expect(onSearch).toBeCalled();
  });

  it('should check correctly when there is a search text', () => {
    const newProps = { ...listCommonProps };
    delete newProps.defaultSelectedKeys;
    const handleSelectChange = vi.fn();
    render(
      <Transfer
        {...newProps}
        showSearch
        onSelectChange={handleSelectChange}
        render={(item) => item.value}
      />
    );
    checkTransferItem('target', 0);
    expect(handleSelectChange).toHaveBeenLastCalledWith([], ['b']);

    searchTransferItem('source', 'a');
    checkAll('source');
    expect(handleSelectChange).toHaveBeenLastCalledWith(['a'], ['b']);
  });

  it('should show sorted target key', () => {
    const wrapper = render(<Transfer {...sortedTargetKeyProps} render={(item) => item.value} />);
    fireEvent.click(wrapper.querySelectorAll('.suzume-transfer-operations button')[1]);
    expect(wrapper.querySelector('.suzume-transfer-view-header-unit')).toHaveTextContent('0 / 3');
  });

  it('should add custom styles when their props are provided', () => {
    const style = {
      backgroundColor: 'red',
    };
    const listStyle = {
      backgroundColor: 'blue',
    };
    const operationStyle = {
      backgroundColor: 'yellow',
    };

    const wrapper = render(
      <Transfer
        {...listCommonProps}
        style={style}
        listStyle={listStyle}
        operationStyle={operationStyle}
      />
    );

    // jsdom >= 20 resolves named colours to their rgb() form in computed style.
    expect(getComputedStyle(wrapper.querySelector('.suzume-transfer')).backgroundColor).toBe(
      'rgb(255, 0, 0)'
    );
    expect(
      getComputedStyle(wrapper.querySelector('.suzume-transfer-view-source')).backgroundColor
    ).toBe('rgb(0, 0, 255)');
    expect(
      getComputedStyle(wrapper.querySelector('.suzume-transfer-view-target')).backgroundColor
    ).toBe('rgb(0, 0, 255)');
    expect(
      getComputedStyle(wrapper.querySelector('.suzume-transfer-operations')).backgroundColor
    ).toBe('rgb(255, 255, 0)');
  });

  it('titleTexts works', () => {
    const component = render(
      <Transfer
        {...listCommonProps}
        titleTexts={[
          'LEFT',
          ({ countTotal, countSelected }) => `RIGHT ${countSelected}-${countTotal}`,
        ]}
      />
    );
    const headers = component.querySelectorAll('.suzume-transfer-view-header');
    expect(headers[0]).toHaveTextContent('LEFT1 / 2');
    expect(headers[1]).toHaveTextContent('RIGHT 0-1');
  });

  it('simple retainSelectedItems works', () => {
    const onChange = vi.fn();
    const component = render(
      <Transfer {...listCommonProps} simple={{ retainSelectedItems: true }} onChange={onChange} />
    );

    expect(component.find('.suzume-transfer-view-source .suzume-transfer-view-item')).toHaveLength(
      3
    );
    expect(component.find('.suzume-transfer-view-target .suzume-transfer-view-item')).toHaveLength(
      2
    );

    // 取消选中 a
    checkTransferItem('source', 0);
    expect(onChange).toBeCalledWith(['b'], 'source', ['a']);

    // re-select item [a]
    checkTransferItem('source', 0);
    expect(onChange).toBeCalledWith(['a', 'b'], 'target', ['a']);
  });

  it('callback of draggable item', () => {
    const onDragStart = vi.fn();
    const onDragEnd = vi.fn();
    const onDragOver = vi.fn();
    const onDragLeave = vi.fn();
    const onDrop = vi.fn();

    const component = render(
      <Transfer
        dataSource={[
          { key: 'a', value: 'a' },
          { key: 'b', value: 'b' },
          { key: 'c', value: 'c' },
        ]}
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      />
    );
    const itemClassName = '.suzume-transfer-view-source .suzume-transfer-view-item';
    const item = component.querySelector(itemClassName);

    fireEvent.dragStart(item);
    expect(onDragStart).toBeCalled();

    fireEvent.dragOver(item);
    expect(onDragOver).toBeCalled();

    fireEvent.dragLeave(item);
    expect(onDragLeave).toBeCalled();

    fireEvent.drop(component.find(itemClassName)[1]);
    expect(onDrop).toBeCalled();

    fireEvent.dragEnd(item);
    expect(onDragEnd).toBeCalled();
  });

  it('Pass different properties to transfer list by array', () => {
    const component = render(
      <Transfer
        dataSource={[]}
        listStyle={[{ height: 200 }, { height: 400 }]}
        showSearch={[{ placeholder: 'Placeholder 1' }, { placeholder: 'Placeholder 2' }]}
        showFooter={[false, true]}
        pagination={[false, true]}
      />
    );
    const [source, target] = Array.prototype.slice.call(
      component.querySelectorAll('.suzume-transfer-view')
    );
    expect(
      source.querySelector('.suzume-transfer-view-search input').getAttribute('placeholder')
    ).toBe('Placeholder 1');
    expect(
      target.querySelector('.suzume-transfer-view-search input').getAttribute('placeholder')
    ).toBe('Placeholder 2');
    expect(source.querySelector('.suzume-list-footer')).toBeFalsy();
    expect(target.querySelector('.suzume-list-footer')).toBeTruthy();
    expect(source.querySelector('.suzume-pagination')).toBeFalsy();
    expect(target.querySelector('.suzume-pagination')).toBeTruthy();
    expect(getComputedStyle(source).height).toBe('200px');
    expect(getComputedStyle(target).height).toBe('400px');
  });
});
