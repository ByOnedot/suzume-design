import React from 'react';
import { act } from '../../../tests/util';
import Typography from '..';
import IconCopy from '../../../icon/react-icon/IconCopy';
import { sleep, render, fireEvent } from '../../../tests/util';
import copy from '../../_util/clipboard';

const { Title, Text, Paragraph } = Typography;

vi.mock('../../_util/clipboard', async () => {
  const originalModule = await vi.importActual<typeof import('../../_util/clipboard')>(
    '../../_util/clipboard'
  );

  return {
    __esModule: true,
    ...originalModule,
    default: vi.fn(),
  };
});

describe('Typography', () => {
  it('basic bold', () => {
    const wrapper = render(<Text bold mark code underline delete />);
    expect(wrapper.find('.suzume-typography')).toHaveLength(1);
    expect(wrapper.find('b')).toHaveLength(1);
    expect(wrapper.find('mark')).toHaveLength(1);
    expect(wrapper.find('code')).toHaveLength(1);
    expect(wrapper.find('u')).toHaveLength(1);
    expect(wrapper.find('del')).toHaveLength(1);
  });

  it('basic title Render', () => {
    const wrapper = render(<Title heading={1}>Basic Title</Title>);
    expect(wrapper.find('h1')).toHaveLength(1);

    act(() => {
      wrapper.rerender(<Title heading={3}>Basic Title</Title>);
    });

    expect(wrapper.find('h3')).toHaveLength(1);
  });

  it('specal Paragraph render', () => {
    const wrapper = render(
      <Paragraph className="paragraph-test" spacing="close">
        Paragraph with customize className
      </Paragraph>
    );

    expect(wrapper.find('.suzume-typography')[0].classList.contains('paragraph-test')).toBeTruthy();
    expect(
      wrapper.find('.suzume-typography')[0].classList.contains('suzume-typography-spacing-close')
    ).toBeTruthy();
  });

  it('support copyable', async () => {
    const onCopy = vi.fn();
    const wrapper = render(<Text copyable={{ onCopy, icon: <IconCopy /> }}>copyable test</Text>);
    expect(wrapper.find('.suzume-icon-copy')).toHaveLength(1);

    act(() => {
      fireEvent.click(wrapper.find('.suzume-typography-operation-copy')[0]);
    });

    expect(copy).toHaveBeenCalled();
    expect(onCopy).toHaveBeenCalled();

    await act(async () => {
      sleep(3000);
    });

    expect(wrapper.find('.suzume-icon-copy')).toHaveLength(0);
    expect(wrapper.find('.suzume-icon-check-circle-fill')).toHaveLength(1);
  });

  it('support editable correctly', () => {
    const beforeText = 'editable text';
    const afterText = 'after-edited text';

    const onStart = vi.fn();
    const onEnd = vi.fn();
    const onChange = vi.fn();
    const wrapper = render(
      <Paragraph editable={{ onChange, onStart, onEnd }}>{beforeText}</Paragraph>
    );
    act(() => {
      fireEvent.click(wrapper.find('.suzume-typography-operation-edit')[0]);
    });

    expect(onStart).toHaveBeenCalledTimes(1);
    expect(wrapper.find('.suzume-textarea')).toHaveLength(1);

    act(() => {
      fireEvent.change(wrapper.find('.suzume-textarea')[0], { target: { value: afterText } });
    });
    expect(onChange.mock.calls[0][0]).toEqual(afterText);
    act(() => {
      fireEvent.blur(wrapper.find('.suzume-textarea')[0]);
      wrapper.rerender(<Paragraph editable={{ onChange, onStart, onEnd }}>{afterText}</Paragraph>);
    });
    expect(onEnd).toHaveBeenCalledTimes(1);
    expect(wrapper.find('.suzume-typography')[0]).toHaveTextContent(afterText);
  });
});
