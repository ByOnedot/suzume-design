import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, fireEvent } from '../../../tests/util';
import mountTest from '../../../tests/mountTest';
import componentConfigTest from '../../../tests/componentConfigTest';
import Button from '..';
import { ConfigProvider } from '../..';

mountTest(Button);
componentConfigTest(Button, 'Button');
componentConfigTest(Button.Group, 'Button.Group');

describe('button', () => {
  it('click callback correctly', () => {
    const mockFn = vi.fn();
    const component = render(<Button onClick={mockFn} />);
    const button = component.querySelector('button') as HTMLElement;
    fireEvent.click(button);
    const mockFnCallLength = mockFn.mock.calls.length;
    expect(mockFnCallLength).toBe(1);

    component.rerender(<Button onClick={mockFn} disabled />);

    fireEvent.click(button);
    expect(mockFn.mock.calls.length).toBe(mockFnCallLength);
  });

  it('render multiple children correctly', () => {
    const { container } = render(
      <Button>
        1{'  '}2{'  '}3{'  '}
      </Button>
    );
    expect(container.firstElementChild?.textContent).toEqual('1  2  3  ');
  });

  it('use context autoInsertSpaceInButton correctly', () => {
    const mockText = '测试';

    // The context is provided through `ConfigProvider` rather than by patching
    // `React.useContext`: React 19's ESM build binds `useContext` as a module
    // import, so reassigning the namespace export no longer reaches components.
    const button = render(
      <ConfigProvider prefixCls="test" autoInsertSpaceInButton>
        <Button>{mockText}</Button>
      </ConfigProvider>
    );

    expect(button.querySelector('.test-btn')).toHaveClass('test-btn-two-chinese-chars');
  });

  it('render href type correctly', () => {
    const button = render(
      <Button type="primary" href="https://byonedot.in">
        测试
      </Button>
    );
    expect(button.find('button')).toHaveLength(0);
    expect(button.find('a')).toHaveLength(1);
    expect(button.querySelector('a')?.getAttribute('href')).not.toBeUndefined();

    act(() => {
      button.rerender(<Button type="primary" href="https://byonedot.in" disabled />);
    });

    expect(button.querySelector('a')?.getAttribute('href')).toBeNull();
  });
});
