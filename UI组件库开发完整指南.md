# UI组件库开发完整指南

> 基于 Turbo + Monorepo 架构，支持 React + Vue 双框架，使用 Tailwind CSS

## 📋 目录

- [项目架构设计](#项目架构设计)
- [技术栈选型](#技术栈选型)
- [项目初始化](#项目初始化)
- [包开发流程](#包开发流程)
- [样式处理方案](#样式处理方案)
- [静态资源处理](#静态资源处理)
- [按需引入实现](#按需引入实现)
- [本地开发调试](#本地开发调试)
- [构建与发布](#构建与发布)
- [最佳实践](#最佳实践)

---

## 项目架构设计

### 目录结构

```
my-ui-library/
├── packages/                    # 核心包目录
│   ├── react/                   # React 组件库
│   │   ├── src/
│   │   │   ├── components/      # 组件源码
│   │   │   │   ├── Button/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   └── types.ts
│   │   │   │   ├── Input/
│   │   │   │   └── ...
│   │   │   ├── index.ts         # 全量导出入口
│   │   │   └── styles/          # 样式文件（可选）
│   │   │       └── index.css
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── tsup.config.ts
│   │
│   ├── vue/                     # Vue 组件库
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Button/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── Button.vue
│   │   │   │   │   └── types.ts
│   │   │   │   ├── Input/
│   │   │   │   └── ...
│   │   │   ├── index.ts
│   │   │   └── styles/
│   │   │       └── index.css
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── tsup.config.ts
│   │
│   └── shared/                  # 共享工具库（可选）
│       ├── src/
│       │   ├── utils/
│       │   ├── constants/
│       │   └── types/
│       ├── package.json
│       └── tsup.config.ts
│
├── examples/                    # 示例项目
│   ├── react-demo/              # React 示例
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── vue-demo/                # Vue 示例
│       ├── src/
│       ├── package.json
│       └── vite.config.ts
│
├── docs/                        # 文档站点（可选）
│   ├── .vitepress/
│   └── src/
│
├── .changeset/                  # 版本管理
├── package.json                 # 根配置
├── pnpm-workspace.yaml          # workspace 配置
├── turbo.json                   # Turbo 配置
├── tsconfig.base.json           # 基础 TS 配置
├── tailwind.config.js           # Tailwind 配置
└── postcss.config.js            # PostCSS 配置
```

### 包命名规范

```
@your-org/react    # React 组件库
@your-org/vue      # Vue 组件库
@your-org/shared   # 共享工具库
```

---

## 技术栈选型

### 核心技术

| 技术 | 版本 | 用途 |
|------|------|------|
| **pnpm** | 9+ | 包管理器 |
| **Turbo** | 2+ | Monorepo 构建工具 |
| **TypeScript** | 5+ | 类型系统 |
| **React** | 18/19 | React 组件库 |
| **Vue** | 3.5+ | Vue 组件库 |
| **Tailwind CSS** | 3+ | 样式方案 |
| **Tsup** | 8+ | 打包工具 |
| **Vite** | 5+ | 开发服务器 |
| **Changesets** | 2+ | 版本管理 |

### 构建工具选择

- **Tsup**: 打包组件库（基于 esbuild，速度快）
- **Vite**: 示例项目开发
- **Turbo**: 任务调度和缓存

---

## 项目初始化

### 步骤 1: 创建项目根目录

```bash
mkdir my-ui-library
cd my-ui-library
npm init -y
```

### 步骤 2: 配置 pnpm workspace

创建 `pnpm-workspace.yaml`:

```yaml
packages:
  - "packages/*"
  - "examples/*"
```

创建 `.npmrc`:

```
shamefully-hoist=true
strict-peer-dependencies=false
```

### 步骤 3: 配置根 package.json

```json
{
  "name": "my-ui-library",
  "version": "1.0.0",
  "private": true,
  "packageManager": "pnpm@9.0.0",
  "scripts": {
    "build": "turbo build --filter='./packages/*'",
    "dev": "turbo dev --filter='./packages/*'",
    "dev:examples": "turbo dev --filter='./examples/*'",
    "dev:all": "turbo dev",
    "clean": "turbo clean",
    "changeset": "changeset",
    "version": "changeset version",
    "publish:all": "changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.0",
    "@types/node": "^22.0.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.0",
    "tsup": "^8.3.0",
    "turbo": "^2.3.0",
    "typescript": "^5.6.0"
  },
  "engines": {
    "node": ">=18"
  }
}
```

### 步骤 4: 配置 Turbo

创建 `turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "clean": {
      "cache": false
    }
  }
}
```

### 步骤 5: 配置 TypeScript

创建 `tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

### 步骤 6: 配置 Tailwind CSS

创建 `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./packages/*/src/**/*.{js,ts,jsx,tsx,vue}",
    "./examples/*/src/**/*.{js,ts,jsx,tsx,vue}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
}
```

创建 `postcss.config.js`:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
```

### 步骤 7: 初始化 Changesets

```bash
pnpm add -Dw @changesets/cli
pnpm changeset init
```

### 步骤 8: 安装依赖

```bash
pnpm install
```

---

## 包开发流程

### React 组件库开发

#### 1. 创建 React 包

```bash
mkdir -p packages/react/src/components
cd packages/react
```

#### 2. 配置 package.json

创建 `packages/react/package.json`:

```json
{
  "name": "@your-org/react",
  "version": "1.0.0",
  "description": "React UI component library",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./Button": {
      "types": "./dist/components/Button/index.d.ts",
      "import": "./dist/components/Button/index.js"
    },
    "./Input": {
      "types": "./dist/components/Input/index.d.ts",
      "import": "./dist/components/Input/index.js"
    },
    "./styles": "./dist/styles/index.css"
  },
  "files": ["dist", "README.md"],
  "sideEffects": ["**/*.css"],
  "scripts": {
    "build": "tsup && pnpm build:css",
    "build:css": "tailwindcss -i ./src/styles/index.css -o ./dist/styles/index.css --minify",
    "dev": "tsup --watch",
    "clean": "rimraf dist"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

#### 3. 配置 tsup

创建 `packages/react/tsup.config.ts`:

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    // 按需引入的入口
    "components/Button/index": "src/components/Button/index.tsx",
    "components/Input/index": "src/components/Input/index.tsx"
  },
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["react", "react-dom"],
  treeshake: true,
  splitting: false,
  minify: false,
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";'
    };
  }
});
```

#### 4. 配置 TypeScript

创建 `packages/react/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

#### 5. 创建组件示例

创建 `packages/react/src/components/Button/Button.tsx`:

```tsx
import React from 'react';
import { ButtonProps } from './types';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };
  
  const disabledStyles = 'opacity-50 cursor-not-allowed';

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? disabledStyles : ''}
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
```

创建 `packages/react/src/components/Button/types.ts`:

```typescript
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}
```

创建 `packages/react/src/components/Button/index.tsx`:

```typescript
export { Button } from './Button';
export type { ButtonProps } from './types';
```

#### 6. 创建样式入口（可选）

创建 `packages/react/src/styles/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 自定义样式 */
@layer components {
  .your-custom-class {
    @apply bg-blue-500 text-white;
  }
}
```

#### 7. 创建主入口文件

创建 `packages/react/src/index.ts`:

```typescript
// 全量导出
export { Button } from './components/Button';
export { Input } from './components/Input';
// ... 其他组件

// 导出类型
export type { ButtonProps } from './components/Button/types';
export type { InputProps } from './components/Input/types';
```

---

### Vue 组件库开发

#### 1. 创建 Vue 包

```bash
mkdir -p packages/vue/src/components
cd packages/vue
```

#### 2. 配置 package.json

创建 `packages/vue/package.json`:

```json
{
  "name": "@your-org/vue",
  "version": "1.0.0",
  "description": "Vue UI component library",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./Button": {
      "types": "./dist/components/Button/index.d.ts",
      "import": "./dist/components/Button/index.js"
    },
    "./Input": {
      "types": "./dist/components/Input/index.d.ts",
      "import": "./dist/components/Input/index.js"
    },
    "./styles": "./dist/styles/index.css"
  },
  "files": ["dist", "README.md"],
  "sideEffects": ["**/*.css"],
  "scripts": {
    "build": "tsup && pnpm build:css",
    "build:css": "tailwindcss -i ./src/styles/index.css -o ./dist/styles/index.css --minify",
    "dev": "tsup --watch",
    "clean": "rimraf dist"
  },
  "peerDependencies": {
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "vue": "^3.5.0"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

#### 3. 配置 tsup

创建 `packages/vue/tsup.config.ts`:

```typescript
import { defineConfig } from "tsup";
import vue from "unplugin-vue/esbuild";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "components/Button/index": "src/components/Button/index.ts",
    "components/Input/index": "src/components/Input/index.ts"
  },
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["vue"],
  treeshake: true,
  splitting: false,
  minify: false,
  esbuildPlugins: [
    vue({
      // Vue 编译选项
    })
  ]
});
```

#### 4. 安装 Vue 编译插件

```bash
pnpm add -D unplugin-vue
```

#### 5. 配置 TypeScript

创建 `packages/vue/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "preserve",
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src", "src/**/*.vue"],
  "exclude": ["node_modules", "dist"]
}
```

#### 6. 创建组件示例

创建 `packages/vue/src/components/Button/Button.vue`:

```vue
<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ButtonProps } from './types';

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false
});

const emit = defineEmits<{
  click: [event: MouseEvent]
}>();

const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

const variantStyles = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
};

const sizeStyles = {
  small: 'px-3 py-1.5 text-sm',
  medium: 'px-4 py-2 text-base',
  large: 'px-6 py-3 text-lg'
};

const buttonClasses = computed(() => [
  baseStyles,
  variantStyles[props.variant],
  sizeStyles[props.size],
  props.disabled && 'opacity-50 cursor-not-allowed'
]);

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>
```

创建 `packages/vue/src/components/Button/types.ts`:

```typescript
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}
```

创建 `packages/vue/src/components/Button/index.ts`:

```typescript
import Button from './Button.vue';
import type { ButtonProps } from './types';

export { Button };
export type { ButtonProps };
```

#### 7. 创建主入口文件

创建 `packages/vue/src/index.ts`:

```typescript
import type { App } from 'vue';
import { Button } from './components/Button';
import { Input } from './components/Input';
// ... 其他组件

// 全量导出
export { Button, Input };

// 导出类型
export type { ButtonProps } from './components/Button/types';
export type { InputProps } from './components/Input/types';

// 插件安装函数（支持全局引入）
export default {
  install(app: App) {
    app.component('YButton', Button);
    app.component('YInput', Input);
    // ... 注册其他组件
  }
};
```

---

## 样式处理方案（Tailwind CSS）

### 推荐方案：组件内使用 Tailwind + 提供预编译 CSS

这是最适合组件库的方案，兼顾开发体验和用户使用便利性。

---

### 方案实现步骤

#### 步骤 1: 在组件中直接使用 Tailwind Class

**React 组件示例**:

```tsx
// packages/react/src/components/Button/Button.tsx
import React from 'react';
import { ButtonProps } from './types';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  ...props
}) => {
  // 使用 Tailwind 原子类
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

**Vue 组件示例**:

```vue
<!-- packages/vue/src/components/Button/Button.vue -->
<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      variantClasses[variant],
      sizeClasses[size],
      $attrs.class
    ]"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { ButtonProps } from './types';

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'medium'
});

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
};

const sizeClasses = {
  small: 'px-3 py-1.5 text-sm',
  medium: 'px-4 py-2 text-base',
  large: 'px-6 py-3 text-lg'
};
</script>
```

#### 步骤 2: 创建 Tailwind 样式入口文件

**React 包**:

```css
/* packages/react/src/styles/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 自定义基础样式 */
@layer base {
  * {
    @apply border-border;
  }
}

/* 自定义组件样式（可选） */
@layer components {
  .btn-base {
    @apply inline-flex items-center justify-center rounded-lg font-medium transition-all;
  }
}
```

**Vue 包**（同上）:

```css
/* packages/vue/src/styles/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 步骤 3: 配置 Tailwind

**在组件库根目录或各包目录下创建配置**:

```js
// packages/react/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          // ... 自定义主题色
        }
      }
    }
  },
  plugins: []
}
```

```js
// packages/vue/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,vue}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
}
```

#### 步骤 4: 构建预编译 CSS

**更新 package.json scripts**:

```json
{
  "scripts": {
    "build": "pnpm build:js && pnpm build:css",
    "build:js": "tsup",
    "build:css": "tailwindcss -i ./src/styles/index.css -o ./dist/styles/index.css --minify",
    "dev": "tsup --watch"
  }
}
```

**安装 Tailwind CLI**:

```bash
pnpm add -D tailwindcss autoprefixer postcss
```

#### 步骤 5: 配置 package.json exports

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./styles": "./dist/styles/index.css",
    "./tailwind": "./tailwind.config.js"
  },
  "files": [
    "dist",
    "tailwind.config.js"
  ],
  "sideEffects": [
    "**/*.css"
  ]
}
```

---

### 用户使用方式

#### 方式 1: 使用预编译 CSS（推荐给不使用 Tailwind 的用户）

```typescript
// main.tsx / main.ts
import { Button } from '@your-org/react';
import '@your-org/react/styles';  // 导入预编译样式

