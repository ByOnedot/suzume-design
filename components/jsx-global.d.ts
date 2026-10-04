import type { JSX as ReactJSX } from 'react';

/**
 * React 19 removed the global `JSX` namespace (it now lives under
 * `React.JSX`). A number of public type aliases in this library were written
 * against the global; re-exposing it keeps those declarations source
 * compatible without touching every call site.
 */
declare global {
  namespace JSX {
    type Element = ReactJSX.Element;
    type ElementType = ReactJSX.ElementType;
    type ElementClass = ReactJSX.ElementClass;
    type ElementAttributesProperty = ReactJSX.ElementAttributesProperty;
    type ElementChildrenAttribute = ReactJSX.ElementChildrenAttribute;
    type IntrinsicAttributes = ReactJSX.IntrinsicAttributes;
    type IntrinsicElements = ReactJSX.IntrinsicElements;
    type IntrinsicClassAttributes<T> = ReactJSX.IntrinsicClassAttributes<T>;
    type LibraryManagedAttributes<C, P> = ReactJSX.LibraryManagedAttributes<C, P>;
  }
}
