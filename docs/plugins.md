# Build plugins

**You do not need a plugin to use `@suzume-design/web-react`.** The prebuilt
CSS works with every bundler.

The optional plugins in `suzume-plugins` add bundler-level
integration for projects that want it:

| Package | Bundler | What it does |
| --- | --- | --- |
| `@suzume-design/plugin-webpack-react` | webpack 4 / 5 | On-demand style imports through `babel-plugin-import`, theme injection into `less-loader`, font-face removal, icon replacement, default-language replacement |
| `@suzume-design/plugin-unplugin-react` | Rspack | Same feature set implemented as a Rspack compiler plugin |
| `@suzume-design/plugin-vite-react` | Vite 2+ | On-demand style imports via a Babel transform, theme tokens written to a temporary Less file, icon replacement through esbuild |
| `@suzume-design/plugin-utils` | - | Shared helpers used by the plugins above |

```bash
npm i -D @suzume-design/plugin-webpack-react
```

```js
// webpack.config.js
const SuzumeWebpackPlugin = require('@suzume-design/plugin-webpack-react');

module.exports = {
  plugins: [
    new SuzumeWebpackPlugin({
      include: ['src'],
      webpackImplementation: require('webpack'),
      removeFontFace: true,
      defaultLanguage: 'en-US',
    }),
  ],
};
```

Full option tables and examples are in each package's README.

## When you do NOT need a plugin

- You import `@suzume-design/web-react/dist/css/suzume.css` once (the
  recommended setup).
- You are on Next.js (App Router or Pages Router) - see
  [nextjs.md](./nextjs.md).
- You are on Vite and happy to import the prebuilt CSS.

## Next.js support - accurate status

| Plugin | Works on Next.js? | Notes |
| --- | --- | --- |
| `plugin-webpack-react` | **Partially** | The `webpack()` hook in `next.config.js` lets the theme / font-face / icon / default-language sub-plugins run. The **on-demand style import** feature drives `babel-loader`, but Next compiles application code with **SWC** by default - so that specific feature only applies if your project really compiles with `babel-loader`. |
| `plugin-unplugin-react` | **No** | It is a Rspack compiler plugin and reads `compiler.options.builtins`, which Next does not expose. |
| `plugin-vite-react` | **No** | Vite only. |

There is **no Turbopack plugin**. If your dev server runs with
`next dev --turbo`, rely on the prebuilt CSS import; custom Less compilation
and all three plugins are webpack-only today.

## Turbopack / Rspack / webpack summary

| Path | Turbopack | webpack | Rspack | Vite |
| --- | --- | --- | --- | --- |
| Prebuilt `suzume.css` | yes | yes | yes | yes |
| Per-component Less | no | yes | yes | yes |
| `plugin-webpack-react` | no | yes | no | no |
| `plugin-unplugin-react` | no | no | yes | no |
| `plugin-vite-react` | no | no | no | yes |

## Troubleshooting

**Styles are duplicated.** You are loading both the prebuilt CSS and
per-component Less. Keep one.

**`modifyVars` has no effect.** You are on the prebuilt CSS. Compile the Less
entries instead, or change tokens at runtime with `ConfigProvider` /
`document.body.style.setProperty` (see [theming.md](./theming.md)).

**Icons are missing.** Import them from `@suzume-design/web-react/icon`, or
enable the icon-replacement option of the plugin you are using.
