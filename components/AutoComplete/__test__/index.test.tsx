import React from 'react';
import { render, fireEvent } from '../../../tests/util';
import { ArrowDown, ArrowUp, Enter, Esc } from '../../_util/keycode';
import mountTest from '../../../tests/mountTest';
import componentConfigTest from '../../../tests/componentConfigTest';
import AutoComplete from '..';
import Input from '../../Input';

const { TextArea } = Input;

mountTest(AutoComplete);
componentConfigTest(AutoComplete, 'AutoComplete');

function mountAutoComplete(component: React.ReactElement) {
  return render(component);
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('AutoComplete', () => {
  it('AutoComplete simple use correctly', () => {
    const wrapper = mountAutoComplete(
      <AutoComplete
        placeholder="请输入城市"
        data={[
          '北京',
          '上海',
          '深圳',
          {
            name: '杭州',
            value: '杭州',
          },
        ]}
        triggerElement={<TextArea style={{ width: 520, height: 96 }} />}
      />
    );
    fireEvent.focus(wrapper.find('textarea')[0]);
    expect(wrapper.find('.suzume-trigger')).toHaveLength(1);
  });

  it('AutoComplete with children', () => {
    const wrapper = mountAutoComplete(
      <AutoComplete>
        <AutoComplete.Option value="beijing">Beijing</AutoComplete.Option>
        <AutoComplete.Option value="shanghai">Shanghai</AutoComplete.Option>
      </AutoComplete>
    );
    fireEvent.focus(wrapper.find('input')[0]);
    expect(wrapper.find('.suzume-trigger')).toHaveLength(1);
  });

  it('AutoComplete callback correctly', () => {
    const onSearch = vi.fn();
    const onSelect = vi.fn();
    const onChange = vi.fn();
    const onFocus = vi.fn();
    const onKeyDown = vi.fn();
    const onPressEnter = vi.fn();
    const onInputChange = vi.fn();

    const wrapper = mountAutoComplete(
      <AutoComplete
        placeholder="请输入城市"
        data={['北京', '上海', '深圳', '杭州']}
        style={{ width: 260, marginRight: 20, marginBottom: 20 }}
        onSearch={onSearch}
        onSelect={onSelect}
        onChange={onChange}
        onFocus={onFocus}
        inputProps={{
          onKeyDown,
          onChange: onInputChange,
        }}
        onPressEnter={onPressEnter}
      />
    );
    fireEvent.focus(wrapper.find('input')[0]);
    expect(onFocus).toBeCalled();
    fireEvent.change(wrapper.find('input')[0], {
      target: {
        value: '上',
      },
    });
    expect(onSearch).toBeCalled();
    expect(onChange).toBeCalled();
    expect(onInputChange).toBeCalled();
    fireEvent.keyDown(wrapper.find('input')[0], { keyCode: Enter.code });
    expect(onPressEnter).toBeCalled();

    fireEvent.click(wrapper.find('.suzume-select-option').item(0));
    expect(onSelect).toBeCalled();
  });

  it('keyboard events correctly', () => {
    const wrapper = mountAutoComplete(
      <AutoComplete
        placeholder="请输入城市"
        data={['北京', '上海', '深圳', '杭州']}
        style={{ width: 260, marginRight: 20, marginBottom: 20 }}
      />
    );
    fireEvent.focus(wrapper.find('input')[0]);
    fireEvent.keyDown(wrapper.find('input')[0], { keyCode: ArrowDown.code });
    expect(wrapper.find('.suzume-select-option-hover')[0].innerHTML).toBe('上海');
    fireEvent.keyDown(wrapper.find('input')[0], { keyCode: ArrowUp.code });

    expect(wrapper.find('.suzume-select-option-hover')[0].innerHTML).toBe('北京');
    fireEvent.keyDown(wrapper.find('input')[0], { keyCode: Enter.code });
    fireEvent.keyDown(wrapper.find('input')[0], { keyCode: Esc.code });
    expect(wrapper.find<HTMLInputElement>('input')[0].value).toBe('北京');
  });
});
