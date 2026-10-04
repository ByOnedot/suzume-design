/**
 * Ambient declarations for non-TypeScript assets that the component styles
 * import. TypeScript 6 rejects side-effect imports of unknown extensions
 * (TS2882) unless they are declared.
 */
declare module '*.less' {
  const content: string;
  export default content;
}

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.md' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
