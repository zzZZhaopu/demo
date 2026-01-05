# My UI Library

> 基于 Turbo + Monorepo 架构的 UI 组件库，同时支持 React 和 Vue，使用 Tailwind CSS

## 📦 包含内容

- `@zzzzzzhaopu/react` - React 组件库
- `@zzzzzzhaopu/vue` - Vue 组件库

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发组件库

```bash
# 开发组件库（监听模式）
pnpm dev

# 开发示例项目
pnpm dev:examples

# 同时开发全部
pnpm dev:all
```

### 构建

```bash
# 构建所有包
pnpm build

# 清理构建产物
pnpm clean
```

## 📁 项目结构

```
my-ui-library/
├── packages/
│   ├── react/          # React 组件库
│   └── vue/            # Vue 组件库
├── examples/
│   ├── react-demo/     # React 示例项目 (http://localhost:3000)
│   └── vue-demo/       # Vue 示例项目 (http://localhost:3001)
└── docs/               # 文档（可选）
```

## 🎨 组件列表

- **Button** - 按钮组件
- **Input** - 输入框组件

## 📖 使用文档

### React

```tsx
import { Button, Input } from '@zzzzzzhaopu/react';
import '@zzzzzzhaopu/react/styles';

function App() {
  return (
    <>
      <Button variant="primary">Click me</Button>
      <Input label="Username" placeholder="Enter username" />
    </>
  );
}
```

### Vue

```vue
<script setup>
import { Button, Input } from '@zzzzzzhaopu/vue';
import '@zzzzzzhaopu/vue/styles';
</script>

<template>
  <Button variant="primary">Click me</Button>
  <Input label="Username" placeholder="Enter username" />
</template>
```

## 🔧 技术栈

- **包管理**: pnpm + workspace
- **构建工具**: Turbo + Tsup
- **样式方案**: Tailwind CSS
- **类型系统**: TypeScript
- **版本管理**: Changesets

## 📝 开发指南

### 添加新组件

1. 在 `packages/react/src/components/` 或 `packages/vue/src/components/` 创建组件文件夹
2. 创建组件文件和类型定义
3. 在主入口文件中导出
4. 更新 `tsup.config.ts` 添加按需引入入口
5. 更新 `package.json` 的 `exports` 字段

### 版本管理

```bash
# 创建变更集
pnpm changeset

# 更新版本号
pnpm version

# 发布到 npm
pnpm publish:all
```

## 📄 License

MIT
