import React from 'react';
import dayjs from 'dayjs';
import { render, cleanup } from '../../../tests/util';
import Statistic from '..';
import mountTest from '../../../tests/mountTest';

const Countdown = Statistic.Countdown;

mountTest(Countdown);

const now = dayjs();
const countdownTime = now
  .add(1, 'day')
  .add(1, 'hour')
  .add(1, 'minute')
  .add(10, 'second')
  .add(500, 'millisecond');

describe('Statistic.Countdown', () => {
  it('format', () => {
    const formats = [
      ['HH:mm:ss', '25:01:10'],
      ['HH:mm:ss:SSS', '25:01:10:500'],
      ['DD HH:mm:ss:SSS', '01 01:01:10:500'],
    ];

    formats.forEach(([format, value]) => {
      const component = render(
        <Countdown start={false} now={now} value={countdownTime} format={format} />
      );

      expect(component.find('.suzume-statistic-value')[0].innerHTML).toBe(value);
      cleanup();
    });
  });

  it('onFinish', () => {
    // The countdown ticks against `getNow()`, i.e. the wall clock, which the
    // shared config deliberately leaves real so component ids stay stable.
    // Opt into a faked `Date` here, anchored to the `now` the rest of this
    // file was built from, so `runAllTimers` can walk it to zero instead of
    // spinning on an interval that real time never reaches.
    vi.useFakeTimers({
      toFake: [
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'setImmediate',
        'clearImmediate',
        'requestAnimationFrame',
        'cancelAnimationFrame',
        'performance',
        'Date',
      ],
    });
    vi.setSystemTime(now.valueOf());
    const onFinish = vi.fn();
    const component = render(
      <Countdown
        start={false}
        now={now}
        value={now.add(1, 'second')}
        format="HH:mm:ss"
        onFinish={onFinish}
      />
    );

    expect(component.find('.suzume-statistic-value')[0].innerHTML).toBe('00:00:01');

    component.rerender(
      <Countdown
        start
        now={now}
        value={now.add(1, 'second')}
        format="HH:mm:ss"
        onFinish={onFinish}
      />
    );
    vi.isFakeTimers() && vi.runAllTimers();

    expect(component.find('.suzume-statistic-value')[0].innerHTML).toBe('00:00:00');
    expect(onFinish).toBeCalled();
  });

  it('renderFormat correctly', () => {
    function formatTest(format, value, diff) {
      const mockRender = vi.fn().mockImplementation((a, b) => `${a}-${b}`);
      const component = render(
        <Countdown
          start={false}
          now={now}
          value={countdownTime}
          format={format}
          renderFormat={mockRender}
        />
      );

      expect(mockRender.mock.calls.length).toBe(1);
      expect(component.find('.suzume-statistic-value')[0].innerHTML).toEqual(`${diff}-${value}`);
      cleanup();
    }

    const formats = [
      ['HH:mm:ss', '25:01:10', dayjs(countdownTime).diff(now)],
      ['HH:mm:ss:SSS', '25:01:10:500', dayjs(countdownTime).diff(now)],
      ['DD HH:mm:ss:SSS', '01 01:01:10:500', dayjs(countdownTime).diff(now)],
    ];

    formats.forEach(([format, value, diff]) => formatTest(format, value, diff));
  });
});
