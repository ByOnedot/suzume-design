import React from 'react';
import { act, fireEvent, render } from '../../../tests/util';
import mountTest from '../../../tests/mountTest';
import componentConfigTest from '../../../tests/componentConfigTest';
import Tag from '..';

mountTest(Tag);
componentConfigTest(Tag, 'Tag');

const mountTag = (props: Record<string, any>) => {
  return render(<Tag {...props}>Hello</Tag>);
};

describe('Tag', () => {
  it('tag with type', () => {
    mountTag({ type: 'white' });
  });

  it('tag with color', () => {
    mountTag({ color: 'white' });
  });

  it('tag with hex color', () => {
    mountTag({ color: '#FFFFFF' });
  });

  it('tag with primary checked/visible value', () => {
    mountTag({
      checked: true,
      visible: true,
    });
  });

  it('close tag', () => {
    const closeHandler = vi.fn();
    const tag = mountTag({
      closable: true,
      onClose: closeHandler,
    });
    fireEvent.click(tag.find('.suzume-icon-close')[0]);
    expect(closeHandler).toBeCalled();
  });

  it('check tag', () => {
    const onCheck = vi.fn();
    const tag = mountTag({
      checkable: true,
      onCheck,
    });
    fireEvent.click(tag.container.firstChild!);
    expect(onCheck).toBeCalled();
  });

  it('async onClose is called while resolve', () => {
    const onClose = vi.fn().mockResolvedValue('resolve');
    const tag = mountTag({
      closable: true,
      onClose,
    });
    fireEvent.click(tag.find('.suzume-icon-close')[0]);
    expect(tag.find('.suzume-tag')[0].className).toContain('suzume-tag-loading');

    return onClose.mock.results[0].value
      .then((msg) => {
        expect(msg).toEqual('resolve');
      })
      .finally(async () => {
        // React 19 defers the update queued from the promise handler.
        await act(async () => {});
        expect(tag.find('.suzume-tag')[0].className).not.toContain('suzume-tag-loading');
        expect(tag.find('.suzume-tag')[0].className).toContain('suzume-tag-hide');
      });
  });

  it('async onClose is called while reject', () => {
    const onClose = vi.fn().mockRejectedValue('reject');
    const tag = mountTag({
      closable: true,
      onClose,
    });
    fireEvent.click(tag.find('.suzume-icon-close')[0]);
    expect(tag.find('.suzume-tag')[0].className).toContain('suzume-tag-loading');

    return onClose.mock.results[0].value
      .catch((msg) => {
        expect(msg).toEqual('reject');
      })
      .finally(async () => {
        // React 19 defers the update queued from the promise handler.
        await act(async () => {});
        expect(tag.find('.suzume-tag')[0].className).not.toContain('suzume-tag-loading');
        expect(tag.find('.suzume-tag')[0].className).not.toContain('suzume-tag-hide');
      });
  });
});
