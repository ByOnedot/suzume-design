import { Component, ReactElement, ReactInstance } from 'react';
import * as ReactDOMModule from 'react-dom';

/**
 * React 19 removed `findDOMNode` from `react-dom`. The library still falls
 * back to it when running on an older React, so the type is resolved here
 * instead of depending on a declaration that no longer exists.
 */
type LegacyReactDOM = typeof ReactDOMModule & {
  findDOMNode?: (instance: unknown) => Element | Text | null;
};
const ReactDOM = ReactDOMModule as LegacyReactDOM;
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';
import { isFunction } from './is';
import warning from './warning';

/**
 * Imperative mount handle.
 *
 * React 19 removed `ReactDOM.render` / `ReactDOM.unmountComponentAtNode`, so
 * the only supported way to mount a detached tree (Message, Notification,
 * Modal.confirm, Image preview) is a real root from `react-dom/client`.
 */
type RenderHandle = {
  render: (app: ReactElement) => void;
  unmount: () => void;
  _unmount: () => void;
};

export const render = (app: ReactElement, container: Element | DocumentFragment): RenderHandle => {
  const root: Root = createRoot(container as Element);
  // `ReactDOM.render` used to flush synchronously. `createRoot().render()`
  // schedules instead, which would make imperative mounts (Message,
  // Notification, Modal.confirm, Image preview) visible one tick late.
  // Flushing here preserves the historic observable behaviour.
  flushSync(() => root.render(app));

  return {
    render: (next: ReactElement) => flushSync(() => root.render(next)),
    unmount: () => root.unmount(),
    // Callers that tear down from an effect keep the historic async behaviour.
    _unmount() {
      setTimeout(() => root.unmount());
    },
  };
};

/**
 * Reads the ref of a React element in a version-safe way.
 *
 * React 19 made `ref` an ordinary prop: `element.ref` no longer exists and
 * reading it raises *"Accessing element.ref was removed in React 19"*. React
 * 18 and earlier keep the ref on the element itself and do not expose it
 * through `props`, so both paths are supported without ever touching the
 * removed accessor on React 19.
 */
export const getElementRef = (element: unknown): unknown => {
  const el = element as { props?: { ref?: unknown }; ref?: unknown } | null | undefined;
  if (!el || typeof el !== 'object') return undefined;

  const props = el.props;
  if (props && 'ref' in props) {
    return props.ref;
  }

  // React <= 18: `ref` lives on the element. Reading it is safe there; on
  // React 19 the branch above always short-circuits first.
  try {
    return (el as { ref?: unknown }).ref;
  } catch {
    return undefined;
  }
};

/**
 * Resolves the underlying DOM node for an element, ref object or class
 * component instance.
 *
 * `ReactDOM.findDOMNode` was removed in React 19, so component authors must
 * expose `getRootDOMNode()` (which the interactive components in this library
 * do) or pass a real DOM node / ref.
 */
export const findDOMNode = (element: any, instance?: ReactInstance): Element | null => {
  // Plain DOM node.
  if (element && element instanceof Element) {
    return element;
  }

  // Ref object holding a DOM node.
  if (element && element.current && element.current instanceof Element) {
    return element.current;
  }

  // React 19 removed findDOMNode; prefer the explicit escape hatch first.
  if (element && isFunction(element.getRootDOMNode)) {
    return element.getRootDOMNode();
  }

  if (element instanceof Component && typeof ReactDOM.findDOMNode === 'function') {
    // `findDOMNode` may hand back a Text node; this library only ever passes
    // element hosts, so narrowing here keeps the public signature simple.
    return ReactDOM.findDOMNode(element) as Element | null;
  }

  if (instance) {
    warning(
      typeof ReactDOM.findDOMNode !== 'function' && !hasInstanceWarned(instance),
      'Element does not define the `getRootDOMNode` method and `ReactDOM.findDOMNode` no longer exists. ' +
        'Please expose `getRootDOMNode()` on the component.',
      { element, instance }
    );
    if (typeof ReactDOM.findDOMNode === 'function') {
      return ReactDOM.findDOMNode(instance) as Element | null;
    }
  }

  return null;
};

let warnedInstancesWeakSet: WeakSet<Function> | undefined;

function hasInstanceWarned(instance: ReactInstance) {
  const ctor = instance.constructor;
  if (typeof ctor !== 'function') return false;
  if (!warnedInstancesWeakSet && typeof WeakSet === 'function') {
    warnedInstancesWeakSet = new WeakSet();
  }
  const hasWarned = !!warnedInstancesWeakSet?.has(ctor);
  warnedInstancesWeakSet?.add(ctor);
  return hasWarned;
}

/**
 * Forwards the ref that belongs to `children` onto a replacement node.
 * Version-safe through {@link getElementRef}.
 */
export const callbackOriginRef = (children: unknown, node: unknown) => {
  const ref = getElementRef(children);
  if (!ref) return;

  if (isFunction(ref)) {
    (ref as (value: unknown) => void)(node);
    return;
  }

  if (typeof ref === 'object' && ref !== null && 'current' in ref) {
    (ref as { current: unknown }).current = node;
  }
};

/**
 * Flushes a React update triggered by an imperative API (`Message.info()`,
 * `Notification.info()`, ...).
 *
 * React 16 flushed those synchronously, so callers could assert on the DOM
 * immediately. React 18+ schedules them, which would make the imperative
 * notice APIs observable only after a microtask. Flushing here preserves the
 * historic, synchronous contract without touching application code.
 */
export function flushNoticeUpdate<T>(update: () => T): T {
  let result: T;
  flushSync(() => {
    result = update();
  });
  return result as T;
}
