import { renderHook } from '@testing-library/react';
import { sleep } from '../../../../tests/util';
import useWatermark from '..';

describe('useWatermark', () => {
  it('basic', async () => {
    // `renderHook` from `@testing-library/react` mounts its own container in
    // `document.body`. The watermark element itself is created from a promise,
    // so it cannot exist yet at this point - the count taken here is therefore
    // the baseline, and the assertion below measures the hook's own element.
    renderHook(() => {
      return useWatermark({ content: 'Suzume', getContainer: () => document.body });
    });
    const before = document.body.children.length;

    await sleep(5);

    expect(document.body.children.length).toBe(before + 1);
  });
});
