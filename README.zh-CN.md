# Suzume Design

**面向产品界面开发的 React / Next.js 组件库。**
由 https://byonedot.in 维护

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

```bash
npm i @byonedot/web-react
# 或
yarn add @byonedot/web-react
```

```tsx
import { Button, Table, Form, Input, Modal, Typography } from '@byonedot/web-react';
import '@byonedot/web-react/dist/css/suzume.css';

export function SaveButton() {
  return <Button type="primary">保存</Button>;
}
```

---

## 目录

- [特性](#特性)
- [安装](#安装)
- [使用](#使用)
  - [React](#react)
  - [Next.js](#nextjs)
  - [样式](#样式)
- [文档](#文档)
- [生态](#生态)
- [版本策略](#版本策略)
- [贡献](#贡献)
- [许可证](#许可证)

## 特性

- **70+ 组件**，覆盖表单、表格、数据录入、数据展示、反馈、导航与布局。
- **设计令牌**以 CSS 自定义属性暴露，主题可运行时切换，无需重新构建。
- **暗色模式**通过 `<body>` 上的 `suzume-theme` 属性开启。
- **内置 19 种语言**，通过 `ConfigProvider` 全局配置语言与组件行为。
- **图标** 280+ 个可摇树优化的 React 图标组件。
- **TypeScript 优先**，所有组件均附带类型声明。
- **SSR 安全**，服务端渲染期间不会访问 `window` / `document` / `localStorage`。
- **无需插件**，预构建 CSS 可直接用于任意打包器。

## 安装

对等依赖：`react ^19.0.0` 与 `react-dom ^19.0.0`。

```bash
npm i @byonedot/web-react
```

### CDN / UMD

```html
<script src="https://unpkg.com/@byonedot/web-react@latest/dist/suzume.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@byonedot/web-react@latest/dist/css/suzume.min.css" />
```

UMD 全局变量为 `window.suzume`（组件）、`window.suzumeicon`（图标）与
`window.suzumehooks`。

## 使用

### React

```tsx
import { ConfigProvider, Button } from '@byonedot/web-react';
import zhCN from '@byonedot/web-react/es/locale/zh-CN';
import '@byonedot/web-react/dist/css/suzume.css';

export default function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Button type="primary">确定</Button>
    </ConfigProvider>
  );
}
```

### Next.js

Suzume Design 同时支持 **App Router** 与 **Pages Router**。交互式组件需要
Client Component 边界：

```tsx
// app/components/save-button.tsx
'use client';

import { Button } from '@byonedot/web-react';

export function SaveButton() {
  return <Button type="primary">保存</Button>;
}
```

```tsx
// app/layout.tsx
import '@byonedot/web-react/dist/css/suzume.css';
```

Server Component、水合、`next/font`、Turbopack、摇树与 `transpilePackages`
等完整说明见 [`docs/nextjs.md`](./docs/nextjs.md)。

### 样式

三选一：

| 方式 | 引入 | 说明 |
| --- | --- | --- |
| 预构建 CSS | `import '@byonedot/web-react/dist/css/suzume.css'` | 推荐，任何环境可用 |
| 按组件 Less | `import '@byonedot/web-react/es/Button/style/index.less'` | 需要 Less loader，可配合 `modifyVars` 定制主题 |
| CDN | `dist/css/suzume.min.css` | 配合 UMD 使用 |

## 文档

全部文档位于 [`docs/`](./docs/) 目录，包含
[快速开始](./docs/getting-started.md)、[Next.js 兼容性](./docs/nextjs.md)、
[主题与暗色模式](./docs/theming.md)、[图标](./docs/icons.md)、
[国际化](./docs/i18n.md)、[表单](./docs/forms.md)、[表格](./docs/tables.md)、
[弹层](./docs/overlays.md)、[响应式](./docs/responsive.md)、
[无障碍](./docs/accessibility.md)、[TypeScript](./docs/typescript.md)、
[摇树](./docs/tree-shaking.md)、[SSR](./docs/ssr.md)、
[色彩工具](./docs/color.md)、[构建插件](./docs/plugins.md)、
[迁移与版本](./docs/migration.md) 与[组件清单](./docs/components.md)。

## 生态

| 包 | 用途 |
| --- | --- |
| `@byonedot/web-react` | 本仓库 - React 组件库 |
| `@byonedot/color` | 调色板生成与色彩工具 |
| `@byonedot/plugin-*` | 可选的 webpack / Rspack / Vite 构建插件 |
| `suzume-design-pro` | 中后台模板（Next.js / CRA / Vite） |
| `suzume-design-skill` | 面向 AI Agent 的 `@byonedot/web-react` 技能包 |

## 版本策略

Suzume Design 遵循 [Semantic Versioning](https://semver.org/)。本发行版的公开
发布历史从 **1.0.0** 开始，见 [`CHANGELOG.md`](./CHANGELOG.md)；本仓库代码的上游
来源见 [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md)。

## 贡献

请阅读 [`CONTRIBUTING.md`](./CONTRIBUTING.md) 与
[《行为准则》](./CODE_OF_CONDUCT.md)。

## 许可证

[MIT](./LICENSE)，上游归属见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。
