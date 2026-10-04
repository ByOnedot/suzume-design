import { ComponentState, PropsWithoutRef, useEffect, useRef } from 'react';

export default function usePrevious<T>(value: PropsWithoutRef<T> | ComponentState) {
  // React 19 removed the zero-argument `useRef()` overload; `T | undefined`
  // keeps the inferred return type identical to what it used to be.
  const ref = useRef<T | ComponentState | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
