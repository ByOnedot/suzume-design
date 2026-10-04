import React from 'react';
import mountTest from '../../../tests/mountTest';
import componentConfigTest from '../../../tests/componentConfigTest';
import Alert from '..';
import { fireEvent, render } from '../../../tests/util';

mountTest(Alert);
componentConfigTest(Alert, 'Alert');

describe('Alert', () => {
  it('showIcon correctly', () => {
    const alert = render(<Alert type="error" title="Error" content="Content~" />);

    expect(alert.find('.suzume-icon-close-circle-fill').length).toBe(1);
  });

  it('onClose and afterClose', () => {
    const closeFn = vi.fn();
    const afterCloseFn = vi.fn();
    const alert = render(
      <Alert
        closable
        onClose={closeFn}
        afterClose={afterCloseFn}
        type="info"
        title="Title"
        content="Content"
      />
    );

    vi.useFakeTimers();
    fireEvent.click(alert.find('.suzume-alert-close-btn')[0]);

    expect(closeFn.mock.calls.length).toBe(1);
    vi.isFakeTimers() && vi.runAllTimers();
    expect(afterCloseFn.mock.calls.length).toBe(1);
  });
});