function App() {
  return <Button>Click me</Button>;
}
```

**优点**:
- ✅ 开箱即用，无需配置
- ✅ 样式完整，不会丢失
- ✅ 支持所有组件

**缺点**:
- ❌ CSS 文件较大（包含所有 Tailwind 工具类）
- ❌ 无法自定义主题

---

#### 方式 2: 集成到用户的 Tailwind 配置（推荐给使用 Tailwind 的用户）

用户项目中配置 Tailwind 扫描组件库源码：

```js
// 用户项目的 tailwind.config.js
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,vue}",
    // 扫描组件库的 JS 文件，提取 Tailwind class
    "./node_modules/@your-org/react/dist/**/*.js",
    "./node_modules/@your-org/vue/dist/**/*.js"
  ],
  // 可选：继承组件库的主题配置
  presets: [
    require('@your-org/react/tailwind')
  ]
}
```

然后用户只需导入组件，不需要导入样式：

```typescript
import { Button } from '@your-org/react';
// 不需要导入样式，Tailwind 会自动生成
```

**优点**:
- ✅ 按需生成样式，文件更小
- ✅ 可以自定义主题
- ✅ 与项目 Tailwind 配置统一
- ✅ 支持 Tree Shaking

**缺点**:
- ❌ 需要用户配置 Tailwind
- ❌ 构建时间稍长

---

### 最佳实践建议

#### 1. 同时提供两种方式

在文档中明确说明两种使用方式：

```markdown
## 安装

