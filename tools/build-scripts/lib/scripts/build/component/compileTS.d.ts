interface CompileOptions {
  type: 'es' | 'cjs';
  outDir: string;
  watch?: boolean;
}
declare const _default: (options: CompileOptions) => any;
export default _default;
