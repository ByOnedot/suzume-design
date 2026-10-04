import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

/**
 * `jest-canvas-mock` (used by Watermark / ColorPicker / Image tests) reads a
 * global `jest` object to build its spies. Vitest exposes `vi` instead, so the
 * global is bridged here - the shim exists for that one package, no test code
 * depends on it.
 */
(globalThis as unknown as { jest: typeof vi }).jest = vi;

// Imported dynamically so the assignment above runs first.
await import('jest-canvas-mock');