\`\`\`bash
npm install @your-org/react
\`\`\`

## 使用方式

### 方式 1: 直接导入样式（推荐）

\`\`\`tsx
import { Button } from '@your-org/react';
import '@your-org/react/styles';
\`\`\`

### 方式 2: 集成 Tailwind（高级用户）

如果你的项目使用 Tailwind CSS，可以配置扫描组件库：

\`\`\`js
// tailwind.config.js
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@your-org/react/dist/**/*.js'
  ]
}
\`\`\`
```

#### 2. 提供主题定制能力

导出 Tailwind 配置，让用户可以继承：

```js
// packages/react/tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3b82f6',
          secondary: '#8b5cf6'
        }
      }
    }
  }
}
```

用户使用：

```js
// 用户项目
import baseConfig from '@your-org/react/tailwind';

export default {
  ...baseConfig,
  theme: {
    extend: {
      ...baseConfig.theme.extend,
      colors: {
        ...baseConfig.theme.extend.colors,
        // 覆盖品牌色
        brand: {
          primary: '#ef4444'
        }
      }
    }
  }
}
```

#### 3. 使用 CSS 变量增强定制性（可选）

```css
/* packages/react/src/styles/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-primary: 59 130 246; /* RGB: #3b82f6 */
    --color-secondary: 139 92 246;
  }
}

@layer components {
  .btn-primary {
    @apply bg-[rgb(var(--color-primary))];
  }
}
```

