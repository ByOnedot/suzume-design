import mountTest from '../../../tests/mountTest';
import Modal from '..';
import { act } from '../../../tests/util';

mountTest(Modal);

/*
 * 测试config方法
 */

describe('Modal popup test', () => {
  beforeEach(() => {
    Modal.config({
      prefixCls: 'aaa',
      simple: false,
    });
  });

  afterEach(async () => {
    Modal.config({
      prefixCls: 'suzume',
      simple: true,
    });
  });

  it('render correctly', async () => {
    vi.useFakeTimers();
    Modal.info({ title: 123 });
    vi.isFakeTimers() && vi.runAllTimers();
    // React 18+ schedules the notice exit transition; flush it so the
    // DOM is clean before the next test starts.
    await act(async () => {});

    expect(document.querySelectorAll('.aaa-modal').length).toBe(1);
    expect(document.querySelectorAll('.aaa-modal-simple').length).toBe(0);
  });
});
