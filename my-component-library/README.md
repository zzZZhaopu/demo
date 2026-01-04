# My UI Library

基于 Vite + Vue3 + TypeScript 的业务组件库

## 特性

- ⚡️ 基于 Vite 构建，开发体验极佳
- 🎨 基于 Element Plus，UI 精美
- 📦 支持按需引入，Tree-shaking
- 🔧 完整的 TypeScript 类型定义
- 🌈 支持 SCSS 变量定制主题
- 📖 详细的文档和示例

## 安装

```bash
npm install @demo/my-ui
```

## 快速开始

### 完整引入

```typescript
import { createApp } from 'vue'
import MyUI from '@demo/my-ui'
import '@demo/my-ui/dist/style.css'

const app = createApp(App)
app.use(MyUI)
```

### 按需引入

```vue
<script setup>
import { MyButton, MyInput } from '@demo/my-ui'
import '@demo/my-ui/dist/style.css'
</script>

<template>
  <MyButton>按钮</MyButton>
  <MyInput v-model="value" />
</template>
```

## 组件列表

- MyButton - 按钮组件
- MyInput - 输入框组件
- MyCard - 卡片组件

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 启动文档站点
npm run docs:dev

# 构建组件库
npm run build

# 构建文档
npm run docs:build
```

## 项目结构

```
my-component-library/
├── packages/                    # 组件源码目录
│   ├── components/             # 业务组件
│   │   ├── MyButton/          # 按钮组件
│   │   │   ├── src/
│   │   │   │   ├── MyButton.vue     # 组件实现
│   │   │   │   └── types.ts         # 组件类型定义
│   │   │   ├── style/
│   │   │   │   └── index.scss       # 组件样式
│   │   │   └── index.ts             # 组件入口（支持 install 方法）
│   │   ├── MyInput/           # 输入框组件（结构同上）
│   │   ├── MyCard/            # 卡片组件（结构同上）
│   │   └── index.ts           # 组件统一导出
│   ├── styles/                # 全局样式系统
│   │   ├── variables.scss     # SCSS 变量（颜色、字体、间距等）
│   │   ├── mixins.scss        # SCSS 混入（工具函数）
│   │   └── index.scss         # 样式入口
│   ├── types/                 # 全局类型定义
│   ├── utils/                 # 工具函数
│   ├── composables/           # 组合式函数
│   └── index.ts               # 组件库总入口（导出所有组件）
│
├── src/                        # 开发预览环境
│   ├── App.vue                # 组件预览页面
│   ├── main.ts                # 开发环境入口
│   └── examples/              # 组件示例
│
├── docs/                       # VitePress 文档站点
│   ├── .vitepress/            # VitePress 配置
│   │   ├── config.ts          # 站点配置（导航、侧边栏等）
│   │   └── theme/
│   │       └── index.ts       # 自定义主题（注册组件库）
│   ├── components/            # 组件文档
│   │   ├── button.md         # Button 组件文档
│   │   ├── input.md          # Input 组件文档
│   │   └── card.md           # Card 组件文档
│   ├── guide/                # 指南文档
│   │   └── quick-start.md    # 快速开始
│   └── index.md              # 文档首页
│
├── dist/                      # 构建产物（自动生成）
│   ├── index.es.js           # ES Module 格式
│   ├── index.umd.js          # UMD 格式
│   ├── index.d.ts            # TypeScript 类型定义
│   ├── style.css             # 打包后的样式
│   ├── components/           # 各组件独立文件（支持按需引入）
│   └── assets/               # 静态资源
│
├── vite.config.ts             # Vite 核心配置（库模式构建）
├── tsconfig.json              # TypeScript 配置
├── package.json               # 项目配置和依赖管理
├── env.d.ts                   # 环境类型声明
├── .gitignore                 # Git 忽略文件
├── .npmignore                 # npm 发布忽略文件
└── README.md                  # 项目说明文档
```

### 关键文件说明

#### 配置文件

**vite.config.ts** - Vite 核心配置
```typescript
// 关键配置项说明：
{
  plugins: [
    vue(),                    // Vue 3 支持
    dts({                     // 自动生成 TypeScript 类型定义
      include: ['packages/**/*'],
      outDir: 'dist'
    }),
    svgLoader()              // SVG 作为 Vue 组件导入
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'packages')  // 路径别名，@ 指向 packages 目录
    }
  },
  build: {
    lib: {
      entry: 'packages/index.ts',          // 组件库入口
      name: 'MyUILibrary',                 // UMD 格式全局变量名
      formats: ['es', 'umd']               // 输出 ES Module 和 UMD 两种格式
    },
    rollupOptions: {
      external: ['vue', 'element-plus'],   // 外部依赖，不打包进组件库
      output: {
        preserveModules: true,             // 保留模块结构，支持按需引入
        preserveModulesRoot: 'packages'
      }
    },
    cssCodeSplit: true                     // CSS 代码分割，每个组件独立样式
  }
}
```

**package.json** - 项目配置
```json
{
  "name": "@demo/my-ui",              // npm 包名
  "type": "module",                   // 声明为 ES Module
  "main": "./dist/index.umd.js",     // CommonJS 入口
  "module": "./dist/index.es.js",    // ES Module 入口
  "types": "./dist/index.d.ts",      // TypeScript 类型入口
  "exports": {                        // 现代化导出方式
    ".": {
      "import": "./dist/index.es.js", // import 使用 ES Module
      "require": "./dist/index.umd.js", // require 使用 UMD
      "types": "./dist/index.d.ts"
    },
    "./dist/style.css": "./dist/style.css"  // 样式文件导出
  },
  "files": ["dist"],                 // npm 发布时只包含 dist 目录
  "scripts": {
    "dev": "vite",                   // 启动开发服务器
    "build": "vue-tsc && vite build", // 类型检查 + 构建
    "docs:dev": "vitepress dev docs", // 启动文档站点
    "prepublishOnly": "npm run build" // 发布前自动构建
  },
  "peerDependencies": {              // 对等依赖，用户项目需要安装
    "vue": "^3.4.0"
  }
}
```

**tsconfig.json** - TypeScript 配置
```json
{
  "compilerOptions": {
    "target": "ES2020",              // 编译目标
    "module": "ESNext",              // 模块系统
    "moduleResolution": "bundler",   // 模块解析策略
    "strict": true,                  // 严格类型检查
    "jsx": "preserve",               // 保留 JSX（由 Vite 处理）
    "baseUrl": ".",                  // 路径解析基准
    "paths": {
      "@/*": ["packages/*"]          // 路径映射，@ 指向 packages
    }
  },
  "include": ["src/**/*", "packages/**/*"],  // 包含的文件
  "exclude": ["node_modules", "dist"]        // 排除的文件
}
```

**docs/.vitepress/config.ts** - VitePress 配置
```typescript
{
  title: 'My UI Library',           // 站点标题
  description: '基于 Vite + Vue3 的业务组件库',
  themeConfig: {
    nav: [...],                     // 顶部导航栏
    sidebar: [...],                 // 侧边栏菜单
    socialLinks: [...]              // 社交链接（GitHub 等）
  },
  vite: {                           // 继承 Vite 配置
    resolve: { alias: { '@': '/packages' } },
    css: {                          // SCSS 全局变量注入
      preprocessorOptions: {
        scss: {
          additionalData: `@import "/packages/styles/variables.scss";`
        }
      }
    }
  }
}
```

#### 核心源码文件

**packages/index.ts** - 组件库总入口
- 导出所有组件
- 提供全局安装方法（支持 app.use()）
- 导入全局样式

**packages/components/index.ts** - 组件统一导出
- 收集所有组件
- 实现全局安装逻辑
- 支持按需引入和全量引入

**packages/components/MyButton/index.ts** - 单个组件入口
- 为组件添加 install 方法
- 导出组件和类型定义
- 支持独立使用 app.use(MyButton)

**packages/styles/variables.scss** - SCSS 变量系统
- 定义颜色、字体、间距等设计令牌
- 支持主题定制
- 全局自动注入，组件中可直接使用

#### 文档相关文件

**docs/.vitepress/theme/index.ts** - 自定义主题
- 扩展默认主题
- 注册组件库（使文档中可直接使用组件）
- 引入 Element Plus

**docs/components/*.md** - 组件文档
- Markdown 格式
- 支持内嵌 Vue 组件（实时预览）
- 包含组件 API 说明和示例代码

### 构建产物说明

运行 `npm run build` 后，在 `dist/` 目录生成：

1. **index.es.js** - ES Module 格式，支持 Tree-shaking
2. **index.umd.js** - UMD 格式，支持 script 标签直接引入
3. **index.d.ts** - TypeScript 类型定义入口
4. **style.css** - 打包后的全量样式文件
5. **components/** - 各组件独立文件，支持按需引入
6. **各组件的 .d.ts 文件** - 每个组件的类型定义

## License

MIT