用户可以通过覆盖 CSS 变量自定义主题：

```css
/* 用户项目 */
:root {
  --color-primary: 239 68 68; /* 改为红色 */
}
```

---

## 静态资源处理（使用 Tsup）

### 为什么使用 Tsup 而不是 Vite？

对于组件库开发，Tsup 是更好的选择：

| 特性 | Tsup | Vite |
|------|------|------|
| **适用场景** | ✅ Library 打包 | ❌ 应用开发 |
| **类型生成** | ✅ 原生支持 | ⚠️ 需要插件 |
| **输出格式** | ✅ ESM/CJS | ⚠️ 主要 ESM |
| **体积大小** | ✅ 轻量 | ❌ 重量级 |
| **配置复杂度** | ✅ 简单 | ⚠️ 较复杂 |
| **静态资源** | ✅ 支持（需配置） | ✅ 完美支持 |

**结论**: Tsup 完全可以处理静态资源，只需要适当配置。

---

### 静态资源处理方案

#### 方案 1: Base64 内联（推荐用于小图标）

**适用场景**: 小于 10KB 的图标、SVG

**配置 tsup**:

```typescript
// packages/react/tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "components/Button/index": "src/components/Button/index.tsx"
  },
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["react", "react-dom"],
  esbuildOptions(options) {
    // 配置资源加载器
    options.loader = {
      ...options.loader,
      '.svg': 'dataurl',   // SVG 转 base64
      '.png': 'dataurl',   // PNG 转 base64
      '.jpg': 'dataurl',   // JPG 转 base64
      '.gif': 'dataurl',   // GIF 转 base64
      '.webp': 'dataurl'   // WebP 转 base64
    };
  }
});
```

