import React from 'react';
import { act } from '../../../tests/util';
import { Form, Input } from '../..';
import { sleep, render, fireEvent } from '../../../tests/util';

describe('validate form', () => {
  it('validate trigger in form', async () => {
    let form;

    const mockClickFn = vi.fn();
    const mockBlurFn = vi.fn();
    const mockChangeFn = vi.fn();

    const wrapper = render(
      <Form ref={(node) => (form = node)} validateTrigger="onBlur" style={{ width: 600 }}>
        <Form.Item
          label="Username"
          field="name"
          required
          rules={[
            {
              validateTrigger: 'onClick',
              validator: mockClickFn,
            },
            {
              validateTrigger: ['onFocus', 'onBlur'],
              validator: mockBlurFn,
            },
            {
              validator: mockChangeFn,
            },
          ]}
        >
          <Input placeholder="please enter your username" />
        </Form.Item>
      </Form>
    );

    const input = wrapper.find('input')[0];
    act(() => {
      fireEvent.click(input);
    });
    await sleep(10);
    expect(mockClickFn).toHaveBeenCalledTimes(1);
    expect(mockChangeFn).toHaveBeenCalledTimes(0);
    expect(mockBlurFn).toHaveBeenCalledTimes(0);

    act(() => {
      fireEvent.focus(input);
    });
    await sleep(10);
    expect(mockBlurFn).toHaveBeenCalledTimes(1);
    act(() => {
      fireEvent.blur(input);
    });
    await sleep(10);
    expect(mockBlurFn).toHaveBeenCalledTimes(2);
    expect(mockChangeFn).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.change(input, {
        target: {
          value: 'Hello',
        },
      });
    });
    await sleep(10);
    expect(mockChangeFn).toHaveBeenCalledTimes(1);
    expect(mockBlurFn).toHaveBeenCalledTimes(2);
    expect(mockClickFn).toHaveBeenCalledTimes(1);

    form.submit();
    await sleep(10);
    // 全部执行
    expect(mockChangeFn).toHaveBeenCalledTimes(2);
    expect(mockBlurFn).toHaveBeenCalledTimes(3);
    expect(mockClickFn).toHaveBeenCalledTimes(2);
  });

  it('validate trigger in rules', async () => {
    let form;

    const mockClickFn = vi.fn();
    const mockBlurFn = vi.fn();
    const mockChangeFn = vi.fn();

    const wrapper = render(
      <Form ref={(node) => (form = node)} style={{ width: 600 }}>
        <Form.Item
          label="Username"
          field="name"
          required
          rules={[
            {
              validateTrigger: 'onClick',
              validator: mockClickFn,
            },
            {
              validateTrigger: ['onFocus', 'onBlur'],
              validator: mockBlurFn,
            },
            {
              validator: mockChangeFn,
            },
          ]}
        >
          <Input placeholder="please enter your username" />
        </Form.Item>
      </Form>
    );

    const input = wrapper.find('input')[0];
    act(() => {
      fireEvent.click(input);
    });
    await sleep(10);
    expect(mockClickFn).toHaveBeenCalledTimes(1);
    expect(mockChangeFn).toHaveBeenCalledTimes(0);
    expect(mockBlurFn).toHaveBeenCalledTimes(0);

    act(() => {
      fireEvent.focus(input);
    });
    await sleep(10);
    expect(mockBlurFn).toHaveBeenCalledTimes(1);
    act(() => {
      fireEvent.blur(input);
    });
    await sleep(10);
    expect(mockBlurFn).toHaveBeenCalledTimes(2);
    expect(mockChangeFn).toHaveBeenCalledTimes(0);

    act(() => {
      fireEvent.change(input, {
        target: {
          value: 'Hello',
        },
      });
    });
    await sleep(10);
    expect(mockChangeFn).toHaveBeenCalledTimes(1);
    expect(mockBlurFn).toHaveBeenCalledTimes(2);
    expect(mockClickFn).toHaveBeenCalledTimes(1);

    form.submit();
    await sleep(10);
    // 全部执行
    expect(mockChangeFn).toHaveBeenCalledTimes(2);
    expect(mockBlurFn).toHaveBeenCalledTimes(3);
    expect(mockClickFn).toHaveBeenCalledTimes(2);
  });

  it('validateLevel in rules', async () => {
    let form;
    const wrapper = render(
      <Form ref={(node) => (form = node)} style={{ width: 600 }}>
        <Form.Item
          label="url"
          field="url"
          required
          rules={[
            {
              type: 'email',
              validateLevel: 'warning',
            },
            {
              required: true,
              type: 'string',
              minLength: 6,
            },
          ]}
        >
          <Input placeholder="please enter your username" />
        </Form.Item>
      </Form>
    );

    const input = wrapper.find('input')[0];
    act(() => {
      fireEvent.change(input, {
        target: {
          value: 'Hello',
        },
      });
    });

    await sleep(100);

    expect(wrapper.querySelector('.suzume-form-message')?.innerHTML).toBe(
      '<div role="alert">字符数最少为 6</div><div role="alert" class="suzume-form-message-help-warning">url 不是合法的邮箱地址</div>'
    );
    expect(wrapper.find('.suzume-form-message-help-warning')).toHaveLength(1); // warning 信息

    act(() => {
      fireEvent.change(input, {
        target: {
          value: 'Helloo',
        },
      });
    });
    await sleep(10);

    expect(wrapper.find('.suzume-form-item-status-error')).toHaveLength(0);
    expect(wrapper.find('.suzume-form-message-help-warning')).toHaveLength(1);

    act(() => {
      form.setFields({
        url: {
          warning: 'hahahaha',
        },
      });
    });
    expect(wrapper.find('.suzume-form-message-help-warning')[0].textContent).toBe('hahahaha');
  });

  it('validate messages', async () => {
    const wrapper = render(
      <Form
        validateMessages={{
          required: (_, { label }) => `必须填写 ${label}`,
          string: {
            length: `字符数必须是 #{length}`,
            match: `不匹配正则 #{pattern}`,
          },
        }}
      >
        <Form.Item
          label="Username"
          field="name"
          required
          rules={[
            {
              type: 'string',
              required: true,
              length: 3,
              match: /abc/,
            },
          ]}
        >
          <Input placeholder="please enter your username" />
        </Form.Item>
      </Form>
    );

    const input = wrapper.find('input')[0];

    act(() => {
      fireEvent.change(input, {
        target: {
          value: 'Hello',
        },
      });
    });
    await sleep(10);

    expect(wrapper.find('.suzume-form-message')[0].children[0].textContent).toBe('字符数必须是 3');

    act(() => {
      fireEvent.change(input, {
        target: {
          value: '',
        },
      });
    });
    await sleep(10);

    expect(wrapper.find('.suzume-form-message')[0].children[0].textContent).toBe(
      '必须填写 Username'
    );

    act(() => {
      fireEvent.change(input, {
        target: {
          value: '123',
        },
      });
    });
    await sleep(10);

    expect(wrapper.find('.suzume-form-message')[0].children[0].textContent).toBe(
      '不匹配正则 /abc/'
    );
  });

  it('validateonly', async () => {
    let form;
    const wrapper = render(
      <Form ref={(node) => (form = node)}>
        <Form.Item
          label="Username"
          field="name"
          required
          rules={[
            {
              type: 'string',
              required: true,
            },
          ]}
        >
          <Input placeholder="please enter your username" />
        </Form.Item>
        <Form.Item label="Password" field="password" required>
          <Input placeholder="please enter your password" />
        </Form.Item>
      </Form>
    );

    await act(async () => {
      try {
        await form.validate({ validateOnly: true });
      } catch {
        //
      }
    });

    expect(wrapper.find('.suzume-form-message')).toHaveLength(0);

    await act(async () => {
      try {
        await form.validate();
      } catch {
        //
      }
    });

    expect(wrapper.find('.suzume-form-message')).toHaveLength(1);
  });
});
