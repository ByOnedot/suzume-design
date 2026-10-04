import React from 'react';
import { fireEvent, render, sleep, $ } from '../../../tests/util';
import mountTest from '../../../tests/mountTest';
import Popconfirm from '..';

mountTest(Popconfirm);

describe('Popconfirm', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('render correctly', () => {
    const component = render(
      <Popconfirm title="Are you OK?">
        <span>Edit</span>
      </Popconfirm>
    );

    const triggerEle = component.find('span')[0];

    expect(component.find('.suzume-popconfirm').length).toBe(0);

    fireEvent.click(triggerEle);

    expect(component.find('.suzume-popconfirm').length).toBe(1);
    expect(component.find('.suzume-popconfirm-title-text')[0].innerHTML).toBe('Are you OK?');
  });

  it('onOk and onCancel correctly', async () => {
    const onOk = vi.fn();
    const onCancel = vi.fn();
    const component = render(
      <Popconfirm title="Are you OK?" onOk={onOk} onCancel={onCancel}>
        <span>Edit</span>
      </Popconfirm>
    );

    const triggerEle = component.find('span')[0];

    fireEvent.click(triggerEle);

    expect($('.suzume-popconfirm').length).toBe(1);

    // onCancel
    fireEvent.click(component.find('button').item(0));

    expect(onCancel).toBeCalled();

    await sleep(400);

    expect($('.suzume-popconfirm').length).toBe(0);

    fireEvent.click(triggerEle);

    expect($('.suzume-popconfirm').length).toBe(1);

    // onOk
    fireEvent.click(component.find('button').item(1));

    expect(onOk).toBeCalled();

    await sleep(400);

    expect($('.suzume-popconfirm').length).toBe(0);
  });

  it('Async close correctly', async () => {
    const onOk = vi.fn();
    const asyncOnOk = async () => {
      await sleep(300);
      onOk();
    };
    const component = render(
      <Popconfirm title="Are you OK?" onOk={asyncOnOk}>
        <span>Edit</span>
      </Popconfirm>
    );

    const triggerEle = component.find('span')[0];

    fireEvent.click(triggerEle);

    fireEvent.click(component.find('Button').item(1));

    expect($('.suzume-popconfirm').length).toBe(1);
    expect(onOk).not.toBeCalled();

    await sleep(700);

    expect($('.suzume-popconfirm').length).toBe(0);
    expect(onOk).toBeCalled();
  });
});