**使用方式**:

```tsx
// React 组件
import iconSrc from './assets/icon.svg';

export const Icon = () => {
  return <img src={iconSrc} alt="icon" className="w-6 h-6" />;
};
```

```vue
<!-- Vue 组件 -->
<template>
  <img :src="iconSrc" alt="icon" class="w-6 h-6" />
</template>

<script setup lang="ts">
import iconSrc from './assets/icon.svg';
</script>
```

**优点**:
- ✅ 无需额外的文件请求
- ✅ 适合小图标
- ✅ 打包后独立，不依赖外部文件

**缺点**:
- ❌ 增大 JS bundle 体积
- ❌ 不适合大图片

---

#### 方案 2: 复制文件到 dist（推荐用于较大资源）

**适用场景**: 大于 10KB 的图片、字体文件

**安装依赖**:

```bash
pnpm add -D fs-extra @types/fs-extra
```

**配置 tsup**:

```typescript
// packages/react/tsup.config.ts
import { defineConfig } from "tsup";
import fs from "fs-extra";
import path from "path";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "components/Button/index": "src/components/Button/index.tsx"
  },
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["react", "react-dom"],
  esbuildOptions(options) {
    // 小资源内联，大资源用 file loader
    options.loader = {
      ...options.loader,
      '.svg': 'file',  // SVG 作为文件
      '.png': 'file',
      '.jpg': 'file',
      '.woff': 'file',
      '.woff2': 'file'
    };
    // 配置公共路径
    options.publicPath = '/assets/';
  },
  // 构建后复制资源文件
  onSuccess: async () => {
    const srcAssets = path.resolve(__dirname, 'src/assets');
    const distAssets = path.resolve(__dirname, 'dist/assets');
    
    if (await fs.pathExists(srcAssets)) {
      await fs.copy(srcAssets, distAssets);
      console.log('✅ Assets copied to dist/assets');
    }
  }
});
```

**目录结构**:

```
packages/react/
├── src/
│   ├── assets/
│   │   ├── icons/
│   │   │   ├── check.svg
│   │   │   └── close.svg
│   │   └── images/
│   │       └── banner.png
│   └── components/
└── dist/              # 构建后
    ├── assets/        # 自动复制
    │   ├── icons/
    │   └── images/
    └── components/
```

**使用方式**:

```tsx
// React
import iconSrc from './assets/icons/check.svg';

export const CheckIcon = () => {
  return <img src={iconSrc} alt="check" />;
};
```

**更新 package.json**:

```json
{
  "files": [
    "dist",
    "dist/assets"  // 确保资源文件包含在 npm 包中
  ]
}
```

**优点**:
- ✅ JS bundle 体积小
- ✅ 适合大文件
- ✅ 浏览器可以缓存

**缺点**:
- ❌ 需要额外的文件请求
- ❌ 用户需要配置静态资源服务

---

#### 方案 3: SVG 作为 React/Vue 组件（推荐）

**React: 使用 SVGR**

安装依赖:

```bash
pnpm add -D @svgr/core @svgr/plugin-jsx
```

创建 SVG 转换脚本:

```typescript
// scripts/svgr.ts
import { transform } from '@svgr/core';
import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

async function transformSvgs() {
  const svgFiles = await glob('src/assets/icons/**/*.svg');
  
  for (const file of svgFiles) {
    const svgCode = await fs.readFile(file, 'utf-8');
    const componentCode = await transform(
      svgCode,
      {
        typescript: true,
        plugins: ['@svgr/plugin-jsx']
      },
      { componentName: path.basename(file, '.svg') }
    );
    
    const outputPath = file.replace('.svg', '.tsx');
    await fs.writeFile(outputPath, componentCode);
  }
}

transformSvgs();
```

