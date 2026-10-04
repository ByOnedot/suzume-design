// only used by trigger. Plan to replace ../Portal

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { isServerRendering } from '../_util/dom';

export interface PortalProps {
  /** Portal 挂载的容器 */
  getContainer: () => HTMLElement;
  children?: React.ReactNode;
}

/**
 * React 18/19 `StrictMode` runs effects as `setup -> cleanup -> setup` without
 * re-rendering. The historic implementation created the container during
 * render and only destroyed it in the cleanup, so on the StrictMode remount the
 * container was detached from the document while React kept the portal pointed
 * at it - the popup silently disappeared. The container is now owned by the
 * effect: it is created in `setup` and removed in `cleanup`, and the state
 * update makes React re-point the portal at the fresh container.
 */
const Portal = (props: PortalProps) => {
  const { getContainer, children } = props;
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (isServerRendering) return undefined;

    const next = getContainer();
    setContainer(next);

    return () => {
      if (next.parentNode) {
        next.parentNode.removeChild(next);
      }
      setContainer(null);
    };
    // The container is created once per mount; cleanup/re-setup pairs are
    // handled by StrictMode itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return container ? ReactDOM.createPortal(children, container) : null;
};

export default Portal;
