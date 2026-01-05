# @zzzzzzhaopu/vite-plugin-upload-sourcemap

> 🚀 A Vite plugin that automatically uploads SourceMap files to monitoring platforms after production build.

[English](#english) | [中文](#中文)

---

## English

### Features

- ✨ **Automatic Upload**: Uploads SourceMap files after build completion
- 🗑️ **Auto Cleanup**: Removes .map files after upload (configurable)
- 🔌 **Easy Integration**: Simple Vite plugin configuration
- 🛠️ **Flexible**: Supports custom upload functions for different platforms
- 🎯 **Type Safe**: Full TypeScript support
- 📦 **Zero Config**: Works out of the box with sensible defaults

### Why Do You Need This?

**The Problem:**
1. Production code is minified and obfuscated for better performance
2. Error stack traces show minified code positions, making debugging difficult
3. SourceMaps can't be deployed to production (security risk - exposes source code)

**The Solution:**
1. Generate SourceMaps during build
2. Upload them to your monitoring platform (Sentry, Datadog, etc.)
3. Remove them from deployment bundle
4. Monitor platform uses them to restore readable stack traces

### Installation

```bash
npm install @zzzzzzhaopu/vite-plugin-upload-sourcemap -D
# 或
pnpm add @zzzzzzhaopu/vite-plugin-upload-sourcemap -D
# 或
yarn add @zzzzzzhaopu/vite-plugin-upload-sourcemap -D
```

### Quick Start

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { uploadSourceMapPlugin } from 'vite-plugin-upload-sourcemap'

export default defineConfig(({ mode }) => ({
  plugins: [
    uploadSourceMapPlugin({
      enabled: mode === 'production',
      uploadUrl: 'https://your-platform.com/api/sourcemap',
      apiKey: process.env.SOURCEMAP_API_KEY,
      projectName: 'my-project',
      version: '1.0.0'
    })
  ],
  build: {
    sourcemap: true  // Enable sourcemap generation
  }
}))
```

### Configuration

```typescript
interface SourceMapUploadOptions {
  /** Enable the plugin (default: production only) */
  enabled?: boolean
  
  /** Monitoring platform API URL */
  uploadUrl?: string
  
  /** API key for authentication */
  apiKey?: string
  
  /** Project name */
  projectName?: string
  
  /** Project version */
  version?: string
  
  /** Remove SourceMap files after upload (default: true) */
  removeSourceMap?: boolean
  
  /** Custom upload function (optional) */
  uploadFn?: (
    filePath: string, 
    options: {
      uploadUrl: string
      apiKey: string
      projectName: string
      version: string
    }
  ) => Promise<boolean>
}
```

### Platform Integration Examples

#### Sentry

```typescript
import { uploadSourceMapPlugin } from 'vite-plugin-upload-sourcemap'

uploadSourceMapPlugin({
  enabled: mode === 'production',
  uploadFn: async (filePath, config) => {
    const fs = await import('fs')
    const path = await import('path')
    
    const formData = new FormData()
    const content = fs.readFileSync(filePath, 'utf-8')
    
    formData.append('file', new Blob([content]), path.basename(filePath))
    formData.append('name', path.basename(filePath))
    
    const response = await fetch(
      `https://sentry.io/api/0/projects/${config.projectName}/releases/${config.version}/files/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: formData
      }
    )
    
    return response.ok
  }
})
```

#### Custom Platform

```typescript
uploadSourceMapPlugin({
  uploadFn: async (filePath, config) => {
    // Your custom upload logic here
    const content = fs.readFileSync(filePath, 'utf-8')
    
    const response = await fetch(config.uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': config.apiKey
      },
      body: JSON.stringify({
        project: config.projectName,
        version: config.version,
        filename: path.basename(filePath),
        content
      })
    })
    
    return response.ok
  }
})
```

### Environment Variables

You can use environment variables for configuration:

```bash
# .env.production
VITE_SOURCEMAP_UPLOAD_URL=https://your-platform.com/api/sourcemap
VITE_SOURCEMAP_API_KEY=your-secret-api-key
```

```typescript
// vite.config.ts
uploadSourceMapPlugin({
  uploadUrl: process.env.VITE_SOURCEMAP_UPLOAD_URL,
  apiKey: process.env.VITE_SOURCEMAP_API_KEY
})
```

### How It Works

```
Build Process
│
├─ Vite bundles your code
├─ Generate minified JS files
├─ Generate .map files
│
└─ Plugin executes (closeBundle hook)
   ├─ Find all .map files
   ├─ Upload to monitoring platform
   └─ Remove .map files (optional)
```

### License

MIT

---

## 中文

### 特性

- ✨ **自动上传**：构建完成后自动上传 SourceMap 文件
- 🗑️ **自动清理**：上传后自动删除 .map 文件（可配置）
- 🔌 **轻松集成**：简单的 Vite 插件配置
- 🛠️ **灵活可扩展**：支持自定义上传函数以对接不同平台
- 🎯 **类型安全**：完整的 TypeScript 支持
- 📦 **零配置**：开箱即用的合理默认配置

### 为什么需要这个插件？

**问题背景：**
1. 生产环境代码会被压缩和混淆以提升性能
2. 错误堆栈显示的是压缩后的代码位置，难以调试
3. SourceMap 不能部署到生产环境（会泄露源码）

**解决方案：**
1. 构建时生成 SourceMap
2. 上传到监控平台（Sentry、阿里云 ARMS 等）
3. 从部署包中删除
4. 监控平台使用 SourceMap 还原可读的错误堆栈

### 安装

```bash
npm install @zzzzzzhaopu/vite-plugin-upload-sourcemap -D
# 或
pnpm add @zzzzzzhaopu/vite-plugin-upload-sourcemap -D
# 或
yarn add @zzzzzzhaopu/vite-plugin-upload-sourcemap -D
```

### 快速开始

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { uploadSourceMapPlugin } from 'vite-plugin-upload-sourcemap'

export default defineConfig(({ mode }) => ({
  plugins: [
    uploadSourceMapPlugin({
      enabled: mode === 'production',
      uploadUrl: 'https://your-platform.com/api/sourcemap',
      apiKey: process.env.SOURCEMAP_API_KEY,
      projectName: 'my-project',
      version: '1.0.0'
    })
  ],
  build: {
    sourcemap: true  // 启用 sourcemap 生成
  }
}))
```

### 配置选项

```typescript
interface SourceMapUploadOptions {
  /** 是否启用插件（默认：仅生产环境） */
  enabled?: boolean
  
  /** 监控平台 API 地址 */
  uploadUrl?: string
  
  /** API 密钥 */
  apiKey?: string
  
  /** 项目名称 */
  projectName?: string
  
  /** 项目版本 */
  version?: string
  
  /** 上传后删除 SourceMap 文件（默认：true） */
  removeSourceMap?: boolean
  
  /** 自定义上传函数（可选） */
  uploadFn?: (
    filePath: string, 
    options: {
      uploadUrl: string
      apiKey: string
      projectName: string
      version: string
    }
  ) => Promise<boolean>
}
```

### 平台集成示例

#### Sentry

```typescript
import { uploadSourceMapPlugin } from 'vite-plugin-upload-sourcemap'

uploadSourceMapPlugin({
  enabled: mode === 'production',
  uploadFn: async (filePath, config) => {
    const fs = await import('fs')
    const path = await import('path')
    
    const formData = new FormData()
    const content = fs.readFileSync(filePath, 'utf-8')
    
    formData.append('file', new Blob([content]), path.basename(filePath))
    formData.append('name', path.basename(filePath))
    
    const response = await fetch(
      `https://sentry.io/api/0/projects/${config.projectName}/releases/${config.version}/files/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: formData
      }
    )
    
    return response.ok
  }
})
```

#### 阿里云 ARMS

```typescript
uploadSourceMapPlugin({
  uploadFn: async (filePath, config) => {
    const fs = await import('fs')
    const path = await import('path')
    const content = fs.readFileSync(filePath, 'utf-8')
    
    const response = await fetch(config.uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ARMS-API-KEY': config.apiKey
      },
      body: JSON.stringify({
        project: config.projectName,
        version: config.version,
        filename: path.basename(filePath),
        content
      })
    })
    
    return response.ok
  }
})
```

### 环境变量配置

可以使用环境变量来配置：

```bash
# .env.production
VITE_SOURCEMAP_UPLOAD_URL=https://your-platform.com/api/sourcemap
VITE_SOURCEMAP_API_KEY=your-secret-api-key
```

```typescript
// vite.config.ts
uploadSourceMapPlugin({
  uploadUrl: process.env.VITE_SOURCEMAP_UPLOAD_URL,
  apiKey: process.env.VITE_SOURCEMAP_API_KEY
})
```

### 工作原理

```
构建流程
│
├─ Vite 打包代码
├─ 生成压缩后的 JS 文件
├─ 生成 .map 文件
│
└─ 插件执行 (closeBundle 钩子)
   ├─ 查找所有 .map 文件
   ├─ 上传到监控平台
   └─ 删除 .map 文件（可选）
```

### 许可证

MIT