使用:

```tsx
// 自动生成的组件
import CheckIcon from './assets/icons/Check.tsx';

export const Success = () => {
  return <CheckIcon className="w-5 h-5 text-green-500" />;
};
```

**Vue: 使用 unplugin-vue**

配置已在 tsup.config.ts 中包含（参考前面的配置）。

使用:

```vue
<template>
  <CheckIcon class="w-5 h-5 text-green-500" />
</template>

<script setup lang="ts">
import CheckIcon from './assets/icons/Check.vue';
</script>
```

**优点**:
- ✅ 作为组件使用，可以传递 props
- ✅ 可以动态改变颜色、大小
- ✅ 支持 Tree Shaking
- ✅ 类型安全

---

#### 方案 4: CDN 引用（推荐用于大型资源）

**适用场景**: 大图片、视频、字体

```typescript
// packages/react/src/constants/assets.ts
export const CDN_BASE = 'https://cdn.example.com/your-ui';

export const ASSETS = {
  icons: {
    check: `${CDN_BASE}/icons/check.svg`,
    close: `${CDN_BASE}/icons/close.svg`
  },
  images: {
    banner: `${CDN_BASE}/images/banner.png`
  }
} as const;
```

使用:

```tsx
import { ASSETS } from '@your-org/react/constants';

export const Banner = () => {
  return <img src={ASSETS.images.banner} alt="banner" />;
};
```

**优点**:
- ✅ 不增加包体积
- ✅ CDN 加速
- ✅ 统一管理资源

**缺点**:
- ❌ 依赖外部服务
- ❌ 需要维护 CDN

---

### 推荐组合方案

根据资源类型选择不同方案：

| 资源类型 | 推荐方案 | 理由 |
|---------|---------|------|
| **小图标 (<5KB)** | Base64 内联 | 减少请求 |
| **SVG 图标** | React/Vue 组件 | 可定制性强 |
| **中等图片 (5-50KB)** | 复制到 dist | 平衡体积和性能 |
| **大图片 (>50KB)** | CDN | 不影响包体积 |
| **字体文件** | 复制到 dist 或 CDN | 按需选择 |

### 完整的 tsup 配置示例

```typescript
// packages/react/tsup.config.ts
import { defineConfig } from "tsup";
import fs from "fs-extra";
import path from "path";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "components/Button/index": "src/components/Button/index.tsx",
    "components/Input/index": "src/components/Input/index.tsx"
  },
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["react", "react-dom"],
  treeshake: true,
  splitting: false,
  minify: false,
  esbuildOptions(options) {
    // 资源处理策略
    options.loader = {
      ...options.loader,
      // 小图标内联
      '.svg': 'dataurl',
      // 图片作为文件
      '.png': 'file',
      '.jpg': 'file',
      '.jpeg': 'file',
      '.gif': 'file',
      '.webp': 'file',
      // 字体文件
      '.woff': 'file',
      '.woff2': 'file',
      '.ttf': 'file',
      '.eot': 'file'
    };
    
    // React 组件添加 "use client" 标记
    options.banner = {
      js: '"use client";'
    };
  },
  
  // 构建成功后复制静态资源
  onSuccess: async () => {
    console.log('📦 Copying assets...');
    
    const srcAssets = path.resolve(__dirname, 'src/assets');
    const distAssets = path.resolve(__dirname, 'dist/assets');
    
    if (await fs.pathExists(srcAssets)) {
      await fs.copy(srcAssets, distAssets);
      console.log('✅ Assets copied to dist/assets');
    }
  }
});
```

---

## 按需引入实现

### 配置导出路径

#### package.json exports 配置

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./Button": {
      "types": "./dist/components/Button/index.d.ts",
      "import": "./dist/components/Button/index.js"
    },
    "./Input": {
      "types": "./dist/components/Input/index.d.ts",
      "import": "./dist/components/Input/index.js"
    }
  }
}
```

### 使用方式

#### 全量引入

```typescript
// React
import { Button, Input } from '@your-org/react';
import '@your-org/react/styles';

// Vue
import { createApp } from 'vue';
import YourUI from '@your-org/vue';
import '@your-org/vue/styles';

