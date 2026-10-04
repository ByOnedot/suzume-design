import { vi } from 'vitest';
import { act, cleanup } from '@testing-library/react';

/**
 * React schedules its own work on the event loop, outside the fake clock, so
 * advancing the clock on its own used to leave renders pending and component
 * exit transitions unfinished. Running timer advances inside `act()` queues
 * that work on React's act queue and flushes it synchronously - the suites
 * then observe the DOM exactly like they did under Jest.
 */
const wrapTimerAdvance = (method: 'runAllTimers' | 'runOnlyPendingTimers' | 'advanceTimersByTime' | 'advanceTimersToNextTimer' | 'advanceTimersToNextFrame') => {
  const original = vi[method] as (...args: unknown[]) => unknown;
  if (typeof original !== 'function') return;
  // The helpers that *drain* a queue are safe to run twice - the second call
  // picks up timers the React commit scheduled after the first `act` returned.
  // The helpers that take an explicit amount of time are not: running them
  // twice would move the clock by twice what the test asked for.
  const isDrain = method === 'runAllTimers' || method === 'runOnlyPendingTimers';
  (vi as unknown as Record<string, unknown>)[method] = (...args: unknown[]) => {
    // Some suites drive a real clock on purpose (an interval they want to wait
    // out) and still call an advance helper to flush a transition. Advancing a
    // real clock is a no-op rather than an error.
    if (!vi.isFakeTimers()) return undefined;
    let result: unknown;
    for (let pass = 0; pass < 2; pass++) {
      act(() => {
        if (pass === 0 || isDrain) result = original.apply(vi, args);
      });
    }
    return result;
  };
};

(['runAllTimers', 'runOnlyPendingTimers', 'advanceTimersByTime', 'advanceTimersToNextTimer', 'advanceTimersToNextFrame'] as const).forEach(
  wrapTimerAdvance
);

// React 18/19 only honours `act()` when this flag is set. RTL sets it while it
// renders, but the suites also flush work from imperative APIs (Message,
// Notification, Modal.confirm) in their own hooks.
(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * Shared test bootstrap (previously `tests/setup.js` under Jest).
 *
 * Everything here is environment set-up for the components under test - there
 * is no Enzyme adapter any more because the suite renders with
 * `@testing-library/react`.
 */

// Components debounce user input; tests drive them with fake timers, so the
// real throttle/throttle-by-raf implementation must not swallow calls.
vi.mock('lodash/debounce', () => ({
  // `lodash/debounce` is consumed with a default import, so the factory has to
  // expose `default` for Vitest's ESM interop.
  default: vi.fn(function (fn: (...args: unknown[]) => void, time?: number) {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    function cancel() {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    }
    function wrapper(this: unknown, ...args: unknown[]) {
      cancel();
      timeoutId = setTimeout(() => {
        timeoutId = null;
        fn.apply(this, args);
      }, time);
    }
    wrapper.cancel = cancel;
    return wrapper;
  }),
}));

if (typeof window !== 'undefined') {
  // jsdom does not implement SVGElement.getBBox, but resize-observer-polyfill
  // (used by Trigger / Carousel / OverflowEllipsis) treats every SVG element as
  // an SVGGraphicsElement and calls it, which escapes as an uncaught error
  // instead of a normal measurement.
  const svgProto = window.SVGElement && window.SVGElement.prototype;
  if (svgProto && typeof svgProto.getBBox !== 'function') {
    Object.defineProperty(svgProto, 'getBBox', {
      configurable: true,
      writable: true,
      value: () => ({ x: 0, y: 0, width: 0, height: 0 }),
    });
  }

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Explicit, deterministic cleanup.
//
// 1. RTL tears down the tree it rendered.
// 2. The imperative notice APIs (Message / Notification) own detached React
//    roots that RTL knows nothing about, so they are cleared explicitly.
// 3. Notice dismissal is timer + transition driven; flush both, then flush
//    React, so no DOM from the previous test can leak into the next one.
afterEach(async () => {
  cleanup();

  const { Message, Notification } = await import('../components/index');
  Message.clear();
  Notification.clear();

  // Drain pending work on the clock the test created. Modal / notice exits
  // are timer driven and their teardown schedules a further timer, so two
  // bounded passes (with a React flush in between) are needed. Bounded
  // advances are used instead of `runAllTimers` because several suites leave
  // a repeating timer behind, which would spin that helper forever.
  // Re-installing the clock *first* would drop the pending exit timers and
  // leak the previous test's DOM into this one.
  if (vi.isFakeTimers()) {
    vi.advanceTimersByTime(2000);
  }
  await act(async () => {});
  if (vi.isFakeTimers()) {
    vi.advanceTimersByTime(2000);
  }
  await act(async () => {});
  vi.useFakeTimers();
  vi.runAllTimers();
  await act(async () => {});
  vi.useRealTimers();
});
