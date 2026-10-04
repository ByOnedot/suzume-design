/** Vite/Vitest plugin: style imports are irrelevant to unit tests. */
export function stubAssets() {
  return {
    name: 'suzume:stub-assets',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      const file = id.split('?')[0];
      if (/\.(less|css|scss|sass|styl)$/.test(file)) {
        return { code: 'export default {};\n', map: null };
      }
      return null;
    },
  };
}