app.use(YourUI);
```

#### 按需引入

```typescript
// React
import { Button } from '@your-org/react/Button';
import { Input } from '@your-org/react/Input';

// Vue
import { Button } from '@your-org/vue/Button';
import { Input } from '@your-org/vue/Input';
```

### 自动按需引入（可选）

#### 使用 unplugin-auto-import

```bash
pnpm add -D unplugin-auto-import unplugin-vue-components
```

```typescript
// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

export default {
  plugins: [
    AutoImport({
      resolvers: [
        // 自定义 resolver
      ]
    }),
    Components({
      resolvers: [
        // 自定义 resolver
      ]
    })
  ]
};
```

---

## 本地开发调试

### 创建 React 示例项目

#### 1. 初始化项目

```bash
cd examples
pnpm create vite react-demo --template react-ts
cd react-demo
```

#### 2. 配置 package.json

```json
{
  "name": "react-demo",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "@your-org/react": "workspace:*",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.4.0"
  }
}
```

#### 3. 配置 Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
});
```

#### 4. 配置 Tailwind

```bash
pnpm add -D tailwindcss postcss autoprefixer
pnpm tailwindcss init
```

```js
// tailwind.config.js
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/react/src/**/*.{js,ts,jsx,tsx}"
  ]
};
```

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 5. 使用组件

```tsx
// src/App.tsx
import { Button } from '@your-org/react';

function App() {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">React UI Library Demo</h1>
      <Button variant="primary" onClick={() => alert('clicked')}>
        Click Me
      </Button>
    </div>
  );
}

export default App;
```

### 创建 Vue 示例项目

#### 1. 初始化项目

```bash
cd examples
pnpm create vite vue-demo --template vue-ts
cd vue-demo
```

#### 2. 配置 package.json

```json
{
  "name": "vue-demo",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "@your-org/vue": "workspace:*",
    "vue": "^3.5.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.4.0"
  }
}
```

#### 3. 配置 Tailwind（同 React）

#### 4. 使用组件

```vue
<!-- src/App.vue -->
<template>
  <div class="p-8">
    <h1 class="text-2xl mb-4">Vue UI Library Demo</h1>
    <Button variant="primary" @click="handleClick">
      Click Me
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@your-org/vue';

const handleClick = () => {
  alert('clicked');
};
</script>
```

### 本地调试命令

```bash
# 根目录
pnpm install

# 开发组件库（监听模式）
pnpm dev

# 开发示例项目
pnpm dev:examples

# 同时开发
pnpm dev:all
```

---

## 构建与发布

### 构建流程

#### 1. 构建所有包

```bash
pnpm build
```

这会执行:
- 编译 TypeScript
- 打包组件
- 生成类型声明
- 构建样式文件

#### 2. 验证构建产物

```bash
# 查看 React 包
ls -la packages/react/dist/

# 输出应该包含:
# - index.js
# - index.d.ts
# - components/
# - styles/
```

### 发布前准备

#### 1. 检查 package.json 配置

确保以下字段正确:

```json
{
  "name": "@your-org/react",
  "version": "1.0.0",
  "files": ["dist", "README.md"],
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

#### 2. 创建 .npmignore

```
src/
examples/
*.ts
!*.d.ts
tsconfig.json
tsup.config.ts
```

#### 3. 编写 README

每个包都应该有 README.md 文档。

### 版本管理（使用 Changesets）

#### 1. 创建变更集

```bash
pnpm changeset
```

按提示选择:
- 要更新的包
- 版本类型（major/minor/patch）
- 变更描述

#### 2. 更新版本

```bash
pnpm version
```

这会:
- 更新 package.json 版本号
- 生成 CHANGELOG.md
- 删除已处理的 changeset 文件

#### 3. 提交变更

```bash
git add .
git commit -m "chore: release v1.0.0"
git push
```

### 发布到 npm

#### 方式 1: 手动发布

```bash
# 登录 npm（首次）
npm login

# 发布所有包
pnpm publish:all

# 或单独发布
cd packages/react
pnpm publish
```

#### 方式 2: CI/CD 自动发布

创建 `.github/workflows/publish.yml`:

```yaml
name: Publish

on:
  push:
    branches:
      - main

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build packages
        run: pnpm build
      
      - name: Create Release Pull Request or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm publish:all
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 发布检查清单

