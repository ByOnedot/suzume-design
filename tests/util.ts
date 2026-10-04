import { render as ORender, RenderOptions, act as rtlAct } from '@testing-library/react';
import React from 'react';

export * from '@testing-library/react';

/**
 * `act` with the timing the suites were written against.
 *
 * React 19 flushes a *synchronous* callback inline, but its return value is a
 * thenable whose `then` hops through `setImmediate`. `await act(...)` therefore
 * yields to the event loop, which lets a component's own `setTimeout(0)` -
 * `Upload`'s deferred `doUpload`, for instance - run before the caller's next
 * assertion. The legacy `react-test-renderer` act resolved immediately, so
 * those assertions were written for the microtask-only delay.
 *
 * A synchronous callback is therefore acknowledged on a microtask instead of
 * awaiting React's thenable; async callbacks are still awaited normally so the
 * work they schedule gets flushed.
 */
export const act = ((callback: () => unknown, options?: unknown) => {
  let callbackIsAsync = false;

  const tracked = () => {
    const result = callback();
    if (result !== null && typeof result === 'object' && typeof (result as PromiseLike<unknown>).then === 'function') {
      callbackIsAsync = true;
    }
    return result;
  };

  const actResult = rtlAct(tracked as () => void, options as never) as unknown;

  if (callbackIsAsync) {
    return actResult;
  }

  return Promise.resolve();
}) as typeof rtlAct;

export const $ = function (classNames) {
  return document.querySelectorAll(classNames);
};

export const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(null), time));

export const render = (ui: React.ReactElement, options?: RenderOptions) => {
  const wrapper = {
    ...ORender(ui, {
      // container: document.body,
      ...options,
    }),
  } as ReturnType<typeof ORender> & {
    querySelector: <T extends HTMLElement | SVGElement>(selector: string) => T | null;
    querySelectorAll: <T extends HTMLElement | SVGElement>(selector: string) => NodeListOf<T>;
    find: <E extends HTMLElement | SVGElement>(selector: string) => NodeListOf<E>;
  };

  wrapper.find = <E extends Element>(selector) => {
    return document.querySelectorAll<E>(selector);
  };
  wrapper.querySelector = <T extends Element>(selector) => {
    return document.querySelector<T>(selector);
  };
  wrapper.querySelectorAll = <T extends Element>(selector) => {
    return document.querySelectorAll<T>(selector);
  };

  return wrapper;
};
