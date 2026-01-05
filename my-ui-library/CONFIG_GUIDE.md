# UI 组件库配置详解

> 专为初学者准备的详细配置说明文档

## 📋 目录

- [核心配置文件](#核心配置文件)
- [架构配置要点](#架构配置要点)
- [搭建流程要点](#搭建流程要点)

---

## 核心配置文件

### 1. 根目录 `package.json`

```json
{
  "name": "my-ui-library",
  "private": true,  // ✅ 关键：根项目设为私有，不会被发布到 npm
  "packageManager": "pnpm@9.0.0",  // ✅ 锁定包管理器版本，团队协作必备
  
  "scripts": {
    // Turbo 构建命令，--filter 指定只构建 packages 目录下的包
    "build": "turbo build --filter='./packages/*'",
    
    // 开发模式：只监听组件库的变化（用于单独开发组件）
    "dev": "turbo dev --filter='./packages/*'",
    
    // 开发模式：只运行示例项目（用于查看效果）
    "dev:examples": "turbo dev --filter='./examples/*'",
    
    // 开发模式：同时运行组件库和示例项目（推荐使用）
    "dev:all": "turbo dev",
    
    // 清理所有构建产物
    "clean": "turbo clean",
    
    // Changesets 工作流：创建变更集 → 更新版本 → 发布
    "changeset": "changeset",
    "version": "changeset version",
    "publish:all": "changeset publish"
  },
  
  "devDependencies": {
    "@changesets/cli": "^2.27.0",  // 版本管理和发布工具
    "turbo": "^2.3.0",             // Monorepo 构建系统
    "tsup": "^8.3.0",              // 打包工具（基于 esbuild，速度快）
    "tailwindcss": "^3.4.0",       // 原子化 CSS 框架
    "typescript": "^5.6.0"         // TypeScript 编译器
  }
}
```

**关键点解析：**
- ✅ `private: true`：防止根目录被误发布
- ✅ `packageManager`：确保团队使用相同的 pnpm 版本
- ✅ `scripts`：所有命令通过 Turbo 运行，享受缓存和并行构建

---

### 2. Workspace 配置 `pnpm-workspace.yaml`

```yaml
packages:
  - "packages/*"   # 组件库包目录
  - "examples/*"   # 示例项目目录
```

**作用：**
- 定义 Monorepo 的包结构
- 让 pnpm 知道哪些目录是独立的包
- 支持包之间通过 `workspace:*` 相互引用

---

### 3. Turbo 配置 `turbo.json`

```json
{
  "tasks": {
    "build": {
      // "^build" 表示：先构建所有依赖包，再构建当前包
      // 例如：示例项目依赖组件库 → 组件库会先构建
      "dependsOn": ["^build"],
      
      // 指定构建产物目录，Turbo 会缓存这些目录
      // 如果源码没变，直接复用缓存，极大提升速度
      "outputs": ["dist/**", ".next/**"]
    },
    
    "dev": {
      "cache": false,      // 开发模式不缓存，确保实时更新
      "persistent": true   // 持久运行（如开发服务器不会退出）
    }
  }
}
```

**Turbo 核心价值：**
- ✅ **缓存机制**：源码不变 = 跳过构建，节省 90% 时间
- ✅ **并行构建**：多个包同时构建，充分利用 CPU
- ✅ **依赖分析**：自动确定包的构建顺序

---

### 4. TypeScript 基础配置 `tsconfig.base.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",           // 编译目标：支持现代浏览器
    "module": "ESNext",           // 使用最新的 ES 模块标准
    "jsx": "react-jsx",           // React 17+ 新 JSX 转换（无需 import React）
    "moduleResolution": "bundler", // 适配现代打包工具（Vite/esbuild）
    
    // 类型和映射
    "declaration": true,          // 生成 .d.ts 类型文件
    "declarationMap": true,       // 生成 .d.ts.map 源映射
    "sourceMap": true,            // 生成 .js.map 源映射
    
    // 严格模式（推荐全部开启）
    "strict": true,
    "skipLibCheck": true          // 跳过 node_modules 类型检查，加速编译
  }
}
```

**为什么需要基础配置？**
- 所有子包继承此配置，避免重复定义
- 确保整个项目的 TypeScript 规则统一

---

### 5. 组件库包配置 `packages/react/package.json`

```json
{
  "name": "@zzzzzzhaopu/react",  // ✅ npm 包名（@scope/name 格式）
  "version": "1.0.0",
  "type": "module",              // ✅ 使用 ES Module
  
  // 兼容性入口（支持老工具）
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  
  // ✅ exports：现代化导出方式（重点）
  "exports": {
    // 主入口：import { Button } from '@zzzzzzhaopu/react'
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    
    // 按需引入：import { Button } from '@zzzzzzhaopu/react/Button'
    "./Button": {
      "types": "./dist/components/Button/index.d.ts",
      "import": "./dist/components/Button/index.js"
    },
    
    // 样式导出：import '@zzzzzzhaopu/react/styles'
    "./styles": "./dist/styles/index.css"
  },
  
  // ✅ 发布时包含的文件
  "files": ["dist", "README.md"],
  
  // ✅ 标记有副作用的文件（CSS 不能被 Tree Shaking）
  "sideEffects": ["**/*.css"],
  
  "scripts": {
    "build": "pnpm build:js && pnpm build:css",
    "build:js": "tsup",           // 打包 JS/TS
    "build:css": "tailwindcss -i ./src/styles/index.css -o ./dist/styles/index.css --minify",
    "dev": "tsup --watch"
  },
  
  // ✅ 对等依赖：使用者必须安装，不会被打包
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  
  // 开发依赖：仅开发时需要
  "devDependencies": {
    "@types/react": "^18.3.0",
    "react": "^18.3.1"
  },
  
  // ✅ 发布配置：scope 包默认私有，需设置 public
  "publishConfig": {
    "access": "public"
  }
}
```

**exports 字段详解（现代化必备）：**
- ✅ 支持多入口：全量导入 vs 按需引入
- ✅ 支持条件导出：types（类型）+ import（代码）
- ✅ 更好的 Tree Shaking：打包工具能精确分析使用情况

---

### 6. Tsup 打包配置 `packages/react/tsup.config.ts`

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  // 入口文件配置
  entry: {
    index: "src/index.ts",                              // 全量导出
    "components/Button/index": "src/components/Button/index.tsx",  // 按需引入
    "components/Input/index": "src/components/Input/index.tsx"
  },
  
  format: ["esm"],        // 输出格式：ESM（现代标准）
  dts: true,              // 生成 .d.ts 类型文件
  clean: true,            // 构建前清空 dist
  sourcemap: true,        // 生成 sourcemap
  
  // ✅ 外部依赖：不打包，由使用者提供
  external: ["react", "react-dom"],
  
  treeshake: true,        // 开启 Tree Shaking
  splitting: false,       // 每个入口一个文件
  minify: false,          // 不压缩（保持可读性）
  
  // ✅ 为 React 组件添加 "use client"（Next.js 13+ 需要）
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";'
    };
  }
});
```

**为什么选择 Tsup？**
- ✅ 基于 esbuild，速度极快（比 Webpack 快 10-100 倍）
- ✅ 零配置即可用，配置简单
- ✅ 原生支持 TypeScript，自动生成类型文件

---

### 7. Tailwind CSS 配置 `tailwind.config.js`

```javascript
export default {
  // ✅ 扫描路径：Tailwind 会提取这些文件中使用的类名
  content: [
    "./packages/*/src/**/*.{js,ts,jsx,tsx,vue}",  // 组件库
    "./examples/*/src/**/*.{js,ts,jsx,tsx,vue}"   // 示例项目
  ],
  
  theme: {
    extend: {
      // 自定义主题色
      colors: {
        primary: { ... }
      }
    }
  },
  
  plugins: []
};
```

**Tailwind 工作流程：**
1. 扫描 content 路径下的文件
2. 提取使用的 Tailwind 类名（如 `bg-blue-500`）
3. 生成最小化的 CSS 文件（只包含用到的样式）

---

## 架构配置要点

### 🏗️ Monorepo 架构优势

```
my-ui-library/
├── packages/           # 组件库包
│   ├── react/         # React 组件
│   └── vue/           # Vue 组件
└── examples/          # 示例项目
    ├── react-demo/
    └── vue-demo/
```

**为什么用 Monorepo？**
- ✅ **代码共享**：组件库和示例项目在同一仓库，方便调试
- ✅ **统一管理**：一次命令构建所有包
- ✅ **依赖优化**：pnpm 会自动去重依赖

---

### 🎯 包导出策略

**1. 全量导出（主入口）**
```typescript
// src/index.ts
export { Button } from './components/Button';
export { Input } from './components/Input';
```

**使用方式：**
```typescript
import { Button, Input } from '@zzzzzzhaopu/react';
```

**2. 按需引入（子路径）**
```typescript
// tsup.config.ts
entry: {
  "components/Button/index": "src/components/Button/index.tsx"
}

// package.json
"exports": {
  "./Button": {
    "import": "./dist/components/Button/index.js"
  }
}
```

**使用方式：**
```typescript
import { Button } from '@zzzzzzhaopu/react/Button';
```

**优势对比：**
| 方式 | 优点 | 缺点 |
|------|------|------|
| 全量导出 | 使用简单 | 打包体积可能较大 |
| 按需引入 | 打包体积小 | 导入路径稍长 |

---

### 🔄 依赖关系处理

**peerDependencies（对等依赖）**
```json
"peerDependencies": {
  "react": "^18.0.0 || ^19.0.0"
}
```
- 使用者项目必须安装
- 组件库不会打包这些依赖
- 避免多个 React 版本冲突

**devDependencies（开发依赖）**
```json
"devDependencies": {
  "react": "^18.3.1"
}
```
- 仅用于开发和构建
- 不会出现在最终的 npm 包中

**workspace 依赖（Monorepo 内部引用）**
```json
"dependencies": {
  "@zzzzzzhaopu/react": "workspace:*"
}
```
- `workspace:*`：链接到本地的包
- 开发时修改组件 → 示例项目立即生效

---

### 🎨 样式处理方案

**方案：组件内使用 Tailwind + 提供预编译 CSS**

```typescript
// 组件中直接使用 Tailwind 类
<button className="bg-blue-600 text-white px-4 py-2 rounded-md">
  Click me
</button>
```

```bash
# 构建时编译 CSS
tailwindcss -i ./src/styles/index.css -o ./dist/styles/index.css --minify
```

**使用者有两种选择：**

**方式 1：导入预编译 CSS（推荐）**
```typescript
import '@zzzzzzhaopu/react/styles';
```
- ✅ 开箱即用，无需配置
- ❌ CSS 文件较大（包含所有 Tailwind 工具类）

**方式 2：集成到项目的 Tailwind**
```javascript
// 用户项目的 tailwind.config.js
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@zzzzzzhaopu/react/dist/**/*.js'  // 扫描组件库
  ]
}
```
- ✅ 按需生成样式，文件更小
- ✅ 可以自定义主题
- ❌ 需要用户配置 Tailwind

---

## 搭建流程要点

### 📝 完整搭建步骤

#### 第 1 步：初始化根项目

```bash
mkdir my-ui-library && cd my-ui-library
npm init -y
```

配置 `pnpm-workspace.yaml`：
```yaml
packages:
  - "packages/*"
  - "examples/*"
```

---

#### 第 2 步：配置构建工具

安装核心依赖：
```bash
pnpm add -Dw turbo tsup typescript tailwindcss autoprefixer postcss
```

创建 `turbo.json` 和 `tsconfig.base.json`

---

#### 第 3 步：创建组件库包

```bash
mkdir -p packages/react/src/components/Button
```

配置 `packages/react/package.json`：
- 设置 `name`、`exports`、`peerDependencies`
- 配置构建脚本

配置 `packages/react/tsup.config.ts`：
- 设置 entry（全量 + 按需）
- 配置 external（React/Vue）

---

#### 第 4 步：开发组件

```typescript
// src/components/Button/Button.tsx
export const Button = ({ children, ...props }) => {
  return (
    <button className="bg-blue-600 text-white px-4 py-2" {...props}>
      {children}
    </button>
  );
};

// src/components/Button/index.tsx
export { Button } from './Button';
export type { ButtonProps } from './types';

// src/index.ts
export { Button } from './components/Button';
```

---

#### 第 5 步：创建示例项目

```bash
cd examples
pnpm create vite react-demo --template react-ts
```

配置依赖：
```json
{
  "dependencies": {
    "@zzzzzzhaopu/react": "workspace:*"
  }
}
```

---

#### 第 6 步：本地开发调试

```bash
# 同时运行组件库和示例项目
pnpm dev:all
```

**工作流程：**
1. 修改组件代码 → tsup 监听重新打包
2. 示例项目通过 `workspace:*` 引用最新代码
3. 浏览器热重载，实时查看效果

---

#### 第 7 步：构建和发布

```bash
# 1. 构建所有包
pnpm build

# 2. 创建变更集（记录改动）
pnpm changeset

# 3. 更新版本号
pnpm version

# 4. 发布到 npm
npm login
pnpm publish:all
```

---

### 🎯 关键概念理解

#### Monorepo vs 多仓库

**Monorepo（单一仓库）：**
```
my-ui-library/
├── packages/react/    # 包1
├── packages/vue/      # 包2
└── examples/          # 示例
```
- ✅ 代码共享方便
- ✅ 统一版本管理
- ✅ 调试简单

**多仓库：**
```
react-ui/              # 仓库1
vue-ui/                # 仓库2
ui-examples/           # 仓库3
```
- ❌ 调试需要 npm link
- ❌ 版本管理复杂
- ❌ 代码同步困难

---

#### Turbo 缓存原理

```bash
# 首次构建
pnpm build  # 耗时 10s

# 源码未变，再次构建
pnpm build  # 耗时 0.1s（使用缓存）

# 修改了某个组件
pnpm build  # 只重新构建该组件相关的包
```

**缓存机制：**
1. Turbo 计算每个包的输入哈希（源码 + 依赖）
2. 如果哈希未变 → 直接复用上次的构建产物
3. 如果哈希改变 → 重新构建

---

#### package.json exports 字段

**传统方式（仅支持主入口）：**
```json
{
  "main": "./dist/index.js"
}
```
- 只能 `import ... from 'package'`
- 不支持子路径导出

**现代方式（支持多入口）：**
```json
{
  "exports": {
    ".": "./dist/index.js",
    "./Button": "./dist/components/Button/index.js"
  }
}
```
- 支持 `import ... from 'package/Button'`
- 支持条件导出（types、import、require）
- 更好的 Tree Shaking

---

### 💡 常见问题

#### Q1: 为什么使用 pnpm？
- ✅ 节省磁盘空间（硬链接机制）
- ✅ 安装速度快（并行下载）
- ✅ 严格的依赖管理（避免幽灵依赖）

#### Q2: 为什么选择 Tsup 而不是 Webpack？
- ✅ 速度快 10-100 倍
- ✅ 零配置即可用
- ✅ 原生支持 TypeScript

#### Q3: Tailwind CSS 会增加包体积吗？
- ❌ 不会！Tailwind 会 Tree Shaking 未使用的类
- 最终 CSS 只包含你实际用到的样式

#### Q4: 如何调试组件库？
```bash
# 方式1：使用示例项目（推荐）
pnpm dev:all

# 方式2：使用 npm link（不推荐，容易出问题）
cd packages/react && npm link
cd other-project && npm link @zzzzzzhaopu/react
```

---

### 🚀 进阶优化

#### 1. 添加单元测试
```bash
pnpm add -Dw vitest @testing-library/react
```

#### 2. 添加 ESLint + Prettier
```bash
pnpm add -Dw eslint prettier
```

#### 3. 添加 CI/CD（GitHub Actions）
```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build
```

#### 4. 添加文档站点（VitePress）
```bash
pnpm add -D vitepress
```

---

## 📚 学习资源

- **Turbo 官方文档**: https://turbo.build/repo/docs
- **pnpm Workspace**: https://pnpm.io/workspaces
- **Tsup 文档**: https://tsup.egoist.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **Changesets**: https://github.com/changesets/changesets

---

## ✅ 检查清单

**发布前检查：**
- [ ] 所有测试通过
- [ ] 构建成功无错误
- [ ] README 文档完整
- [ ] package.json 配置正确（name、version、exports）
- [ ] .npmignore 或 files 字段配置正确
- [ ] publishConfig.access 设置为 public
- [ ] npm 账号已登录

**开发规范：**
- [ ] 组件命名使用 PascalCase
- [ ] 导出类型定义（TypeScript）
- [ ] 添加适当的注释
- [ ] 遵循代码风格规范

---

## 🎉 总结

### 核心要点回顾

1. **Monorepo 架构**：一个仓库管理多个包
2. **Turbo 构建系统**：缓存 + 并行 = 极速构建
3. **Tsup 打包工具**：快速、简单、强大
4. **exports 字段**：现代化的包导出方式
5. **workspace 依赖**：本地包之间无缝引用
6. **Tailwind CSS**：原子化样式 + Tree Shaking

### 学习路径建议

1. **初学者**：先理解单个组件库的开发
2. **进阶者**：理解 Monorepo 和 Turbo 原理
3. **高级者**：优化构建性能、添加测试和文档

祝你搭建组件库顺利！🚀
