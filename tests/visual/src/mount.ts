/**
 * React root mount.
 *
 * The baseline was captured on React 16 (which mounted through
 * `ReactDOM.render`); React 18+ mounts through `react-dom/client`, and
 * `ReactDOM.render` no longer exists in React 19. The harness therefore uses
 * the modern API directly - the *scenarios* are what must stay identical
 * between the baseline and every modernization pass, not this bootstrap code.
 */
import type { ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

export function mountRoot(node: ReactNode, container: HTMLElement): Root {
  const root = createRoot(container);
  root.render(node);
  return root;
}