- [ ] 所有测试通过
- [ ] 构建成功无错误
- [ ] 版本号已更新
- [ ] CHANGELOG 已生成
- [ ] README 文档完整
- [ ] package.json 配置正确
- [ ] .npmignore 配置正确
- [ ] Git tag 已创建
- [ ] npm 账号已登录

---

## 最佳实践

### 1. 组件开发规范

#### 命名规范

```
组件名: PascalCase (Button, Input)
文件名: PascalCase (Button.tsx, Button.vue)
类型名: PascalCase + Props (ButtonProps)
工具函数: camelCase (formatDate)
```

#### 组件结构

```
Button/
├── index.ts          # 导出入口
├── Button.tsx/vue    # 组件实现
├── types.ts          # 类型定义
└── Button.test.ts    # 单元测试（可选）
```

### 2. TypeScript 类型定义

#### 导出完整类型

```typescript
// 组件 Props
export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}

// 组件实例类型（React）
export type ButtonRef = HTMLButtonElement;

// 组件类型
export type ButtonComponent = React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<ButtonRef>
>;
```

### 3. 样式隔离

#### 使用 Tailwind Prefix（可选）

```js
// tailwind.config.js
export default {
  prefix: 'y-',  // your prefix
  content: ['./src/**/*.{js,ts,jsx,tsx,vue}']
};
```

使用时:

```tsx
<button className="y-bg-blue-500 y-text-white">
  Button
</button>
```

### 4. Tree Shaking 优化

#### 确保 sideEffects 配置正确

```json
{
  "sideEffects": [
    "**/*.css",
    "./src/styles/*"
  ]
}
```

### 5. 文档维护

#### 组件文档模板

```markdown
# Button 按钮

## 基础用法

\`\`\`tsx
<Button>Click me</Button>
\`\`\`

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | 'primary' \| 'secondary' | 'primary' | 按钮类型 |
| size | 'small' \| 'medium' \| 'large' | 'medium' | 按钮尺寸 |
```

### 6. 性能优化

#### React 组件优化

```tsx
import { memo } from 'react';

export const Button = memo<ButtonProps>(({ children, ...props }) => {
  return <button {...props}>{children}</button>;
});
```

#### Vue 组件优化

```vue
<script setup lang="ts">
import { computed } from 'vue';

// 使用 computed 缓存样式
const buttonClasses = computed(() => [
  'base-class',
  props.variant
]);
</script>
```

### 7. 测试策略（可选）

#### 安装测试工具

```bash
pnpm add -D vitest @testing-library/react @testing-library/vue
```

#### 组件测试示例

```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

---

## 附录

### 常用命令速查

```bash
# 开发
pnpm dev                    # 开发组件库
pnpm dev:examples           # 开发示例项目
pnpm dev:all               # 同时开发全部

# 构建
pnpm build                 # 构建所有包
pnpm build --filter=@your-org/react  # 构建指定包

# 清理
pnpm clean                 # 清理构建产物

# 版本管理
pnpm changeset             # 创建变更集
pnpm version               # 更新版本
pnpm publish:all           # 发布所有包

# 测试
pnpm test                  # 运行测试
pnpm test:watch            # 监听模式
```

### 故障排查

#### 问题 1: pnpm link 后组件无法导入

**解决**: 确保 package.json 中的 exports 配置正确。

#### 问题 2: Tailwind 样式不生效

**解决**: 检查 tailwind.config.js 的 content 路径是否包含组件源码。

#### 问题 3: 类型声明文件未生成

**解决**: 检查 tsconfig.json 中 `declaration: true` 配置。

#### 问题 4: Turbo 缓存问题

**解决**: 运行 `turbo clean` 清除缓存。

---

## 总结

这份指南涵盖了从项目初始化到发布的完整流程。按照以下步骤执行:

1. ✅ **初始化项目结构** - 配置 Monorepo
2. ✅ **开发组件库** - React 和 Vue 包
3. ✅ **配置构建工具** - Tsup + Turbo
4. ✅ **处理样式和资源** - Tailwind + 静态资源
5. ✅ **实现按需引入** - exports 配置
6. ✅ **本地调试** - 示例项目
7. ✅ **版本管理** - Changesets
8. ✅ **发布到 npm** - 手动或 CI/CD

现在你可以开始按照这份指南一步步构建你的 UI 组件库了！

**祝开发顺利！** 🎉
