import { transformSync } from '@babel/core';
import template from '@babel/template';

/**
 * Turns a `__demo__/*.md` file into a module that default-exports the demo
 * component.
 *
 * This is a 1:1 port of the markdown transform the previous (jest) runner
 * used, so the rendered output - and therefore every `demo.test.ts` snapshot -
 * stays byte-identical. The only difference is `modules: false`, because the
 * result is consumed by Vite's ESM pipeline instead of a CommonJS one.
 */
const CODE_FENCE = /^(([ \t]*`{3,4})([^\n]*)([\s\S]+?)(^[ \t]*\2))/m;
const LANGUAGES = ['js', 'javascript', 'jsx', 'tsx'];

function createDemoPlugin({ types }: any) {
  const importReact = template('import React from "react";import ReactDOM from "react-dom";');
  return {
    visitor: {
      Program(path: any) {
        path.unshiftContainer('body', importReact());
      },
      CallExpression(path: any) {
        const callee = path.node.callee as any;
        if (
          callee.object &&
          callee.object.name === 'ReactDOM' &&
          callee.property &&
          callee.property.name === 'render'
        ) {
          const app = types.VariableDeclaration('const', [
            types.VariableDeclarator(types.Identifier('__export'), path.node.arguments[0]),
          ]);
          const exported = types.ExportDefaultDeclaration(types.Identifier('__export'));
          path.insertAfter(exported);
          path.insertAfter(app);
          path.remove();
        }
      },
    },
  };
}

const BASE_PRESETS: [string, object][] = [
  ['@babel/preset-env', { modules: false }],
  ['@babel/preset-react', {}],
];

const BASE_PLUGINS = [
  '@babel/plugin-proposal-export-default-from',
  '@babel/plugin-transform-runtime',
  '@babel/plugin-syntax-dynamic-import',
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-transform-react-jsx-source',
];

export function transformDemoMarkdown(code: string, id: string): string {
  const match = CODE_FENCE.exec(code);
  if (!match) return 'export default undefined;\n';

  const language = (match[3] || '').trim();
  if (!LANGUAGES.includes(language)) return 'export default undefined;\n';

  const source = match[4];
  const isTsx = language === 'tsx' || language === 'jsx';

  const result = transformSync(source, {
    filename: id,
    babelrc: false,
    configFile: false,
    presets: [
      ...BASE_PRESETS,
      [
        '@babel/preset-typescript',
        isTsx ? { isTSX: true, allExtensions: true } : {},
      ] as [string, object],
    ],
    plugins: [...BASE_PLUGINS, createDemoPlugin],
  });

  return result?.code ?? 'export default undefined;\n';
}

/** Vite/Vitest plugin that applies {@link transformDemoMarkdown}. */
export function mdDemo() {
  return {
    name: 'suzume:markdown-demo',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      if (!id.split('?')[0].endsWith('.md')) return null;
      return { code: transformDemoMarkdown(code, id), map: null };
    },
  };
}
